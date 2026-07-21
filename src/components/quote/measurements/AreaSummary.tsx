"use client";

import { useMemo } from "react";
import { useQuote } from "@/store/quoteStore";
import { calculateArea, calculateLinearMeters } from "@/lib/quote-engine/calculate-area";
import { DEFAULT_WASTE_PERCENTAGE } from "@/data/quote-config";

/** Resumen en tiempo real (neta, desperdicio y facturable) según la base. */
export function AreaSummary() {
  const pieces = useQuote((s) => s.pieces);
  const configuration = useQuote((s) => s.configuration);
  const waste = configuration.wastePercentage ?? DEFAULT_WASTE_PERCENTAGE;
  const isLinear = (configuration.pricingBasis ?? "m2") === "linear";
  const { netArea, billableArea } = useMemo(() => calculateArea(pieces, waste), [pieces, waste]);
  const linear = useMemo(() => calculateLinearMeters(pieces, waste), [pieces, waste]);
  const net = isLinear ? calculateLinearMeters(pieces, 0) : netArea;
  const unit = isLinear ? "ml" : "m²";

  return (
    <dl className="grid grid-cols-3 gap-3 rounded-sm border border-stone-beige bg-white p-4 text-center">
      <div>
        <dt className="text-xs text-mineral">{isLinear ? "Metros lineales" : "Área neta"}</dt>
        <dd className="mt-0.5 text-lg font-bold text-ink">{net} {unit}</dd>
      </div>
      <div>
        <dt className="text-xs text-mineral">Desperdicio</dt>
        <dd className="mt-0.5 text-lg font-bold text-ink">{waste}%</dd>
      </div>
      <div>
        <dt className="text-xs text-mineral">Facturable</dt>
        <dd className="mt-0.5 text-lg font-bold text-ink">{isLinear ? linear : billableArea} {unit}</dd>
      </div>
    </dl>
  );
}
