-- About page CMS table
-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)

create table if not exists public.about_content (
  id               serial primary key,

  -- Hero section
  hero_title       text not null default 'About GreenEarth Produce',
  hero_para1       text not null default '',
  hero_para2       text not null default '',
  hero_para3       text not null default '',

  -- Core Values section
  values_subtitle  text not null default 'The principles that shape the way we work',
  value1_title     text not null default 'Quality',
  value1_body      text not null default '',
  value1_icon      text not null default 'leaf',
  value2_title     text not null default 'Reliability',
  value2_body      text not null default '',
  value2_icon      text not null default 'clock',
  value3_title     text not null default 'Partnership',
  value3_body      text not null default '',
  value3_icon      text not null default 'handshake',
  value4_title     text not null default 'Efficiency',
  value4_body      text not null default '',
  value4_icon      text not null default 'box',

  -- From Source to Market section
  story_title      text not null default 'From Source to Market',
  story_para1      text not null default '',
  story_para2      text not null default '',
  story_para3      text not null default '',

  -- What We Focus On section
  focus_subtitle   text not null default 'Key areas that define our daily work',
  focus1_title     text not null default 'Fresh Produce',
  focus1_body      text not null default '',
  focus2_title     text not null default 'Supply Coordination',
  focus2_body      text not null default '',
  focus3_title     text not null default 'Business Relationships',
  focus3_body      text not null default '',
  focus4_title     text not null default 'Market Awareness',
  focus4_body      text not null default '',

  -- A Responsible Approach section
  approach_title   text not null default 'A Responsible Approach',
  approach_para    text not null default '',
  approach_check1  text not null default 'Focus on product quality and consistency',
  approach_check2  text not null default 'Clear coordination across the supply chain',
  approach_check3  text not null default 'Attention to efficient distribution processes',
  approach_check4  text not null default 'Commitment to dependable business relationships',

  -- Our Team section
  team_title       text not null default 'Our Team',
  team_para1       text not null default '',
  team_para2       text not null default '',
  team_para3       text not null default '',

  updated_at       timestamptz not null default now()
);

-- Seed with current content (only inserts if table is empty)
insert into public.about_content (
  hero_para1, hero_para2, hero_para3,
  value1_body, value2_body, value3_body, value4_body,
  story_para1, story_para2, story_para3,
  focus1_body, focus2_body, focus3_body, focus4_body,
  approach_para,
  team_para1, team_para2, team_para3
)
select
  'Green Earth Produce B.V. was established in Venlo, the Netherlands, with a strong focus on fresh ginger. Our team brings nearly 30 years of experience in the ginger industry, covering cultivation, sourcing, processing, packaging, distribution, and international trade. Over the years, we have built long-term and stable partnerships with professional growers and packing facilities in China. This enables us to supply both organic ginger and GlobalG.A.P.-certified conventional ginger that complies with EU Maximum Residue Levels (MRL) requirements.',
  'Our expertise covers the entire supply chain, including cultivation management, sourcing, production, quality control, food safety management, and international logistics. Since the beginning, we have remained committed to one clear goal: building the shortest possible supply chain to deliver premium products, consistent quality, and reliable year-round supply to our customers.',
  'Today, we supply supermarkets, wholesalers, foodservice companies, and food retailers throughout Europe. In addition to fresh ginger, we also offer value-added services such as repacking, processing, and customized labeling. Our mission remains unchanged — to provide reliable quality, stable supply, and professional service to our customers.',
  'We value freshness, consistency, and product standards that support long-term trust.',
  'We focus on dependable coordination between sourcing, supply, and customer needs.',
  'Strong business relationships are essential to building stable and effective produce networks.',
  'We aim for practical, well-organized processes that support smooth distribution and delivery.',
  'We work closely with carefully selected growers and production farms in China, Peru, Brazil, and Thailand. These partners operate their own ginger farms and have extensive cultivation experience and expertise.',
  'Our long-term partnerships enable us to ensure full traceability, consistent quality, and reliable year-round supply. We know our partners, and we trust their quality. We strongly believe that close cooperation at origin is the key to delivering premium ginger to the European market.',
  'At Green Earth Produce, we believe in keeping things simple and fresh — every day. That is a promise our customers can count on.',
  'Fruit and vegetable products handled with attention to quality and consistency.',
  'Supporting the connection between sourcing, distribution, and customer demand.',
  'Building dependable cooperation with partners across the produce chain.',
  'Responding to product, timing, and supply expectations in a practical way.',
  'GreenEarth Produce values professional and responsible ways of working. In a sector where quality, timing, and product handling are essential, careful coordination and efficient processes play an important role in supporting reliable supply.',
  'For over 30 years, GEP team has specialized in ginger supply chain management, building expertise that spans the entire value chain — from cultivation and sourcing to food safety, quality control, logistics, and global distribution.',
  'Driven by professionalism, dedication, and attention to detail, we are committed to ensuring product quality, supply stability, and operational excellence at every step.',
  'More than a supplier, we are a strategic supply chain solutions partner. We work closely with our customers to deliver not only premium ginger products, but also reliable, efficient, and sustainable supply chain solutions that support long-term business growth.'
where not exists (select 1 from public.about_content);

-- RLS: allow public read, authenticated write
alter table public.about_content enable row level security;

create policy "Public can read about_content"
  on public.about_content for select
  using (true);

create policy "Authenticated users can update about_content"
  on public.about_content for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can insert about_content"
  on public.about_content for insert
  with check (auth.role() = 'authenticated');
