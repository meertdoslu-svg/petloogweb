-- PetLoog corporate website — additive migration
--
-- Creates public.blog_posts so the Blog section can be authored from
-- PetLoog Admin instead of the hardcoded array in src/lib/blog.ts (which is
-- left in place, unmodified, as a fallback + historical reference — see
-- that file's comments).
--
-- category / tags / reading_minutes are additive beyond the originally
-- proposed column list: the existing blog UI (category filter chips, tag
-- badges, reading-time label) already depends on them, and dropping them
-- would visibly break that working design.
--
-- RLS: public visitors (anon/authenticated) may only ever SELECT rows with
-- status = 'published' — drafts are invisible to anyone without the
-- service role, both at the app-query level and at the database level.
-- No anon/authenticated insert/update/delete policy exists — only the
-- service role (server-only) can write, matching every other table here.

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

alter table public.blog_posts enable row level security;

drop policy if exists "public read published blog posts" on public.blog_posts;
create policy "public read published blog posts"
  on public.blog_posts
  for select
  to public
  using (status = 'published');

-- Public bucket: cover/content images must be viewable by anyone via a
-- plain URL (no signed URLs needed for marketing images), but the bucket
-- being public only affects the object-serving GET path — RLS on
-- storage.objects still applies to writes, and with no anon/authenticated
-- policy defined, only the service role can upload/replace/delete here.
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = true;

-- Seed: carry the 3 existing hardcoded posts (src/lib/blog.ts) over as
-- already-published rows, preserving slug (and therefore every existing
-- /blog/<slug> URL) and content verbatim. Idempotent — safe to re-run.
insert into public.blog_posts
  (slug, title, excerpt, content, category, tags, reading_minutes, status, author_name, published_at)
values
  (
    'petloog-ekosistemi-nedir',
    'PetLoog Ekosistemi Nedir?',
    'Mobil uygulama, veteriner paneli, pet market ve yapay zeka ile pet yaşamını tek çatı altında toplayan ekosistemi tanıyın.',
    E'## PetLoog neden doğdu?\n\nEvcil hayvan sahipleri ve işletmeler için dağınık süreçleri tek platformda birleştirmek istedik.\n\n## Neler sunuyoruz?\n\nMahalle Dostu, Yuva, Pet Market, AI, Kasko, Pet Taksi, Veteriner ve Admin sistemleri birlikte çalışır.\n\n## Sonuç\n\nPetLoog, pet yaşamını daha güvenli, daha şeffaf ve daha kolay hale getirir.',
    'Kurumsal',
    array['ekosistem', 'mobil', 'dijital'],
    5,
    'published',
    'PetLoog Editör',
    '2026-03-12T00:00:00Z'
  ),
  (
    'dijital-veteriner-hasta-takibi',
    'Dijital Veteriner Hasta Takibi Rehberi',
    'Kliniklerde epikriz, aşı takvimi ve muhasebe süreçlerini dijitalleştirmenin pratik yolları.',
    E'## Dijital takibin faydaları\n\nKağıt karmaşasını azaltır, hasta geçmişine hızlı erişim sağlar.\n\n## Epikriz standartları\n\nStandart şablonlar klinik içi iletişimi hızlandırır.\n\n## PetLoog entegrasyonu\n\nSahipler mobil uygulamadan randevu ve raporlara erişebilir.',
    'Veteriner',
    array['veteriner', 'sağlık', 'dijital'],
    6,
    'published',
    'PetLoog Klinik',
    '2026-04-02T00:00:00Z'
  ),
  (
    'pet-market-stok-yonetimi',
    'Pet Market’te Stok Yönetimi İpuçları',
    'Kritik stok uyarıları, kampanya planlama ve gelir takibi için işletme odaklı öneriler.',
    E'## Stok görünürlüğü\n\nHangi ürünün ne zaman tükeneceğini önceden bilin.\n\n## Kampanya dengesi\n\nİndirimleri stok devir hızına göre planlayın.\n\n## PetLoog Market\n\nSipariş, stok ve gelir tek panelde birleşir.',
    'Market',
    array['market', 'stok', 'işletme'],
    4,
    'published',
    'PetLoog Commerce',
    '2026-05-18T00:00:00Z'
  )
on conflict (slug) do nothing;
