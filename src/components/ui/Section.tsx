import { cn } from "@/lib/utils";
import { Icon, type IconName } from "@/components/ui/Icon";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-extrabold text-secondary">{children}</p>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="max-w-2xl">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h1 className="mt-2 text-[2rem] font-extrabold leading-tight text-primary md:text-5xl">
        {title}
      </h1>
      {lead ? (
        <p className="mt-4 text-lg leading-relaxed text-muted">{lead}</p>
      ) : null}
      {children}
    </header>
  );
}

export function Card({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "article" | "section" | "li";
}) {
  return (
    <Tag
      className={cn(
        "rounded-3xl border border-line bg-surface p-6 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function IconBadge({
  name,
  tone = "amber",
}: {
  name: IconName;
  tone?: "amber" | "success" | "danger" | "brown";
}) {
  return (
    <span
      className={cn(
        "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
        tone === "amber" && "bg-amber/15 text-amber",
        tone === "success" && "bg-success/15 text-success",
        tone === "danger" && "bg-danger/12 text-danger",
        tone === "brown" && "bg-secondary/10 text-secondary",
      )}
    >
      <Icon name={name} size={24} />
    </span>
  );
}
