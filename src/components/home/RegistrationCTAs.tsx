import Link from "next/link";

export function RegistrationCTAs() {
  return (
    <section className="section-below-fold py-6 md:py-8">
      <div className="container-site grid gap-4 md:grid-cols-2 md:gap-5">
        <CTABanner
          href="/kayit/veteriner"
          title="Veteriner Kaydı"
          subtitle="Kliniğinizi PetLoog'a ekleyin"
          gradient="from-[#8B7A3C] to-[#6F6230]"
          icon={<StethoscopeIcon />}
        />
        <CTABanner
          href="/kayit/petshop"
          title="Market Kaydı"
          subtitle="Pet shopunuzu PetLoog'a taşıyın"
          gradient="from-[#6B442A] to-[#4A2A17]"
          icon={<BagIcon />}
        />
      </div>
    </section>
  );
}

function CTABanner({
  href,
  title,
  subtitle,
  gradient,
  icon,
}: {
  href: string;
  title: string;
  subtitle: string;
  gradient: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group relative flex items-center gap-4 overflow-hidden rounded-full bg-gradient-to-r ${gradient} px-5 py-4 text-white shadow-[0_14px_28px_-12px_rgba(74,42,23,0.45)] transition-transform duration-200 hover:scale-[1.015] active:scale-[0.99] md:gap-5 md:px-7 md:py-5`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 md:h-14 md:w-14">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-lg font-extrabold md:text-xl">{title}</span>
        <span className="mt-0.5 block text-sm text-white/85 md:text-[15px]">
          {subtitle}
        </span>
      </span>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 transition group-hover:bg-white/30">
        <ArrowIcon />
      </span>
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StethoscopeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 4v6a6 6 0 0 0 12 0V4" />
      <path d="M6 4h2M16 4h2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M18 16v-2a4 4 0 0 0-4-4h-1" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 8h12l1 12H5L6 8Z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  );
}
