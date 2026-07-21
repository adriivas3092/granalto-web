"use client";

import type { ProductQuoteResult } from "@/types/quote";
import { formatPrice } from "@/lib/store/format";

const ROWS: { key: keyof ProductQuoteResult; label: string }[] = [
  { key: "materialCost", label: "Material" },
  { key: "fabricationCost", label: "Fabricación" },
  { key: "edgeCost", label: "Cantos" },
  { key: "cutoutCost", label: "Cortes y perforaciones" },
  { key: "extrasCost", label: "Extras y servicios" },
  { key: "transportCost", label: "Transporte" },
  { key: "installationCost", label: "Instalación" },
];

/** Desglose de costos de un resultado de cotización. */
export function PriceBreakdown({ result }: { result: ProductQuoteResult }) {
  return (
    <dl className="space-y-1 text-sm">
      {ROWS.map((r) => (
        <div key={r.key} className="flex justify-between gap-3">
          <dt className="text-mineral">{r.label}</dt>
          <dd className="text-charcoal">{formatPrice(result[r.key] as number, result.currency)}</dd>
        </div>
      ))}
      <div className="flex justify-between gap-3 border-t border-stone-beige pt-1.5">
        <dt className="text-charcoal">Subtotal</dt>
        <dd className="text-ink">{formatPrice(result.subtotal, result.currency)}</dd>
      </div>
      <div className="flex justify-between gap-3">
        <dt className="text-mineral">Impuestos (IVA)</dt>
        <dd className="text-charcoal">{formatPrice(result.taxes, result.currency)}</dd>
      </div>
    </dl>
  );
}
