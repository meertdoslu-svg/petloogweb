import { notFound } from "next/navigation";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLegalDocument, listLegalDocuments } from "@/lib/legal/registry";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

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
