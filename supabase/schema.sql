-- PetLoog corporate website schema (Supabase)
-- Enable RLS on all tables. Service role bypasses RLS for server inserts.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  ip text,
  created_at timestamptz not null default now()
);

create table if not exists public.veteriner_applications (
  id uuid primary key default gen_random_uuid(),
  clinic_name text not null,
  vet_name text not null,
  tc_kimlik text not null,
  diploma_no text not null,
  phone text not null,
  email text not null,
  city text not null,
  district text not null,
  address text not null,
  tax_no text not null,
  iban text not null,
  working_hours text not null,
  services text[] not null default '{}',
  documents jsonb not null default '{}'::jsonb,
  status text not null default 'pending_review',
  ip text,
  created_at timestamptz not null default now()
);

create table if not exists public.petshop_applications (
  id uuid primary key default gen_random_uuid(),
  store_name text not null,
  owner_name text not null,
  phone text not null,
  email text not null,
  tax_no text not null,
  iban text not null,
  city text not null,
  district text not null,
  address text not null,
  category text not null,
  working_hours text not null,
  delivery_zones text not null,
  documents jsonb not null default '{}'::jsonb,
  status text not null default 'pending_review',
  ip text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;
alter table public.veteriner_applications enable row level security;
alter table public.petshop_applications enable row level security;
alter table public.audit_logs enable row level security;

-- No public select policies: only service role / authenticated admins should read.
-- Example admin read policy (replace role claim as needed):
-- create policy "admin read contact" on public.contact_messages
--   for select to authenticated
--   using ((auth.jwt() ->> 'role') = 'admin');
