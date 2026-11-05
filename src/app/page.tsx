import Link from "next/link";
import { AppScreenPlaceholder } from "@/components/ui/AppScreenPlaceholder";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Card, Eyebrow, IconBadge } from "@/components/ui/Section";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { SahneSteps } from "@/components/sahne/SahneSteps";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: `${SITE.name} | ${SITE.slogan}`,
  description: SITE.description,
  path: "/",
});

type Feature = {
  id: string;
  icon: IconName;
  tone: "amber" | "success" | "danger" | "brown";
  eyebrow: string;
  title: string;
  text: string;
  points: string[];
  screen: string;
};

const FEATURES: Feature[] = [
  {
    id: "market",
    icon: "store",
    tone: "amber",
    eyebrow: "PetLoog Market",
    title: "Mahallendeki petshop'tan sipariş ver, kapıda öde",
    text: "Mama, kum, oyuncak… Yakınındaki petshop'un ürünlerine bak, sepete ekle. Ödemeyi sipariş kapına gelince yaparsın.",
    points: ["Yakınındaki petshop'lar", "Kapıda ödeme", "Mahalle esnafına destek"],
    screen: "Market ve sepet ekranı",
  },
  {
    id: "veteriner",
    icon: "stethoscope",
    tone: "success",
    eyebrow: "Veteriner ve Acil",
    title: "Şu an açık veterineri hemen bul",
    text: "Gece yarısı ya da pazar sabahı fark etmez. Açık olan veterinerleri görürsün; acil bir durumda en yakın kliniğe tek dokunuşla ulaşırsın.",
    points: ["Şu an açık olanlar", "Acil ve nöbetçi klinikler", "Yol tarifi ve arama"],
    screen: "Açık veterinerler ve Acil ekranı",
  },
  {
    id: "hatirlatma",
    icon: "bell",
    tone: "brown",
    eyebrow: "Hatırlatma",
    title: "Mama bitmeden haberin olsun",
    text: "Paketin ne zaman biteceğini biz hesaplarız, sen son güne kalmazsın. Aradığın ürünü bulamıyorsan \"Bu ürün nerede var?\" diye sor, hangi petshop'ta olduğunu gör.",
    points: ["Mama bitmeden hatırlatma", "\"Bu ürün nerede var?\"", "Tek dokunuşla yeniden sipariş"],
    screen: "Hatırlatma ve ürün arama ekranı",
  },
  {
    id: "mekanlar",
    icon: "coffee",
    tone: "amber",
    eyebrow: "Pati dostu mekanlar",
    title: "Patinle gidebileceğin yerleri keşfet",
    text: "Kafe, restoran, park… Patini rahatça götürebileceğin mekanları haritada gör, gitmeden önce bil.",
    points: ["Harita üzerinde mekanlar", "Yakınındakiler önce", "Gitmeden önce bilgi"],
    screen: "Pati dostu mekanlar haritası",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="container-site grid items-center gap-10 pb-10 pt-8 md:grid-cols-[1.15fr_0.85fr] md:pb-16 md:pt-14">
        <div>
          <Eyebrow>Mahallendeki pati dünyası</Eyebrow>
          <h1 className="mt-3 text-[2.25rem] font-extrabold leading-[1.1] text-primary md:text-[3.5rem]">
            Patin için ihtiyacın olan her şey, mahallende.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Mahalle petshop&apos;undan kapıda ödemeli alışveriş, şu an açık
            veteriner, mama bitmeden hatırlatma ve pati dostu mekanlar. Bir de
            her gün yeni bir konuyla Sahne.
          </p>
          <StoreBadges className="mt-7" />
          <p className="mt-3 text-sm text-muted">
            Uygulama çok yakında mağazalarda.
          </p>
        </div>
        <AppScreenPlaceholder label="Ana ekran" />
      </section>

      {/* Quick nav */}
      <section aria-label="Öne çıkanlar" className="container-site">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { href: "#market", icon: "cart", label: "Market" },
            { href: "#veteriner", icon: "stethoscope", label: "Veteriner ve Acil" },
            { href: "#hatirlatma", icon: "bell", label: "Hatırlatma" },
            { href: "#mekanlar", icon: "pin", label: "Mekanlar" },
            { href: "/sahne", icon: "star", label: "Sahne" },
          ].map((item) => (
            <li key={item.href} className={item.href === "/sahne" ? "col-span-2 md:col-span-1" : undefined}>
              <Link
                href={item.href}
                className="flex min-h-14 items-center gap-3 rounded-2xl border border-line bg-surface px-4 font-extrabold text-primary transition-colors hover:border-secondary"
              >
                <Icon name={item.icon as IconName} size={22} className="text-amber" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Features */}
      <div className="container-site mt-16 space-y-16 md:mt-24 md:space-y-24">
        {FEATURES.map((f, i) => (
          <section
            key={f.id}
            id={f.id}
            aria-labelledby={`${f.id}-baslik`}
            className="grid scroll-mt-24 items-center gap-8 md:grid-cols-2 md:gap-14"
          >
            <div className={i % 2 === 1 ? "md:order-2" : undefined}>
              <IconBadge name={f.icon} tone={f.tone} />
              <p className="mt-4 text-sm font-extrabold text-secondary">{f.eyebrow}</p>
              <h2
                id={`${f.id}-baslik`}
                className="mt-1 text-[1.75rem] font-extrabold leading-tight text-primary md:text-4xl"
              >
                {f.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">{f.text}</p>
              <ul className="mt-5 space-y-2.5">
                {f.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 font-bold text-primary">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-success/15 text-success">
                      <Icon name="check" size={16} strokeWidth={2.25} />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <AppScreenPlaceholder label={f.screen} className={i % 2 === 1 ? "md:order-1" : undefined} />
          </section>
        ))}
      </div>

      {/* Sahne */}
      <section
        aria-labelledby="sahne-baslik"
        className="container-site mt-20 md:mt-28"
      >
        <div className="rounded-[2rem] bg-primary px-6 py-10 text-surface md:px-12 md:py-14">
          <p className="text-sm font-extrabold text-line">Sahne</p>
          <h2 id="sahne-baslik" className="mt-2 text-[1.9rem] font-extrabold leading-tight md:text-[2.75rem]">
            Her gün yeni bir konu, her gece yeni bir yıldız.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-surface/85">
            Günün konusuna uygun patinin fotoğrafını gönder. Gece 00:00&apos;da
            sahneye çıkar, oylarla &quot;Sahnenin yıldızı&quot; seçilir.
          </p>
          <SahneSteps variant="dark" className="mt-8" />
          <ButtonLink href="/sahne" variant="outline" size="lg" className="mt-8">
            Sahne nasıl çalışır?
            <Icon name="arrowRight" size={20} />
          </ButtonLink>
        </div>
      </section>

      {/* Business CTA */}
      <section aria-labelledby="isletme-baslik" className="container-site mt-16 md:mt-24">
        <Card className="grid gap-6 p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <h2 id="isletme-baslik" className="text-2xl font-extrabold text-primary md:text-3xl">
              Petshop ya da veteriner misin?
            </h2>
            <p className="mt-2 max-w-xl text-lg text-muted">
              Mahallendeki pati sahiplerine ulaş. Ön kayıt formunu doldur, seni
              arayalım.
            </p>
          </div>
          <ButtonLink href="/isletmeler" size="lg">
            Ön kayıt yap
            <Icon name="arrowRight" size={20} />
          </ButtonLink>
        </Card>
      </section>
    </>
  );
}
