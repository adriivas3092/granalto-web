import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Brand } from "@/types";

/**
 * Tarjeta de marca. Si la marca tiene sitio oficial, toda la tarjeta es un
 * enlace que abre la web de la marca en una pestaña nueva.
 */
export function BrandCard({ brand }: { brand: Brand }) {
  const inner = (
    <>
      <div className="mb-5 flex h-16 items-center justify-center">
        {brand.officialLogo ? (
          <div className="relative h-full w-full">
            <Image
              src={brand.officialLogo.src}
              alt={brand.officialLogo.alt}
              fill
              sizes="(max-width: 768px) 45vw, 240px"
              className="object-contain object-center"
            />
          </div>
        ) : (
          <span className="font-sans text-2xl font-bold uppercase tracking-[0.08em] text-ink">
            {brand.name}
          </span>
        )}
      </div>
      <p className="text-xs uppercase tracking-[0.15em] text-mineral">{brand.category}</p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/80">{brand.description}</p>
      {brand.website && (
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink">
          Visitar sitio oficial
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      )}
    </>
  );

  if (brand.website) {
    return (
      <a
        href={brand.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visitar el sitio oficial de ${brand.name}`}
        className="group flex flex-col rounded-sm border border-stone-beige bg-white p-6 transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {inner}
      </a>
    );
  }

  return (
    <article className="flex flex-col rounded-sm border border-stone-beige bg-white p-6">{inner}</article>
  );
}
