import Link from "next/link";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/constants";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "PetLoog Destek",
  description:
    "PetLoog uygulaması için yardım, destek ve iletişim bilgileri.",
  path: "/destek",
});

const TOPICS: { title: string; items: string[]; note?: string }[] = [
  {
    title: "1. Hesap ve Giriş",
    items: [
      "Hesap oluşturma",
      "Giriş sorunları",
      "Profil ve hesap ayarları",
    ],
  },
  {
    title: "2. Evcil Hayvan ve Sağlık",
    items: [
      "Evcil hayvan profili",
      "Sağlık kayıtları",
      "PetLoog AI hakkında destek",
    ],
    note: "PetLoog AI tarafından sağlanan bilgiler genel bilgilendirme amaçlıdır ve veteriner hekim muayenesi, teşhisi veya tedavisinin yerine geçmez. Evcil hayvanınızın sağlığıyla ilgili kararlar için yetkili bir veteriner hekime başvurun.",
  },
  {
    title: "3. PetTaksi",
    items: [
      "PetTaksi talepleri",
      "Yolculuk ve teslimat süreçleri",
      "Yaşanan sorunların bildirilmesi",
    ],
  },
  {
    title: "4. PetKasko",
    items: [
      "Planlar",
      "Abonelik ve kullanım hakları",
      "Veteriner hizmetleriyle ilgili destek",
    ],
  },
  {
    title: "5. Market",
    items: ["Siparişler", "Kargo", "Teslimat", "İade süreçleri"],
  },
  {
    title: "6. Sahiplendirme ve Topluluk",
    items: [
      "Sahiplendirme ilanları",
      "Başvurular",
      "Mahalle/topluluk özellikleri",
    ],
  },
];

const LEGAL_LINKS: { href: string; label: string }[] = [
  { href: "/privacy", label: "Gizlilik Politikası" },
  { href: "/terms", label: "Kullanım Koşulları" },
  { href: "/yasal/hesap-silme", label: "Hesap Silme" },
];

export default function DestekPage() {
  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Destek", path: "/destek" },
        ])}
      />
      <Breadcrumb
        items={[{ label: "Anasayfa", href: "/" }, { label: "Destek" }]}
      />

      <h1 className="text-3xl font-extrabold text-primary md:text-5xl">
        PetLoog Destek
      </h1>
      <p className="mt-3 max-w-2xl text-primary/70">
        PetLoog kullanırken yardıma ihtiyacınız varsa bizimle iletişime
        geçebilirsiniz.
      </p>

      {/* Contact summary — visible without scrolling for App Store review */}
      <div className="mt-8 rounded-[24px] bg-surface p-6 shadow-[var(--shadow-card)] md:p-8">
        <h2 className="text-lg font-extrabold text-primary md:text-xl">
          Hızlı iletişim
        </h2>
        <p className="mt-2 text-sm text-primary/70">
          Sorularınız için e-posta ile ya da iletişim formu üzerinden bize
          ulaşabilirsiniz. Hafta içi 1–2 iş günü içinde yanıt veriyoruz.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
          >
            {SITE.email}
          </a>
          <Link
            href="/iletisim"
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 px-6 py-3 text-sm font-bold text-primary transition hover:bg-primary/5"
          >
            İletişim formuna git →
          </Link>
        </div>
      </div>

      {/* Topic sections 1–6 */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {TOPICS.map((topic) => (
          <section
            key={topic.title}
            className="rounded-[24px] bg-surface p-5 shadow-[var(--shadow-soft)] md:p-6"
          >
            <h2 className="text-lg font-extrabold text-primary">
              {topic.title}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-primary/75">
              {topic.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden className="text-primary/40">
                    •
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {topic.note ? (
              <p className="mt-4 rounded-[16px] bg-white/60 p-4 text-xs leading-relaxed text-primary/70">
                {topic.note}
              </p>
            ) : null}
          </section>
        ))}
      </div>

      {/* 7. Gizlilik ve Hesap Silme */}
      <section className="mt-4 rounded-[24px] bg-surface p-5 shadow-[var(--shadow-soft)] md:p-6">
        <h2 className="text-lg font-extrabold text-primary">
          7. Gizlilik ve Hesap Silme
        </h2>
        <p className="mt-3 text-sm text-primary/75">
          Kişisel verilerinizin nasıl işlendiğini Gizlilik Politikası
          sayfasından inceleyebilir; hesabınızı ve verilerinizi silme talebini
          Hesap Silme sayfasındaki adımları izleyerek iletebilirsiniz. Kişisel
          verilerinize ilişkin talepleriniz için{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="font-bold text-primary hover:underline"
          >
            {SITE.email}
          </a>{" "}
          adresine de yazabilirsiniz.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              {link.label} →
            </Link>
          ))}
        </div>
      </section>

      {/* 8. Bize Ulaşın */}
      <section className="mt-4 rounded-[24px] bg-surface p-6 shadow-[var(--shadow-soft)] md:p-8">
        <h2 className="text-lg font-extrabold text-primary md:text-xl">
          8. Bize Ulaşın
        </h2>
        <p className="mt-3 text-sm text-primary/75">
          Sorularınız için e-posta ile ya da iletişim formu üzerinden bize
          ulaşabilirsiniz. Hafta içi 1–2 iş günü içinde yanıt veriyoruz.
        </p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[16px] bg-white/60 p-4">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-primary/50">
              E-posta
            </dt>
            <dd className="mt-1">
              <a
                href={`mailto:${SITE.email}`}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {SITE.email}
              </a>
            </dd>
          </div>
          <div className="rounded-[16px] bg-white/60 p-4">
            <dt className="text-xs font-extrabold uppercase tracking-wide text-primary/50">
              İletişim formu
            </dt>
            <dd className="mt-1">
              <Link
                href="/iletisim"
                className="text-sm font-semibold text-primary hover:underline"
              >
                petloog.com/iletisim
              </Link>
            </dd>
          </div>
        </dl>
      </section>

      {/* Bottom legal links */}
      <div className="mt-10 border-t border-primary/10 pt-6">
        <p className="text-xs font-extrabold uppercase tracking-wide text-primary/50">
          Yasal
        </p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-primary/75 hover:text-primary hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
