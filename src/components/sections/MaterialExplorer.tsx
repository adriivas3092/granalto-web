"use client";

import { useMemo, useState } from "react";
import type { Material } from "@/types";
import { MaterialCard } from "@/components/cards/MaterialCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { normalizeText } from "@/lib/utils";

const typeFilters = [
  "Todos",
  "Piedra natural",
  "Superficie técnica",
  "Superficie decorativa",
] as const;

const typeMap: Record<string, Material["category"]> = {
  "Piedra natural": "natural",
  "Superficie técnica": "tecnico",
  "Superficie decorativa": "decorativo",
};

/**
 * Muestrario digital de materiales: búsqueda por texto y filtro por tipo.
 * Filtros adicionales (tonalidad, acabado, uso, marca) se activarán cuando
 * los datos estén completos y validados.
 */
export function MaterialExplorer({ materials }: { materials: Material[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("Todos");

  const filtered = useMemo(() => {
    const q = normalizeText(query.trim());
    return materials.filter((m) => {
      if (type !== "Todos" && m.category !== typeMap[type]) return false;
      if (!q) return true;
      const haystack = normalizeText(
        `${m.name} ${m.shortDescription} ${m.applications.join(" ")} ${m.colors.join(" ")}`,
      );
      return haystack.includes(q);
    });
  }, [materials, query, type]);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <SearchInput
          label="Buscar materiales"
          placeholder="Buscar por nombre, aplicación o color…"
          value={query}
          onChange={setQuery}
        />
        <FilterBar
          label="Filtrar por tipo de material"
          options={typeFilters}
          value={type}
          onChange={setType}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No encontramos materiales"
          description="Ajuste la búsqueda o el filtro, o consúltenos directamente: es posible que tengamos lo que busca."
        />
      )}
    </div>
  );
}
