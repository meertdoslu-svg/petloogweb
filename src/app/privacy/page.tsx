import { notFound } from "next/navigation";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLegalDocument } from "@/lib/legal/registry";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Gizlilik Politikası",
  description:
    "PetLoog Gizlilik Politikası — kişisel verilerin toplanması, kullanılması, paylaşılması, saklanması, kullanıcı hakları ve hesap silme süreçleri.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const document = getLegalDocument("gizlilik");
  if (!document) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Gizlilik Politikası", path: "/privacy" },
        ])}
      />
      <LegalDocumentView document={document} />
    </>
  );
}
