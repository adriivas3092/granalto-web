import type { QuoteCalculationInput, ProductQuoteResult } from "@/types/quote";
import { QUOTE_CURRENCY } from "@/data/quote-config";
import { calculateArea, calculateLinearMeters, estimatePerimeter } from "./calculate-area";
import { calculateMaterialCost, calculateFabricationCost } from "./calculate-material";
import { calculateEdgeCost } from "./calculate-edges";
import { calculateCutoutCost, calculateExtrasCost } from "./calculate-cutouts";
import { calculateServices } from "./calculate-services";
import { calculateTaxes } from "./calculate-taxes";

/**
 * Motor de cálculo desacoplado de la UI. Aplica la MISMA configuración de
 * proyecto a cada material seleccionado y devuelve un resultado por producto.
 *
 * subtotal = material + fabricación + cantos + cortes + extras + transporte + instalación (+ otros servicios)
 * total    = subtotal + impuestos
 */
export function calculateQuote(input: QuoteCalculationInput): ProductQuoteResult[] {
  const { products, pieces, configuration } = input;
  const basis = configuration.pricingBasis ?? "m2";
  const { netArea, billableArea } = calculateArea(pieces, configuration.wastePercentage);
  const billableLinearMeters = calculateLinearMeters(pieces, configuration.wastePercentage);

  // Costos independientes del producto (compartidos entre opciones).
  const perimeter = estimatePerimeter(pieces);
  const edges = configuration.edges.map((e) => ({
    ...e,
    linearMeters: e.linearMeters || perimeter,
  }));
  const edgeCost = calculateEdgeCost(edges);
  const cutoutCost = calculateCutoutCost(configuration.cutouts);
  const extrasCost = calculateExtrasCost(configuration.additionalElements);
  const { installationCost, transportCost, otherServicesCost } = calculateServices(
    configuration.services,
    billableArea,
    configuration.location,
  );
  const fabricationCost = calculateFabricationCost(billableArea);

  return products.map((product) => {
    const materialCost = calculateMaterialCost(product, basis, billableArea, billableLinearMeters);
    const subtotal =
      materialCost +
      fabricationCost +
      edgeCost +
      cutoutCost +
      extrasCost +
      transportCost +
      installationCost +
      otherServicesCost;
    const taxes = calculateTaxes(subtotal);
    const total = subtotal + taxes;

    return {
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      category: product.category,
      materialArea: netArea,
      billableArea,
      linearMeters: billableLinearMeters,
      pricingBasis: basis,
      materialCost,
      fabricationCost,
      edgeCost,
      cutoutCost,
      extrasCost: extrasCost + otherServicesCost,
      transportCost,
      installationCost,
      subtotal,
      taxes,
      total,
      currency: QUOTE_CURRENCY,
    };
  });
}
