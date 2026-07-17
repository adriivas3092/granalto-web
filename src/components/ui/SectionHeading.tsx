import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  onDark?: boolean;
  children?: ReactNode;
};

/** Encabezado editorial de sección: eyebrow, título serif y descripción breve. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  onDark = false,
  children,
}: Props) {
  return (
    <div
      className={cn(
        "mb-10 max-w-2xl md:mb-14",
        align === "center" && "mx-auto text-center",
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-xs font-medium uppercase tracking-[0.2em]",
            onDark ? "text-stone-beige" : "text-mineral",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl leading-tight md:text-4xl lg:text-[2.75rem]",
          onDark ? "text-ivory" : "text-ink",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            onDark ? "text-stone-beige" : "text-charcoal/80",
          )}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
