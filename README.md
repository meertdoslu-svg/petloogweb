# PetLoog web sitesi (petloog.com)

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Zod.
Barındırma: Vercel (GitHub `main` dalından).

## Kurulum

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Ortam değişkenleri

Bkz. `.env.example`. Ön kayıt formu için `RESEND_API_KEY` ve `RESEND_FROM`
gerekir (yalnızca sunucu tarafı; `NEXT_PUBLIC_` öneki KULLANMAYIN).

## Sayfalar (v1)

- `/` Ana sayfa · `/sahne` · `/hakkimizda` · `/blog`, `/blog/[slug]`
- `/isletmeler` Petshop ve veteriner ön kayıt (`?tur=petshop|veteriner`) → `/api/on-kayit` → e-posta (Resend), veritabanına yazmaz
- `/iletisim` · `/support` (App Store destek adresi; `/destek` ve `/help` aynı içerik)
- Yasal: `/privacy`, `/terms`, `/kvkk`, `/cerez`, `/yasal`, `/yasal/[slug]` (ör. `/yasal/hesap-silme`, `/yasal/sahne-kurallari`)

Eski konsept adresleri `next.config.ts` içinde 301 ile yönlendirilir.

## Komutlar

- `npm run dev` · `npm run build` · `npm run start` · `npm run lint`
