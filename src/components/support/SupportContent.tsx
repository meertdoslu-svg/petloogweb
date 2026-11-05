import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Card, IconBadge, PageHeader } from "@/components/ui/Section";
import { SITE } from "@/lib/constants";
import { faqJsonLd } from "@/lib/seo";

const TOPICS: { icon: IconName; title: string; items: string[] }[] = [
  { icon: "user", title: "Hesap ve giriş", items: ["Hesap oluşturma", "Giriş sorunları", "Profil ayarları"] },
  { icon: "cart", title: "PetLoog Market", items: ["Siparişler", "Kapıda ödeme", "Teslimat", "İade ve iptal"] },
  { icon: "stethoscope", title: "Veteriner ve Acil", items: ["Açık veteriner bulma", "Acil durumlar", "Klinik bilgileri"] },
  { icon: "bell", title: "Hatırlatmalar", items: ["Mama hatırlatması", "\"Bu ürün nerede var?\"", "Bildirim ayarları"] },
  { icon: "pin", title: "Pati dostu mekanlar", items: ["Mekan bilgileri", "Yanlış bilgi bildirme", "Mekan önerme"] },
  { icon: "star", title: "Sahne", items: ["Fotoğraf gönderme", "Oylama", "Hikâye kartı", "İçerik bildirme"] },
];

export const SUPPORT_FAQS = [
  {
    q: "Siparişimi nasıl öderim?",
    a: "PetLoog Market'te siparişini mahallendeki petshop hazırlar, ödemeyi sipariş kapına geldiğinde yaparsın.",
  },
  {
    q: "Acil bir durumda ne yapmalıyım?",
    a: "Uygulamadaki Acil bölümünden şu an açık klinikleri görüp en yakınına ulaşabilirsin. Hayati bir durumda vakit kaybetmeden en yakın veteriner kliniğine git.",
  },
  {
    q: "Sahne'ye gönderdiğim fotoğraf ne zaman yayınlanır?",
    a: "Gün içinde gönderilen fotoğraflar gece 00:00'da sahneye çıkar ve oylama başlar.",
  },
  {
    q: "Hesabımı nasıl silerim?",
    a: "Uygulamada Profil → Hesabımı Sil adımlarını izle. Ayrıntılı anlatım Hesap silme sayfasında.",
  },
  {
    q: "Size ne kadar sürede dönüyorsunuz?",
    a: "Hafta içi genellikle 1–2 iş günü içinde yanıt veriyoruz.",
  },
];

export function SupportContent() {
  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd data={faqJsonLd(SUPPORT_FAQS)} />
      <Breadcrumb items={[{ label: "Ana sayfa", href: "/" }, { label: "Destek" }]} />
      <PageHeader
        eyebrow="Destek"
        title="Nasıl yardımcı olabiliriz?"
        lead="Bir sorun mu yaşıyorsun ya da aklına takılan bir şey mi var? Bize yaz, birlikte çözelim."
      />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <IconBadge name="mail" />
            <div>
              <h2 className="font-extrabold text-primary">E-posta</h2>
              <a href={`mailto:${SITE.email}`} className="font-bold text-secondary underline">
                {SITE.email}
              </a>
            </div>
          </div>
          <p className="text-muted">
            Sorununu kısaca anlat; telefon modeli, uygulama sürümü ve ekran
            görüntüsü eklersen daha hızlı çözeriz. Kart bilgisi gönderme.
          </p>
        </Card>
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <IconBadge name="trash" tone="danger" />
            <h2 className="font-extrabold text-primary">Hesabını silmek mi istiyorsun?</h2>
          </div>
          <p className="text-muted">Uygulamada Profil → Hesabımı Sil adımlarını izle.</p>
          <ButtonLink href="/yasal/hesap-silme" variant="outline" className="self-start">
            Adım adım anlatım
            <Icon name="arrowRight" size={18} />
          </ButtonLink>
        </Card>
      </div>

      <section aria-labelledby="konular" className="mt-14">
        <h2 id="konular" className="text-2xl font-extrabold text-primary md:text-3xl">
          Konular
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t) => (
            <Card as="li" key={t.title}>
              <IconBadge name={t.icon} tone="brown" />
              <h3 className="mt-4 font-extrabold text-primary">{t.title}</h3>
              <ul className="mt-2 space-y-1 text-muted">
                {t.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </Card>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sss" className="mt-14 max-w-3xl">
        <h2 id="sss" className="text-2xl font-extrabold text-primary md:text-3xl">
          Sık sorulanlar
        </h2>
        <div className="mt-5 space-y-3">
          {SUPPORT_FAQS.map((f) => (
            <details key={f.q} className="group rounded-3xl border border-line bg-surface p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-extrabold text-primary">
                {f.q}
                <Icon name="arrowRight" size={20} className="shrink-0 transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-2 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-10 text-muted">
        Gizlilik ve kişisel verilerle ilgili talepler için:{" "}
        <a href={`mailto:${SITE.legalEmail}`} className="font-extrabold text-primary underline">
          {SITE.legalEmail}
        </a>
        . Ayrıca bkz.{" "}
        <Link href="/privacy" className="font-extrabold text-primary underline">
          Gizlilik politikası
        </Link>
        .
      </p>
    </div>
  );
}
