"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { StudioProduct } from "@/lib/studio/types";
import { studioFilters } from "@/data/studioProducts";
import { normalizeText } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Props = {
  products: StudioProduct[];
  activeProductId?: string;
  disabled?: boolean;
  onApply: (product: StudioProduct) => void;
};

export function ProductCatalog({
  products,
  activeProductId,
  disabled,
  onApply,
}: Props) {
  const [query, setQuery] = useState("");
  const [material, setMaterial] = useState("Todos");

  const filtered = useMemo(() => {
    const q = normalizeText(query.trim());
    return products.filter((p) => {
      if (material !== "Todos" && p.material !== material) return false;
      if (!q) return true;
      return normalizeText(
        `${p.name} ${p.sku} ${p.collection} ${p.effect} ${p.color}`,
      ).includes(q);
    });
  }, [products, query, material]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-stone-beige p-4">
        <div className="relative">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mineral"
          />
          <label htmlFor="studio-search" className="sr-only">
            Buscar productos
          </label>
          <input
            id="studio-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, código, colección…"
            className="w-full rounded-sm border border-stone-beige bg-white py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-mineral focus:border-ink focus:outline-none"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["Todos", ...studioFilters.material].map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={material === m}
              onClick={() => setMaterial(m)}
              className={cn(
                "rounded-sm border px-2.5 py-1 text-xs transition-colors",
                material === m
                  ? "border-ink bg-ink text-ivory"
                  : "border-stone-beige bg-white text-charcoal hover:border-mineral",
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {disabled && (
        <p className="border-b border-stone-beige bg-ivory px-4 py-2 text-xs text-charcoal/70">
          Seleccione o cree una superficie para aplicar un producto.
        </p>
      )}

      <ul className="grid flex-1 grid-cols-2 gap-3 overflow-y-auto p-4">
        {filtered.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              disabled={disabled}
              aria-pressed={p.id === activeProductId}
              onClick={() => onApply(p)}
              className={cn(
                "group w-full overflow-hidden rounded-sm border text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                p.id === activeProductId
                  ? "border-ink"
                  : "border-stone-beige hover:border-mineral",
              )}
            >
              <span className="relative block aspect-square w-full bg-stone-beige">
                <Image
                  src={p.texture}
                  alt={`Textura ${p.name}`}
                  fill
                  sizes="140px"
                  className="object-cover"
                />
              </span>
              <span className="block p-2">
                <span className="block text-xs font-medium text-ink">{p.name}</span>
                <span className="block text-[0.7rem] text-mineral">
                  {p.format} · {p.finish}
                </span>
              </span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="col-span-2 py-8 text-center text-sm text-mineral">
            Sin productos con esos criterios.
          </li>
        )}
      </ul>
    </div>
  );
}
