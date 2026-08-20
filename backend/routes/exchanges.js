const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { one, many, query } = require('../db/db');
const { requireParentAuth } = require('../services/auth');
const { assertChildOwnership } = require('./children');
const { requestDelivery } = require('../services/delivery');
const asyncHandler = require('../services/asyncHandler');

const router = express.Router();

// A child (via their parent) proposes to exchange their item for another child's item.
router.post('/', requireParentAuth, asyncHandler(async (req, res) => {
  const { offered_item_id, requested_item_id, from_child_id, duration_type, duration_days } = req.body;
  if (!offered_item_id || !requested_item_id || !from_child_id) {
    return res.status(400).json({ error: 'offered_item_id, requested_item_id, from_child_id are required' });
  }
  const child = await assertChildOwnership(from_child_id, req.parentId);
  if (!child) return res.status(403).json({ error: 'This child does not belong to your account' });

  const requestedItem = await one('SELECT * FROM items WHERE id = $1', [requested_item_id]);
  const offeredItem = await one('SELECT * FROM items WHERE id = $1', [offered_item_id]);
  if (!requestedItem || !offeredItem) return res.status(404).json({ error: 'Item not found' });

  const exchange = await one(
    `INSERT INTO exchange_requests (
      id, offered_item_id, requested_item_id, from_child_id, to_child_id,
      duration_type, duration_days
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      uuidv4(), offered_item_id, requested_item_id, from_child_id, requestedItem.child_id,
      duration_type || 'forever', duration_days || null
    ]
  );

  await query(
    `UPDATE items SET status = 'pending_exchange' WHERE id IN ($1, $2)`,
    [offered_item_id, requested_item_id]
  );

  res.status(201).json(exchange);
}));

// List exchange requests involving any of the authenticated parent's children.
router.get('/', requireParentAuth, asyncHandler(async (req, res) => {
  const rows = await many(
    `SELECT er.*,
      oi.title as offered_title, oi.photo_path as offered_photo,
      ri.title as requested_title, ri.photo_path as requested_photo,
      fc.display_name as from_child_name, tc.display_name as to_child_name
     FROM exchange_requests er
     JOIN items oi ON er.offered_item_id = oi.id
     JOIN items ri ON er.requested_item_id = ri.id
     JOIN children fc ON er.from_child_id = fc.id
     JOIN children tc ON er.to_child_id = tc.id
     WHERE er.from_child_id IN (SELECT id FROM children WHERE parent_id = $1)
        OR er.to_child_id IN (SELECT id FROM children WHERE parent_id = $1)
     ORDER BY er.created_at DESC`,
    [req.parentId]
  );
  res.json(rows);
}));

// Parent approves an exchange on behalf of their child (whichever side they represent).
router.post('/:id/approve', requireParentAuth, asyncHandler(async (req, res) => {
  const exchange = await one('SELECT * FROM exchange_requests WHERE id = $1', [req.params.id]);
  if (!exchange) return res.status(404).json({ error: 'Exchange not found' });

  const fromChild = await one('SELECT * FROM children WHERE id = $1', [exchange.from_child_id]);
  const toChild = await one('SELECT * FROM children WHERE id = $1', [exchange.to_child_id]);

  let updated = false;
  if (fromChild.parent_id === req.parentId) {
    await query(`UPDATE exchange_requests SET from_parent_approved = 1 WHERE id = $1`, [exchange.id]);
    updated = true;
  }
  if (toChild.parent_id === req.parentId) {
    await query(`UPDATE exchange_requests SET to_parent_approved = 1 WHERE id = $1`, [exchange.id]);
    updated = true;
  }
  if (!updated) return res.status(403).json({ error: 'You are not a party to this exchange' });

  let refreshed = await one('SELECT * FROM exchange_requests WHERE id = $1', [exchange.id]);

  if (refreshed.from_parent_approved && refreshed.to_parent_approved && refreshed.status === 'pending_parent_approval') {
    await query(`UPDATE exchange_requests SET status = 'approved' WHERE id = $1`, [exchange.id]);

    const fromParent = await one('SELECT * FROM parents WHERE id = $1', [fromChild.parent_id]);
    const toParent = await one('SELECT * FROM parents WHERE id = $1', [toChild.parent_id]);
    const offeredItem = await one('SELECT * FROM items WHERE id = $1', [exchange.offered_item_id]);
    const requestedItem = await one('SELECT * FROM items WHERE id = $1', [exchange.requested_item_id]);

    const deliveryResult = await requestDelivery({
      exchangeId: exchange.id,
      pickupAddress: fromParent.address_text,
      dropoffAddress: toParent.address_text,
      itemsSummary: `${offeredItem.title} <-> ${requestedItem.title}`
    });

    await query(
      `INSERT INTO deliveries (id, exchange_id, status, raw_response)
       VALUES ($1, $2, $3, $4)`,
      [uuidv4(), exchange.id, deliveryResult.ok ? 'requested' : 'failed', deliveryResult.raw]
    );

    await query(`UPDATE exchange_requests SET status = 'delivery_requested' WHERE id = $1`, [exchange.id]);
    refreshed = await one('SELECT * FROM exchange_requests WHERE id = $1', [exchange.id]);
  }

  res.json(refreshed);
}));

router.post('/:id/decline', requireParentAuth, asyncHandler(async (req, res) => {
  const exchange = await one('SELECT * FROM exchange_requests WHERE id = $1', [req.params.id]);
  if (!exchange) return res.status(404).json({ error: 'Exchange not found' });
  await query(`UPDATE exchange_requests SET status = 'declined' WHERE id = $1`, [exchange.id]);
  await query(
    `UPDATE items SET status = 'available' WHERE id IN ($1, $2)`,
    [exchange.offered_item_id, exchange.requested_item_id]
  );
  res.json({ ok: true });
}));

// --- Canned messaging (no freeform text between children, by design) ---

router.get('/canned-messages', requireParentAuth, asyncHandler(async (req, res) => {
  res.json(await many('SELECT * FROM canned_messages ORDER BY id'));
}));

router.post('/:id/messages', requireParentAuth, asyncHandler(async (req, res) => {
  const { sender_child_id, canned_message_id } = req.body;
  const child = await assertChildOwnership(sender_child_id, req.parentId);
  if (!child) return res.status(403).json({ error: 'This child does not belong to your account' });

  await query(
    `INSERT INTO exchange_messages (id, exchange_id, sender_child_id, canned_message_id)
     VALUES ($1, $2, $3, $4)`,
    [uuidv4(), req.params.id, sender_child_id, canned_message_id]
  );

  res.status(201).json({ ok: true });
}));

router.get('/:id/messages', requireParentAuth, asyncHandler(async (req, res) => {
  const rows = await many(
    `SELECT em.*, cm.text, c.display_name as sender_name, c.avatar_emoji
     FROM exchange_messages em
     JOIN canned_messages cm ON em.canned_message_id = cm.id
     JOIN children c ON em.sender_child_id = c.id
     WHERE em.exchange_id = $1
     ORDER BY em.created_at ASC`,
    [req.params.id]
  );
  res.json(rows);
}));

module.exports = router;
