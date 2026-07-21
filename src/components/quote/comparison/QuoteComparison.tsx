"use client";

import { useMemo } from "react";
import type { ProductQuoteResult } from "@/types/quote";
import { useQuote } from "@/store/quoteStore";
import { trackEvent } from "@/lib/analytics";
import { QuoteResultCard } from "./QuoteResultCard";

/** Comparación lado a lado (escritorio) / apilada (móvil). */
export function QuoteComparison({ estimates }: { estimates: ProductQuoteResult[] }) {
  const selectedEstimateId = useQuote((s) => s.selectedEstimateId);
  const setSelectedEstimate = useQuote((s) => s.setSelectedEstimate);

  const cheapestTotal = useMemo(
    () => (estimates.length ? Math.min(...estimates.map((e) => e.total)) : 0),
    [estimates],
  );
  // Recomendada: mejor relación precio/característica → aquí, la de menor precio
  // que no sea la más barata absoluta, o la primera si solo hay una. Ajustable.
  const recommendedId = useMemo(() => {
    if (estimates.length <= 1) return estimates[0]?.productId;
    const sorted = [...estimates].sort((a, b) => a.total - b.total);
    return (sorted[1] ?? sorted[0]).productId;
  }, [estimates]);

  const cols = Math.min(estimates.length, 4);
  const gridClass =
    cols >= 4 ? "lg:grid-cols-4" : cols === 3 ? "lg:grid-cols-3" : cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-1";

  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${gridClass}`}>
      {estimates.map((e) => (
        <QuoteResultCard
          key={e.productId}
          result={e}
          selected={selectedEstimateId === e.productId}
          isCheapest={e.total === cheapestTotal}
          isRecommended={e.productId === recommendedId}
          priceDiff={e.total - cheapestTotal}
          onSelect={() => {
            setSelectedEstimate(e.productId);
            trackEvent({ name: "quote_option_selected", params: { total: e.total } });
          }}
        />
      ))}
    </div>
  );
}
