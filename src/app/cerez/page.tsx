import { notFound } from "next/navigation";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLegalDocument } from "@/lib/legal/registry";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Çerez Politikası",
  description: "PetLoog çerez politikası.",
  path: "/cerez",
});

export default function CerezPage() {
  const document = getLegalDocument("cerez");
  if (!document) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Çerez Politikası", path: "/cerez" },
        ])}
      />
      <LegalDocumentView document={document} />
    </>
  );
}
