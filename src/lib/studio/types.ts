/** Tipos del configurador visual (estudio de superficies). */

/** Punto del polígono, normalizado 0..1 respecto al tamaño de la imagen. */
export type Point = { x: number; y: number };

export type SurfaceKind =
  | "piso"
  | "pared"
  | "salpicadero"
  | "encimera"
  | "otro";

export type SurfaceTransform = {
  /** Escala del patrón (tamaño del formato). */
  scale: number;
  /** Rotación de la textura en grados. */
  rotation: number;
  /** Opacidad de la textura (0..1). */
  opacity: number;
  /** Brillo de la textura (0.5..1.5). */
  brightness: number;
};

export type StudioSurface = {
  id: string;
  name: string;
  kind: SurfaceKind;
  points: Point[];
  productId?: string;
  transform: SurfaceTransform;
  hidden?: boolean;
};

export type StudioProduct = {
  id: string;
  name: string;
  sku: string;
  brand: string;
  collection: string;
  category: string;
  material: string;
  effect: string;
  color: string;
  format: string;
  finish: string;
  /** Imagen de textura sin costura. */
  texture: string;
  /** Superficie recomendada. */
  surface: "piso" | "pared" | "ambos";
  usage: "interior" | "exterior" | "ambos";
};

export type StudioRoom = {
  id: string;
  name: string;
  style: string;
  image: string;
  surfacesCount: number;
};

export type StudioProject = {
  id: string;
  name: string;
  roomId?: string;
  /** Ruta pública o dataURL de la imagen base. */
  image: string;
  surfaces: StudioSurface[];
  createdAt: string;
  updatedAt: string;
};

export const defaultTransform: SurfaceTransform = {
  scale: 1,
  rotation: 0,
  opacity: 1,
  brightness: 1,
};
