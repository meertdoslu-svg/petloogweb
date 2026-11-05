import Link from "next/link";
import { LegalUpdatingNotice } from "@/components/legal/LegalDocumentView";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/Section";
import { listLegalDocuments } from "@/lib/legal/registry";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Yasal metinler",
  description:
    "PetLoog gizlilik politikası, kullanım koşulları, KVKK aydınlatma metni, çerez politikası, Sahne kuralları ve hesap silme.",
  path: "/yasal",
});

const SHORT_ROUTES: Record<string, string> = {
  kvkk: "/kvkk",
  gizlilik: "/privacy",
  cerez: "/cerez",
  "kullanim-kosullari": "/terms",
  destek: "/support",
};

export default function YasalPage() {
  const documents = listLegalDocuments();

  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana sayfa", path: "/" },
          { name: "Yasal", path: "/yasal" },
        ])}
      />
      <Breadcrumb items={[{ label: "Ana sayfa", href: "/" }, { label: "Yasal metinler" }]} />
      <PageHeader
        title="Yasal metinler"
        lead="PetLoog'u kullanırken geçerli olan metinlerin hepsi burada."
      />
      <div className="mt-6 max-w-3xl">
        <LegalUpdatingNotice />
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <li key={doc.slug}>
            <Link
              href={SHORT_ROUTES[doc.slug] ?? `/yasal/${doc.slug}`}
              className="flex h-full items-start justify-between gap-3 rounded-3xl border border-line bg-surface p-5 transition-colors hover:border-secondary"
            >
              <span>
                <span className="block font-extrabold text-primary">{doc.title}</span>
                <span className="mt-1 block text-sm text-muted">{doc.description}</span>
              </span>
              <Icon name="arrowRight" size={20} className="mt-0.5 shrink-0 text-amber" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
