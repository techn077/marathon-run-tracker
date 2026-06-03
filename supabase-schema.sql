-- Run this entire file in Supabase → SQL Editor → New Query

create table if not exists runs (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  runner      text,
  date        date not null,
  map         text not null,
  outcome     text not null check (outcome in ('Extracted', 'Died', 'Abandoned')),
  credits     integer not null default 0,
  shell       text,
  team_size   text check (team_size in ('1', '2', '3')),
  notes       text
);

-- Enable Row Level Security (allows public read/write for now)
-- When you add auth later, update these policies to restrict by user_id
alter table runs enable row level security;

create policy "Allow all for now"
  on runs
  for all
  using (true)
  with check (true);

-- Index for faster date sorting
create index if not exists runs_date_idx on runs (date desc);
