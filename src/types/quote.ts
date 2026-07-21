/**
 * Tipos del cotizador de superficies y encimeras (/cotizar).
 * Agrupa producto, proyecto, configuración, cálculo y cliente.
 */

/* ----------------------------------------------------------------- Producto */

export interface SurfaceProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  collection?: string;
  brand?: string;
  description?: string;
  imageUrl: string;
  gallery?: string[];
  /** Precio base por m². PENDIENTE: reemplazar por tarifa real de Granalto. */
  pricePerSquareMeter: number;
  /** Precio por metro lineal (fondo estándar). Si falta, se estima desde el m². */
  pricePerLinearMeter?: number;
  availableThicknesses: number[];
  finishes: string[];
  colors?: string[];
  tags?: string[];
  isActive: boolean;
}

/* ------------------------------------------------------------------ Proyecto */

export type PieceShape = "recto" | "l" | "u" | "isla" | "barra" | "splashback" | "personalizado";
export type MeasureUnit = "mm" | "cm" | "m";

export interface ProjectPiece {
  id: string;
  name: string;
  shape: PieceShape;
  length: number;
  width: number;
  quantity: number;
  unit: MeasureUnit;
  thickness: number;
  notes?: string;
}

export type ProjectKind = "cocina" | "bano" | "isla" | "barra" | "mueble" | "comercial" | "otro";
export type ProjectStage = "nuevo" | "remodelacion" | "sustitucion";

export interface ProjectInformation {
  kind: ProjectKind;
  stage: ProjectStage;
  name?: string;
  province?: string;
  estimatedDate?: string;
}

export interface ProjectLocation {
  province: string;
  canton?: string;
  district?: string;
  postalCode?: string;
  zone?: string;
}

/* ------------------------------------------------------------- Configuración */

export interface EdgeSelection {
  edgeId: string;
  /** Metros lineales a los que se aplica el canto. */
  linearMeters: number;
}

export interface CutoutSelection {
  cutoutId: string;
  quantity: number;
  notes?: string;
}

export interface AdditionalElement {
  id: string;
  typeId: string;
  length: number; // m
  height: number; // m
  quantity: number;
  finish?: string;
}

export interface ServiceSelection {
  serviceId: string;
}

/** Base de cotización elegida por el cliente. */
export type PricingBasis = "m2" | "linear";

export interface QuoteConfiguration {
  selectedThickness: number;
  /** Cotizar por metro cuadrado o por metro lineal. Por defecto "m2". */
  pricingBasis?: PricingBasis;
  finish?: string;
  edges: EdgeSelection[];
  cutouts: CutoutSelection[];
  additionalElements: AdditionalElement[];
  services: ServiceSelection[];
  location?: ProjectLocation;
  /** Sobrescribe el desperdicio por defecto de la configuración global. */
  wastePercentage?: number;
}

/* ------------------------------------------------------------------ Cálculo */

export interface QuoteCalculationInput {
  products: SurfaceProduct[];
  pieces: ProjectPiece[];
  configuration: QuoteConfiguration;
}

export interface ProductQuoteResult {
  productId: string;
  productName: string;
  imageUrl: string;
  category: string;
  materialArea: number;
  billableArea: number;
  /** Metros lineales facturables (relevante en base "linear"). */
  linearMeters: number;
  /** Base con la que se cotizó el material. */
  pricingBasis: PricingBasis;
  materialCost: number;
  fabricationCost: number;
  edgeCost: number;
  cutoutCost: number;
  extrasCost: number;
  transportCost: number;
  installationCost: number;
  subtotal: number;
  taxes: number;
  total: number;
  currency: string;
}

/* ------------------------------------------------------------------ Cliente */

export type PreferredContact = "whatsapp" | "llamada" | "correo";

export interface CustomerInformation {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: PreferredContact;
  province?: string;
  canton?: string;
  district?: string;
  address?: string;
  estimatedDate?: string;
  budget?: string;
  comments?: string;
}

export interface ConsentInformation {
  privacyAccepted: boolean;
  contactConsent: boolean;
}

export interface QuoteSubmission {
  quoteId?: string;
  source: "granalto-online-quote";
  project: ProjectInformation | null;
  selectedProducts: SurfaceProduct[];
  pieces: ProjectPiece[];
  configuration: QuoteConfiguration;
  calculations: ProductQuoteResult[];
  selectedOptionId?: string;
  customer: CustomerInformation;
  consent: ConsentInformation;
  createdAt?: string;
}
