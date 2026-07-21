import type { PricingBasis, SurfaceProduct } from "@/types/quote";
import { FABRICATION_COST_PER_M2, LINEAR_STANDARD_DEPTH_M } from "@/data/quote-config";

/** Precio por metro lineal del producto (propio o estimado desde el m²). */
export function linearPrice(product: SurfaceProduct): number {
  return product.pricePerLinearMeter ?? product.pricePerSquareMeter * LINEAR_STANDARD_DEPTH_M;
}

/**
 * Costo del material según la base de cotización:
 *  - "m2":     área facturable × precio por m²
 *  - "linear": metros lineales × precio por metro lineal
 */
export function calculateMaterialCost(
  product: SurfaceProduct,
  basis: PricingBasis,
  billableArea: number,
  billableLinearMeters: number,
): number {
  if (basis === "linear") return Math.round(linearPrice(product) * billableLinearMeters);
  return Math.round(product.pricePerSquareMeter * billableArea);
}

/** Costo de fabricación: área facturable × tarifa de fabricación. */
export function calculateFabricationCost(billableArea: number): number {
  return Math.round(FABRICATION_COST_PER_M2 * billableArea);
}
