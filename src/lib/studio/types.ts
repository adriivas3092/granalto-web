/** Tipos del configurador visual (estudio de superficies). */

/** Punto del polígono, normalizado 0..1 respecto al tamaño de la imagen. */
export type Point = { x: number; y: number };

export type SurfaceKind =
  | "piso"
  | "pared"
  | "salpicadero"
  | "encimera"
  | "otro";

/** Patrón de colocación de las piezas. */
export type LayingPattern = "recto" | "desplazado" | "diagonal" | "mosaico";

export type SurfaceTransform = {
  /** Escala del patrón (tamaño del formato). */
  scale: number;
  /** Rotación de la textura en grados. */
  rotation: number;
  /** Opacidad de la textura (0..1). */
  opacity: number;
  /** Brillo de la textura (0.5..1.5). */
  brightness: number;
  /** Ancho de la junta en píxeles de textura (0 = sin junta). */
  groutWidth: number;
  /** Color de la junta. */
  groutColor: string;
  /** Patrón de colocación. */
  pattern: LayingPattern;
  /** Deformar la textura a la perspectiva de los 4 puntos (si aplica). */
  perspective: boolean;
};

export type StudioSurface = {
  id: string;
  name: string;
  kind: SurfaceKind;
  points: Point[];
  productId?: string;
  transform: SurfaceTransform;
  hidden?: boolean;
  /** Superficie bloqueada: no se puede editar ni cambiar su producto. */
  locked?: boolean;
};

/** Herramienta activa del editor. */
export type EditorTool = "select" | "draw" | "ai" | "wand";

/** Estado de la carga de imagen. */
export type UploadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; dataUrl: string };

/** Historial de deshacer/rehacer (instantáneas de superficies). */
export type EditorHistory = {
  past: StudioSurface[][];
  future: StudioSurface[][];
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
  groutWidth: 0,
  groutColor: "#d8d4cc",
  pattern: "recto",
  perspective: false,
};
