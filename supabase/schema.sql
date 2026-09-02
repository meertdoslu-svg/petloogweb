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
  -- {pzt,sal,car,per,cum,cmt,paz}: {open,close,closed} — same shape as the
  -- production merchants.working_hours JSONB column (main app).
  working_hours jsonb not null default '{}'::jsonb,
  services text[] not null default '{}',
  -- documents.ruhsat (Veteriner Ruhsatı) is optional — may be null.
  documents jsonb not null default '{}'::jsonb,
  status text not null default 'pending_review',
  reviewed_at timestamptz,
  rejection_reason text,
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
  -- {pzt,sal,car,per,cum,cmt,paz}: {open,close,closed} — same shape as the
  -- production merchants.working_hours JSONB column (main app).
  working_hours jsonb not null default '{}'::jsonb,
  -- Human-readable fallback (comma-joined mahalle names); the structured
  -- selection lives in delivery_neighborhoods below. The real merchants
  -- table only supports radius-based delivery, so there's no existing
  -- neighborhood-list model to reuse for this column.
  delivery_zones text not null,
  -- { il, ilce, mahalleler: string[] }
  delivery_neighborhoods jsonb not null default '{}'::jsonb,
  -- documents.vergiLevhasi (Vergi Levhası) alongside logo/kapak/belgeler.
  documents jsonb not null default '{}'::jsonb,
  status text not null default 'pending_review',
  reviewed_at timestamptz,
  rejection_reason text,
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
