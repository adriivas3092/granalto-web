/** Tipos del Visualizador de Ambientes. */

export type EnvironmentType = "kitchen" | "bathroom" | "wall" | "bbq";

/** Clave semántica de una superficie editable (compartida entre ambientes). */
export type SurfaceKind =
  | "countertop"
  | "cabinets"
  | "backsplash"
  | "floor"
  | "wall"
  | "shower-wall"
  | "niche"
  | "vanity"
  | "vanity-top"
  | "washbasin"
  | "faucet"
  | "sink"
  | "shower"
  | "feature-wall"
  | "facade"
  | "grill";

export type MaterialCategory =
  | "cuarzo"
  | "granito"
  | "marmol"
  | "porcelanico"
  | "porcelanato"
  | "ceramica"
  | "piedra"
  | "travertino"
  | "madera"
  | "microcemento"
  | "lacado"
  | "metal"
  | "sanitario";

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  collection?: string;
  color?: string;
  finish?: string;
  /** Ruta a la textura teselable (SVG/imagen). Ausente = color sólido. */
  texture?: string;
  /** Color/gradiente CSS de respaldo y para acentos de UI. */
  swatch: string;
  /** Tipos de superficie donde puede aplicarse. */
  availableFor: SurfaceKind[];
}

export interface Surface {
  id: string;
  name: string;
  kind: SurfaceKind;
  /** Geometría vectorial (equivale a la máscara). Path SVG en el viewBox. */
  path: string;
  /** Orden de apilado (mayor = encima). */
  z: number;
  defaultMaterialId?: string;
  textureScale?: number;
  textureRotation?: number;
  /** Sombra/luz propia de la superficie (multiply overlay 0–1). */
  shade?: number;
}

export interface Environment {
  id: string;
  type: EnvironmentType;
  name: string;
  description?: string;
  /** Subtipo para "Enchape de pared": sala, comedor, etc. */
  subtype?: string;
  viewBox: string;
  /** Color base del lienzo detrás de las capas. */
  baseFill: string;
  /** SVG decorativo de fondo, detrás de las superficies (ventanas, muebles). */
  decor?: string;
  /** SVG de detalle al frente (tiradores, vidrio, espejo, sombras). */
  overlay?: string;
  surfaces: Surface[];
}

export interface LightingPreset {
  id: string;
  name: string;
  /** Filtro CSS aplicado al lienzo. */
  filter: string;
  /** Color del overlay de ambiente. */
  overlay: string;
  /** Opacidad del overlay 0–1. */
  overlayOpacity: number;
  /** blend mode del overlay. */
  blend: "multiply" | "screen" | "soft-light" | "overlay";
}
