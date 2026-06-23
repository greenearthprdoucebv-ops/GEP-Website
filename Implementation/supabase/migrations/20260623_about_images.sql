-- Add image URL columns to about_content table
-- Run in Supabase Dashboard → SQL Editor → New query

alter table public.about_content
  add column if not exists hero_image_url     text default null,
  add column if not exists story_image_url    text default null,
  add column if not exists approach_image_url text default null,
  add column if not exists team_banner_url    text default null;
