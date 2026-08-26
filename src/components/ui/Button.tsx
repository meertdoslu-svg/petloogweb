import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-bold transition disabled:cursor-not-allowed disabled:opacity-60",
        size === "sm" && "px-4 py-2 text-sm",
        size === "md" && "px-5 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        variant === "primary" &&
          "bg-accent text-white shadow-[var(--shadow-btn)] hover:brightness-105",
        variant === "secondary" &&
          "bg-secondary text-white shadow-[var(--shadow-soft)] hover:brightness-105",
        variant === "outline" &&
          "border border-primary/15 bg-white text-primary hover:bg-white/80",
        variant === "ghost" && "bg-transparent text-primary hover:bg-primary/5",
        className,
      )}
      {...props}
    />
  );
}
