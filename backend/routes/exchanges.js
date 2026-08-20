const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/db');
const { requireParentAuth } = require('../services/auth');
const { assertChildOwnership } = require('./children');
const { requestDelivery } = require('../services/delivery');

const router = express.Router();

// A child (via their parent) proposes to exchange their item for another child's item.
router.post('/', requireParentAuth, (req, res) => {
  const { offered_item_id, requested_item_id, from_child_id, duration_type, duration_days } = req.body;
  if (!offered_item_id || !requested_item_id || !from_child_id) {
    return res.status(400).json({ error: 'offered_item_id, requested_item_id, from_child_id are required' });
  }
  const child = assertChildOwnership(from_child_id, req.parentId);
  if (!child) return res.status(403).json({ error: 'This child does not belong to your account' });

  const requestedItem = db.prepare('SELECT * FROM items WHERE id = ?').get(requested_item_id);
  const offeredItem = db.prepare('SELECT * FROM items WHERE id = ?').get(offered_item_id);
  if (!requestedItem || !offeredItem) return res.status(404).json({ error: 'Item not found' });

  const id = uuidv4();
  db.prepare(`
    INSERT INTO exchange_requests (
      id, offered_item_id, requested_item_id, from_child_id, to_child_id,
      duration_type, duration_days
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, offered_item_id, requested_item_id, from_child_id, requestedItem.child_id,
    duration_type || 'forever', duration_days || null);

  db.prepare(`UPDATE items SET status = 'pending_exchange' WHERE id IN (?, ?)`).run(offered_item_id, requested_item_id);

  res.status(201).json(db.prepare('SELECT * FROM exchange_requests WHERE id = ?').get(id));
});

// List exchange requests involving any of the authenticated parent's children.
router.get('/', requireParentAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT er.*, 
      oi.title as offered_title, oi.photo_path as offered_photo,
      ri.title as requested_title, ri.photo_path as requested_photo,
      fc.display_name as from_child_name, tc.display_name as to_child_name
    FROM exchange_requests er
    JOIN items oi ON er.offered_item_id = oi.id
    JOIN items ri ON er.requested_item_id = ri.id
    JOIN children fc ON er.from_child_id = fc.id
    JOIN children tc ON er.to_child_id = tc.id
    WHERE er.from_child_id IN (SELECT id FROM children WHERE parent_id = ?)
       OR er.to_child_id IN (SELECT id FROM children WHERE parent_id = ?)
    ORDER BY er.created_at DESC
  `).all(req.parentId, req.parentId);
  res.json(rows);
});

// Parent approves an exchange on behalf of their child (whichever side they represent).
router.post('/:id/approve', requireParentAuth, async (req, res) => {
  const exchange = db.prepare('SELECT * FROM exchange_requests WHERE id = ?').get(req.params.id);
  if (!exchange) return res.status(404).json({ error: 'Exchange not found' });

  const fromChild = db.prepare('SELECT * FROM children WHERE id = ?').get(exchange.from_child_id);
  const toChild = db.prepare('SELECT * FROM children WHERE id = ?').get(exchange.to_child_id);

  let updated = false;
  if (fromChild.parent_id === req.parentId) {
    db.prepare(`UPDATE exchange_requests SET from_parent_approved = 1 WHERE id = ?`).run(exchange.id);
    updated = true;
  }
  if (toChild.parent_id === req.parentId) {
    db.prepare(`UPDATE exchange_requests SET to_parent_approved = 1 WHERE id = ?`).run(exchange.id);
    updated = true;
  }
  if (!updated) return res.status(403).json({ error: 'You are not a party to this exchange' });

  const refreshed = db.prepare('SELECT * FROM exchange_requests WHERE id = ?').get(exchange.id);

  if (refreshed.from_parent_approved && refreshed.to_parent_approved && refreshed.status === 'pending_parent_approval') {
    db.prepare(`UPDATE exchange_requests SET status = 'approved' WHERE id = ?`).run(exchange.id);

    // Trigger delivery request now that both parents approved.
    const fromParent = db.prepare('SELECT * FROM parents WHERE id = ?').get(fromChild.parent_id);
    const toParent = db.prepare('SELECT * FROM parents WHERE id = ?').get(toChild.parent_id);
    const offeredItem = db.prepare('SELECT * FROM items WHERE id = ?').get(exchange.offered_item_id);
    const requestedItem = db.prepare('SELECT * FROM items WHERE id = ?').get(exchange.requested_item_id);

    const deliveryResult = await requestDelivery({
      exchangeId: exchange.id,
      pickupAddress: fromParent.address_text,
      dropoffAddress: toParent.address_text,
      itemsSummary: `${offeredItem.title} <-> ${requestedItem.title}`
    });

    const deliveryId = uuidv4();
    db.prepare(`
      INSERT INTO deliveries (id, exchange_id, status, raw_response)
      VALUES (?, ?, ?, ?)
    `).run(deliveryId, exchange.id, deliveryResult.ok ? 'requested' : 'failed', deliveryResult.raw);

    db.prepare(`UPDATE exchange_requests SET status = 'delivery_requested' WHERE id = ?`).run(exchange.id);
  }

  res.json(db.prepare('SELECT * FROM exchange_requests WHERE id = ?').get(exchange.id));
});

router.post('/:id/decline', requireParentAuth, (req, res) => {
  const exchange = db.prepare('SELECT * FROM exchange_requests WHERE id = ?').get(req.params.id);
  if (!exchange) return res.status(404).json({ error: 'Exchange not found' });
  db.prepare(`UPDATE exchange_requests SET status = 'declined' WHERE id = ?`).run(exchange.id);
  db.prepare(`UPDATE items SET status = 'available' WHERE id IN (?, ?)`).run(exchange.offered_item_id, exchange.requested_item_id);
  res.json({ ok: true });
});

// --- Canned messaging (no freeform text between children, by design) ---

router.get('/canned-messages', requireParentAuth, (req, res) => {
  res.json(db.prepare('SELECT * FROM canned_messages').all());
});

router.post('/:id/messages', requireParentAuth, (req, res) => {
  const { sender_child_id, canned_message_id } = req.body;
  const child = assertChildOwnership(sender_child_id, req.parentId);
  if (!child) return res.status(403).json({ error: 'This child does not belong to your account' });

  const id = uuidv4();
  db.prepare(`
    INSERT INTO exchange_messages (id, exchange_id, sender_child_id, canned_message_id)
    VALUES (?, ?, ?, ?)
  `).run(id, req.params.id, sender_child_id, canned_message_id);

  res.status(201).json({ ok: true });
});

router.get('/:id/messages', requireParentAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT em.*, cm.text, c.display_name as sender_name, c.avatar_emoji
    FROM exchange_messages em
    JOIN canned_messages cm ON em.canned_message_id = cm.id
    JOIN children c ON em.sender_child_id = c.id
    WHERE em.exchange_id = ?
    ORDER BY em.created_at ASC
  `).all(req.params.id);
  res.json(rows);
});

module.exports = router;
