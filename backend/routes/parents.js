const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { one, many, query } = require('../db/db');
const { signParentToken, requireParentAuth } = require('../services/auth');
const { isConfiguredAdminEmail } = require('../services/adminEmails');
const { fallbackGeocode } = require('../services/geo');
const asyncHandler = require('../services/asyncHandler');
const {
  POLICY_VERSION,
  AGE_BANDS,
  publicChild,
  recordConsent,
  deleteFamilyAccount
} = require('../services/privacy');
const { isAccepted, legalMeta, AGREEMENTS_TEXT } = require('../services/legal');

const ACCOUNT_CONSENT_TEXT = {
  pl: `Jestem rodzicem lub opiekunem prawnym i wyrażam zgodę na przetwarzanie danych rodziny w ToySwap zgodnie z polityką prywatności ${POLICY_VERSION}.`,
  en: `I am a parent or legal guardian and I consent to ToySwap processing my family data under privacy policy ${POLICY_VERSION}.`
};

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
router.get('/privacy-meta', (req, res) => {
  res.json({
    ...legalMeta(),
    age_bands: AGE_BANDS,
    child_fields: ['display_name', 'age_band', 'avatar_emoji']
  });
});

router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, address_text } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email and password are required' });
  }
  if (!isAccepted(req.body.agreements_accepted) && !isAccepted(req.body.privacy_consent)) {
    return res.status(400).json({ error: 'You must accept the required agreements to create a family account' });
  }
  const existing = await one('SELECT id FROM parents WHERE email = $1', [email]);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  // Never accept browser GPS. Store only a coarse point from neighbourhood text.
  const point = fallbackGeocode(address_text || '');
  const id = uuidv4();
  const password_hash = bcrypt.hashSync(password, 10);

  const role = isConfiguredAdminEmail(email) ? 'admin' : 'parent';
  await query(
    `INSERT INTO parents (id, name, email, password_hash, role, address_text, lat, lng)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, name, email, password_hash, role, address_text || null, point.lat, point.lng]
  );

  const locale = req.body.locale === 'en' ? 'en' : 'pl';
  await recordConsent({
    parentId: id,
    email,
    kind: 'required_agreements',
    locale,
    confirmationText: AGREEMENTS_TEXT[locale]
  });
  await recordConsent({
    parentId: id,
    email,
    kind: 'family_account',
    locale,
    confirmationText: ACCOUNT_CONSENT_TEXT[locale]
  });

  const token = signParentToken({ id, email });
  res.status(201).json({
    token,
    parent: publicParent({ id, name, email, role }),
    legal_pack_version: POLICY_VERSION
  });
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
  const children = await many(
    'SELECT id, display_name, age_band, avatar_emoji, created_at FROM children WHERE parent_id = $1',
    [req.parentId]
  );
  res.json({ parent, children: children.map(publicChild) });
}));

router.get('/me/consents', requireParentAuth, asyncHandler(async (req, res) => {
  const rows = await many(
    `SELECT id, kind, policy_version, locale, confirmation_text, confirmed_at
     FROM guardian_consents WHERE parent_id = $1
     ORDER BY confirmed_at DESC`,
    [req.parentId]
  );
  res.json({ policy_version: POLICY_VERSION, consents: rows });
}));

router.delete('/me', requireParentAuth, asyncHandler(async (req, res) => {
  try {
    await deleteFamilyAccount(req.parentId);
  } catch (err) {
    if (err.status === 409) {
      return res.status(409).json({
        error: 'A child profile has an active exchange. Decline or finish it before deleting the family account.'
      });
    }
    throw err;
  }
  res.json({ ok: true });
}));

module.exports = router;
