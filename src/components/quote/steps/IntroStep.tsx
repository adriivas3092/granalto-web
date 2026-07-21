"use client";

import { Clock, Layers, Calculator, ShieldCheck } from "lucide-react";

const BENEFITS = [
  { icon: Layers, text: "Compará hasta 4 materiales con la misma configuración." },
  { icon: Calculator, text: "Estimación instantánea según tus medidas y acabados." },
  { icon: ShieldCheck, text: "Sin compromiso: un asesor valida el precio final." },
];

/** Paso 1: introducción comercial. */
export function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="text-3xl leading-tight md:text-4xl">Calculá el precio estimado de tu superficie</h1>
      <p className="mt-4 text-base leading-relaxed text-charcoal/85">
        Elegí tus materiales, agregá las medidas de tu proyecto y compará diferentes opciones de Granalto.
      </p>

      <ul className="mx-auto mt-8 max-w-md space-y-3 text-left">
        {BENEFITS.map((b, i) => (
          <li key={i} className="flex items-center gap-3 rounded-sm border border-stone-beige bg-white p-3">
            <b.icon aria-hidden="true" className="h-5 w-5 shrink-0 text-ink" />
            <span className="text-sm text-charcoal">{b.text}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 inline-flex items-center gap-2 text-sm text-mineral">
        <Clock aria-hidden="true" className="h-4 w-4" /> Toma aproximadamente 3 minutos.
      </p>

      <div className="mt-8">
        <button
          onClick={onStart}
          className="inline-flex min-h-[48px] items-center justify-center rounded-sm bg-ink px-8 py-3 text-sm font-medium text-ivory hover:bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Comenzar
        </button>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-mineral">
        La estimación es orientativa y puede variar según la instalación, el transporte, las medidas
        definitivas y los acabados seleccionados.
      </p>
    </div>
  );
}
