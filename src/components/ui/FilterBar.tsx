"use client";

import { cn } from "@/lib/utils";

type Props = {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
};

/** Barra de filtros por chips, accesible con teclado (botones reales). */
export function FilterBar({ label, options, value, onChange }: Props) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={cn(
              "min-h-[40px] rounded-sm border px-4 py-2 text-sm transition-colors",
              active
                ? "border-ink bg-ink text-ivory"
                : "border-stone-beige bg-white text-charcoal hover:border-mineral",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
