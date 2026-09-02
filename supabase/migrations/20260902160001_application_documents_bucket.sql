-- PetLoog corporate website — additive migration
-- Creates the PRIVATE storage bucket used for veterinarian/petshop
-- application documents (tax certificate, signature circular, license,
-- diploma proof, shop photos, etc.).
--
-- Safe to run multiple times (idempotent). This migration does NOT:
--   - modify any existing table (contact_messages, veteriner_applications,
--     petshop_applications, audit_logs) or its RLS policies
--   - delete or touch any existing storage object
--   - make the bucket public
--   - add any anon/authenticated storage policy
--
-- All access to this bucket happens exclusively through trusted
-- server-side code (src/app/api/applications/veteriner/route.ts and
-- .../petshop/route.ts) using SUPABASE_SERVICE_ROLE_KEY, which bypasses
-- Row Level Security entirely. storage.objects has Row Level Security
-- enabled by default on every Supabase project and cannot be disabled, so
-- with no policies defined here, anon/authenticated clients have zero
-- access to this bucket's contents — only the service role (server-only,
-- never exposed to the browser) can read or write. Later admin tooling
-- that needs to display a document should generate a short-lived signed
-- URL server-side (supabase.storage.from('application-documents')
-- .createSignedUrl(path, expiresInSeconds)) rather than persisting any
-- public/long-lived URL.

insert into storage.buckets (id, name, public)
values ('application-documents', 'application-documents', false)
on conflict (id) do update set public = false;
