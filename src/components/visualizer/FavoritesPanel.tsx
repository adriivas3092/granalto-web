"use client";

import { Heart, Plus } from "lucide-react";
import { getMaterial } from "@/data/visualizer/materials";
import type { Environment } from "@/data/visualizer/types";
import { useVisualizer } from "@/store/visualizerStore";

const KIND_LABELS: Record<string, string> = {
  countertop: "Sobre", cabinets: "Gabinetes", backsplash: "Backsplash", floor: "Piso",
  wall: "Pared", "shower-wall": "Ducha", niche: "Nicho", vanity: "Mueble", "vanity-top": "Sobre",
  washbasin: "Lavamanos", faucet: "Grifería", sink: "Fregadero", shower: "Ducha",
  "feature-wall": "Pared destacada", facade: "Fachada", grill: "Parrilla",
};

export function FavoritesPanel({ environment }: { environment: Environment }) {
  const favorites = useVisualizer((s) => s.favorites);
  const toggleFavorite = useVisualizer((s) => s.toggleFavorite);
  const applyMaterial = useVisualizer((s) => s.applyMaterial);
  const activeSurfaceId = useVisualizer((s) => s.activeSurfaceId);

  if (favorites.length === 0) {
    return (
      <p className="rounded-sm border border-dashed border-stone-beige px-4 py-6 text-center text-sm text-mineral">
        Marque materiales con el corazón para guardarlos como favoritos.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {favorites.map((id) => {
        const mat = getMaterial(id);
        if (!mat) return null;
        const activeSurface = environment.surfaces.find((s) => s.id === activeSurfaceId);
        const canApplyToActive = activeSurface ? mat.availableFor.includes(activeSurface.kind) : false;
        const target = canApplyToActive
          ? activeSurface
          : environment.surfaces.find((s) => mat.availableFor.includes(s.kind));
        return (
          <li key={id} className="flex items-center gap-3 rounded-sm border border-stone-beige bg-white p-2">
            <span
              aria-hidden="true"
              className="h-11 w-11 shrink-0 rounded-sm border border-black/10 bg-cover bg-center"
              style={{ backgroundColor: mat.swatch, backgroundImage: mat.texture ? `url(${mat.texture})` : undefined }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{mat.name}</p>
              <p className="truncate text-xs text-mineral">
                {[mat.collection, mat.finish].filter(Boolean).join(" · ") || mat.category}
              </p>
              <p className="truncate text-[0.65rem] text-mineral">
                {mat.availableFor.map((k) => KIND_LABELS[k] ?? k).slice(0, 3).join(", ")}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={() => target && applyMaterial(target.id, mat.id)}
                disabled={!target}
                aria-label={`Aplicar ${mat.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-stone-beige text-charcoal hover:border-ink disabled:opacity-40"
              >
                <Plus aria-hidden="true" className="h-4 w-4" />
              </button>
              <button
                onClick={() => toggleFavorite(id)}
                aria-label={`Quitar ${mat.name} de favoritos`}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-stone-beige text-[#a03826] hover:border-ink"
              >
                <Heart aria-hidden="true" className="h-4 w-4 fill-[#a03826]" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
