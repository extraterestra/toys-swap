-- ToySwap schema (Postgres). Designed so Phase 4 can add PostGIS
-- without changing table names or the rest of the API.

CREATE TABLE IF NOT EXISTS parents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'parent',
  address_text TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS children (
  id TEXT PRIMARY KEY,
  parent_id TEXT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  birth_year INTEGER,
  avatar_emoji TEXT DEFAULT '🧒',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  child_id TEXT NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'toy',
  title TEXT NOT NULL,
  description TEXT,
  photo_path TEXT,
  ai_condition_score INTEGER,
  ai_condition_label TEXT,
  ai_description TEXT,
  ai_exchangeable INTEGER DEFAULT 1,
  moderation_status TEXT DEFAULT 'pending',
  status TEXT DEFAULT 'available',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS canned_messages (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS exchange_requests (
  id TEXT PRIMARY KEY,
  offered_item_id TEXT NOT NULL REFERENCES items(id),
  requested_item_id TEXT NOT NULL REFERENCES items(id),
  from_child_id TEXT NOT NULL REFERENCES children(id),
  to_child_id TEXT NOT NULL REFERENCES children(id),
  duration_type TEXT DEFAULT 'forever',
  duration_days INTEGER,
  status TEXT DEFAULT 'pending_parent_approval',
  from_parent_approved INTEGER DEFAULT 0,
  to_parent_approved INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exchange_messages (
  id TEXT PRIMARY KEY,
  exchange_id TEXT NOT NULL REFERENCES exchange_requests(id) ON DELETE CASCADE,
  sender_child_id TEXT NOT NULL REFERENCES children(id),
  canned_message_id INTEGER REFERENCES canned_messages(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deliveries (
  id TEXT PRIMARY KEY,
  exchange_id TEXT NOT NULL REFERENCES exchange_requests(id),
  delivery_order_ref TEXT,
  status TEXT DEFAULT 'requested',
  raw_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE INDEX IF NOT EXISTS children_parent_id_idx ON children (parent_id);
CREATE INDEX IF NOT EXISTS items_child_id_idx ON items (child_id);
CREATE INDEX IF NOT EXISTS items_status_idx ON items (status);
CREATE INDEX IF NOT EXISTS exchange_from_child_idx ON exchange_requests (from_child_id);
CREATE INDEX IF NOT EXISTS exchange_to_child_idx ON exchange_requests (to_child_id);

ALTER TABLE parents ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'parent';

CREATE TABLE IF NOT EXISTS item_photos (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  photo_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS item_photos_item_id_idx ON item_photos (item_id);
