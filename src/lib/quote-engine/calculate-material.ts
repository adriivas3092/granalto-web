import type { SurfaceProduct } from "@/types/quote";
import { FABRICATION_COST_PER_M2 } from "@/data/quote-config";

/** Costo del material: área facturable × precio por m² del producto. */
export function calculateMaterialCost(product: SurfaceProduct, billableArea: number): number {
  return Math.round(product.pricePerSquareMeter * billableArea);
}

/** Costo de fabricación: área facturable × tarifa de fabricación. */
export function calculateFabricationCost(billableArea: number): number {
  return Math.round(FABRICATION_COST_PER_M2 * billableArea);
}
