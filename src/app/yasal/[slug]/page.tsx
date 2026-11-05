import { notFound } from "next/navigation";
import { AccountDeletionSteps } from "@/components/legal/AccountDeletionSteps";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLegalDocument, listLegalDocuments } from "@/lib/legal/registry";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Slugs whose canonical URL is a dedicated short route.
const LEGAL_CANONICAL_OVERRIDES: Record<string, string | undefined> = {
  gizlilik: "/privacy",
  "kullanim-kosullari": "/terms",
  kvkk: "/kvkk",
  cerez: "/cerez",
  destek: "/support",
};

export async function generateStaticParams() {
  return listLegalDocuments().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const document = getLegalDocument(slug);
  if (!document) return {};
  return buildMetadata({
    title: document.title,
    description: document.description,
    path: `/yasal/${slug}`,
    canonicalPath: LEGAL_CANONICAL_OVERRIDES[slug],
  });
}

export default async function YasalDocumentPage({ params }: Props) {
  const { slug } = await params;
  const document = getLegalDocument(slug);
  if (!document) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana sayfa", path: "/" },
          { name: "Yasal", path: "/yasal" },
          { name: document.title, path: `/yasal/${slug}` },
        ])}
      />
      <LegalDocumentView document={document}>
        {slug === "hesap-silme" ? <AccountDeletionSteps /> : null}
      </LegalDocumentView>
    </>
  );
}
