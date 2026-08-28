import Link from "next/link";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { Button } from "@/components/ui/Button";
import { APP_STORE_LINK_VERIFIED, SITE, type ModulePage } from "@/lib/constants";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export function ModuleLanding({ module }: { module: ModulePage }) {
  const crumbs = [
    { label: "Anasayfa", href: "/" },
    { label: "Sistemlerimiz", href: "/sistemlerimiz" },
    { label: module.shortTitle },
  ];

  // The App Store URL isn't a verified live listing yet (see
  // APP_STORE_LINK_VERIFIED) — never present it as a working download CTA.
  const ctaIsUnverifiedAppStore =
    module.ctaHref === SITE.appStore && !APP_STORE_LINK_VERIFIED;

  return (
    <div className="container-site py-10 md:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Anasayfa", path: "/" },
            { name: "Sistemlerimiz", path: "/sistemlerimiz" },
            { name: module.shortTitle, path: `/moduller/${module.slug}` },
          ]),
          faqJsonLd(module.faqs),
        ]}
      />
      <Breadcrumb items={crumbs} />

      <header className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">
          PetLoog Modül
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-primary md:text-5xl">
          {module.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-primary/70 md:text-lg">
          {module.description}
        </p>
        <div className="mt-6">
          {ctaIsUnverifiedAppStore ? (
            <Button size="lg" disabled title="Uygulama yakında mağazalarda">
              Yakında
            </Button>
          ) : (
            <Link href={module.ctaHref}>
              <Button size="lg">{module.ctaLabel}</Button>
            </Link>
          )}
        </div>
      </header>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-primary">Özellikler</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {module.features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[24px] bg-surface p-6 shadow-[var(--shadow-soft)]"
            >
              <h3 className="text-lg font-extrabold text-primary">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-primary/70">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-primary">Ekran Görüntüleri</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="flex aspect-[4/3] items-center justify-center rounded-[24px] bg-gradient-to-br from-[#efe6d8] to-[#dfe8c8] shadow-[var(--shadow-soft)]"
            >
              <span className="text-sm font-bold text-primary/50">
                {module.shortTitle} · Görsel {n}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-primary">Avantajlar</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {module.advantages.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-sm font-semibold text-primary shadow-[var(--shadow-soft)]"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success/15 text-success">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold text-primary">
          Sık Sorulan Sorular
        </h2>
        <div className="mt-5 space-y-3">
          {module.faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-[20px] bg-surface p-5 shadow-[var(--shadow-soft)]"
            >
              <summary className="cursor-pointer list-none text-base font-extrabold text-primary">
                {faq.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-primary/70">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-[28px] bg-gradient-to-r from-accent to-secondary p-8 text-white shadow-[var(--shadow-card)] md:p-10">
        <h2 className="text-2xl font-extrabold md:text-3xl">
          {module.shortTitle} ile hemen başlayın
        </h2>
        <p className="mt-2 max-w-xl text-white/90">
          PetLoog ekosisteminin bir parçası olun; süreçlerinizi dijitalleştirin.
        </p>
        <div className="mt-6">
          {ctaIsUnverifiedAppStore ? (
            <span
              className="inline-flex cursor-not-allowed rounded-full bg-white/70 px-6 py-3 text-sm font-extrabold text-primary/60"
              title="Uygulama yakında mağazalarda"
            >
              Yakında
            </span>
          ) : (
            <Link
              href={module.ctaHref}
              className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-extrabold text-primary"
            >
              {module.ctaLabel}
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
