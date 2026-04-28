-- ResumeAI Pro — initial schema
-- Run this in your Supabase SQL Editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

-- USER TYPES
do $$ begin
  create type user_type as enum ('fresher', 'intermediate', 'professional');
exception when duplicate_object then null; end $$;

do $$ begin
  create type plan_type as enum ('free', 'fresher_pack', 'pro_monthly', 'professional_pack');
exception when duplicate_object then null; end $$;

do $$ begin
  create type resume_status as enum ('draft', 'generating', 'generated', 'failed');
exception when duplicate_object then null; end $$;

-- PROFILES (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  user_type user_type default 'fresher',
  plan plan_type default 'free',
  credits_remaining int not null default 1,
  is_admin boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RESUMES — content stored as JSONB to keep schema simple
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'Untitled Resume',
  user_type user_type not null default 'fresher',
  target_role text,
  status resume_status not null default 'draft',
  content jsonb not null default '{}'::jsonb,        -- form input from user
  generated jsonb,                                    -- AI-generated structured output
  ats_score int,
  improvement_tips jsonb,
  is_deleted boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists resumes_user_id_idx on public.resumes(user_id);

-- PAYMENTS (mock-friendly log)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount_cents int not null,
  currency text not null default 'usd',
  plan_purchased plan_type not null,
  status text not null default 'succeeded',
  is_mock boolean not null default true,
  created_at timestamptz default now()
);

-- EMAIL LOG (since we mock Resend)
create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  to_email text not null,
  subject text not null,
  body text not null,
  created_at timestamptz default now()
);

-- TRIGGERS
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles
  for each row execute procedure public.touch_updated_at();

drop trigger if exists resumes_touch on public.resumes;
create trigger resumes_touch before update on public.resumes
  for each row execute procedure public.touch_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.resumes enable row level security;
alter table public.payments enable row level security;
alter table public.email_logs enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "resumes_owner_all" on public.resumes;
create policy "resumes_owner_all" on public.resumes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "payments_owner_select" on public.payments;
create policy "payments_owner_select" on public.payments
  for select using (auth.uid() = user_id);

drop policy if exists "payments_owner_insert" on public.payments;
create policy "payments_owner_insert" on public.payments
  for insert with check (auth.uid() = user_id);

-- email_logs: only service role writes; users cannot read
-- (no policies = no client access)
