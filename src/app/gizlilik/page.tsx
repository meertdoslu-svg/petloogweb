import { notFound } from "next/navigation";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLegalDocument } from "@/lib/legal/registry";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Gizlilik Politikası",
  description:
    "PetLoog Gizlilik Politikası — kişisel verilerin toplanması, kullanılması, paylaşılması, saklanması, kullanıcı hakları ve hesap silme süreçleri.",
  path: "/gizlilik",
  // /privacy and /gizlilik serve the same document; canonicalize to /privacy
  // (the URL used for App Store / Google Play listings) to avoid duplicate
  // indexing while keeping /gizlilik reachable for Turkish users.
  canonicalPath: "/privacy",
});

export default function GizlilikPage() {
  const document = getLegalDocument("gizlilik");
  if (!document) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Gizlilik", path: "/gizlilik" },
        ])}
      />
      <LegalDocumentView document={document} />
    </>
  );
}
