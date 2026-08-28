import Link from "next/link";
import { notFound } from "next/navigation";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/constants";
import { getLegalDocument } from "@/lib/legal/registry";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Destek",
  description: "PetLoog destek merkezi: gerçek iletişim kanalları ve destek bilgileri.",
  path: "/support",
});

export default function SupportPage() {
  const document = getLegalDocument("destek");
  if (!document) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Destek", path: "/support" },
        ])}
      />
      <LegalDocumentView document={document} />

      <div className="container-site pb-14">
        <div className="rounded-[24px] bg-surface p-6 shadow-[var(--shadow-soft)] md:p-8">
          <h2 className="text-lg font-extrabold text-primary md:text-xl">
            Diğer İletişim Kanalları
          </h2>
          <p className="mt-2 text-sm text-primary/70">
            Telefon, WhatsApp, e-posta ve iletişim formu için PetLoog İletişim
            sayfasını kullanabilirsiniz.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ContactItem label="Telefon" value={SITE.phone} href={`tel:${SITE.phone.replace(/\s/g, "")}`} />
            <ContactItem
              label="WhatsApp"
              value="WhatsApp'tan yazın"
              href={`https://wa.me/${SITE.whatsapp}`}
              external
            />
            <ContactItem label="E-posta" value={SITE.email} href={`mailto:${SITE.email}`} />
            <ContactItem label="Adres" value={SITE.address} />
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/iletisim"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              İletişim formuna git →
            </Link>
            <Link
              href="/yasal/hesap-silme"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              Hesap Silme →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function ContactItem({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="rounded-[16px] bg-white/60 p-4 shadow-[var(--shadow-soft)]">
      <p className="text-xs font-extrabold uppercase tracking-wide text-primary/50">
        {label}
      </p>
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="mt-1 block text-sm font-semibold text-primary hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="mt-1 text-sm font-semibold text-primary">{value}</p>
      )}
    </div>
  );
}
