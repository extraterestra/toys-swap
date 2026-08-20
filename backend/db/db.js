const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

function sslConfig() {
  const url = process.env.DATABASE_URL || '';
  if (!url) return false;
  if (process.env.DATABASE_SSL === 'false') return false;
  if (url.includes('localhost') || url.includes('127.0.0.1')) return false;
  // Hosted Postgres (Railway) typically requires SSL.
  return { rejectUnauthorized: false };
}

if (!process.env.DATABASE_URL) {
  console.warn('[WARN] DATABASE_URL is not set. Set it to a Postgres connection string.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig(),
  max: 10
});

async function query(text, params = []) {
  return pool.query(text, params);
}

async function one(text, params = []) {
  const { rows } = await pool.query(text, params);
  return rows[0] || null;
}

async function many(text, params = []) {
  const { rows } = await pool.query(text, params);
  return rows;
}

async function waitForDb(retries = 30) {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      return;
    } catch (err) {
      lastError = err;
      console.log(`Waiting for Postgres (${i + 1}/${retries})...`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw lastError || new Error('Could not connect to Postgres');
}

async function seed() {
  await query(
    `INSERT INTO admin_settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO NOTHING`,
    ['exchange_radius_km', process.env.DEFAULT_EXCHANGE_RADIUS_KM || '10']
  );

  const canned = [
    'Hi! 👋',
    'Is this still available?',
    'I would love to exchange with you!',
    'Great, let\'s ask our parents to confirm 🎉',
    'Can you tell me more about it?',
    'Yes, it still works great!',
    'It has a small scratch but works fine.',
    'Thank you! 😊',
    'See you soon!',
    'My parent will arrange delivery.'
  ];
  for (const text of canned) {
    await query(
      `INSERT INTO canned_messages (text) VALUES ($1) ON CONFLICT (text) DO NOTHING`,
      [text]
    );
  }
}

function splitSql(sql) {
  return sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}

async function initDb() {
  await waitForDb();
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  for (const statement of splitSql(schema)) {
    await query(statement);
  }
  await seed();
  console.log('✔ Postgres schema ready');
}

module.exports = { pool, query, one, many, initDb };
