const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { one, many, query } = require('../db/db');
const { requireParentAuth } = require('../services/auth');
const asyncHandler = require('../services/asyncHandler');
const { REPORT_REASONS, SUBJECT_TYPES } = require('../services/legal');

const router = express.Router();

async function otherParentFromListing(listingId, reporterId) {
  const row = await one(
    `SELECT children.parent_id AS parent_id
     FROM items JOIN children ON items.child_id = children.id
     WHERE items.id = $1`,
    [listingId]
  );
  if (!row || row.parent_id === reporterId) return null;
  return row.parent_id;
}

async function otherParentFromExchange(exchangeId, reporterId) {
  const row = await one(
    `SELECT fc.parent_id AS from_parent, tc.parent_id AS to_parent
     FROM exchange_requests er
     JOIN children fc ON er.from_child_id = fc.id
     JOIN children tc ON er.to_child_id = tc.id
     WHERE er.id = $1`,
    [exchangeId]
  );
  if (!row) return null;
  if (row.from_parent === reporterId) return row.to_parent;
  if (row.to_parent === reporterId) return row.from_parent;
  return null;
}

async function resolveReportedParent(subjectType, subjectId, reporterId) {
  if (subjectType === 'listing' || subjectType === 'family') {
    return otherParentFromListing(subjectId, reporterId);
  }
  if (subjectType === 'exchange') {
    return otherParentFromExchange(subjectId, reporterId);
  }
  if (subjectType === 'message') {
    const msg = await one('SELECT exchange_id FROM exchange_messages WHERE id = $1', [subjectId]);
    if (!msg) return otherParentFromExchange(subjectId, reporterId);
    return otherParentFromExchange(msg.exchange_id, reporterId);
  }
  return null;
}

router.post('/reports', requireParentAuth, asyncHandler(async (req, res) => {
  const subjectType = String(req.body.subject_type || '');
  const subjectId = String(req.body.subject_id || '').trim();
  const reason = String(req.body.reason || '');
  const details = String(req.body.details || '').trim().slice(0, 1000);

  if (!SUBJECT_TYPES.includes(subjectType) || !subjectId) {
    return res.status(400).json({ error: 'A report needs a subject' });
  }
  if (!REPORT_REASONS.includes(reason)) {
    return res.status(400).json({ error: 'Choose a report reason' });
  }

  const reportedParentId = await resolveReportedParent(subjectType, subjectId, req.parentId);
  if (!reportedParentId) {
    return res.status(400).json({ error: 'You can only report another family' });
  }

  const report = await one(
    `INSERT INTO safety_reports (
      id, reporter_parent_id, subject_type, subject_id, reported_parent_id, reason, details
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, subject_type, reason, status, created_at`,
    [uuidv4(), req.parentId, subjectType, subjectId, reportedParentId, reason, details || null]
  );
  res.status(201).json({ ok: true, report });
}));

router.post('/blocks', requireParentAuth, asyncHandler(async (req, res) => {
  const subjectType = String(req.body.subject_type || 'listing');
  const subjectId = String(req.body.subject_id || '').trim();
  if (!subjectId) return res.status(400).json({ error: 'A report needs a subject' });

  const blockedId = await resolveReportedParent(subjectType, subjectId, req.parentId);
  if (!blockedId) {
    return res.status(400).json({ error: 'You can only block another family' });
  }

  await query(
    `INSERT INTO parent_blocks (blocker_id, blocked_id) VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [req.parentId, blockedId]
  );
  res.json({ ok: true });
}));

module.exports = router;
