const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { one, many, query } = require('../db/db');
const { signParentToken, requireParentAuth } = require('../services/auth');
const { fallbackGeocode } = require('../services/geo');
const asyncHandler = require('../services/asyncHandler');

const router = express.Router();

// Register a new parent account. Children are created afterwards under this
// account - a child can never self-register without a parent account existing
// first, by design (parental consent by construction).
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, address_text, lat, lng } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }
  const existing = await one('SELECT id FROM parents WHERE email = $1', [email]);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const point = (lat && lng) ? { lat, lng } : fallbackGeocode(address_text || email);
  const id = uuidv4();
  const password_hash = bcrypt.hashSync(password, 10);

  await query(
    `INSERT INTO parents (id, name, email, password_hash, address_text, lat, lng)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [id, name, email, password_hash, address_text || null, point.lat, point.lng]
  );

  const token = signParentToken({ id, email });
  res.status(201).json({ token, parent: { id, name, email } });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const parent = await one('SELECT * FROM parents WHERE email = $1', [email]);
  if (!parent || !bcrypt.compareSync(password, parent.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const token = signParentToken(parent);
  res.json({ token, parent: { id: parent.id, name: parent.name, email: parent.email } });
}));

router.get('/me', requireParentAuth, asyncHandler(async (req, res) => {
  const parent = await one(
    'SELECT id, name, email, address_text, lat, lng FROM parents WHERE id = $1',
    [req.parentId]
  );
  if (!parent) {
    return res.status(401).json({ error: 'Account not found. Please log in again.' });
  }
  const children = await many('SELECT * FROM children WHERE parent_id = $1', [req.parentId]);
  res.json({ parent, children });
}));

module.exports = router;
