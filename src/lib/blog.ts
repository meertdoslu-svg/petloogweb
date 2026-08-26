import type { BlogPost } from "@/types";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "petloog-ekosistemi-nedir",
    title: "PetLoog Ekosistemi Nedir?",
    excerpt:
      "Mobil uygulama, veteriner paneli, pet market ve yapay zeka ile pet yaşamını tek çatı altında toplayan ekosistemi tanıyın.",
    content: `
## PetLoog neden doğdu?

Evcil hayvan sahipleri ve işletmeler için dağınık süreçleri tek platformda birleştirmek istedik.

## Neler sunuyoruz?

Mahalle Dostu, Yuva, Pet Market, AI, Kasko, Pet Taksi, Veteriner ve Admin sistemleri birlikte çalışır.

## Sonuç

PetLoog, pet yaşamını daha güvenli, daha şeffaf ve daha kolay hale getirir.
    `.trim(),
    category: "Kurumsal",
    tags: ["ekosistem", "mobil", "dijital"],
    author: "PetLoog Editör",
    publishedAt: "2026-03-12",
    coverImage: "/images/blog/ecosystem.svg",
    readingMinutes: 5,
  },
  {
    slug: "dijital-veteriner-hasta-takibi",
    title: "Dijital Veteriner Hasta Takibi Rehberi",
    excerpt:
      "Kliniklerde epikriz, aşı takvimi ve muhasebe süreçlerini dijitalleştirmenin pratik yolları.",
    content: `
## Dijital takibin faydaları

Kağıt karmaşasını azaltır, hasta geçmişine hızlı erişim sağlar.

## Epikriz standartları

Standart şablonlar klinik içi iletişimi hızlandırır.

## PetLoog entegrasyonu

Sahipler mobil uygulamadan randevu ve raporlara erişebilir.
    `.trim(),
    category: "Veteriner",
    tags: ["veteriner", "sağlık", "dijital"],
    author: "PetLoog Klinik",
    publishedAt: "2026-04-02",
    coverImage: "/images/blog/vet.svg",
    readingMinutes: 6,
  },
  {
    slug: "pet-market-stok-yonetimi",
    title: "Pet Market’te Stok Yönetimi İpuçları",
    excerpt:
      "Kritik stok uyarıları, kampanya planlama ve gelir takibi için işletme odaklı öneriler.",
    content: `
## Stok görünürlüğü

Hangi ürünün ne zaman tükeneceğini önceden bilin.

## Kampanya dengesi

İndirimleri stok devir hızına göre planlayın.

## PetLoog Market

Sipariş, stok ve gelir tek panelde birleşir.
    `.trim(),
    category: "Market",
    tags: ["market", "stok", "işletme"],
    author: "PetLoog Commerce",
    publishedAt: "2026-05-18",
    coverImage: "/images/blog/market.svg",
    readingMinutes: 4,
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 2) {
  const current = getPost(slug);
  if (!current) return BLOG_POSTS.slice(0, limit);
  return BLOG_POSTS.filter(
    (p) =>
      p.slug !== slug &&
      (p.category === current.category ||
        p.tags.some((t) => current.tags.includes(t))),
  ).slice(0, limit);
}
