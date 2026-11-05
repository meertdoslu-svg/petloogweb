import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Official PetLoog "P + pati" mark (transparent PNG, same as the app). */
export function PetLoogMark({
  size,
  className,
  priority = false,
}: {
  size: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={size > 64 ? "/brand/logo-256.png" : "/brand/logo-128.png"}
      alt=""
      width={size}
      height={size}
      priority={priority}
      className={cn("shrink-0 object-contain", className)}
      aria-hidden
    />
  );
}

export function Logo({
  href = "/",
  className,
}: {
  href?: string | null;
  className?: string;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <PetLoogMark size={36} priority />
      <span className="text-[22px] font-extrabold tracking-tight text-primary">
        PetLoog
      </span>
    </span>
  );

  if (href === null) return content;

  return (
    <Link href={href} className="inline-flex shrink-0 rounded-full" aria-label="PetLoog ana sayfa">
      {content}
    </Link>
  );
}
