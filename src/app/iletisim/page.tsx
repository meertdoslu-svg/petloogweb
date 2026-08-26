import { ContactForm } from "@/components/forms/ContactForm";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/constants";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "İletişim",
  description:
    "PetLoog iletişim: telefon, WhatsApp, e-posta, harita ve iletişim formu.",
  path: "/iletisim",
});

const FAQS = [
  {
    q: "Destek saatleri nedir?",
    a: "Hafta içi 09:00–18:00 arasında öncelikli destek sağlıyoruz. WhatsApp hattımız mesai dışında da mesaj alabilir.",
  },
  {
    q: "Veteriner/PetShop kaydı ne kadar sürer?",
    a: "Belgeler eksiksizse inceleme genellikle 1–3 iş günü içinde tamamlanır.",
  },
];

export default function IletisimPage() {
  const wa = `https://wa.me/${SITE.whatsapp}`;

  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Anasayfa", path: "/" },
            { name: "İletişim", path: "/iletisim" },
          ]),
          faqJsonLd(FAQS),
        ]}
      />
      <Breadcrumb
        items={[{ label: "Anasayfa", href: "/" }, { label: "İletişim" }]}
      />

      <h1 className="text-3xl font-extrabold text-primary md:text-5xl">
        İletişim
      </h1>
      <p className="mt-3 max-w-2xl text-primary/70">
        Sorularınız için bize ulaşın. Form, telefon, WhatsApp veya e-posta ile
        yazabilirsiniz.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] bg-surface p-6 shadow-[var(--shadow-card)] md:p-8">
          <h2 className="text-xl font-extrabold text-primary">İletişim Formu</h2>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-4">
          <InfoCard title="Telefon">
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`}>{SITE.phone}</a>
          </InfoCard>
          <InfoCard title="WhatsApp">
            <a href={wa} target="_blank" rel="noopener noreferrer">
              WhatsApp’tan yazın
            </a>
          </InfoCard>
          <InfoCard title="E-posta">
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </InfoCard>
          <InfoCard title="Adres">{SITE.address}</InfoCard>

          <div className="overflow-hidden rounded-[24px] shadow-[var(--shadow-soft)]">
            <iframe
              title="PetLoog Konum"
              src="https://maps.google.com/maps?q=Istanbul&t=&z=12&ie=UTF8&iwloc=&output=embed"
              className="h-64 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </aside>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-primary">SSS</h2>
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
    </div>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[20px] bg-surface p-5 shadow-[var(--shadow-soft)]">
      <h3 className="text-sm font-extrabold text-primary">{title}</h3>
      <div className="mt-1 text-sm text-primary/75">{children}</div>
    </div>
  );
}
