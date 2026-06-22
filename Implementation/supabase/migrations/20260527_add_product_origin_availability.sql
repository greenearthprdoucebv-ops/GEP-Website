-- US-01: product catalogue shows origin and availability per product.
-- Run in Supabase SQL Editor (Dashboard → SQL → New query).

alter table public.products
  add column if not exists origin text,
  add column if not exists availability text;

comment on column public.products.origin is 'Growing region or country of origin, e.g. Shandong, China';
comment on column public.products.availability is 'Availability status, e.g. In stock, Seasonal, On request';

-- Optional backfill for common ginger SKUs (adjust titles to match your rows).
update public.products
set
  origin = coalesce(origin, 'Shandong, China'),
  availability = coalesce(availability, 'In stock')
where title ilike '%chinese%' or title ilike '%china%';

update public.products
set
  origin = coalesce(origin, 'Junín, Peru'),
  availability = coalesce(availability, 'Seasonal')
where title ilike '%peru%';
