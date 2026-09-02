-- PetLoog corporate website schema (Supabase)
-- Enable RLS on all tables. Service role bypasses RLS for server inserts.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  status text not null default 'new',
  read_at timestamptz,
  replied_at timestamptz,
  ip text,
  created_at timestamptz not null default now()
);

-- Authored from PetLoog Admin; publicly readable only when published (see
-- RLS policy below). src/lib/blog.ts keeps a small hardcoded fallback set.
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_image_url text,
  category text,
  tags text[] not null default '{}',
  reading_minutes integer,
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_name text,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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
alter table public.blog_posts enable row level security;

-- No public select policies on the tables above: only service role /
-- authenticated admins should read. Example admin read policy (replace
-- role claim as needed):
-- create policy "admin read contact" on public.contact_messages
--   for select to authenticated
--   using ((auth.jwt() ->> 'role') = 'admin');

-- blog_posts is the one public-content exception: anyone may read
-- published posts (drafts stay invisible to anon/authenticated).
create policy "public read published blog posts"
  on public.blog_posts
  for select
  to public
  using (status = 'published');
