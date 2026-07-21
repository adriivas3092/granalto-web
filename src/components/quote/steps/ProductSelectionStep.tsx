"use client";

import { useState } from "react";
import { Plus, Grid3x3 } from "lucide-react";
import { useQuote, MAX_PRODUCTS } from "@/store/quoteStore";
import { trackEvent } from "@/lib/analytics";
import { ProductBrowser } from "@/components/quote/products/ProductBrowser";
import { SelectedProductCard } from "@/components/quote/products/SelectedProductCard";

/** Paso 2: selección y comparación de colores/materiales. */
export function ProductSelectionStep() {
  const products = useQuote((s) => s.selectedProducts);
  const removeProduct = useQuote((s) => s.removeProduct);
  const [browserOpen, setBrowserOpen] = useState(false);

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl md:text-3xl">Elegí tus colores</h2>
      <p className="mt-2 text-sm text-charcoal/80">
        Podés comparar entre 1 y {MAX_PRODUCTS} materiales. Se aplicará la misma configuración de proyecto a cada uno.
      </p>

      <div className="mt-6 space-y-3">
        {products.map((p) => (
          <SelectedProductCard
            key={p.id}
            product={p}
            onRemove={() => {
              removeProduct(p.id);
              trackEvent({ name: "quote_product_removed", params: { count: products.length - 1 } });
            }}
            onReplace={() => setBrowserOpen(true)}
          />
        ))}

        {products.length === 0 && (
          <div className="rounded-sm border border-dashed border-stone-beige px-4 py-10 text-center">
            <p className="text-sm text-mineral">Aún no has elegido materiales.</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setBrowserOpen(true)}
          disabled={products.length >= MAX_PRODUCTS}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal disabled:opacity-50"
        >
          <Plus aria-hidden="true" className="h-4 w-4" /> Agregar color
        </button>
        <button
          onClick={() => setBrowserOpen(true)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-stone-beige px-5 py-2.5 text-sm font-medium text-charcoal hover:border-ink"
        >
          <Grid3x3 aria-hidden="true" className="h-4 w-4" /> Ver todos los colores
        </button>
      </div>

      {products.length >= MAX_PRODUCTS && (
        <p className="mt-3 text-sm text-mineral">Podés comparar un máximo de {MAX_PRODUCTS} materiales.</p>
      )}
      {products.length === 0 && (
        <p className="mt-3 text-sm text-[#a03826]">Seleccioná al menos un material para continuar.</p>
      )}

      <ProductBrowser open={browserOpen} onClose={() => setBrowserOpen(false)} />
    </div>
  );
}
