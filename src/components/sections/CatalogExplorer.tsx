"use client";

import { useMemo, useState } from "react";
import type { Catalog } from "@/types";
import { CatalogCard } from "@/components/cards/CatalogCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterBar } from "@/components/ui/FilterBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { normalizeText } from "@/lib/utils";
import { catalogFilters } from "@/data/catalogs";

/** Listado de catálogos con búsqueda y filtros por marca o categoría. */
export function CatalogExplorer({ catalogs }: { catalogs: Catalog[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("Todos");

  const filtered = useMemo(() => {
    const q = normalizeText(query.trim());
    return catalogs.filter((c) => {
      if (filter !== "Todos" && c.brand !== filter && c.category !== filter) {
        return false;
      }
      if (!q) return true;
      return normalizeText(`${c.title} ${c.brand} ${c.category} ${c.description}`).includes(q);
    });
  }, [catalogs, query, filter]);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5">
        <SearchInput
          label="Buscar catálogos"
          placeholder="Buscar por título, marca o categoría…"
          value={query}
          onChange={setQuery}
        />
        <FilterBar
          label="Filtrar catálogos"
          options={catalogFilters}
          value={filter}
          onChange={setFilter}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((catalog) => (
            <CatalogCard key={catalog.id} catalog={catalog} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No encontramos catálogos"
          description="Ajuste la búsqueda o el filtro. Si busca un recurso específico, escríbanos y se lo hacemos llegar."
        />
      )}
    </div>
  );
}
