"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SliderIllustration } from "@/components/home/SliderIllustration";
import { SLIDER_CARDS, type SliderCard } from "@/lib/constants";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 5000;

export function ServiceSlider() {
  const [index, setIndex] = useState(0);
  const pauseRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const count = SLIDER_CARDS.length;

  const goTo = useCallback((next: number) => {
    setIndex(((next % count) + count) % count);
  }, [count]);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!pauseRef.current) setIndex((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [count]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    if (start == null) return;
    const end = event.changedTouches[0]?.clientX ?? start;
    const delta = end - start;
    if (delta < -50) next();
    else if (delta > 50) prev();
  };

  const visibleCards = getVisibleCards(index, count);
  const activeCard = SLIDER_CARDS[index];

  return (
    <section
      className="relative py-4 md:py-6"
      onMouseEnter={() => {
        pauseRef.current = true;
      }}
      onMouseLeave={() => {
        pauseRef.current = false;
      }}
      aria-roledescription="carousel"
      aria-label="PetLoog sistemleri"
    >
      <div className="container-site relative">
        <NavButton direction="prev" onClick={prev} />
        <NavButton direction="next" onClick={next} />

        <div
          className="md:hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div key={activeCard.id} className="slider-fade-in">
            <ServiceCard card={activeCard} featured />
          </div>
        </div>

        <div className="hidden md:grid md:grid-cols-3 md:gap-5 lg:gap-6">
          {visibleCards.map((card) => (
            <div key={card.id} className="slider-card-transition">
              <ServiceCard
                card={card}
                featured={card.id === activeCard.id}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2" role="tablist">
          {SLIDER_CARDS.map((card, i) => (
            <button
              key={card.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${card.title} slaytı`}
              onClick={() => goTo(i)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                i === index
                  ? "w-6 bg-accent"
                  : "w-2.5 bg-primary/20 hover:bg-primary/35",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function NavButton({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Önceki kart" : "Sonraki kart"}
      className={cn(
        "absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-primary shadow-[var(--shadow-soft)] transition hover:scale-105 active:scale-95",
        isPrev
          ? "left-0 md:-left-1 lg:-left-3 xl:-left-5"
          : "right-0 md:-right-1 lg:-right-3 xl:-right-5",
      )}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        aria-hidden
      >
        {isPrev ? (
          <path d="M15 18l-6-6 6-6" />
        ) : (
          <path d="M9 18l6-6-6-6" />
        )}
      </svg>
    </button>
  );
}

function getVisibleCards(index: number, count: number) {
  return [
    SLIDER_CARDS[(index - 1 + count) % count],
    SLIDER_CARDS[index],
    SLIDER_CARDS[(index + 1) % count],
  ];
}

function ServiceCard({
  card,
  featured,
}: {
  card: SliderCard;
  featured?: boolean;
}) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[28px] bg-surface shadow-[var(--shadow-card)] transition-[transform,opacity,box-shadow] duration-300 ease-out",
        featured
          ? "md:scale-[1.02] md:shadow-[var(--shadow-card)]"
          : "md:scale-[0.97] md:opacity-90",
      )}
    >
      <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden">
        <SliderIllustration id={card.id} />
        <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/90 text-white shadow-md">
          <CardIcon type={card.icon} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-lg font-extrabold leading-snug text-primary md:text-xl">
          {card.title}
        </h3>
        <ul className="mt-3 space-y-2">
          {card.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm font-medium text-primary/75"
            >
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <CheckIcon />
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-5">
          <Link
            href={card.href}
            prefetch
            className="inline-flex items-center gap-2 rounded-full bg-[#EEE8DF] px-4 py-2.5 text-sm font-bold text-primary transition hover:bg-[#e5ddd1]"
          >
            Detaylı İncele
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CardIcon({ type }: { type: SliderCard["icon"] }) {
  const common = { width: 18, height: 18, fill: "currentColor" };
  switch (type) {
    case "paw":
      return (
        <svg {...common} viewBox="0 0 20 20">
          <ellipse cx="10" cy="13" rx="4.5" ry="3.5" />
          <ellipse cx="4.5" cy="7" rx="2.2" ry="2.8" transform="rotate(-25 4.5 7)" />
          <ellipse cx="8" cy="4.8" rx="2" ry="2.6" transform="rotate(-8 8 4.8)" />
          <ellipse cx="12" cy="4.8" rx="2" ry="2.6" transform="rotate(8 12 4.8)" />
          <ellipse cx="15.5" cy="7" rx="2.2" ry="2.8" transform="rotate(25 15.5 7)" />
        </svg>
      );
    case "stethoscope":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 4v6a6 6 0 0 0 12 0V4" />
          <path d="M6 4h2M16 4h2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M18 16v-2a4 4 0 0 0-4-4h-1" />
        </svg>
      );
    case "cart":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="17" cy="20" r="1.5" />
          <path d="M3 4h2l2.4 11h9.8l2-8H7" />
        </svg>
      );
    case "taxi":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 16h16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2Z" />
          <path d="M5 16 7 9h10l2 7" />
          <circle cx="8" cy="18.5" r="0.5" fill="currentColor" />
          <circle cx="16" cy="18.5" r="0.5" fill="currentColor" />
          <path d="M9 9V7h6v2" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3 5 6v5c0 4.5 3 8 7 9 4-1 7-4.5 7-9V6l-7-3Z" />
        </svg>
      );
    case "home":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m4 11 8-7 8 7" />
          <path d="M6 10v9h12v-9" />
        </svg>
      );
    case "ai":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
        </svg>
      );
    default:
      return null;
  }
}
