import { notFound } from "next/navigation";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLegalDocument } from "@/lib/legal/registry";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Kullanım Koşulları",
  description: "PetLoog kullanım koşulları.",
  path: "/terms",
});

export default function TermsPage() {
  const document = getLegalDocument("kullanim-kosullari");
  if (!document) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Kullanım Koşulları", path: "/terms" },
        ])}
      />
      <LegalDocumentView document={document} />
    </>
  );
}
