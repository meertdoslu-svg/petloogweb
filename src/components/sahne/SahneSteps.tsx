import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export const SAHNE_STEPS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "camera",
    title: "Fotoğrafını gönder",
    text: "Her gün yeni bir konu var. Konuya uyan patinin fotoğrafını gün içinde gönder.",
  },
  {
    icon: "moon",
    title: "Gece 00:00'da sahnede",
    text: "Gece yarısı tüm fotoğraflar sahneye çıkar. Herkes beğendiğine oy verir.",
  },
  {
    icon: "star",
    title: "Sahnenin yıldızı ol",
    text: "En çok oyu alan pati \"Sahnenin yıldızı\" olur. Hikâye kartıyla paylaş.",
  },
];

export function SahneSteps({
  variant = "light",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  const dark = variant === "dark";
  return (
    <ol className={cn("grid gap-4 md:grid-cols-3", className)}>
      {SAHNE_STEPS.map((step, i) => (
        <li
          key={step.title}
          className={cn(
            "rounded-3xl p-5",
            dark ? "bg-surface/10" : "border border-line bg-surface shadow-[var(--shadow-soft)]",
          )}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-2xl",
                dark ? "bg-amber text-primary" : "bg-amber/15 text-amber",
              )}
            >
              <Icon name={step.icon} size={22} />
            </span>
            <span className={cn("text-sm font-extrabold", dark ? "text-line" : "text-secondary")}>
              {i + 1}. adım
            </span>
          </div>
          <h3 className={cn("mt-4 text-lg font-extrabold", dark ? "text-surface" : "text-primary")}>
            {step.title}
          </h3>
          <p className={cn("mt-1.5 leading-relaxed", dark ? "text-surface/85" : "text-muted")}>
            {step.text}
          </p>
        </li>
      ))}
    </ol>
  );
}
