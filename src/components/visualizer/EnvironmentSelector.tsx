"use client";

import { ENVIRONMENT_TYPES, environmentsByType, getEnvironment } from "@/data/visualizer/scenes";
import { useVisualizer } from "@/store/visualizerStore";
import { cn } from "@/lib/utils";

/** Selector horizontal de categorías + variantes de ambiente. */
export function EnvironmentSelector() {
  const environmentId = useVisualizer((s) => s.environmentId);
  const setEnvironment = useVisualizer((s) => s.setEnvironment);
  const current = getEnvironment(environmentId);
  const activeType = current?.type ?? "kitchen";
  const variants = environmentsByType(activeType);

  return (
    <div className="space-y-3">
      <div role="tablist" aria-label="Tipo de ambiente" className="flex gap-2 overflow-x-auto pb-1">
        {ENVIRONMENT_TYPES.map((t) => {
          const selected = t.type === activeType;
          return (
            <button
              key={t.type}
              role="tab"
              aria-selected={selected}
              onClick={() => {
                const first = environmentsByType(t.type)[0];
                if (first) setEnvironment(first.id);
              }}
              className={cn(
                "shrink-0 rounded-sm border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                selected
                  ? "border-ink bg-ink text-ivory"
                  : "border-stone-beige bg-white text-charcoal hover:border-mineral",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {variants.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {variants.map((env) => {
            const selected = env.id === environmentId;
            return (
              <button
                key={env.id}
                onClick={() => setEnvironment(env.id)}
                aria-pressed={selected}
                className={cn(
                  "shrink-0 rounded-sm border px-3 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                  selected
                    ? "border-ink bg-stone-beige/70 text-ink"
                    : "border-stone-beige bg-white text-charcoal hover:border-mineral",
                )}
              >
                {env.subtype ? env.name : env.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
