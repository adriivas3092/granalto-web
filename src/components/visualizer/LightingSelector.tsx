"use client";

import { Sun, Moon, Snowflake, Flame } from "lucide-react";
import { LIGHTING_PRESETS } from "@/data/visualizer/lighting";
import { useVisualizer } from "@/store/visualizerStore";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof Sun> = { natural: Sun, warm: Flame, cool: Snowflake, night: Moon };

export function LightingSelector() {
  const lightingId = useVisualizer((s) => s.lightingId);
  const setLighting = useVisualizer((s) => s.setLighting);

  return (
    <div role="group" aria-label="Iluminación" className="grid grid-cols-4 gap-1.5">
      {LIGHTING_PRESETS.map((l) => {
        const Icon = ICONS[l.id] ?? Sun;
        const selected = lightingId === l.id;
        return (
          <button
            key={l.id}
            onClick={() => setLighting(l.id)}
            aria-pressed={selected}
            className={cn(
              "flex flex-col items-center gap-1 rounded-sm border px-1 py-2 text-[0.65rem] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
              selected ? "border-ink bg-ink text-ivory" : "border-stone-beige text-charcoal hover:border-mineral",
            )}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            {l.name}
          </button>
        );
      })}
    </div>
  );
}
