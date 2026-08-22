# Legal and safety pages (P1.3)

**Pack version:** `2026-08-21.2`  
**In-app:** `#privacy` `#terms` `#safety` `#rules`  
**Support:** `SUPPORT_EMAIL` (or the first `ADMIN_EMAILS` address) · target reply `SUPPORT_RESPONSE_HOURS` (default 48) · emergency **112**

These pages are operator draft copy. They are **not** a substitute for qualified legal review (`docs/legal-review-request.md`).

## Decision points

| Moment | What the parent sees |
|---|---|
| Before register | Footer + register links to all four documents; location hint beside the neighbourhood field |
| Register | One **unticked** required checkbox for the legal pack. **No marketing checkbox** (the product does not send marketing) |
| Listing a photo | Honest notice: no pre-publish human or safety-model review |
| Nearby listing / nickname | Report listing, report family, block family |
| Exchange list and canned chat | Report swap, report message, block family |

Acceptance of the pack is stored as `guardian_consents.kind = required_agreements` with `policy_version`, parent account, timestamp, locale, and confirmation text (plus the existing `family_account` row).

## Photo moderation (accurate)

- **Who reviews before publish:** nobody.
- **When:** only after a parent report, by the admin operator.
- **What is rejected:** Community Rules (unsafe/recalled items, child in photo, etc.).
- **How removal works:** parent deletes their listing, or admin sets `items.status = 'removed'` from a report.

Condition scoring (Claude or mock) is **not** a safety filter.
