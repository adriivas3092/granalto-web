"use client";

import { QUOTE_STEPS, TOTAL_STEPS } from "@/store/quoteStore";

/** Barra de progreso + "Paso X de N" + nombre del paso. */
export function QuoteProgress({ currentStep }: { currentStep: number }) {
  const progress = TOTAL_STEPS > 1 ? (currentStep / (TOTAL_STEPS - 1)) * 100 : 0;
  const step = QUOTE_STEPS[currentStep];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-mineral">
        <span>
          Paso {currentStep + 1} de {TOTAL_STEPS}
        </span>
        <span className="font-medium text-charcoal">{step?.label}</span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-stone-beige"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progreso: paso ${currentStep + 1} de ${TOTAL_STEPS}`}
      >
        <div className="h-full rounded-full bg-ink transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
