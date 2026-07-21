"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ChevronDown, Award, Tag } from "lucide-react";
import type { ProductQuoteResult } from "@/types/quote";
import { formatPrice } from "@/lib/store/format";
import { PriceBreakdown } from "./PriceBreakdown";
import { cn } from "@/lib/utils";

export function QuoteResultCard({
  result,
  selected,
  isCheapest,
  isRecommended,
  priceDiff,
  onSelect,
}: {
  result: ProductQuoteResult;
  selected: boolean;
  isCheapest: boolean;
  isRecommended: boolean;
  priceDiff: number;
  onSelect: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-sm border bg-white", selected ? "border-ink ring-2 ring-ink/30" : "border-stone-beige")}>
      <div className="relative aspect-[4/3] bg-stone-beige">
        <Image src={result.imageUrl} alt={result.productName} fill sizes="(max-width:768px) 100vw, 300px" className="object-cover" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {isCheapest && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-[#3f6b41] px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-white">
              <Tag className="h-3 w-3" /> Más económica
            </span>
          )}
          {isRecommended && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-ink px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-ivory">
              <Award className="h-3 w-3" /> Recomendada
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[0.7rem] uppercase tracking-wide text-mineral">{result.category}</p>
        <h3 className="text-base font-bold text-ink">{result.productName}</h3>
        <p className="mt-1 text-xs text-mineral">Área facturable: {result.billableArea} m²</p>

        <p className="mt-3 text-2xl font-bold text-ink">{formatPrice(result.total, result.currency)}</p>
        <p className="text-xs text-mineral">Total estimado (IVA incluido)</p>
        {priceDiff > 0 && <p className="mt-1 text-xs text-[#a03826]">+{formatPrice(priceDiff, result.currency)} vs. la más económica</p>}

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-3 inline-flex items-center gap-1 self-start text-sm text-charcoal underline-offset-4 hover:underline"
        >
          Ver desglose <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </button>
        {open && (
          <div className="mt-3 rounded-sm bg-ivory/70 p-3">
            <PriceBreakdown result={result} />
          </div>
        )}

        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className={cn(
            "mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm px-5 py-2.5 text-sm font-medium transition-colors",
            selected ? "bg-ink text-ivory" : "border border-ink text-ink hover:bg-ink hover:text-ivory",
          )}
        >
          {selected && <Check className="h-4 w-4" />} {selected ? "Opción elegida" : "Seleccionar"}
        </button>
      </div>
    </div>
  );
}
