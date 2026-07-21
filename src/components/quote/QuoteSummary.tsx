"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useQuote } from "@/store/quoteStore";
import { calculateArea } from "@/lib/quote-engine/calculate-area";
import { formatPrice } from "@/lib/store/format";

/** Resumen contextual: materiales elegidos y área acumulada. */
export function QuoteSummary({ compact = false }: { compact?: boolean }) {
  const products = useQuote((s) => s.selectedProducts);
  const pieces = useQuote((s) => s.pieces);
  const configuration = useQuote((s) => s.configuration);

  const { billableArea } = useMemo(
    () => calculateArea(pieces, configuration.wastePercentage),
    [pieces, configuration.wastePercentage],
  );

  const fromPrice = products.length
    ? Math.min(...products.map((p) => p.pricePerSquareMeter))
    : 0;

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="text-mineral">{products.length} material(es)</span>
        <span className="font-medium text-ink">{billableArea > 0 ? `${billableArea} m²` : "—"}</span>
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-stone-beige bg-white p-4">
      <h3 className="font-sans text-sm font-bold text-ink">Resumen</h3>

      {products.length === 0 ? (
        <p className="mt-3 text-sm text-mineral">Aún no has elegido materiales.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-2">
              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-sm bg-stone-beige">
                <Image src={p.imageUrl} alt={p.name} fill sizes="36px" className="object-cover" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-ink">{p.name}</span>
                <span className="block text-[0.65rem] text-mineral">{p.category}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <dl className="mt-4 space-y-1.5 border-t border-stone-beige pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-mineral">Área facturable</dt>
          <dd className="text-ink">{billableArea > 0 ? `${billableArea} m²` : "—"}</dd>
        </div>
        {fromPrice > 0 && (
          <div className="flex justify-between">
            <dt className="text-mineral">Desde</dt>
            <dd className="text-ink">{formatPrice(fromPrice)}/m²</dd>
          </div>
        )}
      </dl>

      <p className="mt-3 text-[0.7rem] leading-relaxed text-mineral">
        El precio mostrado es una estimación y está sujeto a validación técnica.
      </p>
    </div>
  );
}
