const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { pool, one, many, query } = require('../db/db');

const { LEGAL_PACK_VERSION } = require('./legal');

const POLICY_VERSION = LEGAL_PACK_VERSION;
const AGE_BANDS = ['0-2', '3-5', '6-8', '9-12', '13-17'];
const NICKNAME_MAX = 40;

const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads');

function hashEmail(email) {
  return crypto.createHash('sha256').update(String(email || '').trim().toLowerCase()).digest('hex');
}

function unlinkPhotoFile(photoPath) {
  if (!photoPath) return;
  const filePath = path.join(uploadsDir, path.basename(photoPath));
  fs.unlink(filePath, () => {});
}

function publicChild(child) {
  if (!child) return null;
  return {
    id: child.id,
    display_name: child.display_name,
    age_band: child.age_band || null,
    avatar_emoji: child.avatar_emoji,
    created_at: child.created_at
  };
}

function publicNearbyListing(item) {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    photo_path: item.photo_path,
    ai_condition_score: item.ai_condition_score,
    ai_condition_label: item.ai_condition_label,
    ai_description: item.ai_description,
    owner_name: item.owner_name,
    owner_avatar: item.owner_avatar,
    distance_km: item.distance_km
  };
}

function normalizeNickname(raw) {
  const name = String(raw || '').trim();
  if (!name) return { error: 'A nickname is required' };
  if (name.length > NICKNAME_MAX) return { error: 'Nickname is too long (max 40 characters)' };
  if (name.includes('@')) {
    return { error: 'Use a first name or nickname only — not an email or ID' };
  }
  return { name };
}

function normalizeAgeBand(raw) {
  const band = String(raw || '').trim();
  if (!AGE_BANDS.includes(band)) return { error: 'Choose an age range' };
  return { band };
}

function normalizeLocale(raw) {
  return raw === 'en' ? 'en' : 'pl';
}

async function recordConsent({
  parentId,
  childId = null,
  email,
  kind,
  locale,
  confirmationText
}) {
  const id = uuidv4();
  await query(
    `INSERT INTO guardian_consents (
      id, parent_id, child_id, parent_email_hash, kind,
      policy_version, locale, confirmation_text
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      id,
      parentId,
      childId,
      hashEmail(email),
      kind,
      POLICY_VERSION,
      normalizeLocale(locale),
      confirmationText
    ]
  );
  return id;
}

async function collectPhotoPathsForChild(childId) {
  const items = await many('SELECT id, photo_path FROM items WHERE child_id = $1', [childId]);
  const paths = [];
  for (const item of items) {
    if (item.photo_path) paths.push(item.photo_path);
    const photos = await many('SELECT photo_path FROM item_photos WHERE item_id = $1', [item.id]);
    for (const photo of photos) paths.push(photo.photo_path);
  }
  return paths;
}

async function exchangeIdsForChild(childId) {
  const rows = await many(
    `SELECT DISTINCT id FROM exchange_requests
     WHERE from_child_id = $1 OR to_child_id = $1
        OR offered_item_id IN (SELECT id FROM items WHERE child_id = $1)
        OR requested_item_id IN (SELECT id FROM items WHERE child_id = $1)`,
    [childId]
  );
  return rows.map((r) => r.id);
}

async function activeExchangeForChild(childId) {
  return one(
    `SELECT id FROM exchange_requests
     WHERE (from_child_id = $1 OR to_child_id = $1
        OR offered_item_id IN (SELECT id FROM items WHERE child_id = $1)
        OR requested_item_id IN (SELECT id FROM items WHERE child_id = $1))
       AND status NOT IN ('declined')
     LIMIT 1`,
    [childId]
  );
}

async function deleteChildData(childId) {
  const active = await activeExchangeForChild(childId);
  if (active) {
    const err = new Error('This child has an active exchange. Decline or finish it first.');
    err.status = 409;
    throw err;
  }

  const photoPaths = await collectPhotoPathsForChild(childId);
  const exchangeIds = await exchangeIdsForChild(childId);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const exId of exchangeIds) {
      await client.query('DELETE FROM exchange_messages WHERE exchange_id = $1', [exId]);
      await client.query('DELETE FROM deliveries WHERE exchange_id = $1', [exId]);
      await client.query('DELETE FROM exchange_requests WHERE id = $1', [exId]);
    }
    await client.query('DELETE FROM items WHERE child_id = $1', [childId]);
    await client.query('UPDATE guardian_consents SET child_id = NULL WHERE child_id = $1', [childId]);
    await client.query('DELETE FROM children WHERE id = $1', [childId]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
  for (const photoPath of photoPaths) unlinkPhotoFile(photoPath);
}

async function deleteFamilyAccount(parentId) {
  const children = await many('SELECT id FROM children WHERE parent_id = $1', [parentId]);
  for (const child of children) {
    await deleteChildData(child.id);
  }
  await query('UPDATE guardian_consents SET parent_id = NULL WHERE parent_id = $1', [parentId]);
  await query('DELETE FROM parents WHERE id = $1', [parentId]);
}

module.exports = {
  POLICY_VERSION,
  AGE_BANDS,
  publicChild,
  publicNearbyListing,
  normalizeNickname,
  normalizeAgeBand,
  recordConsent,
  deleteChildData,
  deleteFamilyAccount,
  unlinkPhotoFile
};
