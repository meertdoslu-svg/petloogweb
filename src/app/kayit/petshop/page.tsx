import Link from "next/link";
import { PetshopForm } from "@/components/forms/PetshopForm";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "PetShop Kaydı",
  description:
    "Pet shopunuzu PetLoog’a taşıyın. Market kayıt başvurusu ve admin onay süreci.",
  path: "/kayit/petshop",
});

export default function PetshopKayitPage() {
  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "PetShop Kaydı", path: "/kayit/petshop" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Anasayfa", href: "/" },
          { label: "PetShop Kaydı" },
        ]}
      />
      <h1 className="text-3xl font-extrabold text-primary md:text-5xl">
        PetShop Kaydı
      </h1>
      <p className="mt-3 max-w-2xl text-primary/70">
        Mağaza, vergi, IBAN, belgeler ve teslimat bölgelerinizi gönderin. Onay
        sonrası ekosistemde yayınlanır. Başvuru öncesi{" "}
        <Link href="/yasal/satici-sozlesmesi" className="font-bold text-accent underline">
          Satıcı Hizmet Sözleşmesi
        </Link>
        &apos;ni inceleyin.
      </p>
      <div className="mt-8">
        <PetshopForm />
      </div>
    </div>
  );
}
