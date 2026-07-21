"use client";

import { useQuote } from "@/store/quoteStore";
import { PieceForm } from "@/components/quote/measurements/PieceForm";
import { PieceCard } from "@/components/quote/measurements/PieceCard";
import { AreaSummary } from "@/components/quote/measurements/AreaSummary";
import { MeasurementGuide } from "@/components/quote/measurements/MeasurementGuide";
import { DEFAULT_WASTE_PERCENTAGE } from "@/data/quote-config";

/** Paso 4: forma y medidas. */
export function MeasurementsStep() {
  const pieces = useQuote((s) => s.pieces);
  const configuration = useQuote((s) => s.configuration);
  const updateConfiguration = useQuote((s) => s.updateConfiguration);
  const waste = configuration.wastePercentage ?? DEFAULT_WASTE_PERCENTAGE;

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl md:text-3xl">Forma y medidas</h2>
      <p className="mt-2 text-sm text-charcoal/80">Agregá cada pieza de tu proyecto. Podés incluir varias.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <PieceForm />
        <div className="space-y-4">
          <MeasurementGuide />
          <div>
            <label htmlFor="waste" className="mb-1 block text-sm text-charcoal">
              Desperdicio estimado: <span className="font-medium text-ink">{waste}%</span>
            </label>
            <input
              id="waste"
              type="range"
              min={0}
              max={30}
              step={1}
              value={waste}
              onChange={(e) => updateConfiguration({ wastePercentage: Number(e.target.value) })}
              className="w-full"
              aria-label="Porcentaje de desperdicio"
            />
          </div>
        </div>
      </div>

      {pieces.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-sm font-medium text-ink">Piezas ({pieces.length})</h3>
          {pieces.map((p) => (
            <PieceCard key={p.id} piece={p} />
          ))}
        </div>
      )}

      <div className="mt-6">
        <AreaSummary />
      </div>

      {pieces.length === 0 && (
        <p className="mt-3 text-sm text-[#a03826]">Agregá al menos una pieza para continuar.</p>
      )}
    </div>
  );
}
