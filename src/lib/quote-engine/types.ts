/** Reexporta los tipos de cálculo para el motor de cotización. */
export type {
  SurfaceProduct,
  ProjectPiece,
  MeasureUnit,
  QuoteConfiguration,
  QuoteCalculationInput,
  ProductQuoteResult,
  EdgeSelection,
  CutoutSelection,
  AdditionalElement,
  ServiceSelection,
  ProjectLocation,
} from "@/types/quote";

export interface AreaResult {
  netArea: number;
  billableArea: number;
}

export interface ServicesResult {
  installationCost: number;
  transportCost: number;
  otherServicesCost: number;
}
