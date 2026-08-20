const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/db');
const { requireParentAuth } = require('../services/auth');

const router = express.Router();

// Create a child profile under the authenticated parent's account.
router.post('/', requireParentAuth, (req, res) => {
  const { display_name, birth_year, avatar_emoji } = req.body;
  if (!display_name) return res.status(400).json({ error: 'display_name is required' });

  const id = uuidv4();
  db.prepare(`
    INSERT INTO children (id, parent_id, display_name, birth_year, avatar_emoji)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, req.parentId, display_name, birth_year || null, avatar_emoji || '🧒');

  res.status(201).json(db.prepare('SELECT * FROM children WHERE id = ?').get(id));
});

router.get('/', requireParentAuth, (req, res) => {
  const children = db.prepare('SELECT * FROM children WHERE parent_id = ?').all(req.parentId);
  res.json(children);
});

// Ensures a given child belongs to the authenticated parent - used by other
// routes to enforce that a child can only act via their own verified parent.
function assertChildOwnership(childId, parentId) {
  const child = db.prepare('SELECT * FROM children WHERE id = ? AND parent_id = ?').get(childId, parentId);
  return child || null;
}

module.exports = router;
module.exports.assertChildOwnership = assertChildOwnership;
