require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { initDb, pool } = require('./db/db');
const { requireParentAuth, requireAdmin } = require('./services/auth');

const app = express();
const PORT = process.env.PORT || 4000;

const uploadsDir = process.env.UPLOADS_DIR || path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

if (!process.env.JWT_SECRET) {
  console.warn('[WARN] JWT_SECRET is not set - using an insecure default for local dev only.');
  process.env.JWT_SECRET = 'insecure_dev_secret_change_me';
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

app.use('/api/parents', require('./routes/parents'));
app.use('/api/children', require('./routes/children'));
app.use('/api/items', require('./routes/items'));
app.use('/api/exchanges', require('./routes/exchanges'));
app.use('/api/safety', require('./routes/safety'));
app.use('/api/admin', requireParentAuth, requireAdmin, require('./routes/admin'));

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, service: 'toyswap-backend', db: 'up' });
  } catch (err) {
    res.status(503).json({ ok: false, service: 'toyswap-backend', db: 'down' });
  }
});

const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir, {
  etag: false,
  lastModified: false,
  setHeaders(res) {
    res.setHeader('Cache-Control', 'no-store');
  }
}));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

async function start() {
  await initDb();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ToySwap backend running at http://localhost:${PORT}`);
    console.log(process.env.ANTHROPIC_API_KEY
      ? '✔ AI photo evaluation: using real Claude vision API'
      : 'ℹ AI photo evaluation: using MOCK evaluator (set ANTHROPIC_API_KEY in .env for real assessment)');
  });
}

start().catch((err) => {
  console.error('Failed to start ToySwap:', err);
  process.exit(1);
});
