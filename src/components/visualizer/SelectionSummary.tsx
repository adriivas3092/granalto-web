"use client";

import { getMaterial } from "@/data/visualizer/materials";
import type { Environment } from "@/data/visualizer/types";
import { useVisualizer } from "@/store/visualizerStore";

/** Resumen de las superficies configuradas del ambiente activo. */
export function SelectionSummary({ environment }: { environment: Environment }) {
  const materialIdFor = useVisualizer((s) => s.materialIdFor);

  return (
    <dl className="divide-y divide-stone-beige rounded-sm border border-stone-beige bg-white text-sm">
      {environment.surfaces.map((s) => {
        const mat = getMaterial(materialIdFor(environment, s.id));
        return (
          <div key={s.id} className="flex items-center justify-between gap-3 px-3 py-2">
            <dt className="text-charcoal">{s.name}</dt>
            <dd className="flex items-center gap-2 text-right text-ink">
              <span
                aria-hidden="true"
                className="h-4 w-4 rounded-sm border border-black/10 bg-cover bg-center"
                style={{ backgroundColor: mat?.swatch, backgroundImage: mat?.texture ? `url(${mat.texture})` : undefined }}
              />
              <span className="truncate">{mat?.name ?? "—"}</span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
