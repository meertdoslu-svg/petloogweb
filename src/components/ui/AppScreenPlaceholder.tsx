import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Placeholder for an app screenshot (the real screenshots will be supplied
 * later). Keep the 9:19.5 phone ratio so swapping in an <Image> later
 * doesn't shift layout. `label` describes which screen belongs here.
 */
export function AppScreenPlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "relative mx-auto aspect-[9/19.5] w-full max-w-[220px] md:max-w-[260px] rounded-[2.5rem] border-[6px] border-primary bg-surface p-3 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-primary" aria-hidden />
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-[1.8rem] border-2 border-dashed border-line px-4 text-center">
        <Icon name="image" size={32} className="text-amber" />
        <figcaption className="text-sm font-bold text-muted">
          Uygulama ekranı
          <span className="mt-1 block text-xs font-semibold">{label}</span>
        </figcaption>
      </div>
    </figure>
  );
}
