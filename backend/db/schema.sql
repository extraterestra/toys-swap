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

ALTER TABLE children ADD COLUMN IF NOT EXISTS age_band TEXT;

CREATE TABLE IF NOT EXISTS guardian_consents (
  id TEXT PRIMARY KEY,
  parent_id TEXT REFERENCES parents(id) ON DELETE SET NULL,
  child_id TEXT REFERENCES children(id) ON DELETE SET NULL,
  parent_email_hash TEXT NOT NULL,
  kind TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'pl',
  confirmation_text TEXT,
  confirmed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS guardian_consents_parent_idx ON guardian_consents (parent_id);
CREATE INDEX IF NOT EXISTS guardian_consents_child_idx ON guardian_consents (child_id);

-- Minimize existing child records: keep an age range, drop exact birth year.
UPDATE children
SET age_band = CASE
  WHEN age_band IS NOT NULL THEN age_band
  WHEN birth_year IS NULL THEN NULL
  WHEN (EXTRACT(YEAR FROM NOW())::int - birth_year) <= 2 THEN '0-2'
  WHEN (EXTRACT(YEAR FROM NOW())::int - birth_year) <= 5 THEN '3-5'
  WHEN (EXTRACT(YEAR FROM NOW())::int - birth_year) <= 8 THEN '6-8'
  WHEN (EXTRACT(YEAR FROM NOW())::int - birth_year) <= 12 THEN '9-12'
  ELSE '13-17'
END
WHERE age_band IS NULL AND birth_year IS NOT NULL;

UPDATE children SET birth_year = NULL WHERE birth_year IS NOT NULL;

CREATE TABLE IF NOT EXISTS item_photos (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  photo_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS item_photos_item_id_idx ON item_photos (item_id);

CREATE TABLE IF NOT EXISTS safety_reports (
  id TEXT PRIMARY KEY,
  reporter_parent_id TEXT REFERENCES parents(id) ON DELETE SET NULL,
  subject_type TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  reported_parent_id TEXT REFERENCES parents(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS safety_reports_status_idx ON safety_reports (status, created_at DESC);

CREATE TABLE IF NOT EXISTS parent_blocks (
  blocker_id TEXT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  blocked_id TEXT NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);
