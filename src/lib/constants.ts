// Canonical production domain is the apex (no "www"). NEXT_PUBLIC_SITE_URL
// can override this per-environment; the safe fallback is always the apex
// domain so a missing env var never regresses to a non-canonical host.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://petloog.com";

export const SITE = {
  name: "PetLoog",
  slogan: "Mahallendeki pati dünyası",
  description:
    "Mahalle petshop'undan kapıda ödemeli alışveriş, şu an açık veteriner, mama hatırlatması, pati dostu mekanlar ve her gün yeni bir Sahne. Hepsi PetLoog'da.",
  url: SITE_URL,
  // General public contact address — footer, /iletisim, /support and the
  // Organization JSON-LD all read this one value. Legal-notice contexts
  // (KVKK requests, account deletion fallback) keep legal@petloog.com,
  // hardcoded in the legal texts on purpose.
  email: "info@petloog.com",
  legalEmail: "legal@petloog.com",
} as const;

// App Store listing isn't public yet → always "Yakında".
// Google Play link was removed on purpose (decision about the old Android
// build is pending) → also "Yakında". Add a verified listing URL here and
// flip the flag only when a real public listing exists.
export const STORE_LINKS = {
  appStore: { label: "App Store", href: null as string | null },
  googlePlay: { label: "Google Play", href: null as string | null },
} as const;

// Verified public PetLoog social accounts only.
export const SOCIAL_LINKS: {
  instagram?: string;
} = {
  instagram: "https://www.instagram.com/petloogapp/",
};

export const NAV_LINKS = [
  { href: "/", label: "Ana sayfa" },
  { href: "/sahne", label: "Sahne" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/blog", label: "Blog" },
  { href: "/isletmeler", label: "İşletmeler için" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export const FOOTER_LINKS = {
  petloog: [
    { href: "/sahne", label: "Sahne" },
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/blog", label: "Blog" },
    { href: "/isletmeler", label: "Petshop ve veterinerler için" },
  ],
  yardim: [
    { href: "/support", label: "Destek" },
    { href: "/iletisim", label: "İletişim" },
    { href: "/yasal/hesap-silme", label: "Hesap silme" },
  ],
  yasal: [
    { href: "/privacy", label: "Gizlilik politikası" },
    { href: "/terms", label: "Kullanım koşulları" },
    { href: "/kvkk", label: "KVKK aydınlatma metni" },
    { href: "/cerez", label: "Çerez politikası" },
    { href: "/yasal/sahne-kurallari", label: "Sahne kuralları" },
    { href: "/yasal", label: "Tüm yasal metinler" },
  ],
} as const;
