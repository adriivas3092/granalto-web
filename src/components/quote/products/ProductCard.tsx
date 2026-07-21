"use client";

import Image from "next/image";
import { Check, Plus } from "lucide-react";
import type { SurfaceProduct } from "@/types/quote";
import { formatPrice } from "@/lib/store/format";
import { cn } from "@/lib/utils";

const TAG_LABEL: Record<string, string> = { nuevo: "Nuevo", popular: "Popular", recomendado: "Recomendado" };

export function ProductCard({
  product,
  selected,
  disabled,
  onToggle,
}: {
  product: SurfaceProduct;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled && !selected}
      aria-pressed={selected}
      aria-label={`${selected ? "Quitar" : "Seleccionar"} ${product.name}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-sm border text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-45",
        selected ? "border-ink ring-2 ring-ink/40" : "border-stone-beige hover:border-mineral",
      )}
    >
      <span className="relative block aspect-[4/3] w-full overflow-hidden bg-stone-beige">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width:640px) 50vw, 240px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.tags?.[0] && (
          <span className="absolute left-2 top-2 rounded-sm bg-ink/85 px-2 py-0.5 text-[0.6rem] uppercase tracking-wide text-ivory">
            {TAG_LABEL[product.tags[0]] ?? product.tags[0]}
          </span>
        )}
        <span
          className={cn(
            "absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full",
            selected ? "bg-ink text-ivory" : "bg-white/85 text-charcoal",
          )}
          aria-hidden="true"
        >
          {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
        </span>
      </span>
      <span className="flex flex-1 flex-col p-3">
        <span className="text-[0.7rem] uppercase tracking-wide text-mineral">{product.category}</span>
        <span className="mt-0.5 text-sm font-bold text-ink">{product.name}</span>
        {product.collection && <span className="text-xs text-mineral">{product.collection}</span>}
        <span className="mt-2 text-sm font-semibold text-ink">
          {formatPrice(product.pricePerSquareMeter)}
          <span className="text-xs font-normal text-mineral"> /m²</span>
        </span>
      </span>
    </button>
  );
}
