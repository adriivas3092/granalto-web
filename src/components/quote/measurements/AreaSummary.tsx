"use client";

import { useMemo } from "react";
import { useQuote } from "@/store/quoteStore";
import { calculateArea } from "@/lib/quote-engine/calculate-area";
import { DEFAULT_WASTE_PERCENTAGE } from "@/data/quote-config";

/** Resumen de área en tiempo real (neta, desperdicio y facturable). */
export function AreaSummary() {
  const pieces = useQuote((s) => s.pieces);
  const configuration = useQuote((s) => s.configuration);
  const waste = configuration.wastePercentage ?? DEFAULT_WASTE_PERCENTAGE;
  const { netArea, billableArea } = useMemo(() => calculateArea(pieces, waste), [pieces, waste]);

  return (
    <dl className="grid grid-cols-3 gap-3 rounded-sm border border-stone-beige bg-white p-4 text-center">
      <div>
        <dt className="text-xs text-mineral">Área neta</dt>
        <dd className="mt-0.5 text-lg font-bold text-ink">{netArea} m²</dd>
      </div>
      <div>
        <dt className="text-xs text-mineral">Desperdicio</dt>
        <dd className="mt-0.5 text-lg font-bold text-ink">{waste}%</dd>
      </div>
      <div>
        <dt className="text-xs text-mineral">Facturable</dt>
        <dd className="mt-0.5 text-lg font-bold text-ink">{billableArea} m²</dd>
      </div>
    </dl>
  );
}
