import { JsonLd } from "@/components/seo/JsonLd";
import { SupportContent } from "@/components/support/SupportContent";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

// /support is the App Store support URL — keep it stable.
export const metadata = buildMetadata({
  title: "Destek",
  description:
    "PetLoog destek: hesap, PetLoog Market, veteriner ve Acil, hatırlatmalar, pati dostu mekanlar ve Sahne. Bize info@petloog.com adresinden ulaş.",
  path: "/support",
});

export default function Page() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana sayfa", path: "/" },
          { name: "Destek", path: "/support" },
        ])}
      />
      <SupportContent />
    </>
  );
}
