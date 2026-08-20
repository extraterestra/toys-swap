const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { one, many, query } = require('../db/db');
const { requireParentAuth } = require('../services/auth');
const asyncHandler = require('../services/asyncHandler');

const router = express.Router();

// Create a child profile under the authenticated parent's account.
router.post('/', requireParentAuth, asyncHandler(async (req, res) => {
  const { display_name, birth_year, avatar_emoji } = req.body;
  if (!display_name) return res.status(400).json({ error: 'display_name is required' });

  const id = uuidv4();
  const child = await one(
    `INSERT INTO children (id, parent_id, display_name, birth_year, avatar_emoji)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [id, req.parentId, display_name, birth_year || null, avatar_emoji || '🧒']
  );

  res.status(201).json(child);
}));

router.get('/', requireParentAuth, asyncHandler(async (req, res) => {
  const children = await many('SELECT * FROM children WHERE parent_id = $1', [req.parentId]);
  res.json(children);
}));

// Ensures a given child belongs to the authenticated parent - used by other
// routes to enforce that a child can only act via their own verified parent.
async function assertChildOwnership(childId, parentId) {
  return one('SELECT * FROM children WHERE id = $1 AND parent_id = $2', [childId, parentId]);
}

module.exports = router;
module.exports.assertChildOwnership = assertChildOwnership;
