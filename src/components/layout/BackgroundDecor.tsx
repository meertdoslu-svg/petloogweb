export function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-bg" />
      <div className="absolute inset-0 bg-paw-pattern opacity-70" />

      <div className="ambient-blur absolute -left-24 -top-16 hidden h-72 w-72 rounded-full bg-[#dfe8c8]/50 blur-3xl md:block" />
      <div className="ambient-blur ambient-blur-delay absolute -right-20 top-40 hidden h-80 w-80 rounded-full bg-[#e8d9c4]/60 blur-3xl md:block" />
      <div className="ambient-blur ambient-blur-slow absolute bottom-10 left-1/3 hidden h-64 w-64 rounded-full bg-[#c9d4b0]/35 blur-3xl md:block" />

      <Leaf className="absolute left-2 top-24 h-28 w-28 rotate-[-18deg] opacity-40 md:left-6 md:top-32 md:h-40 md:w-40" />
      <Leaf className="absolute -right-4 bottom-40 h-24 w-24 rotate-[28deg] scale-x-[-1] opacity-35 md:right-4 md:h-36 md:w-36" />
      <Leaf className="absolute bottom-8 left-8 h-20 w-20 rotate-[12deg] opacity-30 md:bottom-16 md:left-16 md:h-28 md:w-28" />

      <PawPrint className="absolute right-[12%] top-[18%] h-28 w-28 opacity-[0.07] rotate-12" />
      <PawPrint className="absolute left-[8%] top-[48%] h-36 w-36 opacity-[0.06] -rotate-6" />
      <PawPrint className="absolute right-[18%] bottom-[22%] h-32 w-32 opacity-[0.07] rotate-[-20deg]" />
    </div>
  );
}

function Leaf({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 95C28 55 55 28 98 18C88 55 68 78 28 98C24 99 21 98 20 95Z"
        fill="#7FA06A"
        fillOpacity="0.55"
      />
      <path
        d="M28 98C48 72 72 48 98 18"
        stroke="#5C7A4A"
        strokeOpacity="0.45"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M42 70C52 62 64 50 76 38"
        stroke="#5C7A4A"
        strokeOpacity="0.35"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PawPrint({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="#4A2A17">
      <ellipse cx="50" cy="62" rx="18" ry="14" />
      <ellipse cx="28" cy="38" rx="9" ry="12" transform="rotate(-25 28 38)" />
      <ellipse cx="42" cy="28" rx="8" ry="11" transform="rotate(-8 42 28)" />
      <ellipse cx="58" cy="28" rx="8" ry="11" transform="rotate(8 58 28)" />
      <ellipse cx="72" cy="38" rx="9" ry="12" transform="rotate(25 72 38)" />
    </svg>
  );
}
