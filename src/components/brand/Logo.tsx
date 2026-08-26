import Link from "next/link";
import { cn } from "@/lib/utils";

/** Resmi PetLoog P + pati ikonu */
export const PETLOOG_BRAND_BROWN = "#6D3D28";

type LogoProps = {
  size?: "sm" | "md" | "lg" | "hero";
  showTagline?: boolean;
  href?: string | null;
  className?: string;
};

const sizeMap = {
  sm: { icon: 36, text: "text-xl", tag: "text-[8px]", gap: "gap-2" },
  md: { icon: 44, text: "text-2xl", tag: "text-[9px]", gap: "gap-2.5" },
  lg: { icon: 56, text: "text-3xl", tag: "text-[10px]", gap: "gap-3" },
  hero: {
    icon: 120,
    text: "text-5xl md:text-6xl lg:text-7xl",
    tag: "text-xs md:text-sm",
    gap: "gap-5",
  },
} as const;

/** Mobil uygulama ile aynı resmi P + pati markası (şeffaf PNG) */
export function PetLoogMark({
  size,
  className,
  priority = false,
}: {
  size: number;
  className?: string;
  priority?: boolean;
}) {
  const src =
    size >= 100
      ? "/brand/logo-256.png"
      : size >= 48
        ? "/brand/logo-128.png"
        : "/brand/logo-128.png";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={cn("shrink-0 object-contain", className)}
      aria-hidden
    />
  );
}

export function Logo({
  size = "md",
  showTagline = true,
  href = "/",
  className,
}: LogoProps) {
  const s = sizeMap[size];

  const content = (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <PetLoogMark
        size={s.icon}
        priority={size === "hero"}
        className={
          size === "hero"
            ? "h-[5.5rem] w-[5.5rem] md:h-[7rem] md:w-[7rem] lg:h-[7.5rem] lg:w-[7.5rem]"
            : undefined
        }
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-extrabold tracking-tight text-primary",
            s.text,
          )}
        >
          PetLoog
        </span>
        {showTagline ? (
          <span
            className={cn(
              "mt-1.5 flex items-center gap-2 font-bold tracking-[0.22em] text-primary/70",
              s.tag,
            )}
          >
            <span className="h-px w-3 bg-primary/35" aria-hidden />
            PATİ EKOSİSTEMİ
            <span className="h-px w-3 bg-primary/35" aria-hidden />
          </span>
        ) : null}
      </span>
    </span>
  );

  if (href === null) return content;

  return (
    <Link href={href} className="inline-flex shrink-0" aria-label="PetLoog Anasayfa">
      {content}
    </Link>
  );
}
