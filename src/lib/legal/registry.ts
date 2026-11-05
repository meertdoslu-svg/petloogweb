import fs from "node:fs";
import path from "node:path";

export type LegalSlug =
  | "kvkk"
  | "gizlilik"
  | "cerez"
  | "kullanim-kosullari"
  | "acik-riza"
  | "satici-sozlesmesi"
  | "veteriner-sozlesmesi"
  | "market-kurallari"
  | "kasko"
  | "sahne-kurallari"
  | "hesap-silme"
  | "destek";

export type LegalDocument = {
  slug: LegalSlug;
  title: string;
  description: string;
  filename?: string;
  content: string;
  /** Kept reachable at its URL but not listed, not in sitemap, noindex. */
  unlisted?: boolean;
};

export type LegalDocumentMeta = Omit<LegalDocument, "content">;

const LEGAL_DIR = path.join(process.cwd(), "src/content/legal");
const contentCache = new Map<string, string>();

function readMd(filename: string): string {
  const cached = contentCache.get(filename);
  if (cached) return cached;
  const content = fs.readFileSync(path.join(LEGAL_DIR, filename), "utf8");
  contentCache.set(filename, content);
  return content;
}

function buildFromSections(
  title: string,
  version: string,
  intro: string,
  sections: { title: string; body: string }[],
): string {
  const body = sections
    .map((section, index) => `${index + 1}. ${section.title}\n\n${section.body}`)
    .join("\n\n");
  return `${title}\nSürüm ${version}\n\n${intro}\n\n${body}\n`;
}

const MARKET_CONTENT = buildFromSections(
  "PETLOOG MARKET KURALLARI",
  "1.0",
  "PetLoog Market üzerinden ürün listeleme, sipariş, ödeme ve teslimat süreçlerine ilişkin kurallar.",
  [
    {
      title: "Taraflar",
      body: "Alıcı kullanıcı ile satıcı / mağaza arasındadır. PetLoog aracı platform hizmeti sunar.",
    },
    {
      title: "Ürün Bilgisi",
      body: "Fiyat, stok, içerik ve görseller satıcının sorumluluğundadır. Yanıltıcı ilanlar kaldırılabilir.",
    },
    {
      title: "Ödeme ve İade",
      body: "Ödemeler yetkili ödeme altyapısı üzerinden alınır. Cayma ve iade; mesafeli satış mevzuatı ile satıcı politikalarına tabidir.",
    },
    {
      title: "Teslimat",
      body: "Teslimat yöntemi ve süresi sipariş sırasında belirtilir. Adres doğruluğu alıcının sorumluluğundadır.",
    },
  ],
);

const ACCOUNT_DELETION_CONTENT = buildFromSections(
  "PETLOOG HESAP SİLME POLİTİKASI",
  "1.0",
  "PetLoog hesabınızın silinmesi ve verilerinizin akıbetine ilişkin bilgilendirme.",
  [
    {
      title: "Talep Yöntemi",
      body: "Hesap silme talebi uygulama içi Profil > Hesabımı Sil veya Destek Merkezi üzerinden iletilebilir.",
    },
    {
      title: "Silinen Veriler",
      body: "Profil, evcil hayvan kayıtları (yasal saklama hariç), mesajlaşma ve tercih verileri silinir veya anonimleştirilir.",
    },
    {
      title: "Saklanan Veriler",
      body: "Mevzuat gereği fatura, sözleşme, audit log ve güvenlik kayıtları yasal süre boyunca saklanabilir.",
    },
    {
      title: "İş Ortaklığı Hesapları",
      body: "Veteriner ve satıcı hesaplarında aktif sözleşme veya bekleyen işlem varsa silme, süreç tamamlandıktan sonra gerçekleştirilir.",
    },
  ],
);

// Skeleton only — the legal text will be supplied by counsel. Section
// headings are placeholders for structure; do not treat as legal content.
const SAHNE_RULES_SKELETON = buildFromSections(
  "PETLOOG SAHNE KURALLARI",
  "taslak",
  "Bu sayfanın metni hazırlanıyor.",
  [
    { title: "Kapsam", body: "[Metin hazırlanıyor]" },
    { title: "Katılım", body: "[Metin hazırlanıyor]" },
    { title: "Fotoğraf ve içerik kuralları", body: "[Metin hazırlanıyor]" },
    { title: "Oylama ve Sahnenin yıldızı", body: "[Metin hazırlanıyor]" },
    { title: "Paylaşım ve hikâye kartı", body: "[Metin hazırlanıyor]" },
    { title: "İçeriğin kaldırılması", body: "[Metin hazırlanıyor]" },
    { title: "İletişim", body: "[Metin hazırlanıyor]" },
  ],
);

type LegalEntry = LegalDocumentMeta & {
  filename?: string;
  inlineContent?: string;
  /**
   * Strip Markdown ATX heading markers (`#`, `##`, …) from a file-backed
   * document. The canonical mobile export uses `## N. Başlık` headings, while
   * LegalDocumentView keys headings off the `N. ` numeric prefix; removing the
   * markers changes no words of the legal text.
   */
  stripMarkdownHeadings?: boolean;
};

const LEGAL_ENTRIES: LegalEntry[] = [
  {
    slug: "kvkk",
    title: "KVKK Aydınlatma Metni",
    description: "6698 sayılı KVKK kapsamında aydınlatma metni.",
    filename: "KVKK_AYDINLATMA.md",
  },
  {
    slug: "gizlilik",
    title: "Gizlilik Politikası",
    description:
      "PetLoog Gizlilik Politikası — kişisel verilerin toplanması, kullanılması, paylaşılması, saklanması, kullanıcı hakları ve hesap silme süreçleri.",
    filename: "PRIVACY_POLICY.md",
  },
  {
    slug: "cerez",
    title: "Çerez Politikası",
    description: "PetLoog çerez politikası.",
    filename: "COOKIE_POLICY.md",
  },
  {
    slug: "kullanim-kosullari",
    title: "Kullanım Koşulları",
    description: "PetLoog kullanım koşulları.",
    filename: "TERMS_OF_SERVICE_V1_1.md",
    stripMarkdownHeadings: true,
  },
  {
    slug: "acik-riza",
    title: "Açık Rıza Metni",
    description: "PetLoog açık rıza metni.",
    filename: "CONSENT.md",
  },
  {
    slug: "satici-sozlesmesi",
    title: "Satıcı Hizmet Sözleşmesi",
    description: "PetShop / satıcı hizmet sözleşmesi.",
    filename: "SELLER_AGREEMENT.md",
  },
  {
    slug: "veteriner-sozlesmesi",
    title: "Veteriner Hizmet Sözleşmesi",
    description: "Veteriner klinik hizmet sözleşmesi.",
    filename: "VET_AGREEMENT.md",
  },
  {
    slug: "destek",
    title: "Destek ve İletişim",
    description: "PetLoog destek merkezi bilgileri.",
    filename: "SUPPORT.md",
  },
  {
    slug: "market-kurallari",
    title: "Market Kuralları",
    description: "PetLoog Market kuralları.",
    inlineContent: MARKET_CONTENT,
  },
  {
    // Slug kept as "kasko" for URL/backward compatibility; the document is
    // now PetGüvence (Veteriner Sağlık Planı) — a veterinary membership, not
    // an insurance product.
    slug: "kasko",
    title: "PetGüvence Kullanım Şartları",
    description: "PetGüvence (veteriner sağlık/hizmet üyeliği) kullanım şartları.",
    filename: "PETGUVENCE_TERMS_V1_1.md",
    stripMarkdownHeadings: true,
    // PetGüvence is not part of v1. Unlisted + noindex instead of removed,
    // because users of the old Android build may still hold a plan — the
    // decision about that build is pending. Remove once it is retired.
    unlisted: true,
  },
  {
    slug: "sahne-kurallari",
    title: "Sahne kuralları",
    description: "PetLoog Sahne özelliğine katılım kuralları.",
    inlineContent: SAHNE_RULES_SKELETON,
  },
  {
    slug: "hesap-silme",
    title: "Hesap Silme Politikası",
    description: "Hesap silme ve veri saklama politikası.",
    inlineContent: ACCOUNT_DELETION_CONTENT,
  },
];

function resolveContent(entry: LegalEntry): string {
  if (entry.inlineContent) return entry.inlineContent;
  if (!entry.filename) return "";
  const raw = readMd(entry.filename);
  return entry.stripMarkdownHeadings
    ? raw.replace(/^#{1,6}[ \t]+/gm, "")
    : raw;
}

export function getLegalDocument(slug: string): LegalDocument | undefined {
  const entry = LEGAL_ENTRIES.find((doc) => doc.slug === slug);
  if (!entry) return undefined;
  const { filename, inlineContent, stripMarkdownHeadings, ...meta } = entry;
  void filename;
  void inlineContent;
  void stripMarkdownHeadings;
  return {
    ...meta,
    content: resolveContent(entry),
  };
}

export function listLegalDocuments(
  { includeUnlisted = false }: { includeUnlisted?: boolean } = {},
): LegalDocumentMeta[] {
  return LEGAL_ENTRIES.filter((e) => includeUnlisted || !e.unlisted).map(
    ({ filename, inlineContent, stripMarkdownHeadings, ...meta }) => {
      void filename;
      void inlineContent;
      void stripMarkdownHeadings;
      return meta;
    },
  );
}
