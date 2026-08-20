# ToySwap — Full Project Plan

## 1. Vision

A children's toy & book exchange platform, used with parental supervision: children
photograph items they've outgrown, AI assesses condition and generates a friendly
listing, and nearby families exchange items with a delivery courier — parents pay only
the delivery fee, and the platform takes a small commission on that fee. Later expands
to clothes, shoes, and other categories, plus safe games.

## 2. Core Principles (non-negotiable, shapes every decision below)

- **Parent-first accounts.** A child profile cannot exist without a verified parent account.
  Every exchange requires explicit approval from *both* parents.
- **Safety over features.** Freeform chat, precise location sharing, and unmoderated media
  are not shipped until the moderation/safety infrastructure exists to support them.
- **Fuzzy location, not exact.** Families never see each other's exact address — only
  approximate distance. The delivery courier is the only party that sees pickup/dropoff
  addresses.
- **Legal compliance by design.** COPPA (US), GDPR-K / Age Appropriate Design Code (EU/UK)
  drive data minimization, parental consent flows, and data retention limits from day one.

## 3. Tech Stack

### MVP (local-first, what's in this repo)
| Layer | Choice | Why |
|---|---|---|
| Backend | Node.js + Express | Fast to build, huge ecosystem, single language with frontend |
| DB | Postgres (`pg`) | Same engine as Railway; ready for PostGIS later |
| Auth | JWT + bcrypt | Simple, stateless, well understood |
| Uploads | Multer on a Docker/Railway volume | Survives restarts; swap to S3/R2 when scaling |
| Infra | Docker Compose locally, Dockerfile + `railway.toml` on Railway | One image from laptop to production |
| AI condition assessment | Claude vision API (`claude-sonnet-4-6`) with mock fallback | Real multimodal reasoning about photo condition; fallback keeps MVP runnable offline |
| 3D preview | Three.js (client-side) | No server cost; good enough for MVP visualization |
| Frontend | Vanilla JS SPA | Zero build tooling — `unzip && run` |

### Production (Railway and beyond)
| Layer | Choice | Why |
|---|---|---|
| Backend | Node.js/Express (same codebase) or split into services later | Minimize rewrite risk |
| DB | Postgres + PostGIS (or Haversine query as here, at larger scale) | Managed, durable, geo-indexing |
| Object storage | S3-compatible (Cloudflare R2 / AWS S3) | Railway's filesystem is ephemeral |
| Auth | Managed auth (Clerk/Auth0) or hardened custom JWT + refresh tokens, MFA for parents | Production-grade session security |
| AI condition assessment | Claude vision API (same) | Already production-ready |
| 3D asset generation | Meshy.ai / Kaedim / Spline API, queued via a job worker (BullMQ + Redis) | Real 3D reconstruction is slow/async, needs a queue |
| Photo moderation | AWS Rekognition / Hive / Claude vision as a safety classifier | Required before any child-uploaded photo is shown to other families |
| Chat (Phase 2+) | Managed chat infra (Stream/Sendbird) with keyword filters + human review queue + full parent visibility | Do not build ad hoc for a children's product |
| Delivery integration | Direct API contract with delivery-rabka once documented | Already stubbed with an adapter module |
| Payments | Stripe Connect (split payment: delivery fee to courier, commission to platform) | Standard for two-sided marketplaces |
| Infra | Railway (API + Postgres + Redis), CDN for static assets | Matches stated deployment target |
| Monitoring | Sentry (errors) + basic analytics (privacy-respecting, no child-level tracking/ads) | Compliance-friendly observability |

## 4. Architecture Overview

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────────┐
│  Frontend    │◄────►│  Express API      │◄────►│ Postgres + PostGIS   │
│ (SPA/mobile) │      │  (auth, items,    │      │ (parents, children,  │
└─────────────┘      │   exchanges,      │      │  items, exchanges)   │
                      │   admin)          │      └─────────────────────┘
                      └────────┬─────────┘
                               │
             ┌─────────────────┼───────────────────┐
             ▼                 ▼                    ▼
     ┌───────────────┐ ┌───────────────┐   ┌──────────────────┐
     │ Claude Vision   │ │ Moderation     │   │ Delivery App API  │
     │ (condition +    │ │ classifier     │   │ (delivery-rabka)  │
     │ description)    │ │ (photo safety) │   └──────────────────┘
     └───────────────┘ └───────────────┘
             │
             ▼
     ┌───────────────┐
     │ 3D gen queue   │ (async job worker, Phase 2)
     │ (Meshy/Kaedim) │
     └───────────────┘
```

## 5. Data Model (as implemented in MVP; extends naturally to Postgres)

`parents` → `children` → `items` → `exchange_requests` → `deliveries`, plus
`exchange_messages` (canned-only), `canned_messages`, `admin_settings`.
See `backend/db/schema.sql` for the exact schema — it is Postgres now, close to
what production needs, and ready for a PostGIS column later without renaming tables.

## 6. Business Model

- MVP/launch: platform takes a small commission on the delivery fee (e.g. flat fee or
  5–10% of delivery cost). Item exchange itself stays free — this keeps the core loop
  appealing to families and avoids treating children's belongings as a marketplace with
  cash changing hands, which simplifies both UX and regulatory exposure.
- Later: optional premium features for parents (priority matching, larger radius,
  multiple simultaneous listings, category expansion access) — never pay-to-win features
  aimed at children themselves, and never ads targeted at children.

## 7. Phased Roadmap

### Phase 0 — MVP (this repo)
Parent/child accounts · item listing with AI condition scoring · 3D preview placeholder ·
radius-limited browsing · dual-parent-approval exchange workflow · delivery webhook stub ·
canned-message-only chat · admin radius control.

### Phase 1 — Pre-launch hardening
- Real geocoding + PostGIS radius queries
- Photo moderation pipeline (block before publish, not after)
- Admin authentication & moderation queue UI
- Move to Postgres + S3 storage on Railway
- Finalize delivery-rabka API contract (auth, webhook callbacks for delivery status)
- Payment collection (Stripe) for the delivery fee + commission split
- Legal: COPPA/GDPR-K compliant consent flow, privacy policy, data retention policy,
  parental data-access/delete rights

### Phase 2 — Trust & richer features
- Real 3D asset generation (async job)
- Ratings/trust score per family (based on completed exchanges, not public reviews of children)
- Parent-supervised real-time chat with keyword filtering + human review + full message
  visibility to both parents
- Push/email notifications (match found, approval needed, delivery status)
- Delivery status webhooks feeding back into exchange status in real time

### Phase 3 — Expansion
- New categories: books (already in MVP schema), clothes, shoes
- Simple, ad-free, COPPA-safe in-app games as an engagement layer (no third-party ad SDKs)
- Loyalty/points system for completed exchanges
- Multi-city rollout, per-city radius defaults

### Phase 4 — Scale
- Native mobile apps
- ML-based fraud/safety detection (fake listings, suspicious patterns)
- Multi-region infra, load-tested delivery-partner integrations
- Possibly split into microservices if team/traffic justifies it

## 8. Key Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Grooming / unsafe contact between children | No freeform chat until moderated infra exists; parents see every message; canned messages only in MVP |
| Location exposure | Fuzzy distance only, never exact address to other families |
| Unsafe/broken items exchanged | AI condition check + `exchangeable` flag; add human spot-checks at scale |
| Regulatory (COPPA/GDPR-K) | Parent-gated accounts from day one; legal review before Phase 1 launch |
| Delivery API mismatch | Isolated adapter module (`services/delivery.js`) — one file to update once real contract is known |
| SQLite doesn't scale / isn't durable on Railway | Postgres is the MVP database; PostGIS can be enabled on the same instance |
