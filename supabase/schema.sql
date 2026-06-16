-- LetsBuildFolio — Supabase Database Schema
-- Run this entire file in your Supabase SQL Editor (one paste)

-- 1. USER PROFILES
-- Stores extra info about each registered user
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null,
  grade       text,
  stream      text,   -- STEM / Commerce / Law / Humanities / Impact
  bio         text,
  avatar_url  text,
  xp          integer default 0,
  streak      integer default 0,
  created_at  timestamptz default now()
);

-- Allow each user to read/update only their own profile
alter table public.profiles enable row level security;
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
-- Service role (used by our API) can do anything
create policy "Service role full access"     on public.profiles for all using (true) with check (true);

-- 2. OPPORTUNITIES
-- The actual hackathons, internships, MUNs, etc.
create table if not exists public.opportunities (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  type         text not null,    -- Hackathon / Internship / MUN / Scholarship / Camp / Quest
  description  text,
  stream       text,             -- STEM / Commerce / Law / Humanities / Impact / All
  deadline     date,
  apply_url    text,
  organiser    text,
  location     text,
  is_featured  boolean default false,
  created_at   timestamptz default now()
);

alter table public.opportunities enable row level security;
create policy "Anyone can view opportunities" on public.opportunities for select using (true);
create policy "Service role full access"      on public.opportunities for all using (true) with check (true);

-- Seed a few sample opportunities so the dashboard has something to show
insert into public.opportunities (title, type, stream, description, deadline, organiser, location) values
  ('Smart India Hackathon 2025', 'Hackathon', 'STEM', 'India''s biggest hackathon for college students. Build solutions for government challenges.', '2025-08-15', 'Govt of India', 'Pan-India'),
  ('Harvard WorldMUN 2025', 'MUN', 'Law', 'One of the most prestigious Model UN conferences in the world. Open to all streams.', '2025-09-01', 'Harvard University', 'Boston, USA'),
  ('NMIMS Summer Internship', 'Internship', 'Commerce', 'Paid summer internship programme at NMIMS for Finance and Marketing students.', '2025-07-30', 'NMIMS', 'Mumbai'),
  ('Chevening Scholarship', 'Scholarship', 'All', 'Fully-funded UK government scholarship for outstanding students from India.', '2025-11-05', 'UK Government', 'United Kingdom'),
  ('Google Summer of Code', 'Internship', 'STEM', 'Contribute to open-source projects and get paid. Open to students worldwide.', '2025-04-02', 'Google', 'Remote'),
  ('TEDx Youth Speaker Quest', 'Quest', 'Humanities', 'Complete the public speaking quest and get shortlisted to speak at TEDx Youth events.', '2025-10-01', 'TED', 'Various');

-- 3. SAVED OPPORTUNITIES (bookmarks)
create table if not exists public.saved_opportunities (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.profiles(id) on delete cascade,
  opportunity_id  uuid references public.opportunities(id) on delete cascade,
  saved_at        timestamptz default now(),
  unique (user_id, opportunity_id)
);

alter table public.saved_opportunities enable row level security;
create policy "Users manage own saves" on public.saved_opportunities for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4. EMAIL SUBSCRIBERS (for the newsletter band on the homepage)
create table if not exists public.email_subscribers (
  id             uuid primary key default gen_random_uuid(),
  email          text unique not null,
  subscribed_at  timestamptz default now()
);

alter table public.email_subscribers enable row level security;
create policy "Service role only" on public.email_subscribers for all using (true) with check (true);

-- 5. VISITOR COUNTER (simple page-view tracking)
create table if not exists public.page_views (
  id          uuid primary key default gen_random_uuid(),
  page        text not null,
  viewed_at   timestamptz default now(),
  country     text
);

alter table public.page_views enable row level security;
create policy "Anyone can insert views" on public.page_views for insert with check (true);
create policy "Service role reads views" on public.page_views for select using (true);

-- Handy view: total visitors per page
create or replace view public.visitor_stats as
  select page, count(*) as total_views, max(viewed_at) as last_viewed
  from public.page_views
  group by page
  order by total_views desc;

-- 6. QUEST PROGRESS
create table if not exists public.quest_progress (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade,
  quest_name  text not null,
  status      text default 'not_started',   -- not_started / in_progress / completed
  xp_earned   integer default 0,
  completed_at timestamptz,
  unique (user_id, quest_name)
);

alter table public.quest_progress enable row level security;
create policy "Users manage own quests" on public.quest_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
