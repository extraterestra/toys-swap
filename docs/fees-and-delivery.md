# Fees, delivery, cancellations, damage, loss, refunds

Public summary of this document is shown on the in-app **Costs** page. Update both together.

**Pilot area (as of 21 August 2026):** delivery partner integration is a test webhook aimed at the **Rabka-Zdrój / southern Poland** stack (`DELIVERY_API_URL`). It is **not** a nationwide courier network.

**In-app charges during the closed family pilot: 0 PLN.** ToySwap does not collect card payments.

| Item | Who pays | Amount | When |
|---|---|---|---|
| Create a parent account | Nobody | 0 PLN | — |
| List a toy or book | Nobody | 0 PLN | — |
| Browse nearby / propose a swap | Nobody | 0 PLN | — |
| Decline a proposal | Nobody | 0 PLN | — |
| Dual-parent approval | Nobody in-app | 0 PLN | Partner may still have their own cost **outside** the app; none is charged by ToySwap today |
| Published courier tariff | — | **Not available** | Planned |
| Failed delivery / retry | Families + Ops | 0 PLN in-app | Ops follows up manually; exchange may need a new handover plan |
| Cancellation after approval | Families | 0 PLN in-app | Tell Ops; we cannot auto-cancel a courier that was never reliably booked |
| Damage or loss in transit | **Undefined until partner contract** | — | Do not promise insurance. Families should photograph items at handover |
| Refunds | N/A in-app | No in-app payments, so no in-app refunds | If a partner billed a family directly, that is between the family and the partner |

## Failed delivery handling (current software)

`backend/services/delivery.js` POSTs JSON to the partner URL. On HTTP or network failure the delivery row is stored as `failed`, but the exchange is still marked `delivery_requested`. **Ops must not treat that status as “courier is coming.”**

## Planned (must not be described as live)

- Card checkout / Stripe (or similar) for a delivery fee
- Itemised fee before approve, charged only after both parents confirm
- Insurance, claims, and automatic refunds
