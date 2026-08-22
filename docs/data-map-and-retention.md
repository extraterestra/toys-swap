# Data map and retention schedule

**Policy version:** `2026-08-21.2`  
**Product:** ToySwap closed family pilot  
**Status:** Draft for qualified legal review — **not signed off**

This file is the field-level inventory required by P1.2. Counsel must mark the sign-off block in `docs/legal-review-request.md` before inviting families outside the operator’s household.

Controller (draft): the ToySwap operator. Processors (draft): Railway (app, Postgres, volume, logs), Anthropic (listing photos only if `ANTHROPIC_API_KEY` is set), optional delivery partner after dual parent approval.

## Minimum child data (decision)

| Collect | Do not collect |
|---|---|
| Nickname (`display_name`, max 40) | Legal name / surname |
| Age range (`age_band`: 0–2, 3–5, 6–8, 9–12, 13–17) | Exact birth year or date of birth |
| Avatar emoji | Child photo, school, email, phone, address |

A child profile cannot be created unless the parent checks guardian confirmation. The API stores a `guardian_consents` row (`kind = child_profile`) with policy version, parent account, email hash, locale, timestamp, and confirmation text.

Existing `birth_year` values are converted to an age band on deploy and then cleared.

## What other families receive

Nearby browse returns only: listing title, category, photos, condition estimate, **nickname**, avatar emoji, and **rounded distance in whole kilometres** (never below 1 km). It does **not** return lat/lng, child id, parent email, `address_text`, surname, or school.

After both parents approve a swap, the server may send **parent** neighbourhood/address text to the delivery partner. That is not shown in the other family’s app.

## Field inventory

| Record | Field | Whose data | Purpose | Who can access | Retention | Deletion |
|---|---|---|---|---|---|---|
| `parents` | `name` | Parent | Account display | Parent, operator (admin) | While account exists | `DELETE /api/parents/me` |
| `parents` | `email` | Parent | Login, operator contact | Parent, operator | While account exists | Same; consent row keeps SHA-256 hash only |
| `parents` | `password_hash` | Parent | Authentication | Server only | While account exists | Deleted with account |
| `parents` | `role` | Parent | Admin flag | Operator | While account exists | Deleted with account |
| `parents` | `address_text` | Parent (may be identifying) | Coarse matching; delivery after dual approval | Parent (not in `/me` JSON today), operator, delivery partner after approval | While account exists | Deleted with account. **Do not type a street number.** |
| `parents` | `lat`, `lng` | Parent (coarse) | Radius browse. Derived from neighbourhood text hash, **not** phone GPS | Server; never sent to other families | While account exists | Deleted with account |
| `parents` | `created_at` | Parent | Account age | Parent, operator | While account exists | Deleted with account |
| `children` | `display_name` | Child | Nickname on listings/swaps | Own parent; other families see nickname only | While profile exists | `DELETE /api/children/:id` or family delete |
| `children` | `age_band` | Child | Age range for the profile | Own parent, operator | While profile exists | Same |
| `children` | `avatar_emoji` | Child | Non-identifying avatar | Own parent; other families | While profile exists | Same |
| `children` | `birth_year` | Child | **Deprecated — no longer collected; column nulled** | None via API | Immediate null | Already cleared on migrate |
| `guardian_consents` | `parent_id`, `child_id` | Link | Proof of who consented | Operator; parent via `GET /api/parents/me/consents` (no hash) | See legal exception | IDs set null on delete; row may remain |
| `guardian_consents` | `parent_email_hash` | Parent (pseudonymous) | Prove consent after account deletion | Operator | Up to 3 years after deletion **if counsel confirms** | Manual purge after that period |
| `guardian_consents` | `kind`, `policy_version`, `locale`, `confirmation_text`, `confirmed_at` | Parent | Consent record | Parent, operator | Same as hash | Same |
| `items` | `title`, `description`, `category`, `status` | Family (item) | Listing | Own parent; other families see title/category (not description on nearby) | While listing exists | Listing delete, child delete, or family delete |
| `items` | `lat`, `lng` | Parent (copy of coarse point) | Radius filter | Server only on nearby | While listing exists | Same |
| `item_photos` / `photo_path` | image file | Family; **may include a child’s face if the parent uploads one** | Listing | Anyone with the UUID URL (residual risk) | While listing exists | File unlinked from disk/volume when listing, child, or account is deleted |
| `items` | AI score/label/description | Item | Condition estimate | Own parent; other families see score text | While listing exists | Same. If Claude is enabled, Anthropic may retain per their terms — disable the key to avoid that processor |
| `exchange_requests` | ids, status, duration | Two families | Swap workflow | Both parents, operator | Until both sides deleted or declined cleanup | Removed when a participating child/account is deleted (blocked if status is not `declined`) |
| `exchange_messages` | canned id + sender child | Child (indirect) | Canned chat only | Both parents on that exchange | With the exchange | Deleted with the exchange |
| `deliveries` | `raw_response`, addresses via partner call | Parent | Attempt delivery | Operator; partner copy **out of our database** | With the exchange | Deleted in our DB with the exchange. Partner copies are **not** erased by this app |
| JWT in `localStorage` | session | Parent | Stay logged in | That browser | Until logout or account delete | Cleared in the client on logout/delete |
| `safety_reports` | subject, reason, details, parent emails via join | Reporter + reported families | Safety review after a parent report | Operator (admin) | While open + after resolve for the pilot | Operator may delete; not shown to other families |
| `parent_blocks` | blocker/blocked ids | Parents | Hide listings both ways | Server; each parent only sees the effect | Until unblock (not in UI yet) or account delete | Cascade on parent delete |
| Device IDs, contacts, school, child’s email | — | **Not collected** | — | — | — | — |
| App logs | error messages | Possibly parent email if an error string includes it | Debugging | Operator / Railway | Host log retention (often 7–30 days) | Not erased by in-app delete. Avoid putting child nicknames in logs |
| Postgres backups | snapshot of tables | All of the above | Disaster recovery | Operator / Railway | Host backup window (often ≤ 30 days) | Expire with backup rotation. **No in-app backup wipe** |
| Search index | — | **None** (no Elasticsearch / Meilisearch) | — | — | — | N/A |

## Parent-controlled deletion (implemented)

1. **Listing** — `DELETE /api/items/:id` (unchanged): blocked if a non-declined exchange exists; otherwise DB rows + photo files.
2. **Child profile** — `DELETE /api/children/:id`: listings, photos on disk, canned messages, deliveries, and exchanges for that child. Blocked while any related exchange is not `declined`.
3. **Family account** — `DELETE /api/parents/me`: all children as above, then the parent row. Consent rows keep policy version, locale, time, text, and email hash with `parent_id` / `child_id` nulled.

Active exchanges must be declined first so the other family is not silently removed from a live swap.

## Backup deletion and legal exceptions

| Store | What the app does | Operator follow-up |
|---|---|---|
| Primary Postgres | Immediate row delete / null | Confirm on a staging copy after a test delete |
| Upload volume (`UPLOADS_DIR`) | `unlink` photo files | Confirm file gone on the volume |
| Search | N/A | N/A |
| Application logs | Not deleted | Rely on host retention; do not export child data into tickets |
| Database backups | Not deleted by API | Wait for rotation; if counsel requires faster erasure, restore-exclude is a host ticket |
| Delivery partner / Anthropic | Not deleted by API | Contractual deletion request if those processors were used |

**Legal retention exceptions (draft, counsel must confirm):**

- Consent evidence (hash + version + timestamp + text) up to **3 years** after account deletion, or shorter if counsel says the pilot can rely on logs only.
- No payment or tax records (in-app price is 0 PLN).
- Safety/abuse investigations: operator may keep a ticket **without** copying child nicknames or photos into email.

## Residual risks (do not hide from counsel)

- Listing photo URLs are UUID-named files on `/uploads` without auth on `<img>` tags.
- Parents can still type a street address or put a child’s face/school in a photo or description; the UI warns against it.
- Coarse lat/lng is still stored server-side for radius matching.
- Admin console sees parent email and `address_text`.

## Sign-off

Use `docs/legal-review-request.md`. Until that file is signed, this schedule is an engineering draft, not a controller policy.
