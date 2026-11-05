import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { type IconName } from "@/components/ui/Icon";
import { Card, IconBadge, PageHeader } from "@/components/ui/Section";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Hakkımızda",
  description:
    "PetLoog, pati sahiplerini mahallelerindeki petshop, veteriner ve pati dostu mekanlarla buluşturan uygulama.",
  path: "/hakkimizda",
});

const VALUES: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "store",
    title: "Mahalle önce",
    text: "Alışverişin mahallendeki petshop'tan olsun. Yakındaki esnaf kazansın, sen de beklemeden al.",
  },
  {
    icon: "clock",
    title: "Lazım olduğunda yanında",
    text: "Gece de olsa, bayram da olsa şu an açık veterineri bulabilmen için buradayız.",
  },
  {
    icon: "heart",
    title: "Patiler bir arada",
    text: "Sahne'de her gün yeni bir konu var. Patini göster, başkalarınınkine oy ver, birlikte eğlenelim.",
  },
];

export default function HakkimizdaPage() {
  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana sayfa", path: "/" },
          { name: "Hakkımızda", path: "/hakkimizda" },
        ])}
      />
      <PageHeader
        eyebrow="Hakkımızda"
        title="Patinin ihtiyacı mahallende, PetLoog cebinde."
        lead="PetLoog'u, bir pati sahibinin gün içinde en çok aradığı şeyleri tek yerde toplamak için yapıyoruz: mahalledeki petshop, şu an açık veteriner, mama hatırlatması ve patinle gidebileceğin mekanlar."
      />

      <div className="mt-10 max-w-3xl space-y-4 text-lg leading-relaxed text-muted">
        <p>
          Mama bittiğinde marketi dolaşmak, gece bir şey olduğunda hangi
          kliniğin açık olduğunu aramak, patinle girebileceğin bir kafe bulmak…
          Hepsi bizim de yaşadığımız şeyler.
        </p>
        <p>
          O yüzden işe mahalleden başladık. Siparişini yakındaki petshop
          hazırlar, kapında ödersin. Veterinerleri açık olup olmadıklarına göre
          görürsün. Bir de Sahne var: her gün yeni bir konu, her gece yeni bir
          yıldız.
        </p>
      </div>

      <section aria-label="Değerlerimiz" className="mt-12 grid gap-4 md:grid-cols-3">
        {VALUES.map((v) => (
          <Card key={v.title}>
            <IconBadge name={v.icon} />
            <h2 className="mt-4 text-lg font-extrabold text-primary">{v.title}</h2>
            <p className="mt-1.5 leading-relaxed text-muted">{v.text}</p>
          </Card>
        ))}
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <ButtonLink href="/iletisim" size="lg">
          Bize yaz
        </ButtonLink>
        <ButtonLink href="/isletmeler" variant="outline" size="lg">
          İşletmeler için
        </ButtonLink>
      </div>
    </div>
  );
}
