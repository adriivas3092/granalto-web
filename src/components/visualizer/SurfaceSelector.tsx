"use client";

import { getMaterial } from "@/data/visualizer/materials";
import type { Environment } from "@/data/visualizer/types";
import { useVisualizer } from "@/store/visualizerStore";
import { cn } from "@/lib/utils";

/** Lista de superficies editables del ambiente activo. */
export function SurfaceSelector({ environment }: { environment: Environment }) {
  const activeSurfaceId = useVisualizer((s) => s.activeSurfaceId);
  const setActiveSurface = useVisualizer((s) => s.setActiveSurface);
  const materialIdFor = useVisualizer((s) => s.materialIdFor);

  return (
    <ul className="space-y-1.5" aria-label="Superficies del ambiente">
      {environment.surfaces.map((surface) => {
        const mat = getMaterial(materialIdFor(environment, surface.id));
        const selected = activeSurfaceId === surface.id;
        return (
          <li key={surface.id}>
            <button
              onClick={() => setActiveSurface(surface.id)}
              aria-pressed={selected}
              className={cn(
                "flex w-full items-center gap-3 rounded-sm border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                selected ? "border-ink bg-stone-beige/50" : "border-stone-beige bg-white hover:border-mineral",
              )}
            >
              <span
                aria-hidden="true"
                className="h-8 w-8 shrink-0 rounded-sm border border-black/10 bg-cover bg-center"
                style={{
                  backgroundColor: mat?.swatch ?? "#d8d4cc",
                  backgroundImage: mat?.texture ? `url(${mat.texture})` : undefined,
                }}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-ink">{surface.name}</span>
                <span className="block truncate text-xs text-mineral">{mat?.name ?? "Sin material"}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
