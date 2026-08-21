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

module.exports = router;
