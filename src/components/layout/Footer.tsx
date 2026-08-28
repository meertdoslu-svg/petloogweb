import Link from "next/link";
import { Logo, PetLoogMark } from "@/components/brand/Logo";
import { APP_STORE_LINK_VERIFIED, FOOTER_LINKS, SITE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-16 border-t border-primary/8 pb-8 pt-12 md:mt-24">
      <div className="container-site">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr_1fr] md:items-start lg:grid-cols-[1.2fr_1fr_1fr_1.1fr]">
          <div>
            <Logo size="sm" href="/" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary/65">
              Evcil dostunuz için tek platform. Sağlık, market, topluluk ve daha
              fazlası PetLoog’da.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {APP_STORE_LINK_VERIFIED ? (
                <StoreBadge href={SITE.appStore} label="App Store" />
              ) : (
                <StoreBadge label="App Store" comingSoon />
              )}
              <StoreBadge href={SITE.googlePlay} label="Google Play" />
            </div>
          </div>

          <FooterColumn title="Kurumsal" links={FOOTER_LINKS.kurumsal} />
          <FooterColumn title="Yasal" links={FOOTER_LINKS.yasal} />

          <div>
            <h3 className="mb-3 text-sm font-extrabold tracking-wide text-primary">
              İletişim
            </h3>
            <ul className="space-y-2 text-sm text-primary/70">
              <li>
                <a className="hover:text-primary" href={`mailto:${SITE.email}`}>
                  {SITE.email}
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href={`tel:${SITE.phone.replace(/\s/g, "")}`}>
                  {SITE.phone}
                </a>
              </li>
              <li>{SITE.address}</li>
            </ul>
            <div className="mt-5 flex items-center gap-2.5">
              <SocialCircle href={SITE.social.instagram} label="Instagram">
                <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5Zm8.2 2.2H7.8A2.6 2.6 0 0 0 5.2 7.8v8.4a2.6 2.6 0 0 0 2.6 2.6h8.4a2.6 2.6 0 0 0 2.6-2.6V7.8a2.6 2.6 0 0 0-2.6-2.6ZM12 8.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2Zm0 1.6A2.2 2.2 0 1 0 14.2 12 2.2 2.2 0 0 0 12 9.8Zm4.35-2.95a.9.9 0 1 1-.9.9.9.9 0 0 1 .9-.9Z" />
              </SocialCircle>
              <SocialCircle href={SITE.social.facebook} label="Facebook">
                <path d="M14.2 8.5h2.1V5.8h-2.2c-2.5 0-4.1 1.5-4.1 4.1v1.7H8.2v2.8h1.8V22h3.1v-7.6h2.3l.5-2.8h-2.8V10.2c0-.9.4-1.7 1.6-1.7Z" />
              </SocialCircle>
              <SocialCircle href={SITE.social.x} label="X">
                <path d="M6.2 5.5h2.6l3.3 4.5 3.9-4.5H18l-5 5.8 5.3 7.2h-2.6l-3.6-4.9-4.3 4.9H6.5l5.3-6.1L6.2 5.5Zm2 1.4 8.3 11.2h1.1L9.3 6.9H8.2Z" />
              </SocialCircle>
              <SocialCircle href={SITE.social.youtube} label="YouTube">
                <path d="M21.2 8.2a2.7 2.7 0 0 0-1.9-1.9C17.6 6 12 6 12 6s-5.6 0-7.3.3A2.7 2.7 0 0 0 2.8 8.2 28.4 28.4 0 0 0 2.5 12a28.4 28.4 0 0 0 .3 3.8 2.7 2.7 0 0 0 1.9 1.9C6.4 18 12 18 12 18s5.6 0 7.3-.3a2.7 2.7 0 0 0 1.9-1.9 28.4 28.4 0 0 0 .3-3.8 28.4 28.4 0 0 0-.3-3.8ZM10.2 14.7V9.3L15 12l-4.8 2.7Z" />
              </SocialCircle>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-primary/10 pt-6 text-center md:flex-row md:text-left">
          <a
            href={SITE.url}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary/75 hover:text-primary"
          >
            petloog.com
            <PetLoogMark size={14} />
          </a>
          <p className="text-xs text-primary/55">
            © {year} PetLoog. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-extrabold tracking-wide text-primary">
        {title}
      </h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-primary/70 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialCircle({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-105"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        {children}
      </svg>
    </a>
  );
}

function StoreBadge({
  href,
  label,
  comingSoon = false,
}: {
  href?: string;
  label: string;
  comingSoon?: boolean;
}) {
  if (comingSoon || !href) {
    return (
      <span
        className="rounded-full border border-primary/15 bg-white/40 px-3 py-1.5 text-xs font-bold text-primary/50"
        aria-label={`${label} — yakında`}
      >
        {label} · Yakında
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border border-primary/15 bg-white/70 px-3 py-1.5 text-xs font-bold text-primary/80 transition hover:bg-white"
    >
      {label}
    </a>
  );
}
