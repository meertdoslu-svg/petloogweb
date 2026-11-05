import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "md" | "lg";

function buttonClass(variant: Variant, size: Size, className?: string) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-extrabold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
    size === "md" && "px-5 py-2.5 text-[15px]",
    size === "lg" && "px-6 py-3.5 text-base",
    variant === "primary" && "bg-secondary text-surface hover:bg-primary",
    variant === "outline" &&
      "border border-line bg-surface text-primary hover:border-secondary",
    variant === "ghost" && "text-primary hover:bg-line/50",
    className,
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size, className)} {...props} />
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}
