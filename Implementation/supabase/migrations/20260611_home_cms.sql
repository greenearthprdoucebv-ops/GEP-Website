-- ── Home page CMS tables ─────────────────────────────────────────────────────
-- Allows admins to update the hero video, product cards, and reviews
-- without touching code. Frontend falls back to static assets if tables are empty.

-- Hero section (single active row)
CREATE TABLE IF NOT EXISTS home_hero (
  id          SERIAL      PRIMARY KEY,
  video_url   TEXT        NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Product cards
CREATE TABLE IF NOT EXISTS home_products (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  origin      TEXT        NOT NULL,
  description TEXT        NOT NULL,
  image_url   TEXT        NOT NULL,
  keywords    TEXT[]      NOT NULL DEFAULT '{}',
  image_left  BOOLEAN     NOT NULL DEFAULT true,
  sort_order  INT         NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Client reviews (marquee)
CREATE TABLE IF NOT EXISTS home_reviews (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  stars       INT         NOT NULL CHECK (stars BETWEEN 1 AND 5),
  review_text TEXT        NOT NULL,
  author      TEXT        NOT NULL,
  role        TEXT        NOT NULL,
  sort_order  INT         NOT NULL DEFAULT 0,
  is_active   BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Row-level security ────────────────────────────────────────────────────────
-- Public visitors can read content; only authenticated admins can write.

ALTER TABLE home_hero     ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_reviews  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_hero"     ON home_hero     FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_products" ON home_products FOR SELECT TO anon USING (true);
CREATE POLICY "public_read_reviews"  ON home_reviews  FOR SELECT TO anon USING (true);

-- Authenticated users (admins via Supabase dashboard) can manage all rows
CREATE POLICY "admin_all_hero"     ON home_hero     FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_products" ON home_products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_all_reviews"  ON home_reviews  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── Seed data ────────────────────────────────────────────────────────────────
-- Replace image_url values with your Supabase Storage public URLs after uploading.
-- Until then the frontend uses local fallback assets.

INSERT INTO home_products (name, origin, description, image_url, keywords, image_left, sort_order) VALUES
(
  'Chinese Ginger',
  'Shandong, China',
  'Grown in the fertile soils of Shandong province — bold, pungent, and aromatic. A staple for food manufacturers and spice traders worldwide.',
  '',   -- replace with Supabase Storage URL, e.g. https://xxx.supabase.co/storage/v1/object/public/home/china-ginger.png
  ARRAY['Organic', 'Grade A', 'Year-round supply'],
  true,
  1
),
(
  'Peru Ginger',
  'Junín, Peru',
  'High-altitude farms in Junín produce a milder, slightly sweet ginger — ideal for specialty food, beverage, and wellness markets.',
  '',   -- replace with Supabase Storage URL
  ARRAY['Mild flavor', 'Export quality', 'Seasonal harvest'],
  false,
  2
);

INSERT INTO home_reviews (stars, review_text, author, role, sort_order) VALUES
(5, 'Consistent quality every shipment. GreenEarth is our go-to supplier.',                     'Maria L.',    'Head of Procurement, FoodCo',          1),
(5, 'The Peru ginger opened up a whole new product line for us. Exceptional.',                  'James T.',    'Product Developer, TeaHouse',          2),
(5, 'Reliable, transparent, and genuinely easy to work with.',                                  'Sara K.',     'Operations Manager, SpiceTrade',       3),
(4, 'Grade A quality and fast delivery every time. Will keep ordering.',                        'David R.',    'Buyer, GlobalFoods',                   4),
(5, 'Switched two years ago and never looked back. Our customers can taste the difference.',    'Anika K.',    'Director, Specialty Foods Austria',    5),
(5, 'From first enquiry to final delivery — smooth, professional, no surprises.',               'Thomas R.',   'Operations, Food Service Switzerland', 6),
(5, 'Year-round availability for Chinese ginger is a lifesaver for our supply chain.',          'Lena D.',     'Procurement, Distribution France',     7),
(4, 'Custom packaging made a real difference on our retail shelves. Great partner.',            'Sophie F.',   'Category Manager, Wholesale Germany',  8);
