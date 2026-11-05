import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { FOOTER_LINKS, SITE, SOCIAL_LINKS } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="container-site py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted">
              Mahallendeki petshop, açık veteriner, pati dostu mekanlar ve her
              gün yeni bir Sahne. Hepsi tek uygulamada.
            </p>
            <StoreBadges className="mt-5" />
          </div>

          <FooterColumn title="PetLoog" links={FOOTER_LINKS.petloog} />
          <FooterColumn title="Yardım" links={FOOTER_LINKS.yardim} />
          <FooterColumn title="Yasal" links={FOOTER_LINKS.yasal} />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>© {year} PetLoog</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a className="font-bold hover:text-primary" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            {SOCIAL_LINKS.instagram ? (
              <a
                className="font-bold hover:text-primary"
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            ) : null}
          </div>
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
      <h2 className="text-sm font-extrabold text-primary">{title}</h2>
      <ul className="mt-3 space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-9 items-center text-[15px] text-muted transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
