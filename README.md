# ToySwap 🧸 — MVP

A parent-supervised platform where children list toys/books, get an **AI condition assessment** of the item from a photo, browse what's available within a **configurable radius**, and — once **both parents approve** — the exchange is handed off to a delivery service. Parents pay only the delivery fee.

This is a **Docker + Postgres MVP**: one Express process serves the API and frontend. Schema is applied on startup. Locally you run Postgres (and optionally the app) with Docker Compose; on Railway the same Dockerfile runs against Railway Postgres.

| | Local (Docker Compose) | Railway |
|---|---|---|
| App image | Root `Dockerfile` (`node:22-alpine`) | Same `Dockerfile`, selected in `railway.toml` |
| Database | `postgres:16-alpine` service `db` | Railway **Postgres** plugin |
| App URL | http://localhost:4000 | Public domain you generate |
| Postgres port | `localhost:55432` → container `5432` | Railway private URL in `DATABASE_URL` |
| Uploads | Named volume `uploads` → `/app/backend/uploads` | Attach a volume at the same path |
| Health check | `GET /api/health` | `railway.toml` → `/api/health` |

---

## Docker (local)

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Compose v2: `docker compose`).

### Full stack (recommended)

From the repo root:

```bash
docker compose up --build
```

Wait until the web logs show:

```
✔ Postgres schema ready
ToySwap backend running at http://localhost:4000
```

Open **http://localhost:4000**. Register a parent account, add child profiles, list a toy/book with a photo, then open a second browser (or incognito window) and register a second family to test exchanging.

| Service | Container | Host port | Inside the network |
|---|---|---|---|
| Web (API + frontend) | `kidxchange-web-1` | **4000** | `web:4000` |
| Postgres 16 | `kidxchange-db-1` | **55432** | `db:5432` |

Host port **55432** is intentional so it does not clash with another local Postgres on `5432`.

`docker-compose.yml` bind-mounts `./frontend` and `./backend` into the web container, so UI/API file edits are used on the next request / process restart without rebuilding the image. After changing backend JS, recreate the web container:

```bash
docker compose up -d --force-recreate web
```

### Useful Compose commands

```bash
docker compose up --build          # foreground, live logs
docker compose up -d --build       # background
docker compose logs -f web         # app logs
docker compose ps                  # status
docker compose restart web         # restart API process (picks up backend bind-mount)
docker compose down                # stop; keeps Postgres data + uploads
docker compose down -v             # stop and DELETE database + upload volumes
```

A plain `docker compose up -d` (no `--build`) reuses the existing image. That is fine for source edits because of the bind mounts; use `--build` after changing the `Dockerfile` or `package.json`.

### Postgres in Docker, app on the host

Use this when you want Node debugger / `console.log` on the host:

```bash
docker compose up db -d
cd backend
cp .env.example .env
npm install
npm start
```

`backend/.env.example` already points at Compose Postgres:

```
DATABASE_URL=postgres://toyswap:toyswap@localhost:55432/toyswap
DATABASE_SSL=false
```

Credentials match Compose: user/password/db = `toyswap`. Do not set `DATABASE_SSL=true` against local Docker Postgres.

### Environment variables (Compose)

Set these in a **repo-root** `.env` (Compose interpolates `${VAR}`). `backend/.env` is only for the host-run workflow above.

| Variable | Required | Default / notes |
|---|---|---|
| `JWT_SECRET` | Yes in anything shared | Compose default is a placeholder — change it |
| `ANTHROPIC_API_KEY` | No | Empty → mock AI evaluator |
| `DELIVERY_API_URL` | No | `https://delivery-rabka.up.railway.app/` |
| `DEFAULT_EXCHANGE_RADIUS_KM` | No | `10` |
| `DATABASE_URL` | Set in Compose | `postgres://toyswap:toyswap@db:5432/toyswap` |
| `DATABASE_SSL` | Set in Compose | `false` for local Docker |
| `UPLOADS_DIR` | Set in Compose | `/app/backend/uploads` |
| `PORT` | Set in Compose | `4000` |

### Enabling real AI photo evaluation

By default the AI condition check uses a **mock evaluator** so the app works fully offline.

1. Get an Anthropic API key from [console.anthropic.com](https://console.anthropic.com).
2. **Compose:** put `ANTHROPIC_API_KEY=sk-ant-...` in the **repo-root** `.env`, then `docker compose up -d --force-recreate web`.
3. **Host run:** put the same key in `backend/.env` and restart `npm start`.
4. Logs should show `✔ AI photo evaluation: using real Claude vision API`.

### Local troubleshooting

| Symptom | Fix |
|---|---|
| `⚠ Cannot read properties of null (reading 'name')` | Leftover JWT from an older DB. Hard-refresh (`Cmd+Shift+R`), or in DevTools: `localStorage.removeItem('ts_token'); location.reload()`. Register again — a new Postgres volume has no old accounts. |
| App starts but UI looks unchanged | Hard-refresh. Scripts are cache-busted (`/js/app.js?v=2`); Compose also bind-mounts `./frontend`. |
| Port 4000 already in use | Stop the other process, or change the host mapping in `docker-compose.yml` (`"4001:4000"`). |
| Cannot connect from host `npm start` | Postgres must be up (`docker compose up db -d`) and `DATABASE_URL` must use port **55432**, not 5432. |
| Empty database after `down -v` | `-v` deletes the `pgdata` volume. That is expected; register again. |

---

## Railway

The production image is the **same root `Dockerfile`**. `railway.toml` tells Railway to use it and to health-check `GET /api/health` (30s timeout, restart on failure).

Compose bind-mounts are **local only**. Railway does not use `docker-compose.yml`.

### 1. Create the project

1. New Railway project.
2. Add a **Postgres** service (plugin). Wait until it is running.
3. Add a service from this **GitHub repo** (or `railway up` from the repo root). Railway will build with `builder = "DOCKERFILE"` / `dockerfilePath = "Dockerfile"`.

### 2. Wire variables on the **web** service

In the web service **Variables** tab, set:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Variable reference: `${{Postgres.DATABASE_URL}}` (use your Postgres service name if it is not `Postgres`) |
| `JWT_SECRET` | Long random string (required) |
| `DATABASE_SSL` | Leave unset. Hosted Railway Postgres needs SSL; the app enables SSL automatically when `DATABASE_URL` is not localhost. |
| `ANTHROPIC_API_KEY` | Optional. Empty → mock AI. |
| `DELIVERY_API_URL` | Optional. Defaults to `https://delivery-rabka.up.railway.app/` |
| `DEFAULT_EXCHANGE_RADIUS_KM` | Optional. Default `10`. |
| `UPLOADS_DIR` | Optional. Only if you mount the volume somewhere other than `/app/backend/uploads`. |
| `PORT` | Do **not** hardcode. Railway injects `PORT`; the app already reads `process.env.PORT`. |

`backend/.env` is dockerignored and is **not** copied into the image. Configure everything in the Railway dashboard (or `railway variables`).

### 3. Persist uploaded photos

Railway’s container filesystem is ephemeral. Attach a **volume** to the web service:

- Mount path: `/app/backend/uploads`  
  (or set `UPLOADS_DIR` to the path you mount)

Without a volume, listing photos disappear on every redeploy. Phase 2 should move this to S3/R2.

### 4. Public URL and verify

1. Generate a public domain on the web service.
2. Open `https://<your-domain>/api/health` — expect `{ "ok": true, "service": "toyswap-backend", "db": "up" }`.
3. Open `https://<your-domain>/` and register a parent account.

Schema is applied automatically on boot (`✔ Postgres schema ready` in deploy logs). You do not run migrations by hand.

### Railway notes

- One replica is assumed. Uploads live on a single volume; do not scale replicas until photos are on object storage.
- `/admin` is **unauthenticated** in this MVP — do not share the public URL widely until admin is gated.
- Phase 2 can add Redis + a worker in the same Railway project without changing this API’s shape.

---


## Features Implemented in This MVP

**Accounts & safety model**
- Parent registration/login (JWT + bcrypt)
- Children exist only as sub-profiles under a verified parent account — no child can self-register independently
- Every exchange requires **both parents' explicit approval** before anything is scheduled
- No freeform chat between children — only a fixed set of pre-approved "canned" messages, visible to both families
- Coarse location only (neighborhood/postal text → approximate lat/lng), never an exact address shown to another family

**Core exchange flow**
- Photo upload for a toy or book
- AI condition scoring (1–10), a friendly generated description, and an exchangeable/not-exchangeable flag
  - Real assessment via Claude's vision API when `ANTHROPIC_API_KEY` is set; deterministic mock fallback otherwise
- MVP "3D preview": a rotating Three.js card textured with the uploaded photo (stand-in for full 3D reconstruction — see roadmap)
- Nearby browsing filtered to an **admin-configurable radius** (default 10 km, live-editable from `/admin`, distance computed via Haversine formula)
- Propose → dual-parent-approve → auto-triggered delivery request workflow
- Delivery adapter that POSTs the order to `https://delivery-rabka.up.railway.app/` once both parents approve (isolated in one file — update the payload shape once you have their real API contract)
- Admin page: live radius control + basic platform stats (parents/children/items/exchanges)

**Verified working end-to-end** during development via automated smoke test: registration → child profiles → item upload with AI scoring → nearby search with correct distance filtering → exchange proposal → dual approval → delivery trigger → canned messaging.

---

## What's Intentionally Deferred (and why)

| Feature | Status | Why deferred |
|---|---|---|
| Freeform chat | Not built | Needs moderation infrastructure (filtering, human review, full parent visibility) before it's safe to ship to children |
| Photo moderation pipeline | Stubbed (`moderation_status` column exists, unused) | Needs a dedicated image-safety model/service before public launch |
| Real 3D asset generation | Mocked with a Three.js rotating card | Needs a paid 3D-from-photo API (e.g. Meshy/Kaedim) — architecture already isolates this behind one function so it's a clean swap |
| Games | Not built | Separate product surface, planned Phase 3 |
| Multi-category exchange (clothes, shoes, etc.) | Schema supports it (`category` field is free text) but UI is toy/book only | Keeping MVP scope tight; extending the category list + UI filters is low-effort later |
| Real admin auth | Not built — `/admin` is unauthenticated | MVP-only shortcut, flagged clearly in code comments — must be gated before any public deploy |
| PostGIS | Not enabled yet | Haversine in JS is enough at MVP scale; enable PostGIS on the same Postgres when radius queries need indexes |
| S3/R2 object storage | Not built — disk + Docker/Railway volume | Fine for a single instance; swap when you add a second replica or a 3D-generation worker |

---

## Architecture

```
┌───────────────────────────────┐
│           Browser              │
│   (vanilla JS SPA, Three.js)   │
└───────────────┬─────────────────┘
                │ REST (JSON + multipart)
┌───────────────▼─────────────────┐
│   Express server (single         │
│   process, serves API + static)  │
│  ┌─────────────────────────────┐ │
│  │ routes: parents / children /  │ │
│  │ items / exchanges / admin     │ │
│  └─────────────┬─────────────────┘ │
│  ┌─────────────▼─────────────────┐ │
│  │ services: aiEvaluation, geo,   │ │
│  │ delivery, auth                 │ │
│  └─────────────┬─────────────────┘ │
│  ┌─────────────▼─────────────────┐ │
│  │  Postgres (pg) + volume uploads│ │
│  └─────────────────────────────────┘ │
└───────────────────────────────────┘
        │                      │
        ▼                      ▼
 Claude Vision API      delivery-rabka
 (optional, AI          (webhook fired on
  condition scoring)     dual parent approval)
```

## Tech Stack

**MVP (this repo):** Node.js, Express, Postgres (`pg`), Docker / Docker Compose, JWT auth, Multer uploads on a volume, vanilla JS + Three.js frontend (no build step required).

**Next on Railway:** Redis + a worker for 3D generation and photo moderation, PostGIS on the same Postgres, S3-compatible object storage, managed chat, Stripe Connect.

## Roadmap

1. **MVP (delivered here)** — accounts, AI-scored listings, radius browsing, dual-approval exchange, delivery webhook, admin radius control.
2. **Phase 2** — real 3D generation, photo moderation pipeline, trust/rating system, push notifications, finalized delivery API contract, moderated parent-supervised real-time chat.
3. **Phase 3** — child-safe games, expand to clothes/shoes/other categories, loyalty points.
4. **Phase 4** — PostGIS for geo queries at scale, mobile apps, payment splitting for delivery commission, fraud/safety ML.

## Legal note
This handles children's data and in-app matching between minors. Before any real users touch it, get proper legal review for COPPA (US) / GDPR-K (EU) parental consent requirements, data retention policy, and driver background-check requirements for the delivery side.
