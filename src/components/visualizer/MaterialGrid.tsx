"use client";

import { useMemo, useState } from "react";
import { Heart, Check } from "lucide-react";
import { materialsForSurface } from "@/data/visualizer/materials";
import type { Environment, Material, Surface } from "@/data/visualizer/types";
import { useVisualizer } from "@/store/visualizerStore";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

export function MaterialGrid({
  environment,
  surface,
}: {
  environment: Environment;
  surface: Surface;
}) {
  const materialIdFor = useVisualizer((s) => s.materialIdFor);
  const applyMaterial = useVisualizer((s) => s.applyMaterial);
  const favorites = useVisualizer((s) => s.favorites);
  const toggleFavorite = useVisualizer((s) => s.toggleFavorite);

  const materials = useMemo(() => materialsForSurface(surface.kind), [surface.kind]);
  const categories = useMemo(
    () => ["todos", ...Array.from(new Set(materials.map((m) => m.category)))],
    [materials],
  );
  const [filter, setFilter] = useState("todos");
  const visible = filter === "todos" ? materials : materials.filter((m) => m.category === filter);
  const currentId = materialIdFor(environment, surface.id);

  if (materials.length === 0) {
    return <EmptyState title="Sin materiales" description="No hay materiales para esta superficie." />;
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            aria-pressed={filter === c}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
              filter === c ? "border-ink bg-ink text-ivory" : "border-stone-beige text-charcoal hover:border-mineral",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-3">
        {visible.map((mat) => (
          <MaterialCard
            key={mat.id}
            material={mat}
            selected={mat.id === currentId}
            favorite={favorites.includes(mat.id)}
            onApply={() => applyMaterial(surface.id, mat.id)}
            onToggleFavorite={() => toggleFavorite(mat.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function MaterialCard({
  material,
  selected,
  favorite,
  onApply,
  onToggleFavorite,
}: {
  material: Material;
  selected: boolean;
  favorite: boolean;
  onApply: () => void;
  onToggleFavorite: () => void;
}) {
  return (
    <li className="relative">
      <button
        onClick={onApply}
        aria-pressed={selected}
        aria-label={`Aplicar ${material.name}`}
        className={cn(
          "group block w-full overflow-hidden rounded-sm border text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2",
          selected ? "border-ink ring-2 ring-ink/40" : "border-stone-beige hover:border-mineral",
        )}
      >
        <span
          aria-hidden="true"
          className="block aspect-square w-full bg-cover bg-center"
          style={{
            backgroundColor: material.swatch,
            backgroundImage: material.texture ? `url(${material.texture})` : undefined,
          }}
        />
        <span className="block px-2 py-1.5">
          <span className="block truncate text-xs font-medium text-ink">{material.name}</span>
          <span className="block truncate text-[0.65rem] text-mineral">
            {material.finish ?? material.color ?? material.category}
          </span>
        </span>
        {selected && (
          <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-ivory">
            <Check aria-hidden="true" className="h-3 w-3" />
          </span>
        )}
      </button>
      <button
        onClick={onToggleFavorite}
        aria-pressed={favorite}
        aria-label={favorite ? `Quitar ${material.name} de favoritos` : `Agregar ${material.name} a favoritos`}
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-charcoal backdrop-blur transition-colors hover:text-[#a03826] focus-visible:outline-2"
      >
        <Heart aria-hidden="true" className={cn("h-3.5 w-3.5", favorite && "fill-[#a03826] text-[#a03826]")} />
      </button>
    </li>
  );
}
