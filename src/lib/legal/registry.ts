import fs from "node:fs";
import path from "node:path";

export type LegalSlug =
  | "kvkk"
  | "gizlilik"
  | "cerez"
  | "kullanim-kosullari"
  | "acik-riza"
  | "ai-politikasi"
  | "satici-sozlesmesi"
  | "veteriner-sozlesmesi"
  | "market-kurallari"
  | "pet-taksi"
  | "kasko"
  | "topluluk-kurallari"
  | "yuva-kurallari"
  | "hesap-silme"
  | "destek";

export type LegalDocument = {
  slug: LegalSlug;
  title: string;
  description: string;
  filename?: string;
  content: string;
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

const TAXI_CONTENT = buildFromSections(
  "PETLOOG PET TAKSİ HİZMET ŞARTLARI",
  "1.0",
  "Pet Taksi eşleştirme, taşıma talebi ve güvenlik kurallarını düzenler.",
  [
    {
      title: "Eşleştirme",
      body: "Platform talep ile sürücüyü buluşturur. Taşıma sözleşmesi kullanıcı ile sürücü arasındadır.",
    },
    {
      title: "Hayvan Güvenliği",
      body: "Uygun taşıma ekipmanı, tasma/kafes ve sakinleştirici ilaç kullanımı veteriner önerisine bağlıdır. Agresif veya hastalıklı hayvanlar için önceden bilgilendirme zorunludur.",
    },
    {
      title: "İptal ve Ücret",
      body: "İptal politikaları uygulama içinde gösterilir. Haksız iptal veya no-show durumunda kısıtlama uygulanabilir.",
    },
    {
      title: "Konum",
      body: "Konum paylaşımı taşıma güvenliği içindir. İzin verilmezse bazı özellikler çalışmayabilir.",
    },
  ],
);

const KASKO_CONTENT = buildFromSections(
  "PETLOOG KASKO KULLANIM ŞARTLARI",
  "1.0",
  "PetLoog Kasko / sağlık planı ürünlerinin kullanımına ilişkin genel şartlar. Plan özel şartları önceliklidir.",
  [
    {
      title: "Kapsam",
      body: "Teminat, limit, katılım payı ve bekleme süreleri seçilen plana göre değişir.",
    },
    {
      title: "Hariç Tutulanlar",
      body: "Plan belgesinde sayılan hastalıklar, ihmal veya bilerek verilen zararlar kapsam dışı olabilir.",
    },
    {
      title: "Hak Kullanımı",
      body: "Hak kullanımı anlaşmalı klinik veya uygulama içi süreçlerle yapılır. Sahte beyan geçersiz sayılır.",
    },
    {
      title: "İptal ve Yenileme",
      body: "İptal, yenileme ve iade koşulları plan ve ödeme yöntemine (mağaza / Iyzico) göre uygulanır.",
    },
  ],
);

const COMMUNITY_CONTENT = buildFromSections(
  "PETLOOG TOPLULUK KURALLARI",
  "1.0",
  "Mahalle, Yuva ve diğer topluluk alanlarında güvenli ve saygılı etkileşim için kurallar.",
  [
    {
      title: "Saygı ve Güvenlik",
      body: "Hakaret, nefret, tehdit, spam ve yanıltıcı içerik yasaktır. Hayvan refahı önceliklidir.",
    },
    {
      title: "İçerik",
      body: "Gerçekçi fotoğraf ve doğru konum bilgisi kullanın. Başkasının içeriğini izinsiz paylaşmayın.",
    },
    {
      title: "Moderasyon",
      body: "PetLoog uygunsuz içerikleri kaldırabilir, hesapları kısıtlayabilir veya yasal mercilere bildirebilir.",
    },
    {
      title: "Gizlilik",
      body: "Kişisel iletişim bilgilerini herkese açık paylaşmayın. Çocuk ve hassas konumlarda dikkatli olun.",
    },
  ],
);

const YUVA_CONTENT = buildFromSections(
  "PETLOOG YUVA KURALLARI",
  "1.0",
  "Yuva; sahiplendirme ilanları, başvurular ve klinik kaynaklı aktarımlar için PetLoog üzerindeki buluşma alanıdır. Bu kurallar hayvan refahını, doğru bilgilendirmeyi ve güvenli eşleştirmeyi esas alır.",
  [
    {
      title: "Amaç",
      body: "Yuva, sahipsiz veya yeni yuva arayan hayvanlar ile uygun adayları bir araya getirmek için tasarlanmıştır. PetLoog aracılık platformudur; sahiplik devri taraflar arasında gerçekleşir.",
    },
    {
      title: "İlan Kuralları",
      body: "- İlan sahibi doğru tür, yaş, sağlık ve mizaç bilgisi vermelidir.\n- Yanıltıcı fotoğraf, sahte konum veya ücretli “satış” kılığında sahiplendirme yasaktır.\n- Yasal olarak ticarete konu edilen hayvan satışları Yuva kapsamında değildir.",
    },
    {
      title: "Başvuru ve Değerlendirme",
      body: "- Başvuran kişi kimlik ve iletişim bilgilerini doğru beyan eder.\n- Yaşam alanı, deneyim ve bakım taahhüdü soruları gerçeğe uygun yanıtlanmalıdır.\n- İlan sahibi başvuruları reddedebilir; ayrımcı veya nefret içeren ret gerekçeleri yasaktır.",
    },
    {
      title: "Hayvan Refahı",
      body: "Hayvanın güvenliği, stresinin azaltılması ve uygun taşıma önceliklidir. Agresyon, bulaşıcı hastalık veya özel bakım ihtiyacı önceden açıklanmalıdır. İhmal veya kötü muamele şüphesinde PetLoog ilanı kaldırabilir ve hesabı kısıtlayabilir.",
    },
    {
      title: "Klinik Aktarımlar",
      body: "Veteriner kaynaklı Yuva aktarımlarında klinik kayıtların doğruluğu klinik sorumluluğundadır. Kullanıcı, aktarım sonrası bakım yükümlülüğünü kabul eder.",
    },
    {
      title: "Uyuşmazlık",
      body: "Sahiplendirme sonrası anlaşmazlıklarda PetLoog arabuluculuk yapmak zorunda değildir. Yasal merciler ve ilgili mevzuat saklıdır. Platform kurallarına aykırı davranışlarda hesap kısıtı uygulanabilir.",
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
    slug: "ai-politikasi",
    title: "AI Kullanım ve Sorumluluk Politikası",
    description: "PetLoog AI kullanım politikası.",
    filename: "AI_POLICY.md",
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
    slug: "pet-taksi",
    title: "Pet Taksi Hizmet Şartları",
    description: "Pet Taksi hizmet şartları.",
    inlineContent: TAXI_CONTENT,
  },
  {
    slug: "kasko",
    title: "Kasko Kullanım Şartları",
    description: "Pet Kasko kullanım şartları.",
    inlineContent: KASKO_CONTENT,
  },
  {
    slug: "topluluk-kurallari",
    title: "Topluluk Kuralları",
    description: "Mahalle Dostu topluluk kuralları.",
    inlineContent: COMMUNITY_CONTENT,
  },
  {
    slug: "yuva-kurallari",
    title: "Yuva Kuralları",
    description: "Yuva sahiplendirme kuralları.",
    inlineContent: YUVA_CONTENT,
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

export function listLegalDocuments(): LegalDocumentMeta[] {
  return LEGAL_ENTRIES.map(
    ({ filename, inlineContent, stripMarkdownHeadings, ...meta }) => {
      void filename;
      void inlineContent;
      void stripMarkdownHeadings;
      return meta;
    },
  );
}
