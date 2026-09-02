-- PetLoog corporate website — additive migration
--
-- Adds an admin review workflow to contact_messages (new/read/replied),
-- matching the same status/timestamp pattern already used by
-- petshop_applications / veteriner_applications. Does not touch existing
-- columns, does not change RLS (still zero anon/authenticated policies —
-- only the service role reads/writes this table).

alter table public.contact_messages
  add column if not exists status text not null default 'new',
  add column if not exists read_at timestamptz,
  add column if not exists replied_at timestamptz;
