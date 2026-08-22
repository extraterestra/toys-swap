const express = require('express');
const { one, many, query } = require('../db/db');
const asyncHandler = require('../services/asyncHandler');

const router = express.Router();

router.get('/settings', asyncHandler(async (req, res) => {
  const rows = await many('SELECT * FROM admin_settings');
  const settings = {};
  rows.forEach(r => settings[r.key] = r.value);
  res.json(settings);
}));

router.post('/settings/exchange-radius', asyncHandler(async (req, res) => {
  const { radius_km } = req.body;
  const val = parseFloat(radius_km);
  if (isNaN(val) || val <= 0 || val > 500) {
    return res.status(400).json({ error: 'radius_km must be a positive number (max 500)' });
  }
  await query(
    `INSERT INTO admin_settings (key, value) VALUES ('exchange_radius_km', $1)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [String(val)]
  );
  res.json({ exchange_radius_km: val });
}));

router.get('/stats', asyncHandler(async (req, res) => {
  const parents = (await one('SELECT COUNT(*)::int AS c FROM parents')).c;
  const children = (await one('SELECT COUNT(*)::int AS c FROM children')).c;
  const items = (await one('SELECT COUNT(*)::int AS c FROM items')).c;
  const exchanges = (await one('SELECT COUNT(*)::int AS c FROM exchange_requests')).c;
  const completedExchanges = (await one(
    `SELECT COUNT(*)::int AS c FROM exchange_requests WHERE status = 'delivery_requested'`
  )).c;
  res.json({ parents, children, items, exchanges, completedExchanges });
}));

router.get('/families', asyncHandler(async (req, res) => {
  const families = await many(
    `SELECT p.id, p.name, p.email, p.role, p.address_text, p.created_at,
       (SELECT COUNT(*)::int FROM children c WHERE c.parent_id = p.id) AS children_count,
       (SELECT COUNT(*)::int FROM items i
         JOIN children c ON i.child_id = c.id WHERE c.parent_id = p.id) AS listings_count,
       (SELECT COUNT(*)::int FROM exchange_requests er
         WHERE er.from_child_id IN (SELECT id FROM children WHERE parent_id = p.id)
            OR er.to_child_id IN (SELECT id FROM children WHERE parent_id = p.id)) AS exchanges_count
     FROM parents p
     ORDER BY p.created_at DESC`
  );
  res.json(families);
}));

router.get('/families/:id', asyncHandler(async (req, res) => {
  const parent = await one(
    `SELECT id, name, email, role, address_text, created_at
     FROM parents WHERE id = $1`,
    [req.params.id]
  );
  if (!parent) return res.status(404).json({ error: 'Family not found' });

  const children = await many(
    `SELECT id, display_name, age_band, avatar_emoji, created_at
     FROM children WHERE parent_id = $1 ORDER BY created_at ASC`,
    [parent.id]
  );
  const childIds = children.map((c) => c.id);
  const items = childIds.length
    ? await many(
      `SELECT id, child_id, category, title, description, photo_path,
              ai_condition_score, ai_condition_label, ai_description,
              status, created_at
       FROM items WHERE child_id = ANY($1::text[])
       ORDER BY created_at DESC`,
      [childIds]
    )
    : [];
  const exchanges = childIds.length
    ? await many(
      `SELECT er.id, er.status, er.duration_type, er.created_at,
              er.from_child_id, er.to_child_id,
              oi.title as offered_title, ri.title as requested_title,
              fc.display_name as from_child_name, tc.display_name as to_child_name
       FROM exchange_requests er
       JOIN items oi ON er.offered_item_id = oi.id
       JOIN items ri ON er.requested_item_id = ri.id
       JOIN children fc ON er.from_child_id = fc.id
       JOIN children tc ON er.to_child_id = tc.id
       WHERE er.from_child_id = ANY($1::text[]) OR er.to_child_id = ANY($1::text[])
       ORDER BY er.created_at DESC`,
      [childIds]
    )
    : [];

  res.json({
    parent,
    children: children.map((child) => ({
      ...child,
      listings: items.filter((item) => item.child_id === child.id),
      exchanges: exchanges.filter(
        (ex) => ex.from_child_id === child.id || ex.to_child_id === child.id
      )
    }))
  });
}));

router.get('/reports', asyncHandler(async (req, res) => {
  const rows = await many(
    `SELECT r.id, r.subject_type, r.subject_id, r.reason, r.details, r.status, r.created_at,
            rp.email AS reporter_email, tp.email AS reported_email
     FROM safety_reports r
     LEFT JOIN parents rp ON r.reporter_parent_id = rp.id
     LEFT JOIN parents tp ON r.reported_parent_id = tp.id
     ORDER BY r.created_at DESC
     LIMIT 100`
  );
  res.json(rows);
}));

router.post('/reports/:id', asyncHandler(async (req, res) => {
  const report = await one('SELECT * FROM safety_reports WHERE id = $1', [req.params.id]);
  if (!report) return res.status(404).json({ error: 'Report not found' });

  const status = req.body.status === 'dismissed' ? 'dismissed' : 'resolved';
  await query('UPDATE safety_reports SET status = $1 WHERE id = $2', [status, report.id]);

  if (req.body.remove_listing && (report.subject_type === 'listing' || report.subject_type === 'family')) {
    await query(
      `UPDATE items SET status = 'removed', moderation_status = 'rejected' WHERE id = $1`,
      [report.subject_id]
    );
  }

  const updated = await one('SELECT * FROM safety_reports WHERE id = $1', [report.id]);
  res.json(updated);
}));

module.exports = router;
