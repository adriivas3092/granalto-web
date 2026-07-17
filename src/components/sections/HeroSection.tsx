import Image from "next/image";
import type { Media } from "@/types";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  image: Media;
  title: string;
  eyebrow?: string;
  description?: string;
  size?: "full" | "large" | "medium";
  children?: ReactNode;
  showScrollHint?: boolean;
};

/** Hero editorial con imagen de fondo y overlay para contraste accesible. */
export function HeroSection({
  image,
  title,
  eyebrow,
  description,
  size = "medium",
  children,
  showScrollHint = false,
}: Props) {
  return (
    <section
      className={cn(
        "relative flex items-end overflow-hidden bg-ink text-ivory",
        size === "full" && "min-h-svh",
        size === "large" && "min-h-[70svh]",
        size === "medium" && "min-h-[46svh] pt-24",
      )}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/20" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 md:pb-20 lg:px-8">
        {eyebrow && (
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-stone-beige">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-3xl text-4xl leading-[1.08] md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory/85 md:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
      {showScrollHint && (
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
        >
          <span className="block h-10 w-px animate-pulse bg-ivory/50" />
        </div>
      )}
    </section>
  );
}
