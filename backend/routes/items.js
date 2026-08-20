const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { one, many } = require('../db/db');
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

module.exports = router;
