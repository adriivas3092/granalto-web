import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-medium tracking-wide transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 min-h-[44px]";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-ivory hover:bg-charcoal",
  secondary: "bg-ivory text-ink hover:bg-stone-beige",
  outline:
    "border border-ink text-ink hover:bg-ink hover:text-ivory data-[on-dark=true]:border-ivory data-[on-dark=true]:text-ivory data-[on-dark=true]:hover:bg-ivory data-[on-dark=true]:hover:text-ink",
  ghost: "text-ink hover:bg-stone-beige/50",
};

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  onDark?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className">;

/** Enlace con apariencia de botón: navegación con semántica correcta. */
export function ButtonLink({
  href,
  variant = "primary",
  onDark = false,
  children,
  className,
  ...rest
}: ButtonLinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const classes = cn(base, variants[variant], className);
  if (isExternal) {
    return (
      <a
        href={href}
        className={classes}
        data-on-dark={onDark}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} data-on-dark={onDark} {...rest}>
      {children}
    </Link>
  );
}

type ButtonProps = {
  variant?: Variant;
  onDark?: boolean;
} & ComponentPropsWithoutRef<"button">;

/** Botón real para acciones (formularios, toggles). */
export function Button({
  variant = "primary",
  onDark = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], className)}
      data-on-dark={onDark}
      {...rest}
    >
      {children}
    </button>
  );
}
