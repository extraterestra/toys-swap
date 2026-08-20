require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Safety net: fail loudly if JWT secret was left as the example placeholder in a real deploy.
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
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'toyswap-backend' }));

// Serve the static frontend (so the whole app is one process for the MVP)
const frontendDir = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendDir));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ToySwap backend running at http://localhost:${PORT}`);
  console.log(process.env.ANTHROPIC_API_KEY
    ? '✔ AI photo evaluation: using real Claude vision API'
    : 'ℹ AI photo evaluation: using MOCK evaluator (set ANTHROPIC_API_KEY in .env for real assessment)');
});
