const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'toyswap.sqlite');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS parents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  address_text TEXT,
  lat REAL,
  lng REAL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS children (
  id TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  birth_year INTEGER,
  avatar_emoji TEXT DEFAULT '🧒',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'toy', -- toy | book (extensible later)
  title TEXT NOT NULL,
  description TEXT,
  photo_path TEXT,
  ai_condition_score INTEGER,      -- 1-10 scale, 10 = like new
  ai_condition_label TEXT,         -- e.g. "Like new", "Good", "Worn", "Not exchangeable"
  ai_description TEXT,             -- AI-generated description of the item
  ai_exchangeable INTEGER DEFAULT 1, -- 0/1
  moderation_status TEXT DEFAULT 'pending', -- pending | approved | rejected (photo moderation stub)
  status TEXT DEFAULT 'available', -- available | pending_exchange | exchanged | removed
  lat REAL,
  lng REAL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS canned_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS exchange_requests (
  id TEXT PRIMARY KEY,
  offered_item_id TEXT NOT NULL REFERENCES items(id),
  requested_item_id TEXT NOT NULL REFERENCES items(id),
  from_child_id TEXT NOT NULL REFERENCES children(id),
  to_child_id TEXT NOT NULL REFERENCES children(id),
  duration_type TEXT DEFAULT 'forever', -- forever | temporary
  duration_days INTEGER,
  status TEXT DEFAULT 'pending_parent_approval',
  -- pending_parent_approval -> approved -> delivery_requested -> delivered -> completed
  -- (or) declined / cancelled
  from_parent_approved INTEGER DEFAULT 0,
  to_parent_approved INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS exchange_messages (
  id TEXT PRIMARY KEY,
  exchange_id TEXT NOT NULL REFERENCES exchange_requests(id) ON DELETE CASCADE,
  sender_child_id TEXT NOT NULL REFERENCES children(id),
  canned_message_id INTEGER REFERENCES canned_messages(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS deliveries (
  id TEXT PRIMARY KEY,
  exchange_id TEXT NOT NULL REFERENCES exchange_requests(id),
  delivery_order_ref TEXT,
  status TEXT DEFAULT 'requested', -- requested | accepted | picked_up | delivered | failed
  raw_response TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
`);

// Seed default admin settings
const seedSetting = db.prepare(`INSERT OR IGNORE INTO admin_settings (key, value) VALUES (?, ?)`);
seedSetting.run('exchange_radius_km', process.env.DEFAULT_EXCHANGE_RADIUS_KM || '10');

// Seed canned messages (MVP: no freeform chat between children, for safety)
const cannedCount = db.prepare(`SELECT COUNT(*) as c FROM canned_messages`).get().c;
if (cannedCount === 0) {
  const insertCanned = db.prepare(`INSERT INTO canned_messages (text) VALUES (?)`);
  const defaults = [
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
  const tx = db.transaction((msgs) => msgs.forEach(m => insertCanned.run(m)));
  tx(defaults);
}

module.exports = db;
