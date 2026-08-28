import { notFound } from "next/navigation";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLegalDocument, listLegalDocuments } from "@/lib/legal/registry";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// Slugs whose canonical URL is a dedicated short route (also the URL linked
// from the footer / Yasal Merkez and used for App Store / Google Play).
const LEGAL_CANONICAL_OVERRIDES: Record<string, string | undefined> = {
  gizlilik: "/privacy",
  "kullanim-kosullari": "/terms",
};

export async function generateStaticParams() {
  return listLegalDocuments()
    .filter((doc) => !["kvkk", "gizlilik", "cerez"].includes(doc.slug))
    .map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const document = getLegalDocument(slug);
  if (!document) return {};
  return buildMetadata({
    title: document.title,
    description: document.description,
    path: `/yasal/${slug}`,
    // Some legal docs are also served from a dedicated short route that is
    // the one linked in navigation and used for store listings. Canonicalize
    // /yasal/<slug> to that route to avoid duplicate indexing, while keeping
    // the /yasal/<slug> URL reachable. No redirect (avoids loops).
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
          { name: "Anasayfa", path: "/" },
          { name: "Yasal", path: "/yasal" },
          { name: document.title, path: `/yasal/${slug}` },
        ])}
      />
      <LegalDocumentView document={document} />
    </>
  );
}
