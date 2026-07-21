import { TAX_RATE } from "@/data/quote-config";

/** Impuesto sobre el subtotal (IVA configurable). */
export function calculateTaxes(subtotal: number, taxRate = TAX_RATE): number {
  return Math.round(subtotal * taxRate);
}
