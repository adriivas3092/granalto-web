import type { AdditionalElement, CutoutSelection } from "@/types/quote";
import { ADDITIONAL_ELEMENT_TYPES, CUTOUT_OPTIONS } from "@/data/quote-config";

/** Costo de cortes y perforaciones: Σ (precio unitario × cantidad). */
export function calculateCutoutCost(cutouts: CutoutSelection[]): number {
  return Math.round(
    cutouts.reduce((sum, c) => {
      const opt = CUTOUT_OPTIONS.find((o) => o.id === c.cutoutId);
      if (!opt) return sum;
      return sum + opt.unitPrice * Math.max(0, c.quantity);
    }, 0),
  );
}

/** Costo de elementos adicionales (splashback, faldón, etc.): Σ área × tarifa. */
export function calculateExtrasCost(elements: AdditionalElement[]): number {
  return Math.round(
    elements.reduce((sum, el) => {
      const type = ADDITIONAL_ELEMENT_TYPES.find((t) => t.id === el.typeId);
      if (!type) return sum;
      const area = Math.max(0, el.length) * Math.max(0, el.height) * Math.max(1, el.quantity);
      return sum + type.pricePerM2 * area;
    }, 0),
  );
}
