import { PreRegistrationForm } from "@/components/forms/PreRegistrationForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { type IconName } from "@/components/ui/Icon";
import { Card, IconBadge, PageHeader } from "@/components/ui/Section";
import { SITE } from "@/lib/constants";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Petshop ve veterinerler için ön kayıt",
  description:
    "Mahallendeki pati sahiplerine PetLoog ile ulaş. Petshop ve veteriner kliniği ön kayıt formu; belge gerekmez, seni biz arayalım.",
  path: "/isletmeler",
});

type Props = { searchParams: Promise<{ tur?: string }> };

const BENEFITS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "store",
    title: "Petshop'lar için",
    text: "Mahallendeki pati sahipleri ürünlerini görsün, sipariş versin, kapıda ödesin.",
  },
  {
    icon: "stethoscope",
    title: "Veterinerler için",
    text: "Açık olduğun saatlerde ve acil durumlarda pati sahipleri seni kolayca bulsun.",
  },
  {
    icon: "phone",
    title: "Belge yok, kısa form",
    text: "Birkaç bilgi yeter. Ön kaydını aldıktan sonra seni arayıp süreci birlikte tamamlayalım.",
  },
];

export default async function IsletmelerPage({ searchParams }: Props) {
  const { tur } = await searchParams;
  const initialTur = tur === "veteriner" ? "veteriner" : "petshop";

  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana sayfa", path: "/" },
          { name: "İşletmeler için", path: "/isletmeler" },
        ])}
      />
      <PageHeader
        eyebrow="Petshop ve veterinerler için"
        title="Mahallendeki pati sahiplerine ulaş."
        lead="PetLoog'da yerini al. Ön kayıt formunu doldur, seni arayalım."
      />

      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {BENEFITS.map((b) => (
          <Card as="li" key={b.title}>
            <IconBadge name={b.icon} />
            <h2 className="mt-4 text-lg font-extrabold text-primary">{b.title}</h2>
            <p className="mt-1.5 leading-relaxed text-muted">{b.text}</p>
          </Card>
        ))}
      </ul>

      <section aria-labelledby="form-baslik" className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
        <Card className="p-5 md:p-8">
          <h2 id="form-baslik" className="text-2xl font-extrabold text-primary">
            Ön kayıt formu
          </h2>
          <p className="mt-1 text-muted">Tüm alanlar, aksi belirtilmedikçe zorunlu.</p>
          <div className="mt-6">
            <PreRegistrationForm initialTur={initialTur} />
          </div>
        </Card>
        <aside className="space-y-4">
          <Card>
            <h2 className="font-extrabold text-primary">Sonra ne olacak?</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted">
              <li>Ön kaydın bize e-postayla ulaşır.</li>
              <li>Ekibimiz seni arar, sorularını yanıtlar.</li>
              <li>Hazır olduğunda işletmen uygulamada yerini alır.</li>
            </ol>
          </Card>
          <Card>
            <h2 className="font-extrabold text-primary">Sorun mu var?</h2>
            <p className="mt-2 text-muted">
              Bize{" "}
              <a href={`mailto:${SITE.email}`} className="font-extrabold text-primary underline">
                {SITE.email}
              </a>{" "}
              adresinden de yazabilirsin.
            </p>
          </Card>
        </aside>
      </section>
    </div>
  );
}
