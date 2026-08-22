# Legal review request — children’s data (P1.2)

**Not legal advice. Not a sign-off.** Engineering prepared this package so qualified counsel can review the closed family pilot (Poland / EU first; other jurisdictions only if added).

## Ask

Please review ToySwap against:

- GDPR (EU) 2016/679, including Articles 6–8, 12–17, 32, and child-specific transparency
- Polish implementation and guidance on children’s data / parental consent
- Any other law that applies to the **named pilot area** (start: families invited around Rabka-Zdrój / southern Poland)

Confirm or replace the draft decisions in `docs/data-map-and-retention.md`.

## What to read

| Document / surface | Why |
|---|---|
| `docs/data-map-and-retention.md` | Field map, purposes, retention, deletion, exceptions |
| In-app `#privacy` `#terms` `#safety` `#rules` | Parent-facing pack `2026-08-21.2` |
| `backend/services/privacy.js` / `legal.js` | Policy version, age bands, consent + deletion |
| `backend/db/schema.sql` | `guardian_consents`, `children.age_band` |
| `docs/P1-launch-readiness.md` | Honest product claims; processors (Railway, optional Anthropic, delivery webhook) |

## Engineering controls already in the app

- Parent account required; children cannot self-register
- Privacy checkbox recorded at family registration (`kind = family_account`)
- Guardian checkbox required before a child profile is created (`kind = child_profile`)
- Child fields limited to nickname + age range + emoji (no birth year)
- Nearby API does not return coordinates, address, email, or child id
- Phone GPS is ignored at registration
- Parent can delete a child profile or the whole family account
- Canned messages only (no freeform child chat)

## Counsel must still decide

1. Lawful basis and whether the in-app checkboxes are valid parental consent for this age group.
2. Whether nickname + age range is acceptable or further minimization is required.
3. Retention of hashed email on consent rows after account deletion (draft: up to 3 years).
4. Backup / log erasure vs rotation; DPIA need for the pilot.
5. Processor agreements (Railway, Anthropic if enabled, delivery partner).
6. Photo hosting without authenticated image URLs.
7. Admin access to parent email and neighbourhood text.
8. Whether a wider public launch needs extra notices, DPO, or age-gate changes.

## Sign-off (counsel completes)

| | |
|---|---|
| Jurisdictions reviewed | |
| Counsel name / firm | |
| Date | |
| Policy version reviewed | `2026-08-21.2` |
| Result | ☐ Approved for closed pilot / ☐ Changes required / ☐ Do not process children’s data yet |
| Required changes | |
| Signature | |

Until this block is completed, treat children’s data as **not cleared for families outside the operator’s own test accounts**.
