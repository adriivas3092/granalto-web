"use client";

import { useMemo } from "react";
import { useQuote } from "@/store/quoteStore";
import { EDGE_OPTIONS, THICKNESS_OPTIONS, FINISH_OPTIONS } from "@/data/quote-config";
import { formatPrice } from "@/lib/store/format";
import { cn } from "@/lib/utils";

/** Paso 5: grosor, acabado y tipo de canto. */
export function FinishStep() {
  const products = useQuote((s) => s.selectedProducts);
  const configuration = useQuote((s) => s.configuration);
  const updateConfiguration = useQuote((s) => s.updateConfiguration);

  // Grosores y acabados disponibles según los productos elegidos.
  const thicknesses = useMemo(() => {
    if (products.length === 0) return THICKNESS_OPTIONS;
    const common = THICKNESS_OPTIONS.filter((t) => products.every((p) => p.availableThicknesses.includes(t)));
    return common.length ? common : Array.from(new Set(products.flatMap((p) => p.availableThicknesses)));
  }, [products]);

  // Acabados fijos disponibles para todas las superficies.
  const finishes = FINISH_OPTIONS;

  const currentEdge = configuration.edges[0]?.edgeId ?? "recto";

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl md:text-3xl">Grosor, acabado y canto</h2>
      <p className="mt-2 text-sm text-charcoal/80">Definí el terminado de tu superficie.</p>

      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-medium text-ink">Grosor</legend>
        <div className="flex flex-wrap gap-2">
          {thicknesses.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={configuration.selectedThickness === t}
              onClick={() => updateConfiguration({ selectedThickness: t })}
              className={cn(
                "min-h-[44px] rounded-sm border px-4 py-2 text-sm transition-colors",
                configuration.selectedThickness === t ? "border-ink bg-ink text-ivory" : "border-stone-beige bg-white text-charcoal hover:border-mineral",
              )}
            >
              {t} mm
            </button>
          ))}
        </div>
      </fieldset>

      {finishes.length > 0 && (
        <fieldset className="mt-6">
          <legend className="mb-2 text-sm font-medium text-ink">Acabado</legend>
          <div className="flex flex-wrap gap-2">
            {finishes.map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={configuration.finish === f}
                onClick={() => updateConfiguration({ finish: f })}
                className={cn(
                  "min-h-[44px] rounded-sm border px-4 py-2 text-sm transition-colors",
                  configuration.finish === f ? "border-ink bg-ink text-ivory" : "border-stone-beige bg-white text-charcoal hover:border-mineral",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-medium text-ink">Tipo de canto</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {EDGE_OPTIONS.map((e) => (
            <button
              key={e.id}
              type="button"
              aria-pressed={currentEdge === e.id}
              onClick={() => updateConfiguration({ edges: [{ edgeId: e.id, linearMeters: 0 }] })}
              className={cn(
                "flex items-center justify-between gap-3 rounded-sm border px-4 py-3 text-left transition-colors",
                currentEdge === e.id ? "border-ink bg-stone-beige/40" : "border-stone-beige bg-white hover:border-mineral",
              )}
            >
              <span>
                <span className="block text-sm font-medium text-ink">{e.name}</span>
                {e.description && <span className="block text-xs text-mineral">{e.description}</span>}
              </span>
              <span className="shrink-0 text-xs text-charcoal">
                {e.pricePerLinearMeter === 0 ? "Incluido" : `${formatPrice(e.pricePerLinearMeter)}/ml`}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-mineral">
          El canto se estima sobre el perímetro de las piezas. Un asesor confirma los metros lineales exactos.
        </p>
      </fieldset>
    </div>
  );
}
