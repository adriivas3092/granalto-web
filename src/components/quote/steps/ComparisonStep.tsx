"use client";

import { useCallback, useEffect, useState } from "react";
import { useQuote } from "@/store/quoteStore";
import { calculateQuoteRemote } from "@/lib/api/quote-service";
import { calculateQuote } from "@/lib/quote-engine/calculate-quote";
import { trackEvent } from "@/lib/analytics";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { QuoteComparison } from "@/components/quote/comparison/QuoteComparison";

/** Paso 8: comparación de precios (recalculada en el servidor). */
export function ComparisonStep() {
  const products = useQuote((s) => s.selectedProducts);
  const pieces = useQuote((s) => s.pieces);
  const configuration = useQuote((s) => s.configuration);
  const estimates = useQuote((s) => s.estimates);
  const setEstimates = useQuote((s) => s.setEstimates);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const run = useCallback(async () => {
    setStatus("loading");
    try {
      const productIds = products.map((p) => p.id);
      const result = await calculateQuoteRemote({ productIds, pieces, configuration });
      setEstimates(result);
      setStatus("ready");
      const area = result[0]?.billableArea;
      const total = result[0]?.total;
      trackEvent({ name: "quote_estimate_viewed", params: { options: result.length, area, total } });
    } catch {
      // Respaldo: cálculo local (misma lógica) para no bloquear al usuario.
      try {
        const local = calculateQuote({ products, pieces, configuration });
        setEstimates(local);
        setStatus("ready");
      } catch {
        setStatus("error");
      }
    }
  }, [products, pieces, configuration, setEstimates]);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="text-2xl md:text-3xl">Compará tus opciones</h2>
      <p className="mt-2 text-sm text-charcoal/80">
        La misma configuración aplicada a cada material. Elegí la opción que prefieras.
      </p>

      <div className="mt-6">
        {status === "loading" && <LoadingState label="Calculando estimaciones…" />}
        {status === "error" && (
          <div className="space-y-3">
            <ErrorState title="No pudimos calcular" description="Ocurrió un problema al estimar los precios." />
            <div className="text-center">
              <button onClick={run} className="rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal">
                Reintentar
              </button>
            </div>
          </div>
        )}
        {status === "ready" && estimates.length > 0 && <QuoteComparison estimates={estimates} />}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-mineral">
        El precio mostrado es una estimación y está sujeto a validación técnica. No incluye variaciones por
        acceso, condiciones del sitio o ajustes de medidas definitivas.
      </p>
    </div>
  );
}
