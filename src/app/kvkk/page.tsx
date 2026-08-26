import { notFound } from "next/navigation";
import { LegalDocumentView } from "@/components/legal/LegalDocumentView";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLegalDocument } from "@/lib/legal/registry";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "KVKK Aydınlatma Metni",
  description: "PetLoog KVKK aydınlatma metni.",
  path: "/kvkk",
});

export default function KvkkPage() {
  const document = getLegalDocument("kvkk");
  if (!document) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "KVKK", path: "/kvkk" },
        ])}
      />
      <LegalDocumentView document={document} />
    </>
  );
}
