const express = require('express');
const db = require('../db/db');

const router = express.Router();

// NOTE: MVP-only simplification - there is no separate admin role/auth yet.
// Before production, gate this behind a real admin account + auth, not just
// "anyone with the URL".

router.get('/settings', (req, res) => {
  const rows = db.prepare('SELECT * FROM admin_settings').all();
  const settings = {};
  rows.forEach(r => settings[r.key] = r.value);
  res.json(settings);
});

router.post('/settings/exchange-radius', (req, res) => {
  const { radius_km } = req.body;
  const val = parseFloat(radius_km);
  if (isNaN(val) || val <= 0 || val > 500) {
    return res.status(400).json({ error: 'radius_km must be a positive number (max 500)' });
  }
  db.prepare(`
    INSERT INTO admin_settings (key, value) VALUES ('exchange_radius_km', ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(String(val));
  res.json({ exchange_radius_km: val });
});

router.get('/stats', (req, res) => {
  const parents = db.prepare('SELECT COUNT(*) c FROM parents').get().c;
  const children = db.prepare('SELECT COUNT(*) c FROM children').get().c;
  const items = db.prepare('SELECT COUNT(*) c FROM items').get().c;
  const exchanges = db.prepare('SELECT COUNT(*) c FROM exchange_requests').get().c;
  const completedExchanges = db.prepare(`SELECT COUNT(*) c FROM exchange_requests WHERE status = 'delivery_requested'`).get().c;
  res.json({ parents, children, items, exchanges, completedExchanges });
});

module.exports = router;
