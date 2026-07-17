"use client";

import Image from "next/image";
import { Download, ExternalLink } from "lucide-react";
import type { Catalog } from "@/types";
import { trackEvent } from "@/lib/analytics";

/**
 * Tarjeta de catálogo. Si el archivo aún no está disponible (`fileUrl` vacío)
 * se indica "Disponible próximamente" en lugar de mostrar botones sin acción.
 */
export function CatalogCard({ catalog }: { catalog: Catalog }) {
  const hasFile = Boolean(catalog.fileUrl);

  return (
    <article className="flex flex-col overflow-hidden rounded-sm border border-stone-beige bg-white">
      <div className="relative aspect-[4/5] bg-stone-beige">
        <Image
          src={catalog.coverImage.src}
          alt={catalog.coverImage.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs uppercase tracking-[0.15em] text-mineral">
          {catalog.brand} · {catalog.category}
        </p>
        <h3 className="mt-1 font-serif text-lg leading-snug text-ink">
          {catalog.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-charcoal/75">
          {catalog.description}
        </p>
        <p className="mt-3 text-xs text-mineral">
          {catalog.language}
          {catalog.year ? ` · ${catalog.year}` : ""}
          {catalog.fileSize ? ` · ${catalog.fileSize}` : ""}
        </p>
        {hasFile ? (
          <div className="mt-4 flex gap-2">
            <a
              href={catalog.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent({ name: "catalog_open", params: { catalogId: catalog.id } })}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-sm border border-ink px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-ivory"
            >
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
              Ver catálogo
            </a>
            <a
              href={catalog.fileUrl}
              download
              onClick={() => trackEvent({ name: "catalog_download", params: { catalogId: catalog.id } })}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-sm bg-ink px-3 py-2 text-sm font-medium text-ivory transition-colors hover:bg-charcoal"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              Descargar
            </a>
          </div>
        ) : (
          <p className="mt-4 rounded-sm bg-ivory px-3 py-2.5 text-center text-sm text-charcoal/70">
            Disponible próximamente
          </p>
        )}
      </div>
    </article>
  );
}
