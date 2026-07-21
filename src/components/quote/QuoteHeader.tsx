"use client";

import { LogOut } from "lucide-react";

/** Encabezado del cotizador con botón de salida. */
export function QuoteHeader({ onExit }: { onExit: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-mineral">Cotizador Granalto</p>
        <p className="font-serif text-lg text-ink">Estimá tu superficie</p>
      </div>
      <button
        type="button"
        onClick={onExit}
        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-sm border border-stone-beige bg-white px-3 py-2 text-sm text-charcoal transition-colors hover:border-ink"
      >
        <LogOut aria-hidden="true" className="h-4 w-4" /> Salir
      </button>
    </div>
  );
}
