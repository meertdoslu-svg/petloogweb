-- PetLoog corporate website — additive migration
--
-- Upgrades petshop_applications / veteriner_applications to support:
--   - structured working hours (same {pzt,sal,car,per,cum,cmt,paz}:
--     {open,close,closed} JSONB shape as the production merchants.working_hours
--     column — see main app migrations 127_sprint18_market_getir_discovery.sql
--     and 189_merchant_working_hours_closed_day.sql — so an approved
--     application's hours can be copied into a real merchant/vet row as-is)
--   - petshop delivery neighborhoods (mahalle-level, since the production
--     merchants table only has radius-based delivery — no existing
--     neighborhood-list model to reuse, hence this new normalized column)
--   - an admin review trail (reviewed_at / rejection_reason), matching the
--     shape already used by public.merchant_applications in the main app
--
-- Safe to run multiple times. Does NOT drop or rename any existing column,
-- does NOT touch any other table, does NOT change RLS (still zero
-- anon/authenticated policies — only the service role reads/writes these
-- tables, from either petloogweb's API routes or petloog-admin).
--
-- working_hours changes type text -> jsonb. Any existing row's plain-text
-- value is preserved as a JSON string (via to_jsonb) rather than dropped;
-- there is no other consumer of this column in the codebase to break.

alter table public.petshop_applications
  alter column working_hours drop default,
  alter column working_hours type jsonb using
    case
      when working_hours is null or working_hours = '' then '{}'::jsonb
      else to_jsonb(working_hours)
    end,
  alter column working_hours set default '{}'::jsonb;

alter table public.veteriner_applications
  alter column working_hours drop default,
  alter column working_hours type jsonb using
    case
      when working_hours is null or working_hours = '' then '{}'::jsonb
      else to_jsonb(working_hours)
    end,
  alter column working_hours set default '{}'::jsonb;

alter table public.petshop_applications
  add column if not exists delivery_neighborhoods jsonb not null default '{}'::jsonb,
  add column if not exists reviewed_at timestamptz,
  add column if not exists rejection_reason text;

alter table public.veteriner_applications
  add column if not exists reviewed_at timestamptz,
  add column if not exists rejection_reason text;
