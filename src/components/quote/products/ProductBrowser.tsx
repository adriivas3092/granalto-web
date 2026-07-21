"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { mockProducts } from "@/data/mock-products";
import { useQuote, MAX_PRODUCTS } from "@/store/quoteStore";
import { trackEvent } from "@/lib/analytics";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "./ProductCard";
import { ProductFilters, defaultFilters, type ProductFilterState } from "./ProductFilters";

const PAGE = 8;

/** Catálogo visual: buscador, filtros, orden, selección y contador. */
export function ProductBrowser({ open, onClose }: { open: boolean; onClose: () => void }) {
  const selected = useQuote((s) => s.selectedProducts);
  const addProduct = useQuote((s) => s.addProduct);
  const removeProduct = useQuote((s) => s.removeProduct);
  const isSelected = useQuote((s) => s.isSelected);

  const [filters, setFilters] = useState<ProductFilterState>(defaultFilters);
  const [visible, setVisible] = useState(PAGE);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    let list = mockProducts.filter((p) => p.isActive);
    const f = filters;
    if (f.search) list = list.filter((p) => p.name.toLowerCase().includes(f.search.toLowerCase()));
    if (f.category) list = list.filter((p) => p.category === f.category);
    if (f.collection) list = list.filter((p) => p.collection === f.collection);
    if (f.finish) list = list.filter((p) => p.finishes.includes(f.finish));
    if (f.color) list = list.filter((p) => p.colors?.includes(f.color));
    list = [...list].sort((a, b) => {
      if (f.sort === "precio-asc") return a.pricePerSquareMeter - b.pricePerSquareMeter;
      if (f.sort === "precio-desc") return b.pricePerSquareMeter - a.pricePerSquareMeter;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [filters]);

  if (!open) return null;

  const atMax = selected.length >= MAX_PRODUCTS;

  const toggle = (id: string) => {
    if (isSelected(id)) {
      removeProduct(id);
      setMessage(null);
      return;
    }
    const product = mockProducts.find((p) => p.id === id)!;
    const res = addProduct(product);
    if (!res.ok) setMessage(res.reason ?? null);
    else {
      setMessage(null);
      trackEvent({ name: "quote_product_added", params: { category: product.category, count: selected.length + 1 } });
    }
  };

  return (
    <div className="fixed inset-0 z-[85] flex flex-col bg-black/50 sm:p-6" role="dialog" aria-modal="true" aria-label="Catálogo de materiales">
      <div className="flex min-h-0 flex-1 flex-col bg-ivory sm:mx-auto sm:w-full sm:max-w-5xl sm:rounded-sm">
        <header className="flex items-center justify-between gap-3 border-b border-stone-beige bg-white px-4 py-3">
          <div>
            <h2 className="font-sans text-lg font-bold text-ink">Elegí tus materiales</h2>
            <p className="text-xs text-mineral">{selected.length} de {MAX_PRODUCTS} seleccionados</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar catálogo" className="rounded-sm p-1 text-charcoal hover:bg-stone-beige">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </header>

        <div className="border-b border-stone-beige bg-white px-4 py-3">
          <ProductFilters value={filters} onChange={(f) => { setFilters(f); setVisible(PAGE); }} />
          {message && <p role="alert" className="mt-2 text-sm text-[#a03826]">{message}</p>}
          {atMax && !message && <p className="mt-2 text-xs text-mineral">Alcanzaste el máximo de {MAX_PRODUCTS}. Quitá uno para cambiarlo.</p>}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {results.length === 0 ? (
            <EmptyState title="Sin resultados" description="No encontramos materiales con esos filtros." />
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {results.slice(0, visible).map((p) => (
                  <li key={p.id}>
                    <ProductCard product={p} selected={isSelected(p.id)} disabled={atMax} onToggle={() => toggle(p.id)} />
                  </li>
                ))}
              </ul>
              {visible < results.length && (
                <div className="mt-5 text-center">
                  <button
                    onClick={() => setVisible((v) => v + PAGE)}
                    className="rounded-sm border border-stone-beige bg-white px-5 py-2.5 text-sm font-medium text-charcoal hover:border-ink"
                  >
                    Ver más materiales
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-stone-beige bg-white px-4 py-3">
          <span className="text-sm text-mineral">{selected.length} de {MAX_PRODUCTS}</span>
          <button
            onClick={onClose}
            disabled={selected.length === 0}
            className="min-h-[44px] rounded-sm bg-ink px-6 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal disabled:opacity-50"
          >
            Confirmar selección
          </button>
        </footer>
      </div>
    </div>
  );
}
