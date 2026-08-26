import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Hakkımızda",
  description:
    "PetLoog hikayesi, vizyon, misyon, değerler ve iş ortakları.",
  path: "/hakkimizda",
});

const VALUES = [
  {
    title: "Güven",
    text: "Pet sahipleri ve işletmeler için şeffaf, güvenli süreçler.",
  },
  {
    title: "Merhamet",
    text: "Her kararın merkezinde evcil dostların refahı vardır.",
  },
  {
    title: "Yenilik",
    text: "AI ve dijital araçlarla pet yaşamını geleceğe taşıyoruz.",
  },
  {
    title: "Topluluk",
    text: "Mahalle Dostu ile lokal yardımlaşmayı güçlendiriyoruz.",
  },
];

export default function HakkimizdaPage() {
  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Anasayfa", path: "/" },
          { name: "Hakkımızda", path: "/hakkimizda" },
        ])}
      />
      <Breadcrumb
        items={[{ label: "Anasayfa", href: "/" }, { label: "Hakkımızda" }]}
      />

      <h1 className="text-3xl font-extrabold text-primary md:text-5xl">
        Hakkımızda
      </h1>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-2xl font-extrabold text-primary">PetLoog Hikayesi</h2>
        <p className="mt-3 text-base leading-relaxed text-primary/70">
          PetLoog, evcil hayvan sahiplerinin ve pet işletmelerinin parçalı
          dijital deneyimlerini tek ekosistemde birleştirmek için kuruldu. Mobil
          uygulama, veteriner paneli, pet market, AI asistan, kasko ve mahalle
          topluluğu aynı dilde çalışır.
        </p>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] bg-surface p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-extrabold text-primary">Vizyon</h2>
          <p className="mt-3 text-sm leading-relaxed text-primary/70">
            Türkiye’nin 81 ilinde pet yaşamını güvenli, erişilebilir ve akıllı
            hale getiren lider ekosistem olmak.
          </p>
        </article>
        <article className="rounded-[24px] bg-surface p-6 shadow-[var(--shadow-soft)]">
          <h2 className="text-xl font-extrabold text-primary">Misyon</h2>
          <p className="mt-3 text-sm leading-relaxed text-primary/70">
            Pet sahipleri ile klinik, market ve hizmet sağlayıcıları arasında
            kesintisiz, şeffaf ve insan odaklı dijital köprüler kurmak.
          </p>
        </article>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-primary">Değerler</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <article
              key={v.title}
              className="rounded-[24px] bg-surface p-5 shadow-[var(--shadow-soft)]"
            >
              <h3 className="font-extrabold text-primary">{v.title}</h3>
              <p className="mt-2 text-sm text-primary/70">{v.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-primary">İş Ortakları</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary/70">
          Veteriner klinikleri, pet shop’lar, sigorta ve lojistik partnerleriyle
          büyüyen bir ağ kuruyoruz. İş ortaklığı için veteriner veya market kayıt
          formlarından başvurabilirsiniz.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {["Klinik Ağı", "Market Ağı", "Teknoloji", "Sigorta"].map((p) => (
            <span
              key={p}
              className="rounded-full bg-[#EEE8DF] px-4 py-2 text-sm font-bold text-primary"
            >
              {p}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
