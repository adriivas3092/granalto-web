/**
 * Configuración del cotizador: tarifas, impuestos, opciones de canto, cortes,
 * servicios y transporte. TODAS las tarifas son configurables desde aquí.
 *
 * ⚠️ PENDIENTE_GRANALTO: los montos son PLACEHOLDERS para que el flujo funcione.
 * Sustituya por las tarifas reales (o conéctelas a un CMS/ERP vía la API en
 * src/lib/api/quote-service.ts). No trate estos valores como definitivos.
 */

export const QUOTE_CURRENCY = "CRC";

/** IVA de Costa Rica. Configurable por si cambia o aplica exención. */
export const TAX_RATE = 0.13;

/** Desperdicio por defecto (%) sobre el área neta. */
export const DEFAULT_WASTE_PERCENTAGE = 12;

/** Área mínima facturable (m²). */
export const MINIMUM_BILLABLE_AREA = 0.5;

/** Costo de fabricación por m² (corte, pulido de superficie, manejo). */
export const FABRICATION_COST_PER_M2 = 45000;

/** Grosores disponibles (mm) a nivel global (cada producto puede limitar). */
export const THICKNESS_OPTIONS = [12, 20, 30];

/** Acabados disponibles para las superficies. Configurable. */
export const FINISH_OPTIONS = ["Pulido", "Honed", "Tronchado", "Ranurado"];

export type EdgeOption = {
  id: string;
  name: string;
  description?: string;
  /** Precio por metro lineal de canto. */
  pricePerLinearMeter: number;
};

export const EDGE_OPTIONS: EdgeOption[] = [
  { id: "recto", name: "Recto", description: "Canto a 90°, acabado limpio.", pricePerLinearMeter: 0 },
  { id: "biselado", name: "Biselado", description: "Chaflán a 45°.", pricePerLinearMeter: 6000 },
  { id: "redondeado", name: "Redondeado", description: "Canto con radio suave.", pricePerLinearMeter: 8000 },
  { id: "medio-bocel", name: "Medio bocel", pricePerLinearMeter: 11000 },
  { id: "bocel-completo", name: "Bocel completo", pricePerLinearMeter: 14000 },
  { id: "cascada", name: "Cascada (waterfall)", description: "Canto continuo hacia el piso.", pricePerLinearMeter: 22000 },
  { id: "inglete", name: "Inglete (mitre)", description: "Unión a 45° para mayor espesor visual.", pricePerLinearMeter: 26000 },
];

export type CutoutOption = {
  id: string;
  name: string;
  help?: string;
  unitPrice: number;
};

export const CUTOUT_OPTIONS: CutoutOption[] = [
  { id: "fregadero-sobrepuesto", name: "Corte fregadero sobrepuesto", unitPrice: 18000 },
  { id: "fregadero-bajo", name: "Corte fregadero bajo cubierta", help: "Requiere pulido del canto interno.", unitPrice: 32000 },
  { id: "cocina", name: "Corte para cocina/plantilla", unitPrice: 20000 },
  { id: "griferia", name: "Perforación grifería", unitPrice: 6000 },
  { id: "dispensador", name: "Perforación dispensador", unitPrice: 6000 },
  { id: "tomacorriente", name: "Perforación tomacorriente", unitPrice: 9000 },
  { id: "escurridor", name: "Escurridor ranurado", help: "Ranuras talladas junto al fregadero.", unitPrice: 40000 },
  { id: "canal-drenaje", name: "Canal de drenaje", unitPrice: 45000 },
  { id: "personalizado", name: "Corte personalizado", unitPrice: 25000 },
];

/** Tipos de elementos adicionales (verticales) cobrados por m². */
export type AdditionalElementType = {
  id: string;
  name: string;
  pricePerM2: number;
};

export const ADDITIONAL_ELEMENT_TYPES: AdditionalElementType[] = [
  { id: "splashback", name: "Salpicadero (splashback)", pricePerM2: 60000 },
  { id: "faldon", name: "Faldón frontal", pricePerM2: 60000 },
  { id: "lateral", name: "Lateral", pricePerM2: 60000 },
  { id: "cascada", name: "Cascada", pricePerM2: 75000 },
  { id: "zocalo", name: "Zócalo", pricePerM2: 45000 },
  { id: "elevacion", name: "Elevación/repisa", pricePerM2: 65000 },
  { id: "revestimiento", name: "Revestimiento vertical", pricePerM2: 60000 },
];

export type ServiceOption = {
  id: string;
  name: string;
  help?: string;
  kind: "fixed" | "perM2";
  price: number;
};

export const SERVICE_OPTIONS: ServiceOption[] = [
  { id: "medicion", name: "Medición en sitio", kind: "fixed", price: 25000 },
  { id: "plantillado", name: "Plantillado", kind: "fixed", price: 35000 },
  { id: "fabricacion", name: "Fabricación", kind: "perM2", price: 0, help: "Incluida en el costo de fabricación." },
  { id: "instalacion", name: "Instalación", kind: "perM2", price: 30000 },
  { id: "transporte", name: "Transporte", kind: "fixed", price: 0, help: "Se calcula según la provincia de entrega." },
  { id: "retiro", name: "Retiro de superficie anterior", kind: "fixed", price: 40000 },
  { id: "desinstalacion", name: "Desinstalación", kind: "fixed", price: 30000 },
  { id: "sellado", name: "Sellado", kind: "perM2", price: 8000 },
  { id: "visita-tecnica", name: "Visita técnica", kind: "fixed", price: 20000 },
  { id: "solo-suministro", name: "Solo suministro del material", kind: "fixed", price: 0 },
];

/** Zonas de transporte por provincia (placeholder, configurable). */
export const TRANSPORT_ZONES: Record<string, { zone: string; cost: number }> = {
  "San José": { zone: "GAM", cost: 25000 },
  Heredia: { zone: "GAM", cost: 25000 },
  Alajuela: { zone: "GAM", cost: 30000 },
  Cartago: { zone: "GAM", cost: 30000 },
  Guanacaste: { zone: "Fuera GAM", cost: 65000 },
  Puntarenas: { zone: "Fuera GAM", cost: 60000 },
  Limón: { zone: "Fuera GAM", cost: 60000 },
};

export const DEFAULT_TRANSPORT_COST = 45000;

export const PROVINCES = Object.keys(TRANSPORT_ZONES);

/** Objeto único de configuración expuesto por la API /api/quote-config. */
export const quoteConfig = {
  currency: QUOTE_CURRENCY,
  taxRate: TAX_RATE,
  defaultWastePercentage: DEFAULT_WASTE_PERCENTAGE,
  minimumBillableArea: MINIMUM_BILLABLE_AREA,
  fabricationCostPerM2: FABRICATION_COST_PER_M2,
  thicknessOptions: THICKNESS_OPTIONS,
  edges: EDGE_OPTIONS,
  cutouts: CUTOUT_OPTIONS,
  additionalElementTypes: ADDITIONAL_ELEMENT_TYPES,
  services: SERVICE_OPTIONS,
  transportZones: TRANSPORT_ZONES,
  defaultTransportCost: DEFAULT_TRANSPORT_COST,
  provinces: PROVINCES,
};

export type QuoteConfig = typeof quoteConfig;
