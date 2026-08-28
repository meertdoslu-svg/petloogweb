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

const TERMS_CONTENT = buildFromSections(
  "PETLOOG KULLANIM KOŞULLARI",
  "1.0",
  "Bu Kullanım Koşulları, PetLoog mobil uygulaması ve ilişkili dijital hizmetlerin kullanımına ilişkin hukuki çerçeveyi belirler. Uygulamayı indirerek, hesap oluşturarak veya hizmetlerden yararlanarak bu koşulları okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz. Koşulları kabul etmiyorsanız uygulamayı kullanmamalısınız.\n\nYayın tarihi: 22 Temmuz 2026 · Son güncelleme: 22 Temmuz 2026",
  [
    {
      title: "Giriş",
      body: "PetLoog, evcil hayvan sahipleri, veteriner hekimler, sürücüler, kuryeler ve işletmeler arasında acil ihbar, sağlık bilgilendirme, market, taşıma, sahiplendirme ve topluluk özelliklerini bir araya getiren bir dijital platformdur.\n\nBu metin; Apple App Store İnceleme Yönergeleri, Google Play Geliştirici Program Politikaları ve 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ile uyumlu olacak şekilde hazırlanmıştır. Tüketici hakları saklıdır.\n\nHizmetler Türkiye'de sunulur. Belirli özellikler coğrafi, operasyonel veya yasal kısıtlar nedeniyle sınırlı olabilir.",
    },
    {
      title: "Tanımlar",
      body: "- **PetLoog / Platform:** Mobil uygulama, arka uç sistemleri ve bağlı dijital hizmetler.\n- **Kullanıcı:** Hesap oluşturmuş veya misafir olarak Platformu kullanan gerçek kişi.\n- **İçerik:** Kullanıcıların yüklediği metin, fotoğraf, video, konum ve benzeri veriler.\n- **Pet AI:** Yapay zekâ destekli bilgilendirme özellikleri.\n- **Market:** PetLoog üzerinden sunulan ürün satış ve sipariş hizmeti.\n- **Pet Taksi:** Evcil hayvan taşıma eşleştirme hizmeti.\n- **Yuva:** Sahiplendirme ilanları ve başvuru süreçleri.\n- **Mahalle:** Topluluk, besleme noktası ve benzeri yerel özellikler.\n- **Kasko:** Platform üzerindeki evcil hayvan sağlık planı / üyelik ürünleri.\n- **PRO:** Ücretli dijital abonelik (mağaza faturalandırmasına tabi).",
    },
    {
      title: "Hizmet Kapsamı",
      body: "PetLoog; acil sokak hayvanı ihbarı ve ön değerlendirme, veteriner eşleştirme, randevu ve vaka takibi, market siparişi, Pet Taksi, Yuva, Mahalle, Kasko ve Pet AI bilgilendirme hizmetlerini sunabilir.\n\nPlatform bir aracıdır. Veteriner muayenesi, ilaç satışı, taşıma fiili ifası veya ürün tedariki ilgili bağımsız üçüncü taraflarca gerçekleştirilir. PetLoog, üçüncü tarafların mesleki veya ticari eylemlerinden doğrudan sorumlu tutulamaz; zorunlu mevzuat hükümleri saklıdır.\n\nÖzellikler sürüm, bölge ve hesap türüne göre değişebilir. Kapalı beta dönemlerinde bazı hizmetler sınırlı veya deneme niteliğinde olabilir.",
    },
    {
      title: "Kullanıcı Hesabı",
      body: "Hesap oluşturmak için doğru, güncel ve eksiksiz bilgi vermeniz gerekir. Hesap güvenliğinden (şifre, oturum cihazları) siz sorumlusunuz. Yetkisiz erişimi derhal info@petloog.com adresine bildirin.\n\nBir hesap yalnızca yetkili kullanıcıya aittir. Hesabı üçüncü kişilere devretmek, satmak veya toplu otomasyon için kullanmak yasaktır.\n\nRol bazlı hesaplar (veteriner, sürücü, satıcı, kurye) ek doğrulama, belge yükleme ve onay süreçlerine tabi olabilir. Onay verilmeden ilgili panel özellikleri kısıtlanabilir.",
    },
    {
      title: "Üyelik Koşulları",
      body: "Platformu kullanmak için **18 yaşını doldurmuş** olmanız veya yasal temsilcinizin onayı ile hareket etmeniz gerekir. 13 yaşından küçük çocuklar adına hesap açılamaz.\n\nÜyelik ücretsiz veya ücretli (PRO, Kasko, Market vb.) olabilir. Dijital abonelikler Apple App Store veya Google Play abonelik kurallarına tabidir. Fiziksel ürün ve belirli hizmet ödemeleri yetkili ödeme kuruluşları üzerinden işlenebilir.\n\nKampanyalar (örneğin erken kullanıcı denemeleri) duyurulan koşullara ve stok/kota sınırlarına bağlıdır. PetLoog kampanyayı önceden bildirimle değiştirme veya sonlandırma hakkını saklı tutar.",
    },
    {
      title: "Yasaklanan Davranışlar",
      body: "- Sahte, yanıltıcı veya kötü niyetli acil ihbar oluşturmak\n- Başkasına ait kimlik, belge, ödeme veya iletişim bilgilerini kullanmak\n- Nefret söylemi, tehdit, taciz, yasa dışı içerik paylaşmak\n- Hayvan istismarını teşvik eden veya gösteren içerik yüklemek\n- Sistemi tersine mühendislik, scraping veya hizmet kesintisi amacıyla kullanmak\n- Spam, dolandırıcılık, sahte teklif veya sahte sahiplendirme ilanı\n- İzin alınmadan konum, kamera veya mikrofon verilerini kötüye kullanmak\n- Mağaza veya ödeme sistemlerini dolandırma amacıyla kullanmak\n\nİhlal halinde içerik kaldırma, hesap askıya alma, yasal mercilere bildirim ve tazminat yolları saklıdır.",
    },
    {
      title: "AI Hizmeti",
      body: "Pet AI ve benzeri yapay zekâ özellikleri **yalnızca bilgilendirme amaçlıdır**. Veteriner hekim teşhisi, tedavi planı, reçete veya acil tıbbi müdahale yerine geçmez.\n\nÇıktılar hata içerebilir; evcil hayvanınızın durumu için yetkili veterinere başvurun. Acil şüphede en yakın kliniğe veya acil hattına başvurun.\n\nAI özelliklerinin bir kısmı PRO aboneliğine veya deneme hakkına bağlı olabilir. Kullanım, ayrı **AI Kullanım Şartları** ile birlikte okunmalıdır.",
    },
    {
      title: "Veteriner Hizmetleri",
      body: "Veteriner paneli üzerinden sunulan teklif, randevu, tedavi kaydı ve benzeri süreçler ilgili klinik / hekim sorumluluğundadır. PetLoog klinik seçimini dayatmaz; eşleştirme ve iletişim altyapısı sağlar.\n\nKullanıcı, klinik ile arasındaki mesleki ilişkiyi ve ücretlendirmeyi klinik koşullarına göre değerlendirir. Acil vakalarda Platform gecikme veya bağlantı sorunlarından doğabilecek sonuçlardan, kusuru oranında ve zorunlu hükümler çerçevesinde sorumludur.\n\nAyrıntılar **Veteriner Hizmet Şartları** belgesinde yer alır.",
    },
    {
      title: "Pet Taksi",
      body: "Pet Taksi, sürücü ile kullanıcıyı taşıma talebi için eşleştirir. Fiili taşıma sürücü tarafından gerçekleştirilir. Hayvanın güvenli taşınması, kafes/tasma uygunluğu ve doğru adres bilgisi kullanıcı ve sürücü ortak sorumluluğundadır.\n\nPlatform, rota önerisi veya konum paylaşımı sunabilir; trafik ve üçüncü taraf olaylarından sorumlu tutulamaz. Kurallar **Pet Taksi Kuralları** belgesinde detaylandırılır.",
    },
    {
      title: "Market",
      body: "Market üzerinden satılan ürünler satıcı / mağaza tarafından listelenir. Stok, fiyat, teslimat süresi ve ürün uygunluğu satıcının beyanına dayanır. Sipariş sonrası iade ve cayma hakları ilgili mevzuat ve satıcı politikalarına tabidir.\n\nPetLoog, aracı konumunda olduğu ölçüde sipariş durumunu ve ödeme akışını yönetebilir. Ayrıntılar **Market Kuralları** belgesindedir.",
    },
    {
      title: "Yuva",
      body: "Yuva; sahiplendirme ilanları, başvurular ve klinik kaynaklı aktarımlar için bir buluşma alanıdır. İlan sahibi ve başvuran, hayvanın refahına uygun, doğru bilgi vermekle yükümlüdür.\n\nPetLoog sahiplenme sözleşmesinin tarafı değildir. Uyuşmazlıklarda taraflar kendi aralarında çözüm arar; Platform kötüye kullanımı engellemek için ilanı kaldırabilir veya hesap kısıtlayabilir.",
    },
    {
      title: "Mahalle",
      body: "Mahalle özellikleri; besleme noktaları, topluluk etkileşimi ve yerel görünürlük amaçlıdır. Paylaşılan konum ve görsellerin doğruluğundan paylaşan kullanıcı sorumludur.\n\nTopluluk içinde saygılı iletişim zorunludur. Ayrıntılı davranış kuralları **Topluluk Kuralları** belgesinde düzenlenir.",
    },
    {
      title: "Kasko",
      body: "PetLoog üzerindeki Kasko / sağlık planı ürünleri, ilgili plan şartları ve klinik anlaşmaları çerçevesinde sunulur. Teminat kapsamı, limitler, bekleme süreleri ve hariç tutulan haller plan belgelerinde belirtilir.\n\nKasko bir sigorta ürünü gibi sunuluyorsa ilgili lisans ve bilgilendirme yükümlülükleri saklıdır. Detaylar **Kasko Kullanım Şartları** belgesindedir.",
    },
    {
      title: "Fikri Mülkiyet",
      body: "PetLoog markası, logosu, arayüz tasarımı, yazılım kodu ve orijinal içerikler PetLoog'a veya lisans verenlerine aittir. İzinsiz kopyalama, çoğaltma, dağıtma veya türev eser oluşturma yasaktır.\n\nKullanıcı, yüklediği İçerik üzerinde gerekli haklara sahip olduğunu beyan eder ve Platforma hizmetin sunumu için gerekli, dünya çapında, münhasır olmayan, ücret ödemesiz bir kullanım lisansı verir. Bu lisans, hesabın silinmesi talebi ve yasal saklama süreleri çerçevesinde sona erebilir.",
    },
    {
      title: "Hesap Askıya Alma",
      body: "PetLoog; bu koşulların ihlali, yasal zorunluluk, dolandırıcılık şüphesi, güvenlik riski veya üçüncü taraf hak ihlali halinde hesabı geçici veya kalıcı olarak askıya alabilir, içeriği kaldırabilir veya erişimi kısıtlayabilir.\n\nMümkün olduğu ölçüde kullanıcıya bildirim yapılır. Acil güvenlik veya yasal durumlarda önceden bildirim yapılmayabilir. İtirazlar info@petloog.com üzerinden iletilebilir.",
    },
    {
      title: "Sorumluluk Reddi",
      body: "Platform \"olduğu gibi\" ve \"mevcut haliyle\" sunulur. PetLoog; kesintisiz, hatasız veya kesintisiz erişim taahhüt etmez. Dolaylı, arızi, özel veya sonuç zararlarından; kâr kaybı, veri kaybı veya itibar kaybından, zorunlu tüketici hakları ve kusur oranı saklı kalmak kaydıyla sorumlu tutulamaz.\n\nAI çıktıları, üçüncü taraf klinik/sürücü/satıcı eylemleri ve kullanıcı tarafından sağlanan yanlış bilgiler bu sorumluluk sınırının kapsamındadır.\n\nZorunlu mevzuatın izin vermediği ölçüde hiçbir sorumluluk reddi uygulanmaz.",
    },
    {
      title: "Hizmet Kesintileri",
      body: "Bakım, güncelleme, kapasite, ağ veya mücbir sebep nedeniyle hizmetler geçici olarak kesilebilir veya yavaşlayabilir. Planlı bakım mümkün olduğunca önceden duyurulur.\n\nÖdeme, bildirim veya konum servisleri üçüncü taraf altyapılara bağlıdır; bu altyapılardaki kesintiler Platform performansını etkileyebilir.",
    },
    {
      title: "Güncellemeler",
      body: "PetLoog bu Kullanım Koşullarını güncelleyebilir. Önemli değişikliklerde uygulama içi bildirim, e-posta veya mağaza sürüm notları ile bilgilendirme yapılır.\n\nGüncel sürüm uygulama içinde Yasal ve Güvenlik bölümünde ve https://petloog.com/terms adresinde yayımlanır. Değişiklikten sonra Platformu kullanmaya devam etmek, yeni sürümü kabul anlamına gelebilir; zorunlu onay gereken durumlarda ayrıca onay istenir.",
    },
    {
      title: "Uyuşmazlıklar",
      body: "Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Tüketiciler için 6502 sayılı Kanun ve ilgili mevzuat saklıdır.\n\nUyuşmazlıklarda öncelikle info@petloog.com üzerinden dostane çözüm aranır. Çözülemezse yetkili Türk mahkemeleri ve icra daireleri (tüketici hakem heyetleri / tüketici mahkemeleri dâhil) bakmaya yetkilidir.",
    },
    {
      title: "İletişim",
      body: "**PetLoog Destek**\n- E-posta: info@petloog.com\n- Gizlilik / KVKK: info@petloog.com\n- Web: https://petloog.com\n- Destek: https://petloog.com/support\n\nResmi bildirimler yazılı veya kayıtlı elektronik posta ile yapılır.",
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
    description: "PetLoog gizlilik politikası.",
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
    inlineContent: TERMS_CONTENT,
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
  if (entry.filename) return readMd(entry.filename);
  return "";
}

export function getLegalDocument(slug: string): LegalDocument | undefined {
  const entry = LEGAL_ENTRIES.find((doc) => doc.slug === slug);
  if (!entry) return undefined;
  const { filename, inlineContent, ...meta } = entry;
  void filename;
  void inlineContent;
  return {
    ...meta,
    content: resolveContent(entry),
  };
}

export function listLegalDocuments(): LegalDocumentMeta[] {
  return LEGAL_ENTRIES.map(({ filename, inlineContent, ...meta }) => {
    void filename;
    void inlineContent;
    return meta;
  });
}
