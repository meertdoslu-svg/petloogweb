import Link from "next/link";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { listLegalDocuments } from "@/lib/legal/registry";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Yasal Merkez",
  description:
    "PetLoog KVKK, gizlilik, çerez, kullanım koşulları ve iş ortaklığı sözleşmeleri.",
  path: "/yasal",
});

export default function YasalPage() {
  const documents = listLegalDocuments();

  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Yasal", path: "/yasal" },
        ])}
      />
      <Breadcrumb
        items={[{ label: "Anasayfa", href: "/" }, { label: "Yasal Merkez" }]}
      />
      <h1 className="text-3xl font-extrabold text-primary md:text-5xl">
        Yasal Merkez
      </h1>
      <p className="mt-3 max-w-2xl text-primary/70">
        Mobil uygulamadaki hukuki metinlerin birebir web sürümleri. KVKK,
        gizlilik, çerez, kullanım koşulları ve iş ortaklığı sözleşmeleri.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <Link
            key={doc.slug}
            href={
              doc.slug === "kvkk"
                ? "/kvkk"
                : doc.slug === "gizlilik"
                  ? "/privacy"
                  : doc.slug === "cerez"
                    ? "/cerez"
                    : doc.slug === "kullanim-kosullari"
                      ? "/terms"
                      : doc.slug === "destek"
                        ? "/support"
                        : `/yasal/${doc.slug}`
            }
            className="rounded-[24px] bg-surface p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
          >
            <h2 className="text-lg font-extrabold text-primary">{doc.title}</h2>
            <p className="mt-2 text-sm text-primary/70">{doc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
