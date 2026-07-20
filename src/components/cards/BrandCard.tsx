import Image from "next/image";
import type { Brand } from "@/types";

/**
 * Tarjeta de marca. Muestra el logo oficial cuando la marca lo tiene
 * (`officialLogo`); mientras tanto, presenta el nombre como wordmark en
 * Montserrat bold para mantener coherencia tipográfica.
 */
export function BrandCard({ brand }: { brand: Brand }) {
  return (
    <article className="flex flex-col rounded-sm border border-stone-beige bg-white p-6">
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
