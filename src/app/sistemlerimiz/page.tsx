import Link from "next/link";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { MODULES } from "@/lib/constants";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sistemlerimiz",
  description:
    "PetLoog ekosistemindeki tüm sistemler: mobil, AI, market, veteriner, taksi, kasko ve daha fazlası.",
  path: "/sistemlerimiz",
});

export default function SistemlerimizPage() {
  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Sistemlerimiz", path: "/sistemlerimiz" },
        ])}
      />
      <Breadcrumb
        items={[{ label: "Anasayfa", href: "/" }, { label: "Sistemlerimiz" }]}
      />
      <h1 className="text-3xl font-extrabold text-primary md:text-5xl">
        Sistemlerimiz
      </h1>
      <p className="mt-4 max-w-2xl text-base text-primary/70 md:text-lg">
        PetLoog ekosistemindeki tüm modüller; pet sahipleri ve işletmeler için
        uçtan uca dijital deneyim sunar.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((module) => (
          <Link
            key={module.slug}
            href={`/moduller/${module.slug}`}
            className="rounded-[24px] bg-surface p-6 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
          >
            <h2 className="text-xl font-extrabold text-primary">
              {module.shortTitle}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-primary/70">
              {module.description}
            </p>
            <span className="mt-4 inline-block text-sm font-bold text-accent">
              Detaylı İncele →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
