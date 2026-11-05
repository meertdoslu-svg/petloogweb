import Link from "next/link";
import { SahneSteps } from "@/components/sahne/SahneSteps";
import { JsonLd } from "@/components/seo/JsonLd";
import { AppScreenPlaceholder } from "@/components/ui/AppScreenPlaceholder";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Card, IconBadge, PageHeader } from "@/components/ui/Section";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Sahne",
  description:
    "Her gün yeni bir konu. Patinin fotoğrafını gönder, gece 00:00'da sahneye çıksın, oylarla Sahnenin yıldızı seçilsin, hikâye kartıyla paylaş.",
  path: "/sahne",
});

const HIGHLIGHTS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "calendar",
    title: "Her gün yeni konu",
    text: "Her gün başka bir konu seni bekler. Konuyu uygulamada görür, fotoğrafını ona göre seçersin.",
  },
  {
    icon: "heart",
    title: "Oyla, oylan",
    text: "Sahnedeki fotoğraflara göz at, en sevdiklerine oy ver.",
  },
  {
    icon: "share",
    title: "Hikâye kartı",
    text: "Patin sahneye çıktığında ya da yıldız olduğunda hazır hikâye kartıyla paylaş.",
  },
];

const FAQS = [
  {
    q: "Fotoğrafımı ne zaman gönderebilirim?",
    a: "Günün konusu yayındayken gün içinde istediğin zaman gönderebilirsin. Gönderilen fotoğraflar gece 00:00'da sahneye çıkar.",
  },
  {
    q: "Sahnenin yıldızı nasıl seçilir?",
    a: "Sahnedeki fotoğraflar oylanır. En çok oyu alan pati günün \"Sahnenin yıldızı\" olur.",
  },
  {
    q: "Hangi fotoğrafları gönderebilirim?",
    a: "Kendi çektiğin, patinin göründüğü ve günün konusuna uyan fotoğrafları. Ayrıntılar Sahne kurallarında.",
  },
];

export default function SahnePage() {
  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Ana sayfa", path: "/" },
            { name: "Sahne", path: "/sahne" },
          ]),
          faqJsonLd(FAQS),
        ]}
      />

      <div className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <PageHeader
          eyebrow="Sahne"
          title="Her gün yeni bir konu, her gece yeni bir yıldız."
          lead="Patinin fotoğrafını gönder, gece 00:00'da sahneye çıksın. Oylar toplanır, Sahnenin yıldızı seçilir. Sonra hikâye kartıyla paylaşırsın."
        >
          <StoreBadges className="mt-7" />
        </PageHeader>
        <AppScreenPlaceholder label="Sahne ekranı" />
      </div>

      <section aria-labelledby="nasil-calisir" className="mt-16">
        <h2 id="nasil-calisir" className="text-2xl font-extrabold text-primary md:text-3xl">
          Nasıl çalışır?
        </h2>
        <SahneSteps className="mt-6" />
      </section>

      <section aria-label="Sahne'nin öne çıkanları" className="mt-16 grid gap-4 md:grid-cols-3">
        {HIGHLIGHTS.map((h) => (
          <Card key={h.title}>
            <IconBadge name={h.icon} tone="brown" />
            <h3 className="mt-4 text-lg font-extrabold text-primary">{h.title}</h3>
            <p className="mt-1.5 leading-relaxed text-muted">{h.text}</p>
          </Card>
        ))}
      </section>

      <section aria-label="Ekran görüntüleri" className="mt-16 grid gap-8 sm:grid-cols-3">
        <AppScreenPlaceholder label="Günün konusu ve fotoğraf gönderme" />
        <AppScreenPlaceholder label="Oylama" />
        <AppScreenPlaceholder label="Sahnenin yıldızı hikâye kartı" />
      </section>

      <section aria-labelledby="sss" className="mt-16 max-w-3xl">
        <h2 id="sss" className="text-2xl font-extrabold text-primary md:text-3xl">
          Sık sorulanlar
        </h2>
        <div className="mt-5 space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-3xl border border-line bg-surface p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold text-primary">
                {f.q}
                <Icon name="arrowRight" size={20} className="shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-2 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-muted">
          Katılmadan önce{" "}
          <Link href="/yasal/sahne-kurallari" className="font-extrabold text-primary underline">
            Sahne kurallarına
          </Link>{" "}
          göz at.
        </p>
      </section>
    </div>
  );
}
