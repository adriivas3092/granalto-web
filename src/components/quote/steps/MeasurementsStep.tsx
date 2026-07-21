"use client";

import { useQuote } from "@/store/quoteStore";
import { WORKTOP_SHAPES, getWorktopShape } from "@/data/worktop-shapes";
import { PieceForm } from "@/components/quote/measurements/PieceForm";
import { PieceCard } from "@/components/quote/measurements/PieceCard";
import { AreaSummary } from "@/components/quote/measurements/AreaSummary";
import { DEFAULT_WASTE_PERCENTAGE } from "@/data/quote-config";
import { cn } from "@/lib/utils";

const numInput = "w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";

/** Paso 4: forma y medidas (2 fases: elegir forma → ingresar dimensiones). */
export function MeasurementsStep() {
  const layoutId = useQuote((s) => s.layoutId);
  const setLayout = useQuote((s) => s.setLayout);
  const clearLayout = useQuote((s) => s.clearLayout);
  const pieces = useQuote((s) => s.pieces);
  const updatePiece = useQuote((s) => s.updatePiece);
  const configuration = useQuote((s) => s.configuration);
  const updateConfiguration = useQuote((s) => s.updateConfiguration);
  const shape = getWorktopShape(layoutId);
  const waste = configuration.wastePercentage ?? DEFAULT_WASTE_PERCENTAGE;

  // --- Fase 1: elegir la forma ---
  if (!shape) {
    return (
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-2xl md:text-3xl">¿Qué forma tiene tu superficie?</h2>
        <p className="mt-2 text-sm text-charcoal/80">
          Elegí la distribución que más se parezca a tu espacio. La mayoría usa una o dos.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {WORKTOP_SHAPES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setLayout(s.id)}
              className="group flex flex-col items-center gap-2 rounded-sm border border-stone-beige bg-white p-4 transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <span className="w-full" aria-hidden="true" dangerouslySetInnerHTML={{ __html: s.diagram }} />
              <span className="text-sm font-medium text-ink">{s.name}</span>
              <span className="text-xs text-mineral">
                {s.id === "personalizada" ? "a tu medida" : `${s.parts.length} ${s.parts.length === 1 ? "parte" : "partes"}`}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- Fase 2: dimensiones ---
  const isCustom = shape.id === "personalizada";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl md:text-3xl">Ingresá las medidas</h2>
        <button
          type="button"
          onClick={clearLayout}
          className="text-sm text-mineral underline-offset-2 hover:text-ink hover:underline"
        >
          ← Cambiar forma
        </button>
      </div>
      <p className="mt-2 text-sm text-charcoal/80">
        Medidas aproximadas en milímetros están bien; confirmamos en sitio. El fondo estándar de un sobre
        es <strong className="text-charcoal">600&nbsp;mm</strong> (islas 800–900&nbsp;mm).
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[16rem_1fr]">
        <div className="rounded-sm border border-stone-beige bg-white p-4">
          <p className="mb-2 text-sm font-medium text-ink">{shape.name}</p>
          <div aria-hidden="true" dangerouslySetInnerHTML={{ __html: shape.diagram }} />
        </div>

        <div className="space-y-4">
          {!isCustom &&
            pieces.map((p, i) => (
              <fieldset key={p.id} className="rounded-sm border border-stone-beige bg-white p-4">
                <legend className="flex items-center gap-2 px-1 text-sm font-medium text-ink">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[0.7rem] text-ivory">{i + 1}</span>
                  {p.name}
                </legend>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`len-${p.id}`} className="mb-1 block text-xs text-charcoal">Largo (mm)</label>
                    <input
                      id={`len-${p.id}`}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="Ej. 3000"
                      className={numInput}
                      value={p.length || ""}
                      onChange={(e) => updatePiece(p.id, { length: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <label htmlFor={`dep-${p.id}`} className="mb-1 block text-xs text-charcoal">Fondo (mm)</label>
                    <input
                      id={`dep-${p.id}`}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="Ej. 600"
                      className={numInput}
                      value={p.width || ""}
                      onChange={(e) => updatePiece(p.id, { width: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </fieldset>
            ))}

          {isCustom && (
            <>
              <PieceForm />
              {pieces.length > 0 && (
                <div className="space-y-2">
                  {pieces.map((p) => (
                    <PieceCard key={p.id} piece={p} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="waste" className="mb-1 block text-sm text-charcoal">
            Desperdicio estimado: <span className="font-medium text-ink">{waste}%</span>
          </label>
          <input
            id="waste"
            type="range"
            min={0}
            max={30}
            value={waste}
            onChange={(e) => updateConfiguration({ wastePercentage: Number(e.target.value) })}
            className="w-full"
            aria-label="Porcentaje de desperdicio"
          />
        </div>
        <AreaSummary />
      </div>

      {!isCustom && pieces.some((p) => !(p.length > 0) || !(p.width > 0)) && (
        <p className={cn("mt-3 text-sm text-[#a03826]")}>Ingresá el largo y el fondo de cada parte para continuar.</p>
      )}
    </div>
  );
}
