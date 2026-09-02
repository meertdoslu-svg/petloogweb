"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo, PetLoogMark } from "@/components/brand/Logo";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-primary/5 bg-[#F7F3EC]/90 shadow-[0_8px_24px_-16px_rgba(74,42,23,0.25)] backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="container-site flex h-[76px] items-center justify-between gap-4 md:h-[88px]">
        <Logo size="md" />

        <nav
          className="hidden items-center gap-7 lg:flex xl:gap-9"
          aria-label="Ana menü"
        >
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative pb-1 text-[15px] font-semibold tracking-wide transition-colors",
                  active ? "text-primary" : "text-primary/70 hover:text-primary",
                )}
              >
                {active ? (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <PetLoogMark size={14} />
                  </span>
                ) : null}
                {link.label}
                {active ? (
                  <span className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-success" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/iletisim"
            className="hidden items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-btn)] transition hover:scale-[1.03] active:scale-[0.98] sm:inline-flex"
          >
            Bize Ulaşın
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-primary shadow-[var(--shadow-soft)] lg:hidden"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-primary/5 bg-[#F7F3EC]/98 transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="container-site flex flex-col gap-1 py-4" aria-label="Mobil menü">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-2xl px-4 py-3 text-base font-semibold",
                  active
                    ? "bg-white text-primary shadow-[var(--shadow-soft)]"
                    : "text-primary/75",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/iletisim"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-white"
          >
            Bize Ulaşın
          </Link>
        </nav>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}
