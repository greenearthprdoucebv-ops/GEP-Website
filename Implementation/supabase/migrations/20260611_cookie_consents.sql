-- Cookie consent audit log
-- Each row = one consent action (accept / reject / customize).
-- device_id is an anonymous UUID stored in the visitor's localStorage.

CREATE TABLE IF NOT EXISTS cookie_consents (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id   TEXT        NOT NULL,
  necessary   BOOLEAN     NOT NULL DEFAULT true,
  analytics   BOOLEAN     NOT NULL DEFAULT false,
  marketing   BOOLEAN     NOT NULL DEFAULT false,
  action      TEXT        NOT NULL CHECK (action IN ('accept_all', 'reject_all', 'customize')),
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index so "latest consent for a device" queries are fast
CREATE INDEX IF NOT EXISTS cookie_consents_device_id_idx
  ON cookie_consents (device_id, created_at DESC);

-- Row-level security: visitors can insert their own records, no read needed
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert" ON cookie_consents
  FOR INSERT TO anon WITH CHECK (true);
