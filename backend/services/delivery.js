/**
 * Adapter for the external delivery app.
 *
 * IMPORTANT: This is a best-guess request shape. You will need to align the
 * field names / auth with the real contract of https://delivery-rabka.up.railway.app/
 * once you have its API docs - this module is intentionally isolated so that's
 * a one-file change.
 */
async function requestDelivery({ exchangeId, pickupAddress, dropoffAddress, itemsSummary }) {
  const url = process.env.DELIVERY_API_URL || 'https://delivery-rabka.up.railway.app/';

  const payload = {
    external_order_ref: exchangeId,
    pickup: pickupAddress,
    dropoff: dropoffAddress,
    items: itemsSummary,
    payer: 'parent', // parents pay only for the delivery fee, per business model
    notes: 'ToySwap toy/book exchange order'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      raw: text
    };
  } catch (err) {
    // Network to this domain is not whitelisted in every environment (e.g. this
    // dev sandbox), so failures here are expected in local/offline testing.
    // The exchange still proceeds and can be retried / marked manually.
    return { ok: false, status: 0, raw: `Delivery request failed: ${err.message}` };
  }
}

module.exports = { requestDelivery };
