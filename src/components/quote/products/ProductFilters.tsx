"use client";

import { Search } from "lucide-react";
import { PRODUCT_CATEGORIES, PRODUCT_COLLECTIONS, PRODUCT_FINISHES, PRODUCT_COLORS } from "@/data/mock-products";

export type ProductFilterState = {
  search: string;
  category: string;
  collection: string;
  finish: string;
  color: string;
  sort: "nombre" | "precio-asc" | "precio-desc";
};

export const defaultFilters: ProductFilterState = {
  search: "",
  category: "",
  collection: "",
  finish: "",
  color: "",
  sort: "nombre",
};

const selectCls =
  "rounded-sm border border-stone-beige bg-white px-2.5 py-2 text-sm text-ink focus:border-ink focus:outline-none";

export function ProductFilters({
  value,
  onChange,
}: {
  value: ProductFilterState;
  onChange: (next: ProductFilterState) => void;
}) {
  const set = (patch: Partial<ProductFilterState>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mineral" />
        <label htmlFor="qb-search" className="sr-only">Buscar material</label>
        <input
          id="qb-search"
          type="search"
          value={value.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Buscar material…"
          className="w-full rounded-sm border border-stone-beige bg-white py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-mineral focus:border-ink focus:outline-none"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <select aria-label="Categoría" className={selectCls} value={value.category} onChange={(e) => set({ category: e.target.value })}>
          <option value="">Categoría</option>
          {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select aria-label="Colección" className={selectCls} value={value.collection} onChange={(e) => set({ collection: e.target.value })}>
          <option value="">Colección</option>
          {PRODUCT_COLLECTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select aria-label="Acabado" className={selectCls} value={value.finish} onChange={(e) => set({ finish: e.target.value })}>
          <option value="">Acabado</option>
          {PRODUCT_FINISHES.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select aria-label="Color" className={selectCls} value={value.color} onChange={(e) => set({ color: e.target.value })}>
          <option value="">Color</option>
          {PRODUCT_COLORS.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
        </select>
        <select aria-label="Ordenar" className={selectCls} value={value.sort} onChange={(e) => set({ sort: e.target.value as ProductFilterState["sort"] })}>
          <option value="nombre">Nombre</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
        </select>
      </div>
    </div>
  );
}
