import Link from "next/link";
import { ContactForm } from "@/components/forms/ContactForm";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card, IconBadge, PageHeader } from "@/components/ui/Section";
import { SITE, SOCIAL_LINKS } from "@/lib/constants";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "İletişim",
  description: "PetLoog'a yaz: iletişim formu ve info@petloog.com.",
  path: "/iletisim",
});

export default function IletisimPage() {
  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Ana sayfa", path: "/" },
          { name: "İletişim", path: "/iletisim" },
        ])}
      />
      <Breadcrumb items={[{ label: "Ana sayfa", href: "/" }, { label: "İletişim" }]} />
      <PageHeader
        eyebrow="İletişim"
        title="Bize yaz."
        lead="Soru, öneri ya da sadece merhaba. Formu doldur ya da e-posta gönder; hafta içi 1–2 iş günü içinde dönüyoruz."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5 md:p-8">
          <h2 className="text-xl font-extrabold text-primary">İletişim formu</h2>
          <div className="mt-5">
            <ContactForm />
          </div>
        </Card>

        <aside className="space-y-4">
          <Card className="flex items-center gap-3">
            <IconBadge name="mail" />
            <div>
              <h2 className="font-extrabold text-primary">E-posta</h2>
              <a href={`mailto:${SITE.email}`} className="font-bold text-secondary underline">
                {SITE.email}
              </a>
            </div>
          </Card>
          {SOCIAL_LINKS.instagram ? (
            <Card className="flex items-center gap-3">
              <IconBadge name="camera" tone="brown" />
              <div>
                <h2 className="font-extrabold text-primary">Instagram</h2>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-secondary underline"
                >
                  @petloogapp
                </a>
              </div>
            </Card>
          ) : null}
          <Card>
            <h2 className="font-extrabold text-primary">Petshop ya da veteriner misin?</h2>
            <p className="mt-1.5 text-muted">
              Ön kayıt için{" "}
              <Link href="/isletmeler" className="font-extrabold text-primary underline">
                işletmeler sayfasına
              </Link>{" "}
              göz at.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}
