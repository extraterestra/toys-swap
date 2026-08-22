# P1.1 — Public claims vs working service

Reviewed against homepage copy, in-app strings, and server code on **21 August 2026**. Protected API behaviour listed as **Verify** was inferred from source, not live authenticated testing.

Owners below are the roles that must keep the claim true. Fill named people before inviting families.

## Three product states

| State | Meaning | Where it may appear |
|---|---|---|
| **Available now** | Built, used in the closed family pilot, described accurately | Parent accounts, child profiles, listings, nearby browse (Haversine + admin radius), dual-parent approval, canned chat |
| **Pilot-only** | Works in a limited way for invited families; not a public guarantee | Condition score, delivery partner webhook (Rabka test endpoint), in-app “no charge” |
| **Planned** | Not available. Must not be sold as live | Nationwide courier, in-app payment, published delivery tariff, photo moderation, real 3D models, refunds automation |

## Claim inventory

| Public / in-app claim (before this change) | State | Evidence | Owner | Status after P1.1 |
|---|---|---|---|---|
| Parent-only accounts; children cannot self-register | Available now | `backend/routes/parents.js`, `children.js` | Engineering | Keep |
| Dual parent approval before anything is scheduled | Available now | `backend/routes/exchanges.js` approve flow | Engineering | Keep |
| No freeform child chat; canned messages only | Available now | `canned_messages` + exchange message routes | Engineering | Keep |
| Other families do not see street address | Available now | Nearby listings return nickname, rounded km, listing fields — **not** `lat`/`lng`, `address_text`, email, or child id (`publicNearbyListing`) | Engineering | Keep |
| Admin-set browse radius (default 10 km) | Available now | `admin_settings.exchange_radius_km`, Haversine | Ops + Engineering | Keep; area is still a geocode stand-in |
| Listing, browse, matching have no ToySwap fee | Available now | No Stripe/payment code | Product | Keep |
| “AI checks condition and writes a listing” | Pilot-only | Real Claude only if `ANTHROPIC_API_KEY` is set; otherwise **mock** scores (`aiEvaluation.js`). No human review queue. Photos are **not** moderated (`moderation_status` unused). | Product + Engineering | Copy now: estimate / first look, not an appraisal |
| “We hand the exchange to delivery / courier collects” | Pilot-only | `delivery.js` POSTs a best-guess JSON body to `DELIVERY_API_URL` (default `delivery-rabka.up.railway.app`). Contract not finalized. Failed HTTP still marks exchange `delivery_requested`. No pickup SLA. | Ops + Engineering | Copy now: partner *may* be notified in the test area; not a nationwide courier |
| “Parents pay only the delivery fee” | Planned (charging) / Pilot-only (0 PLN in-app) | No payment capture. Adapter comment says `payer: 'parent'` but nothing is billed. | Finance + Product | Copy now: **0 PLN in the app** during the pilot; partner cost is not a published tariff |
| “Families stay at home — no meetups required” | Planned as default / not guaranteed | Depends on a working courier booking | Ops | Copy now: no meetup is *required by the app*; handover may still be needed if delivery is not booked |
| “Demo” footer | — | Marketing leftover | Product | Replaced with **closed family pilot** notice |
| Hero illustration | Unconfirmed rights | `frontend/img/hero.jpg` supplied in product chat 21 Aug 2026 | Product / Legal | Register in `frontend/img/ASSET_LICENSE.md` — **do not run paid ads until license is filed** |
| 3D rotating preview | Pilot-only / not advertised as 3D scan | Three.js textured card | Engineering | Not claimed on homepage |
| Photo safety / CSAM moderation | Planned | Stub column only | Safety | Not claimed |
| Exact Polish neighbourhood geocoding | Planned | `fallbackGeocode` hashes text to a point near southern Poland | Engineering | Copy does not promise map-accurate addresses |

## Confirmations required before real children’s data

1. **AI:** Decide live vs mock in production. If live: document model, human review, and that scores are non-binding. If mock: do not invite families who will rely on condition scores.
2. **Courier:** Written partner contract, service area list, and what happens when `requestDelivery` returns `ok: false`.
3. **Fees:** Publish the table in `docs/fees-and-delivery.md` on the public Costs page (done). Update amounts when a tariff exists.
4. **Artwork:** Complete `frontend/img/ASSET_LICENSE.md` with a license or replace `hero.jpg`.
5. **Children’s data:** Counsel sign-off on `docs/legal-review-request.md` and the map in `docs/data-map-and-retention.md`. Engineering controls (guardian consent, age range, deletion) are in the app; they are **not** a legal approval.

## Acceptance (P1.1)

- [x] Inventory of operational claims with owner + evidence (this file).
- [x] Public copy separates **available now**, **pilot-only**, and **planned**.
- [x] “Demo” replaced by a closed-pilot notice.
- [x] Delivery area and expected cost are visible **before registration** (`#costs`) and **before approve**.
- [ ] Written proof of hero artwork rights (register started; license still **UNCONFIRMED**).
