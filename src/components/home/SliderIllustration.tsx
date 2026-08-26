"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SliderIllustrationProps = {
  id: string;
  className?: string;
};

/** Inline SVG — ağ isteği yok, lazy-load kayması yok */
export function SliderIllustration({ id, className }: SliderIllustrationProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden bg-[#efe8dc]",
        className,
      )}
      aria-hidden
    >
      {illustrations[id] ?? illustrations.mobil}
    </div>
  );
}

const paw = (
  <>
    <ellipse cx="0" cy="8" rx="10" ry="8" />
    <ellipse cx="-14" cy="-6" rx="5" ry="7" transform="rotate(-25)" />
    <ellipse cx="-5" cy="-14" rx="4.5" ry="6" transform="rotate(-8)" />
    <ellipse cx="5" cy="-14" rx="4.5" ry="6" transform="rotate(8)" />
    <ellipse cx="14" cy="-6" rx="5" ry="7" transform="rotate(25)" />
  </>
);

const illustrations: Record<string, ReactNode> = {
  mobil: (
    <svg viewBox="0 0 960 660" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mobil-bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#EFE6D8" />
          <stop offset="1" stopColor="#C8D9B0" />
        </linearGradient>
        <linearGradient id="mobil-phone" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#6B442A" />
          <stop offset="1" stopColor="#4A2A17" />
        </linearGradient>
      </defs>
      <rect width="960" height="660" fill="url(#mobil-bg)" />
      <circle cx="820" cy="120" r="90" fill="#8B7A3C" fillOpacity="0.15" />
      <circle cx="140" cy="560" r="110" fill="#5FA86B" fillOpacity="0.12" />
      <rect x="320" y="80" width="200" height="400" rx="28" fill="url(#mobil-phone)" />
      <rect x="338" y="110" width="164" height="300" rx="12" fill="#FFFDF9" />
      <g transform="translate(420 280) scale(2.2)" fill="#5FA86B" fillOpacity="0.85">
        {paw}
      </g>
      <ellipse cx="680" cy="420" rx="120" ry="70" fill="#D4A574" />
      <ellipse cx="620" cy="360" rx="35" ry="45" fill="#D4A574" transform="rotate(-20 620 360)" />
      <ellipse cx="740" cy="360" rx="35" ry="45" fill="#D4A574" transform="rotate(20 740 360)" />
      <circle cx="710" cy="400" r="18" fill="#4A2A17" fillOpacity="0.6" />
      <circle cx="650" cy="400" r="18" fill="#4A2A17" fillOpacity="0.6" />
      <path d="M640 440 Q710 480 760 430" stroke="#4A2A17" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="180" cy="480" rx="70" ry="45" fill="#8B7355" />
      <ellipse cx="140" cy="430" rx="22" ry="28" fill="#8B7355" transform="rotate(-25 140 430)" />
      <ellipse cx="220" cy="430" rx="22" ry="28" fill="#8B7355" transform="rotate(25 220 430)" />
    </svg>
  ),
  veteriner: (
    <svg viewBox="0 0 960 660" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="vet-bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#E8EDE0" />
          <stop offset="1" stopColor="#D5E0C4" />
        </linearGradient>
      </defs>
      <rect width="960" height="660" fill="url(#vet-bg)" />
      <rect x="120" y="100" width="720" height="460" rx="32" fill="#FFFDF9" fillOpacity="0.7" />
      <rect x="180" y="160" width="280" height="340" rx="20" fill="#5FA86B" fillOpacity="0.2" />
      <path d="M320 220 v120 M260 280 h120" stroke="#5FA86B" strokeWidth="18" strokeLinecap="round" />
      <circle cx="620" cy="280" r="80" fill="#D4A574" />
      <ellipse cx="560" cy="220" rx="28" ry="36" fill="#D4A574" transform="rotate(-25 560 220)" />
      <ellipse cx="680" cy="220" rx="28" ry="36" fill="#D4A574" transform="rotate(25 680 220)" />
      <rect x="560" y="380" width="120" height="80" rx="16" fill="#6B442A" fillOpacity="0.15" />
      <path d="M200 480 L760 480" stroke="#4A2A17" strokeOpacity="0.1" strokeWidth="2" />
      <circle cx="780" cy="520" r="50" fill="#8B7A3C" fillOpacity="0.2" />
    </svg>
  ),
  market: (
    <svg viewBox="0 0 960 660" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="market-bg" x1="0" y1="1" x2="1" y2="0">
          <stop stopColor="#F0E6D6" />
          <stop offset="1" stopColor="#E5D4BC" />
        </linearGradient>
      </defs>
      <rect width="960" height="660" fill="url(#market-bg)" />
      <rect x="100" y="140" width="760" height="380" rx="24" fill="#FFFDF9" fillOpacity="0.8" />
      <rect x="160" y="200" width="140" height="180" rx="16" fill="#8B7A3C" fillOpacity="0.25" />
      <rect x="340" y="200" width="140" height="180" rx="16" fill="#5FA86B" fillOpacity="0.25" />
      <rect x="520" y="200" width="140" height="180" rx="16" fill="#6B442A" fillOpacity="0.2" />
      <rect x="700" y="200" width="100" height="180" rx="16" fill="#D9534F" fillOpacity="0.15" />
      <circle cx="230" cy="290" r="40" fill="#D4A574" />
      <rect x="380" y="260" width="60" height="80" rx="8" fill="#4A2A17" fillOpacity="0.2" />
      <ellipse cx="580" cy="300" rx="35" ry="25" fill="#C9A882" />
      <path d="M160 420 h640" stroke="#4A2A17" strokeOpacity="0.15" strokeWidth="3" strokeDasharray="12 8" />
      <circle cx="850" cy="150" r="60" fill="#5FA86B" fillOpacity="0.15" />
    </svg>
  ),
  taksi: (
    <svg viewBox="0 0 960 660" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="taxi-bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#EDE4D4" />
          <stop offset="1" stopColor="#D8E8C8" />
        </linearGradient>
      </defs>
      <rect width="960" height="660" fill="url(#taxi-bg)" />
      <path d="M0 520 Q480 480 960 520 L960 660 L0 660 Z" fill="#5FA86B" fillOpacity="0.15" />
      <rect x="200" y="280" width="560" height="160" rx="24" fill="#8B7A3C" />
      <rect x="240" y="240" width="480" height="80" rx="16" fill="#6F6230" />
      <rect x="280" y="320" width="120" height="80" rx="8" fill="#87CEEB" fillOpacity="0.6" />
      <rect x="560" y="320" width="120" height="80" rx="8" fill="#87CEEB" fillOpacity="0.6" />
      <circle cx="300" cy="460" r="40" fill="#4A2A17" />
      <circle cx="660" cy="460" r="40" fill="#4A2A17" />
      <circle cx="300" cy="460" r="20" fill="#8A7568" />
      <circle cx="660" cy="460" r="20" fill="#8A7568" />
      <ellipse cx="780" cy="380" rx="50" ry="30" fill="#D4A574" />
      <ellipse cx="750" cy="350" rx="18" ry="24" fill="#D4A574" transform="rotate(-20 750 350)" />
      <rect x="720" y="400" width="80" height="50" rx="10" fill="#6B442A" fillOpacity="0.3" />
    </svg>
  ),
  kasko: (
    <svg viewBox="0 0 960 660" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="kasko-bg" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop stopColor="#E8EDE0" />
          <stop offset="1" stopColor="#D5C4A8" />
        </linearGradient>
      </defs>
      <rect width="960" height="660" fill="url(#kasko-bg)" />
      <path d="M480 120 L280 200 V380 C280 480 380 540 480 560 C580 540 680 480 680 380 V200 Z" fill="#5FA86B" fillOpacity="0.35" stroke="#5FA86B" strokeWidth="4" />
      <path d="M480 180 L340 240 V360 C340 430 400 475 480 490 C560 475 620 430 620 360 V240 Z" fill="#FFFDF9" fillOpacity="0.85" />
      <g transform="translate(480 340) scale(2)" fill="#5FA86B">
        {paw}
      </g>
      <ellipse cx="200" cy="480" rx="80" ry="50" fill="#D4A574" />
      <ellipse cx="760" cy="500" rx="60" ry="40" fill="#8B7355" />
      <circle cx="850" cy="130" r="70" fill="#8B7A3C" fillOpacity="0.15" />
    </svg>
  ),
  mahalle: (
    <svg viewBox="0 0 960 660" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mahalle-bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#F5EDE0" />
          <stop offset="1" stopColor="#C8D9B0" />
        </linearGradient>
      </defs>
      <rect width="960" height="660" fill="url(#mahalle-bg)" />
      <path d="M120 480 L280 320 L440 400 L600 280 L840 420 V520 H120 Z" fill="#5FA86B" fillOpacity="0.2" />
      <rect x="340" y="300" width="200" height="180" fill="#FFFDF9" fillOpacity="0.9" />
      <path d="M440 300 L440 480 M340 390 H540" stroke="#6B442A" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M340 300 L440 220 L540 300 Z" fill="#8B7A3C" fillOpacity="0.4" />
      <circle cx="620" cy="380" r="35" fill="#D4A574" />
      <circle cx="700" cy="400" r="28" fill="#8B7355" />
      <circle cx="560" cy="400" r="25" fill="#C9A882" />
      <rect x="680" y="360" width="100" height="70" rx="12" fill="#6B442A" fillOpacity="0.15" />
      <circle cx="180" cy="200" r="50" fill="#FFD93D" fillOpacity="0.4" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 960 660" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ai-bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#E8E4F0" />
          <stop offset="1" stopColor="#D5E0C4" />
        </linearGradient>
        <linearGradient id="ai-chip" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#8B7A3C" />
          <stop offset="1" stopColor="#4A2A17" />
        </linearGradient>
      </defs>
      <rect width="960" height="660" fill="url(#ai-bg)" />
      <circle cx="480" cy="330" r="160" fill="url(#ai-chip)" fillOpacity="0.15" />
      <rect x="360" y="210" width="240" height="240" rx="24" fill="url(#ai-chip)" />
      <rect x="390" y="240" width="180" height="180" rx="12" fill="#FFFDF9" />
      <circle cx="480" cy="330" r="50" fill="#5FA86B" fillOpacity="0.5" />
      <path d="M480 280 v100 M430 330 h100" stroke="#5FA86B" strokeWidth="8" strokeLinecap="round" />
      <line x1="360" y1="270" x2="300" y2="270" stroke="#8B7A3C" strokeWidth="4" />
      <line x1="600" y1="270" x2="660" y2="270" stroke="#8B7A3C" strokeWidth="4" />
      <line x1="360" y1="390" x2="300" y2="390" stroke="#8B7A3C" strokeWidth="4" />
      <line x1="600" y1="390" x2="660" y2="390" stroke="#8B7A3C" strokeWidth="4" />
      <ellipse cx="720" cy="480" rx="70" ry="45" fill="#D4A574" />
      <ellipse cx="240" cy="460" rx="55" ry="35" fill="#8B7355" />
      <circle cx="150" cy="150" r="8" fill="#8B7A3C" fillOpacity="0.5" />
      <circle cx="810" cy="180" r="12" fill="#5FA86B" fillOpacity="0.4" />
      <circle cx="780" cy="560" r="10" fill="#8B7A3C" fillOpacity="0.3" />
    </svg>
  ),
};
