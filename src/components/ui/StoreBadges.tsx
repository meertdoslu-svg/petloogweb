import { STORE_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Both stores currently show "Yakında" — see STORE_LINKS in constants.ts.
export function StoreBadges({ className }: { className?: string }) {
  const stores = [STORE_LINKS.appStore, STORE_LINKS.googlePlay];
  return (
    <ul className={cn("flex flex-wrap gap-2.5", className)} aria-label="Uygulama mağazaları">
      {stores.map((store) =>
        store.href ? (
          <li key={store.label}>
            <a
              href={store.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-extrabold text-surface"
            >
              {store.label}
            </a>
          </li>
        ) : (
          <li
            key={store.label}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-5 text-sm font-extrabold text-primary"
          >
            {store.label}
            <span className="rounded-full bg-amber/15 px-2 py-0.5 text-xs text-secondary">
              Yakında
            </span>
          </li>
        ),
      )}
    </ul>
  );
}
