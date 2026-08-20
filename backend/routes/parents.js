const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/db');
const { signParentToken, requireParentAuth } = require('../services/auth');
const { fallbackGeocode } = require('../services/geo');

const router = express.Router();

// Register a new parent account. Children are created afterwards under this
// account - a child can never self-register without a parent account existing
// first, by design (parental consent by construction).
router.post('/register', (req, res) => {
  const { name, email, password, address_text, lat, lng } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }
  const existing = db.prepare('SELECT id FROM parents WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const point = (lat && lng) ? { lat, lng } : fallbackGeocode(address_text || email);
  const id = uuidv4();
  const password_hash = bcrypt.hashSync(password, 10);

  db.prepare(`
    INSERT INTO parents (id, name, email, password_hash, address_text, lat, lng)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, email, password_hash, address_text || null, point.lat, point.lng);

  const parent = { id, email };
  const token = signParentToken(parent);
  res.status(201).json({ token, parent: { id, name, email } });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const parent = db.prepare('SELECT * FROM parents WHERE email = ?').get(email);
  if (!parent || !bcrypt.compareSync(password, parent.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = signParentToken(parent);
  res.json({ token, parent: { id: parent.id, name: parent.name, email: parent.email } });
});

router.get('/me', requireParentAuth, (req, res) => {
  const parent = db.prepare('SELECT id, name, email, address_text, lat, lng FROM parents WHERE id = ?').get(req.parentId);
  const children = db.prepare('SELECT * FROM children WHERE parent_id = ?').all(req.parentId);
  res.json({ parent, children });
});

module.exports = router;
