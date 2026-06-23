-- Fix home_hero: add lead_text and mode columns if missing
ALTER TABLE home_hero
  ADD COLUMN IF NOT EXISTS lead_text TEXT,
  ADD COLUMN IF NOT EXISTS mode      TEXT NOT NULL DEFAULT 'video';

-- Hero slideshow slides
CREATE TABLE IF NOT EXISTS home_slideshow (
  id          SERIAL      PRIMARY KEY,
  image_url   TEXT        NOT NULL,
  title       TEXT,
  caption     TEXT,
  sort_order  INT         NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE home_slideshow ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_slideshow" ON home_slideshow FOR SELECT TO anon        USING (true);
CREATE POLICY "admin_all_slideshow"   ON home_slideshow FOR ALL    TO authenticated USING (true) WITH CHECK (true);

-- Certifications
CREATE TABLE IF NOT EXISTS certifications (
  id          SERIAL      PRIMARY KEY,
  name        TEXT        NOT NULL,
  image_url   TEXT,
  sort_order  INT         NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_certifications" ON certifications FOR SELECT TO anon        USING (true);
CREATE POLICY "admin_all_certifications"   ON certifications FOR ALL    TO authenticated USING (true) WITH CHECK (true);

-- Drop reviews table (no longer used)
DROP TABLE IF EXISTS home_reviews;
