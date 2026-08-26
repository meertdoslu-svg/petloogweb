# PetLoog Corporate Website

Bağımsız kurumsal web sitesi. Mobil uygulamadan import edilmez.

## Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS 4
- Framer Motion
- React Hook Form + Zod
- Supabase

## Kurulum

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase

1. `supabase/schema.sql` dosyasını Supabase SQL editor’de çalıştırın.
2. `.env.local` içine URL ve anahtarları ekleyin.
3. RLS açıktır; yazma işlemleri service role ile sunucu tarafında yapılır.

## Scripts

- `npm run dev` — geliştirme
- `npm run build` — production build
- `npm run start` — production sunucu
- `npm run lint` — ESLint

## Sayfalar

- `/` Anasayfa (referans tasarım)
- `/hakkimizda`
- `/sistemlerimiz`
- `/moduller/[slug]`
- `/blog`, `/blog/[slug]`
- `/iletisim`
- `/kayit/veteriner`
- `/kayit/petshop`
- `/kvkk`, `/gizlilik`, `/cerez`
