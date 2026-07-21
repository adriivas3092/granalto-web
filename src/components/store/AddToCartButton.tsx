"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import type { Product } from "@/types/store";
import { useCart } from "@/store/cartStore";

/** Selector de cantidad + agregar al carrito (página de producto). */
export function AddToCartButton({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const disabled = !product.available;

  function handleAdd() {
    if (disabled) return;
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-sm border border-stone-beige">
          <button
            type="button"
            aria-label="Disminuir cantidad"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center text-charcoal hover:bg-stone-beige/60"
          >
            <Minus aria-hidden="true" className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium text-ink" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Aumentar cantidad"
            onClick={() => setQty((q) => q + 1)}
            className="flex h-11 w-11 items-center justify-center text-charcoal hover:bg-stone-beige/60"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-sm bg-ink px-7 py-3 text-sm font-medium text-ivory transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-50"
        >
          {added ? (
            <>
              <Check aria-hidden="true" className="h-4 w-4" /> Agregado
            </>
          ) : (
            <>
              <ShoppingCart aria-hidden="true" className="h-4 w-4" />
              {disabled ? "No disponible" : "Agregar al carrito"}
            </>
          )}
        </button>
      </div>

      {added && (
        <Link href="/carrito" className="text-sm font-medium text-ink underline underline-offset-4">
          Ver carrito →
        </Link>
      )}
    </div>
  );
}
