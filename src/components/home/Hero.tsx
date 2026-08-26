import { Logo } from "@/components/brand/Logo";
import { SITE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative pb-6 pt-6 md:pb-8 md:pt-10">
      <div className="container-site flex flex-col items-center text-center">
        <div className="fade-in-up relative">
          <Sparkle className="absolute -left-10 top-4 hidden text-success/70 sm:block md:-left-16" />
          <Sparkle className="absolute -right-10 top-4 hidden scale-x-[-1] text-success/70 sm:block md:-right-16" />
          <Logo size="hero" href={null} showTagline />
        </div>

        <h1 className="fade-in-up fade-in-up-delay mt-6 max-w-3xl text-2xl font-extrabold leading-tight tracking-tight text-primary sm:text-3xl md:mt-8 md:text-4xl lg:text-[2.65rem]">
          {SITE.slogan}
        </h1>
      </div>
    </section>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="36"
      viewBox="0 0 28 36"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M8 4c2 6 4 10 8 14"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M4 12c4 4 8 7 14 9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M6 22c5 2 9 3 14 3"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
