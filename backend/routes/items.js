const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { one, many, query } = require('../db/db');
const { requireParentAuth } = require('../services/auth');
const { assertChildOwnership } = require('./children');
const { evaluateItemPhoto } = require('../services/aiEvaluation');
const { distanceKm } = require('../services/geo');
const asyncHandler = require('../services/asyncHandler');

const router = express.Router();

const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      cb(null, `${uuidv4()}${ext}`);
    }
  }),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image uploads are allowed'));
    cb(null, true);
  }
});

async function getRadiusKm() {
  const row = await one(`SELECT value FROM admin_settings WHERE key = 'exchange_radius_km'`);
  return row ? parseFloat(row.value) : 10;
}

// Create an item: upload a photo, run AI condition evaluation, store the result.
router.post('/', requireParentAuth, upload.single('photo'), asyncHandler(async (req, res) => {
  const { child_id, category, title, description } = req.body;
  if (!child_id || !title) return res.status(400).json({ error: 'child_id and title are required' });

  const child = await assertChildOwnership(child_id, req.parentId);
  if (!child) return res.status(403).json({ error: 'This child does not belong to your account' });

  const parent = await one('SELECT lat, lng FROM parents WHERE id = $1', [req.parentId]);

  let aiResult = { score: null, label: null, description: null, exchangeable: true };
  let photoPath = null;

  if (req.file) {
    photoPath = `/uploads/${req.file.filename}`;
    aiResult = await evaluateItemPhoto({
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      category: category || 'toy',
      title
    });
  }

  const item = await one(
    `INSERT INTO items (
      id, child_id, category, title, description, photo_path,
      ai_condition_score, ai_condition_label, ai_description, ai_exchangeable,
      moderation_status, lat, lng
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *`,
    [
      uuidv4(), child_id, category || 'toy', title, description || null, photoPath,
      aiResult.score, aiResult.label, aiResult.description, aiResult.exchangeable ? 1 : 0,
      'pending',
      parent.lat, parent.lng
    ]
  );

  if (photoPath) {
    await query(
      `INSERT INTO item_photos (id, item_id, photo_path) VALUES ($1, $2, $3)`,
      [uuidv4(), item.id, photoPath]
    );
  }

  res.status(201).json(item);
}));

router.get('/mine', requireParentAuth, asyncHandler(async (req, res) => {
  const items = await many(
    `SELECT items.*, children.display_name as owner_name
     FROM items JOIN children ON items.child_id = children.id
     WHERE children.parent_id = $1
     ORDER BY items.created_at DESC`,
    [req.parentId]
  );
  res.json(items);
}));

// Browse items available for exchange within the configurable radius of the
// requesting child's parent location.
router.get('/nearby', requireParentAuth, asyncHandler(async (req, res) => {
  const { child_id, category } = req.query;
  const child = await assertChildOwnership(child_id, req.parentId);
  if (!child) return res.status(403).json({ error: 'This child does not belong to your account' });

  const parent = await one('SELECT lat, lng FROM parents WHERE id = $1', [req.parentId]);
  const radiusKm = await getRadiusKm();

  let items = await many(
    `SELECT items.*, children.display_name as owner_name, children.avatar_emoji as owner_avatar
     FROM items JOIN children ON items.child_id = children.id
     WHERE items.status = 'available'
       AND items.ai_exchangeable = 1
       AND items.child_id != $1
       AND ($2::text IS NULL OR items.category = $2)
     ORDER BY items.created_at DESC`,
    [child_id, category || null]
  );

  items = items
    .map(item => ({ ...item, distance_km: Math.round(distanceKm(parent.lat, parent.lng, item.lat, item.lng) * 10) / 10 }))
    .filter(item => item.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km);

  res.json({ radius_km: radiusKm, items });
}));

async function getOwnedItem(itemId, parentId) {
  return one(
    `SELECT items.*, children.display_name as owner_name
     FROM items JOIN children ON items.child_id = children.id
     WHERE items.id = $1 AND children.parent_id = $2`,
    [itemId, parentId]
  );
}

function unlinkPhotoFile(photoPath) {
  if (!photoPath) return;
  const filePath = path.join(uploadsDir, path.basename(photoPath));
  fs.unlink(filePath, () => {});
}

async function listItemPhotos(item) {
  let photos = await many(
    `SELECT id, photo_path, created_at FROM item_photos WHERE item_id = $1 ORDER BY created_at ASC`,
    [item.id]
  );
  if (!photos.length && item.photo_path) {
    const row = await one(
      `INSERT INTO item_photos (id, item_id, photo_path, created_at)
       VALUES ($1, $2, $3, $4) RETURNING id, photo_path, created_at`,
      [uuidv4(), item.id, item.photo_path, item.created_at]
    );
    photos = [row];
  }
  return photos;
}

async function syncCoverPhoto(itemId) {
  const first = await one(
    `SELECT photo_path FROM item_photos WHERE item_id = $1 ORDER BY created_at ASC LIMIT 1`,
    [itemId]
  );
  await query(`UPDATE items SET photo_path = $1 WHERE id = $2`, [first ? first.photo_path : null, itemId]);
}

async function listItemSwaps(itemId) {
  return many(
    `SELECT er.id, er.status, er.duration_type, er.created_at,
            oi.title as offered_title, ri.title as requested_title,
            fc.display_name as from_child_name, tc.display_name as to_child_name
     FROM exchange_requests er
     JOIN items oi ON er.offered_item_id = oi.id
     JOIN items ri ON er.requested_item_id = ri.id
     JOIN children fc ON er.from_child_id = fc.id
     JOIN children tc ON er.to_child_id = tc.id
     WHERE er.offered_item_id = $1 OR er.requested_item_id = $1
     ORDER BY er.created_at DESC`,
    [itemId]
  );
}

async function withItemDetails(item) {
  const photos = await listItemPhotos(item);
  const swaps = await listItemSwaps(item.id);
  return { ...item, photos, swaps };
}

router.post('/:id/photos', requireParentAuth, upload.array('photos', 8), asyncHandler(async (req, res) => {
  const item = await getOwnedItem(req.params.id, req.parentId);
  if (!item) return res.status(404).json({ error: 'Listing not found' });
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ error: 'Choose at least one photo' });

  const existing = await many('SELECT id FROM item_photos WHERE item_id = $1', [item.id]);
  if (existing.length + files.length > 8) {
    return res.status(400).json({ error: 'You can attach up to 8 photos per listing' });
  }

  for (const file of files) {
    await query(
      `INSERT INTO item_photos (id, item_id, photo_path) VALUES ($1, $2, $3)`,
      [uuidv4(), item.id, `/uploads/${file.filename}`]
    );
  }
  await syncCoverPhoto(item.id);
  const updated = await getOwnedItem(item.id, req.parentId);
  res.status(201).json(await withItemDetails(updated));
}));

router.delete('/:id/photos/:photoId', requireParentAuth, asyncHandler(async (req, res) => {
  const item = await getOwnedItem(req.params.id, req.parentId);
  if (!item) return res.status(404).json({ error: 'Listing not found' });

  const photo = await one(
    `SELECT * FROM item_photos WHERE id = $1 AND item_id = $2`,
    [req.params.photoId, item.id]
  );
  if (!photo) return res.status(404).json({ error: 'Photo not found' });

  await query('DELETE FROM item_photos WHERE id = $1', [photo.id]);
  unlinkPhotoFile(photo.photo_path);
  await syncCoverPhoto(item.id);
  const updated = await getOwnedItem(item.id, req.parentId);
  res.json(await withItemDetails(updated));
}));

router.get('/:id', requireParentAuth, asyncHandler(async (req, res) => {
  const item = await getOwnedItem(req.params.id, req.parentId);
  if (!item) return res.status(404).json({ error: 'Listing not found' });
  res.json(await withItemDetails(item));
}));

router.put('/:id', requireParentAuth, asyncHandler(async (req, res) => {
  const item = await getOwnedItem(req.params.id, req.parentId);
  if (!item) return res.status(404).json({ error: 'Listing not found' });

  const title = (req.body.title || '').trim();
  const description = req.body.description;
  const category = req.body.category || item.category;
  if (!title) return res.status(400).json({ error: 'title is required' });

  await query(
    `UPDATE items SET title = $1, description = $2, category = $3 WHERE id = $4`,
    [title, description || null, category, item.id]
  );
  const updated = await getOwnedItem(item.id, req.parentId);
  res.json(await withItemDetails(updated));
}));

router.delete('/:id', requireParentAuth, asyncHandler(async (req, res) => {
  const item = await one(
    `SELECT items.*
     FROM items JOIN children ON items.child_id = children.id
     WHERE items.id = $1 AND children.parent_id = $2`,
    [req.params.id, req.parentId]
  );
  if (!item) return res.status(404).json({ error: 'Listing not found' });

  const activeExchange = await one(
    `SELECT id FROM exchange_requests
     WHERE (offered_item_id = $1 OR requested_item_id = $1)
       AND status NOT IN ('declined')
     LIMIT 1`,
    [item.id]
  );
  if (activeExchange) {
    return res.status(409).json({
      error: 'This listing is in an active exchange. Decline or finish the exchange first.'
    });
  }

  const related = await many(
    `SELECT id FROM exchange_requests WHERE offered_item_id = $1 OR requested_item_id = $1`,
    [item.id]
  );
  for (const ex of related) {
    await query('DELETE FROM exchange_messages WHERE exchange_id = $1', [ex.id]);
    await query('DELETE FROM deliveries WHERE exchange_id = $1', [ex.id]);
    await query('DELETE FROM exchange_requests WHERE id = $1', [ex.id]);
  }

  const photos = await many('SELECT photo_path FROM item_photos WHERE item_id = $1', [item.id]);
  await query('DELETE FROM items WHERE id = $1', [item.id]);
  for (const photo of photos) unlinkPhotoFile(photo.photo_path);
  unlinkPhotoFile(item.photo_path);

  res.json({ ok: true });
}));

module.exports = router;
