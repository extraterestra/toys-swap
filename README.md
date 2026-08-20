# ToySwap 🧸 — MVP

A parent-supervised platform where children list toys/books, get an **AI condition assessment** of the item from a photo, browse what's available within a **configurable radius**, and — once **both parents approve** — the exchange is handed off to a delivery service. Parents pay only the delivery fee.

This is a **local-first MVP**: unzip, `npm install`, `npm start`, open `http://localhost:4000`. One Node process serves both the API and the frontend, backed by SQLite (zero external services required to run it).

---

## Quick Start

```bash
cd backend
cp .env.example .env      # edit if you want, defaults work for local testing
npm install
npm start
```

Open **http://localhost:4000** in your browser. Register a parent account, add one or two child profiles, list a toy/book with a photo, then open a second browser (or incognito window) and register a second "family" to test browsing/exchanging between two accounts.

### Enabling real AI photo evaluation
By default the AI condition check uses a **mock evaluator** so the app works fully offline. To use real AI:
1. Get an Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
2. Put it in `backend/.env` as `ANTHROPIC_API_KEY=sk-ant-...`
3. Restart the server — the console will confirm `✔ AI photo evaluation: using real Claude vision API`

### Deploying to Railway later
- Add a `railway.json`/`Procfile` pointing to `backend/server.js` (root dir = `backend`)
- Set `JWT_SECRET`, `ANTHROPIC_API_KEY`, `DELIVERY_API_URL` as Railway environment variables
- Swap SQLite for Railway's managed Postgres (see Phase 4 below) — SQLite's file-based storage doesn't survive Railway's ephemeral filesystem across redeploys/multiple instances
- Swap local disk uploads for an S3-compatible bucket — local disk works for a single quick first deploy but won't scale past one instance

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
| Postgres/PostGIS, S3 storage | Not built — using SQLite + local disk | Correct for local MVP; swap-in path documented above for Railway |

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
│  │  SQLite (better-sqlite3)       │ │
│  └─────────────────────────────────┘ │
└───────────────────────────────────┘
        │                      │
        ▼                      ▼
 Claude Vision API      delivery-rabka
 (optional, AI          (webhook fired on
  condition scoring)     dual parent approval)
```

## Tech Stack

**MVP (this repo):** Node.js, Express, SQLite (`better-sqlite3`), JWT auth, Multer for uploads, vanilla JS + Three.js frontend (no build step required).

**Planned for production (Railway):** Postgres + PostGIS (or Haversine SQL) for real geo queries at scale, S3-compatible object storage for photos, a queued job for 3D asset generation, a dedicated image-moderation service, a managed identity/consent provider for COPPA/GDPR-K compliant parental consent, and a moderated real-time chat service.

## Roadmap

1. **MVP (delivered here)** — accounts, AI-scored listings, radius browsing, dual-approval exchange, delivery webhook, admin radius control.
2. **Phase 2** — real 3D generation, photo moderation pipeline, trust/rating system, push notifications, finalized delivery API contract, moderated parent-supervised real-time chat.
3. **Phase 3** — child-safe games, expand to clothes/shoes/other categories, loyalty points.
4. **Phase 4** — Postgres/PostGIS migration, mobile apps, payment splitting for delivery commission, fraud/safety ML.

## Legal note
This handles children's data and in-app matching between minors. Before any real users touch it, get proper legal review for COPPA (US) / GDPR-K (EU) parental consent requirements, data retention policy, and driver background-check requirements for the delivery side.
