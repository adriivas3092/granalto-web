"use client";

import Image from "next/image";
import { Trash2, RefreshCw } from "lucide-react";
import type { SurfaceProduct } from "@/types/quote";
import { formatPrice } from "@/lib/store/format";

/** Tarjeta de un material ya seleccionado (con quitar / sustituir). */
export function SelectedProductCard({
  product,
  onRemove,
  onReplace,
}: {
  product: SurfaceProduct;
  onRemove: () => void;
  onReplace: () => void;
}) {
  return (
    <div className="flex gap-3 rounded-sm border border-stone-beige bg-white p-3">
      <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-stone-beige">
        <Image src={product.imageUrl} alt={product.name} fill sizes="80px" className="object-cover" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.7rem] uppercase tracking-wide text-mineral">{product.category}</p>
        <p className="truncate text-sm font-bold text-ink">{product.name}</p>
        {(product.collection || product.brand) && (
          <p className="truncate text-xs text-mineral">{product.collection ?? product.brand}</p>
        )}
        <p className="mt-1 text-sm font-semibold text-ink">
          {product.pricePerSquareMeter > 0 ? (
            <>{formatPrice(product.pricePerSquareMeter)}<span className="text-xs font-normal text-mineral"> /m²</span></>
          ) : (
            <span className="text-xs font-normal text-mineral">Precio a confirmar</span>
          )}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <button
          type="button"
          onClick={onReplace}
          aria-label={`Sustituir ${product.name}`}
          className="flex h-8 w-8 items-center justify-center rounded-sm border border-stone-beige text-charcoal hover:border-ink"
        >
          <RefreshCw aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Quitar ${product.name}`}
          className="flex h-8 w-8 items-center justify-center rounded-sm border border-stone-beige text-[#a03826] hover:border-[#a03826]"
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
