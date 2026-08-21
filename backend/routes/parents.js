const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { one, many, query } = require('../db/db');
const { signParentToken, requireParentAuth } = require('../services/auth');
const { isConfiguredAdminEmail } = require('../services/adminEmails');
const { fallbackGeocode } = require('../services/geo');
const asyncHandler = require('../services/asyncHandler');

const router = express.Router();

function publicParent(parent) {
  return {
    id: parent.id,
    name: parent.name,
    email: parent.email,
    role: parent.role === 'admin' ? 'admin' : 'parent'
  };
}

async function grantConfiguredAdmin(parent) {
  if (parent.role === 'admin' || !isConfiguredAdminEmail(parent.email)) return parent;
  await query(`UPDATE parents SET role = 'admin' WHERE id = $1`, [parent.id]);
  return { ...parent, role: 'admin' };
}

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

  const role = isConfiguredAdminEmail(email) ? 'admin' : 'parent';
  await query(
    `INSERT INTO parents (id, name, email, password_hash, role, address_text, lat, lng)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, name, email, password_hash, role, address_text || null, point.lat, point.lng]
  );

  const token = signParentToken({ id, email });
  res.status(201).json({ token, parent: publicParent({ id, name, email, role }) });
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const found = await one('SELECT * FROM parents WHERE email = $1', [email]);
  if (!found || !bcrypt.compareSync(password, found.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const parent = await grantConfiguredAdmin(found);
  const token = signParentToken(parent);
  res.json({ token, parent: publicParent(parent) });
}));

router.get('/me', requireParentAuth, asyncHandler(async (req, res) => {
  const found = await one(
    'SELECT id, name, email, role, address_text, lat, lng FROM parents WHERE id = $1',
    [req.parentId]
  );
  if (!found) {
    return res.status(401).json({ error: 'Account not found. Please log in again.' });
  }
  const parent = publicParent(await grantConfiguredAdmin(found));
  const children = await many('SELECT * FROM children WHERE parent_id = $1', [req.parentId]);
  res.json({ parent, children });
}));

module.exports = router;
