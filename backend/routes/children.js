const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { one, many } = require('../db/db');
const { requireParentAuth } = require('../services/auth');
const asyncHandler = require('../services/asyncHandler');
const {
  POLICY_VERSION,
  publicChild,
  normalizeNickname,
  normalizeAgeBand,
  recordConsent,
  deleteChildData
} = require('../services/privacy');

const router = express.Router();

const CHILD_CONSENT_TEXT = {
  pl: `Potwierdzam, że jestem rodzicem lub opiekunem prawnym tego dziecka i wyrażam zgodę na utworzenie profilu dziecka w ToySwap zgodnie z polityką prywatności ${POLICY_VERSION}. Nie podaję nazwiska, szkoły, adresu ani dokładnej daty urodzenia dziecka.`,
  en: `I confirm I am the parent or legal guardian of this child and I consent to creating a ToySwap child profile under privacy policy ${POLICY_VERSION}. I will not submit the child’s surname, school, address, or exact date of birth.`
};

// Create a child profile under the authenticated parent's account.
router.post('/', requireParentAuth, asyncHandler(async (req, res) => {
  if (req.body.guardian_confirmed !== true && req.body.guardian_confirmed !== 'true') {
    return res.status(400).json({ error: 'Guardian confirmation is required before creating a child profile' });
  }

  const nick = normalizeNickname(req.body.display_name);
  if (nick.error) return res.status(400).json({ error: nick.error });
  const age = normalizeAgeBand(req.body.age_band);
  if (age.error) return res.status(400).json({ error: age.error });

  const parent = await one('SELECT id, email FROM parents WHERE id = $1', [req.parentId]);
  if (!parent) return res.status(401).json({ error: 'Account not found. Please log in again.' });

  const locale = req.body.locale === 'en' ? 'en' : 'pl';
  const id = uuidv4();
  const child = await one(
    `INSERT INTO children (id, parent_id, display_name, age_band, avatar_emoji, birth_year)
     VALUES ($1, $2, $3, $4, $5, NULL)
     RETURNING *`,
    [id, req.parentId, nick.name, age.band, req.body.avatar_emoji || '🧒']
  );

  await recordConsent({
    parentId: parent.id,
    childId: child.id,
    email: parent.email,
    kind: 'child_profile',
    locale,
    confirmationText: CHILD_CONSENT_TEXT[locale]
  });

  res.status(201).json(publicChild(child));
}));

router.get('/', requireParentAuth, asyncHandler(async (req, res) => {
  const children = await many(
    'SELECT id, display_name, age_band, avatar_emoji, created_at FROM children WHERE parent_id = $1',
    [req.parentId]
  );
  res.json(children.map(publicChild));
}));

router.delete('/:id', requireParentAuth, asyncHandler(async (req, res) => {
  const child = await one(
    'SELECT id FROM children WHERE id = $1 AND parent_id = $2',
    [req.params.id, req.parentId]
  );
  if (!child) return res.status(404).json({ error: 'Child profile not found' });

  try {
    await deleteChildData(child.id);
  } catch (err) {
    if (err.status === 409) return res.status(409).json({ error: err.message });
    throw err;
  }
  res.json({ ok: true });
}));

// Ensures a given child belongs to the authenticated parent - used by other
// routes to enforce that a child can only act via their own verified parent.
async function assertChildOwnership(childId, parentId) {
  return one('SELECT * FROM children WHERE id = $1 AND parent_id = $2', [childId, parentId]);
}

module.exports = router;
module.exports.assertChildOwnership = assertChildOwnership;
