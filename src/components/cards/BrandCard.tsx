import Image from "next/image";
import type { Brand } from "@/types";

/** Tarjeta de marca: logo, categoría y descripción breve. */
export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <article className="flex flex-col rounded-sm border border-stone-beige bg-white p-6">
      <div className="relative mb-5 h-14">
        <Image
          src={brand.logo.src}
          alt={brand.logo.alt}
          fill
          sizes="200px"
          className="object-contain object-left"
        />
      </div>
      <p className="text-xs uppercase tracking-[0.15em] text-mineral">
        {brand.category}
      </p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/80">
        {brand.description}
      </p>
      {brand.website && (
        <a
          href={brand.website}
          target="_blank"
          rel="noopener noreferrer"
          className="link-editorial mt-4 text-sm text-ink"
        >
          Sitio oficial
        </a>
      )}
    </article>
  );
}
