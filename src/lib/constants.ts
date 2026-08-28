// Canonical production domain is the apex (no "www"). NEXT_PUBLIC_SITE_URL
// can override this per-environment; the safe fallback is always the apex
// domain so a missing env var never regresses to a non-canonical host.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://petloog.com";

export const SITE = {
  name: "PetLoog",
  tagline: "PATİ EKOSİSTEMİ",
  slogan: "Evcil dostunuz için tek platform.",
  url: SITE_URL,
  email: "info@petloog.com",
  phone: "+90 850 000 00 00",
  whatsapp: "908500000000",
  address: "İstanbul, Türkiye",
  social: {
    instagram: "https://instagram.com/petloog",
    facebook: "https://facebook.com/petloog",
    x: "https://x.com/petloog",
    youtube: "https://youtube.com/@petloog",
  },
  appStore: "https://apps.apple.com/app/petloog",
  googlePlay: "https://play.google.com/store/apps/details?id=com.petloog",
} as const;

// The configured appStore URL is missing the numeric "/idNNNNNNNNNN" segment
// every real App Store listing has, and support docs describe the app as
// still in closed beta — so it isn't a verified public listing. Flip this
// to true (and fix SITE.appStore above) once a real App Store URL exists.
// Never render appStore as a working download link while this is false.
export const APP_STORE_LINK_VERIFIED = false as const;

export const NAV_LINKS = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/sistemlerimiz", label: "Sistemlerimiz" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
] as const;

export const FOOTER_LINKS = {
  kurumsal: [
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/sistemlerimiz", label: "Sistemlerimiz" },
    { href: "/blog", label: "Blog" },
    { href: "/iletisim", label: "İletişim" },
  ],
  yasal: [
    { href: "/privacy", label: "Gizlilik Politikası" },
    { href: "/terms", label: "Kullanım Koşulları" },
    { href: "/kvkk", label: "KVKK" },
    { href: "/support", label: "Destek" },
    { href: "/help", label: "Yardım" },
    { href: "/yasal", label: "Yasal Merkez" },
    { href: "/cerez", label: "Çerez Politikası" },
    { href: "/yasal/veteriner-sozlesmesi", label: "Veteriner Sözleşmesi" },
    { href: "/yasal/satici-sozlesmesi", label: "Satıcı Sözleşmesi" },
    { href: "/yasal/hesap-silme", label: "Hesap Silme" },
  ],
  kayit: [
    { href: "/kayit/veteriner", label: "Veteriner Kaydı" },
    { href: "/kayit/petshop", label: "PetShop Kaydı" },
  ],
} as const;

export const FEATURES_BAR = [
  { id: "cities", label: "81 İl Hedefi", icon: "globe" },
  { id: "ai", label: "Yapay Zeka Destekli", icon: "cpu" },
  { id: "health", label: "Dijital Sağlık Dosyası", icon: "folder" },
  { id: "neighborhood", label: "Mahalle Dostu", icon: "home" },
  { id: "insurance", label: "Pet Kasko", icon: "shield" },
] as const;

export type SliderCard = {
  id: string;
  title: string;
  features: string[];
  href: string;
  icon: "paw" | "stethoscope" | "cart" | "taxi" | "shield" | "home" | "ai";
  image: string;
  imageAlt: string;
  accent?: string;
};

export const SLIDER_CARDS: SliderCard[] = [
  {
    id: "mobil",
    title: "PetLoog Mobil Uygulaması",
    features: ["Mahalle Dostu", "PetLoog AI", "Pet Kasko", "Sahiplendirme"],
    href: "/moduller/mobil",
    icon: "paw",
    image: "/images/slider/mobil.svg",
    imageAlt: "PetLoog mobil uygulaması ve evcil hayvanlar",
  },
  {
    id: "veteriner",
    title: "Veteriner Sistemi",
    features: [
      "Dijital Hasta Takibi",
      "İhale Sistemi",
      "Epikriz Raporları",
      "Şeffaf Muhasebe",
    ],
    href: "/moduller/veteriner",
    icon: "stethoscope",
    image: "/images/slider/veteriner.svg",
    imageAlt: "Veteriner hekim ve evcil hayvan",
  },
  {
    id: "market",
    title: "Pet Market Sistemi",
    features: ["Sipariş Yönetimi", "Kampanyalar", "Gelir Takibi", "Stok Yönetimi"],
    href: "/moduller/pet-market",
    icon: "cart",
    image: "/images/slider/market.svg",
    imageAlt: "Pet market ürünleri",
  },
  {
    id: "taksi",
    title: "Pet Taksi",
    features: [
      "Güvenli Taşıma",
      "Canlı Takip",
      "Sigortalı Sürücüler",
      "Anlık Randevu",
    ],
    href: "/moduller/pet-taksi",
    icon: "taxi",
    image: "/images/slider/taksi.svg",
    imageAlt: "Pet taksi hizmeti",
  },
  {
    id: "kasko",
    title: "Pet Kasko",
    features: [
      "Kapsamlı Koruma",
      "Hızlı Hasar Süreci",
      "7/24 Destek",
      "Dijital Poliçe",
    ],
    href: "/moduller/kasko",
    icon: "shield",
    image: "/images/slider/kasko.svg",
    imageAlt: "Pet kasko koruması",
  },
  {
    id: "mahalle",
    title: "Mahalle Dostu",
    features: [
      "Yerel Topluluk",
      "Komşu Desteği",
      "Kayıp İlanları",
      "Etkinlikler",
    ],
    href: "/moduller/mahalle-dostu",
    icon: "home",
    image: "/images/slider/mahalle.svg",
    imageAlt: "Mahalle dostu topluluğu",
  },
  {
    id: "ai",
    title: "PetLoog AI",
    features: [
      "Akıllı Öneriler",
      "Sağlık Analizi",
      "Davranış Asistanı",
      "7/24 Chatbot",
    ],
    href: "/moduller/ai",
    icon: "ai",
    image: "/images/slider/ai.svg",
    imageAlt: "PetLoog yapay zeka",
  },
];

export type ModulePage = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  features: { title: string; description: string }[];
  advantages: string[];
  faqs: { q: string; a: string }[];
  ctaHref: string;
  ctaLabel: string;
};

export const MODULES: ModulePage[] = [
  {
    slug: "mobil",
    title: "PetLoog Mobil Uygulaması",
    shortTitle: "PetLoog Mobil",
    description:
      "Evcil dostunuzun tüm ihtiyaçlarını tek uygulamada yönetin. Sağlık, market, taksi, kasko ve mahalle topluluğu bir arada.",
    features: [
      {
        title: "Tek Hesap",
        description: "Tüm PetLoog hizmetlerine tek hesap ile erişin.",
      },
      {
        title: "Dijital Pet Profili",
        description: "Aşı, muayene ve hatırlatmaları tek ekranda takip edin.",
      },
      {
        title: "Akıllı Bildirimler",
        description: "Önemli hatırlatmalar ve kampanyalar anında gelsin.",
      },
      {
        title: "Güvenli Ödeme",
        description: "Market, kasko ve hizmet ödemelerini güvenle yapın.",
      },
    ],
    advantages: [
      "iOS ve Android desteği",
      "Offline görüntüleme",
      "Çoklu pet profili",
      "Konum bazlı hizmetler",
    ],
    faqs: [
      {
        q: "Uygulama ücretsiz mi?",
        a: "Evet, PetLoog mobil uygulamasını App Store ve Google Play’den ücretsiz indirebilirsiniz.",
      },
      {
        q: "Birden fazla pet ekleyebilir miyim?",
        a: "Evet, hesabınıza birden fazla evcil hayvan profili ekleyebilirsiniz.",
      },
    ],
    ctaHref: SITE.appStore,
    ctaLabel: "Uygulamayı İndir",
  },
  {
    slug: "ai",
    title: "PetLoog AI",
    shortTitle: "PetLoog AI",
    description:
      "Yapay zeka destekli asistan ile pet sağlığı, beslenme ve davranış konularında anında destek alın.",
    features: [
      {
        title: "Sağlık Asistanı",
        description: "Belirtileri analiz ederek yönlendirme önerileri sunar.",
      },
      {
        title: "Beslenme Önerileri",
        description: "Yaş, ırk ve aktiviteye göre kişiselleştirilmiş öneriler.",
      },
      {
        title: "Davranış Rehberi",
        description: "Eğitim ve davranış sorunlarında adım adım yardım.",
      },
      {
        title: "7/24 Chat",
        description: "Günün her saati sorularınıza yanıt alın.",
      },
    ],
    advantages: [
      "Veteriner yönlendirmesi",
      "Türkçe doğal dil desteği",
      "Gizlilik odaklı mimari",
      "Sürekli öğrenen modeller",
    ],
    faqs: [
      {
        q: "AI veteriner yerine geçer mi?",
        a: "Hayır. PetLoog AI bilgilendirme amaçlıdır; teşhis ve tedavi için veteriner hekime başvurun.",
      },
    ],
    ctaHref: "/moduller/mobil",
    ctaLabel: "Mobilde Keşfet",
  },
  {
    slug: "pet-market",
    title: "Pet Market Sistemi",
    shortTitle: "Pet Market",
    description:
      "Pet shop’lar için sipariş, stok, kampanya ve gelir yönetimini tek panelde birleştiren profesyonel market sistemi.",
    features: [
      {
        title: "Sipariş Yönetimi",
        description: "Gelen siparişleri anlık takip edin ve durum güncelleyin.",
      },
      {
        title: "Stok Takibi",
        description: "Kritik stok uyarıları ile ürünlerinizi yönetin.",
      },
      {
        title: "Kampanyalar",
        description: "İndirim ve paket kampanyalarını kolayca oluşturun.",
      },
      {
        title: "Gelir Raporları",
        description: "Satış performansınızı şeffaf panellerle izleyin.",
      },
    ],
    advantages: [
      "Mobil entegrasyon",
      "Teslimat bölgesi yönetimi",
      "Çoklu mağaza desteği",
      "KDV uyumlu faturalama",
    ],
    faqs: [
      {
        q: "PetShop kaydı nasıl yapılır?",
        a: "PetShop kayıt formunu doldurarak başvurabilirsiniz. Başvurunuz admin onayından sonra aktifleşir.",
      },
    ],
    ctaHref: "/kayit/petshop",
    ctaLabel: "Market Kaydı Başlat",
  },
  {
    slug: "veteriner",
    title: "Veteriner Sistemi",
    shortTitle: "Veteriner",
    description:
      "Klinikler için dijital hasta takibi, epikriz, ihale ve muhasebe süreçlerini sadeleştiren kapsamlı veteriner paneli.",
    features: [
      {
        title: "Dijital Hasta Takibi",
        description: "Muayene geçmişi ve aşı takvimini dijitalleştirin.",
      },
      {
        title: "Epikriz Raporları",
        description: "Standart epikriz şablonlarıyla hızlı rapor üretin.",
      },
      {
        title: "İhale Sistemi",
        description: "Klinik ihtiyaçlarınız için şeffaf tedarik süreçleri.",
      },
      {
        title: "Şeffaf Muhasebe",
        description: "Gelir-gider ve tahsilatları tek ekrandan yönetin.",
      },
    ],
    advantages: [
      "Hasta mobil erişimi",
      "Randevu yönetimi",
      "Belge arşivi",
      "Çoklu klinik desteği",
    ],
    faqs: [
      {
        q: "Klinik kaydı ne kadar sürer?",
        a: "Başvuru sonrası admin incelemesi genellikle 1–3 iş günü içinde tamamlanır.",
      },
    ],
    ctaHref: "/kayit/veteriner",
    ctaLabel: "Veteriner Kaydı Başlat",
  },
  {
    slug: "pet-taksi",
    title: "Pet Taksi",
    shortTitle: "Pet Taksi",
    description:
      "Evcil hayvanlar için güvenli, izlenebilir ve sigortalı taşıma hizmeti.",
    features: [
      {
        title: "Canlı Konum",
        description: "Yolculuğu anlık harita üzerinden takip edin.",
      },
      {
        title: "Güvenli Kabin",
        description: "Pet dostu araç ve ekipman standartları.",
      },
      {
        title: "Sigortalı Sürücü",
        description: "Onaylı sürücü ağı ile güvenli taşıma.",
      },
      {
        title: "Anlık Randevu",
        description: "İhtiyacınıza göre hemen veya ileri tarihli çağrı.",
      },
    ],
    advantages: [
      "Veteriner / market entegrasyonu",
      "Fiyat şeffaflığı",
      "Değerlendirme sistemi",
      "Gece hizmeti",
    ],
    faqs: [
      {
        q: "Hangi şehirlerde aktif?",
        a: "Pet Taksi önce büyük şehirlerde açılır; 81 il hedefine kademeli olarak genişler.",
      },
    ],
    ctaHref: "/moduller/mobil",
    ctaLabel: "Uygulamadan Çağır",
  },
  {
    slug: "mahalle-dostu",
    title: "Mahalle Dostu",
    shortTitle: "Mahalle Dostu",
    description:
      "Komşularınızla pet dostu bir topluluk kurun: kayıp ilanları, yardımlaşma ve yerel etkinlikler.",
    features: [
      {
        title: "Yerel Ağ",
        description: "Mahallenizdeki pet sahipleriyle bağlantı kurun.",
      },
      {
        title: "Kayıp İlanları",
        description: "Kayıp pet duyurularını hızlıca paylaşın.",
      },
      {
        title: "Yardımlaşma",
        description: "Bakım, yürüyüş ve acil destek talepleri oluşturun.",
      },
      {
        title: "Etkinlikler",
        description: "Yerel buluşma ve etkinlikleri keşfedin.",
      },
    ],
    advantages: [
      "Konum bazlı akış",
      "Güvenli mesajlaşma",
      "Moderasyon",
      "Anonim seçenekler",
    ],
    faqs: [
      {
        q: "Mahalle Dostu ücretsiz mi?",
        a: "Temel topluluk özellikleri ücretsizdir.",
      },
    ],
    ctaHref: "/moduller/mobil",
    ctaLabel: "Topluluğa Katıl",
  },
  {
    slug: "yuva",
    title: "Yuva",
    shortTitle: "Yuva",
    description:
      "Sahiplendirme ve yuva bulma süreçlerini güvenli, şeffaf ve izlenebilir hale getiren PetLoog modülü.",
    features: [
      {
        title: "Sahiplendirme İlanları",
        description: "Detaylı pet profilleri ile doğru eşleşmeler.",
      },
      {
        title: "Başvuru Takibi",
        description: "Sahiplendirme başvurularını adım adım yönetin.",
      },
      {
        title: "Güven Skoru",
        description: "Doğrulanmış kullanıcılarla daha güvenli süreç.",
      },
      {
        title: "Takip Sonrası",
        description: "Yuva sonrası kontrol ve destek hatırlatmaları.",
      },
    ],
    advantages: [
      "Barınak entegrasyonu",
      "Belge doğrulama",
      "Coğrafi filtreleme",
      "Gönüllü ağı",
    ],
    faqs: [
      {
        q: "Ücretli saiplendirme yasak mı?",
        a: "Yuva modülü etik saiplendirme ilkelerini destekler; uygunsuz ilanlar denetlenir.",
      },
    ],
    ctaHref: "/moduller/mobil",
    ctaLabel: "Yuva’yı Keşfet",
  },
  {
    slug: "kasko",
    title: "Pet Kasko",
    shortTitle: "Pet Kasko",
    description:
      "Evcil dostunuz için dijital poliçe, hızlı hasar süreci ve 7/24 destek sunan kasko çözümü.",
    features: [
      {
        title: "Dijital Poliçe",
        description: "Poliçenizi mobil uygulamadan anında görüntüleyin.",
      },
      {
        title: "Hızlı Hasar",
        description: "Hasar bildirimi ve takip süreci dijitalleşir.",
      },
      {
        title: "Kapsam Seçenekleri",
        description: "İhtiyacınıza göre paketler arasından seçim yapın.",
      },
      {
        title: "7/24 Destek",
        description: "Acil durumlarda destek hattına hızlı erişim.",
      },
    ],
    advantages: [
      "Veteriner ağı entegrasyonu",
      "Şeffaf teminatlar",
      "Online ödeme",
      "Yenileme hatırlatmaları",
    ],
    faqs: [
      {
        q: "Hangi riskler kapsanır?",
        a: "Paketlere göre kaza, hastalık ve ek teminat seçenekleri değişir. Detaylar poliçede yer alır.",
      },
    ],
    ctaHref: "/moduller/mobil",
    ctaLabel: "Kasko Paketlerini Gör",
  },
  {
    slug: "admin",
    title: "Admin Paneli",
    shortTitle: "Admin",
    description:
      "PetLoog ekosistemini yönetmek için operasyon, onay, denetim ve raporlama paneli.",
    features: [
      {
        title: "Başvuru Onayları",
        description: "Veteriner ve PetShop başvurularını inceleyin.",
      },
      {
        title: "Kullanıcı Yönetimi",
        description: "Roller, yetkiler ve hesap durumlarını yönetin.",
      },
      {
        title: "Audit Log",
        description: "Kritik işlemleri izlenebilir kayıtlarla takip edin.",
      },
      {
        title: "Raporlama",
        description: "Büyüme, işlem ve performans metriklerini görün.",
      },
    ],
    advantages: [
      "Rol tabanlı erişim",
      "RLS uyumlu mimari",
      "Güvenlik denetimleri",
      "Çoklu ortam desteği",
    ],
    faqs: [
      {
        q: "Admin paneline kimler erişir?",
        a: "Yalnızca yetkilendirilmiş PetLoog operasyon ekibi erişebilir.",
      },
    ],
    ctaHref: "/iletisim",
    ctaLabel: "İletişime Geç",
  },
  {
    slug: "petshop",
    title: "PetShop Yönetimi",
    shortTitle: "PetShop",
    description:
      "Pet shop işletmeleri için mağaza profili, ürün kataloğu, teslimat ve belge yönetimi.",
    features: [
      {
        title: "Mağaza Profili",
        description: "Logo, kapak, kategori ve çalışma saatlerini yönetin.",
      },
      {
        title: "Ürün Kataloğu",
        description: "Ürünlerinizi kategorilere ayırarak yayınlayın.",
      },
      {
        title: "Teslimat Bölgeleri",
        description: "Hizmet verdiğiniz bölgeleri tanımlayın.",
      },
      {
        title: "Belge Arşivi",
        description: "Vergi ve ruhsat belgelerini güvenle saklayın.",
      },
    ],
    advantages: [
      "Mobil vitrin",
      "Kampanya araçları",
      "Sipariş bildirimleri",
      "Admin onaylı güven",
    ],
    faqs: [
      {
        q: "Başvuru sonrası ne olur?",
        a: "Belgeleriniz incelenir; onay sonrası mağazanız ekosistemde yayınlanır.",
      },
    ],
    ctaHref: "/kayit/petshop",
    ctaLabel: "PetShop Kaydı",
  },
];

export function getModule(slug: string) {
  return MODULES.find((m) => m.slug === slug);
}
