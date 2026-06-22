create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  status text not null default 'pending',
  confirmation_token_hash text,
  confirmation_sent_at timestamptz,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  source text not null default 'website_about_newsletter',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint newsletter_subscribers_email_lowercase check (email = lower(email)),
  constraint newsletter_subscribers_status_check check (
    status in ('pending', 'confirmed', 'unsubscribed')
  )
);

create unique index if not exists newsletter_subscribers_email_key
  on public.newsletter_subscribers (email);

create unique index if not exists newsletter_subscribers_confirmation_token_hash_key
  on public.newsletter_subscribers (confirmation_token_hash)
  where confirmation_token_hash is not null;

create or replace function public.set_newsletter_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_newsletter_updated_at on public.newsletter_subscribers;

create trigger set_newsletter_updated_at
before update on public.newsletter_subscribers
for each row
execute function public.set_newsletter_updated_at();

alter table public.newsletter_subscribers enable row level security;

comment on table public.newsletter_subscribers is
  'Newsletter subscribers created through the website. Uses a double opt-in confirmation flow.';
