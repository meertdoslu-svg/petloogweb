import Link from "next/link";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/constants";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Yardım",
  description: "PetLoog yardım merkezi: sık sorulan sorular, destek ve yasal sayfalara hızlı erişim.",
  path: "/help",
});

const FAQS = [
  {
    q: "Destek saatleri nedir?",
    a: "Kapalı beta sürecinde hafta içi 1–2 iş günü içinde yanıt veriyoruz.",
  },
  {
    q: "Uygulama abonelik iptalini nasıl yaparım?",
    a: "iOS: Ayarlar → Apple ID → Abonelikler → PetLoog. Android: Play Store → Ödemeler ve abonelikler → Abonelikler.",
  },
  {
    q: "Uygulama çöküyor veya hata veriyor, ne yapmalıyım?",
    a: "Destek talebinize cihaz modeli, işletim sistemi sürümü, hatanın adımları ve mümkünse bir ekran görüntüsü ekleyin.",
  },
  {
    q: "Ödeme ile ilgili bir sorun yaşıyorum.",
    a: "Kart numaranızı paylaşmadan sipariş veya abonelik kimliğinizi belirterek Destek ekibimize ulaşın.",
  },
  {
    q: "Kişisel verilerimle ilgili haklarımı nasıl kullanırım?",
    a: "KVKK Aydınlatma Metni ve Gizlilik Politikası sayfalarında başvuru yöntemleri açıklanmıştır; talebinizi Destek üzerinden iletebilirsiniz.",
  },
  {
    q: "Veteriner/PetShop kaydı ne kadar sürer?",
    a: "Belgeler eksiksizse inceleme genellikle 1–3 iş günü içinde tamamlanır.",
  },
];

const QUICK_LINKS = [
  { href: "/support", label: "Destek Merkezi", description: "Gerçek iletişim kanalları ve destek bilgileri." },
  { href: "/privacy", label: "Gizlilik Politikası", description: "Kişisel verilerinizin nasıl işlendiğini öğrenin." },
  { href: "/terms", label: "Kullanım Koşulları", description: "Platform kullanımına ilişkin hukuki çerçeve." },
  { href: "/kvkk", label: "KVKK Aydınlatma Metni", description: "6698 sayılı Kanun kapsamında aydınlatma metni." },
  { href: "/destek", label: "Destek", description: "Konu başlıklarına göre yardım ve iletişim bilgileri." },
  { href: "/iletisim", label: "İletişim", description: "E-posta ve iletişim formu." },
  { href: "/yasal/hesap-silme", label: "Hesap Silme", description: "Hesabınızın ve verilerinizin silinmesini nasıl talep edeceğinizi öğrenin." },
];

export default function HelpPage() {
  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Anasayfa", path: "/" },
            { name: "Yardım", path: "/help" },
          ]),
          faqJsonLd(FAQS),
        ]}
      />
      <Breadcrumb items={[{ label: "Anasayfa", href: "/" }, { label: "Yardım" }]} />

      <h1 className="text-3xl font-extrabold text-primary md:text-5xl">Yardım</h1>
      <p className="mt-3 max-w-2xl text-primary/70">
        Sık sorulan sorular, destek kanalları ve yasal sayfalara hızlı erişim
        için doğru yerdesiniz.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-[24px] bg-surface p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
          >
            <h2 className="text-lg font-extrabold text-primary">{link.label}</h2>
            <p className="mt-2 text-sm text-primary/70">{link.description}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-primary">Sık Sorulan Sorular</h2>
        <div className="mt-5 space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="rounded-[20px] bg-surface p-5 shadow-[var(--shadow-soft)]"
            >
              <summary className="cursor-pointer font-extrabold text-primary">
                {faq.q}
              </summary>
              <p className="mt-2 text-sm text-primary/70">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-[24px] bg-surface p-6 text-center shadow-[var(--shadow-soft)] md:p-8">
        <h2 className="text-xl font-extrabold text-primary">
          Aradığınızı bulamadınız mı?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-primary/70">
          Bize {SITE.email} adresinden veya iletişim formundan
          ulaşabilirsiniz.
        </p>
        <Link
          href="/iletisim"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
        >
          İletişime Geç
        </Link>
      </section>
    </div>
  );
}
