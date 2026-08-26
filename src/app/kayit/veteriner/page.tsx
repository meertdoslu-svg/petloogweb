import Link from "next/link";
import { VeterinerForm } from "@/components/forms/VeterinerForm";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Veteriner Kaydı",
  description:
    "Kliniğinizi PetLoog’a ekleyin. Veteriner kayıt başvurusu ve admin onay süreci.",
  path: "/kayit/veteriner",
});

export default function VeterinerKayitPage() {
  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Veteriner Kaydı", path: "/kayit/veteriner" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Anasayfa", href: "/" },
          { label: "Veteriner Kaydı" },
        ]}
      />
      <h1 className="text-3xl font-extrabold text-primary md:text-5xl">
        Veteriner Kaydı
      </h1>
      <p className="mt-3 max-w-2xl text-primary/70">
        Klinik bilgilerinizi ve belgelerinizi gönderin. Başvuru sonrası durum:{" "}
        <strong>Admin Onayı Bekleniyor</strong>. Başvuru öncesi{" "}
        <Link
          href="/yasal/veteriner-sozlesmesi"
          className="font-bold text-accent underline"
        >
          Veteriner Hizmet Sözleşmesi
        </Link>
        &apos;ni inceleyin.
      </p>
      <div className="mt-8">
        <VeterinerForm />
      </div>
    </div>
  );
}
