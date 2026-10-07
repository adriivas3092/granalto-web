/**
 * Configuración del cotizador de sobres estandarizados (Documento 4).
 *
 * Reglas de negocio (RN-01..RN-12): catálogo aprobado, espesor automático por
 * material, una sola moldura, salpicadero opcional, U sin cotización automática,
 * paralela = 2 sobres, personalizado deriva a asesor, plazo editable.
 *
 * NOTA DE PRECIOS: los precios por m² y por metro lineal son PARÁMETROS
 * editables por Granalto. Mientras estén en 0, el cotizador calcula áreas y
 * metros pero muestra "Precio a confirmar" (no inventa montos). Al cargar los
 * precios reales aquí, el cálculo se activa automáticamente.
 */

export const IVA_RATE = 0.13;

/** Moneda del cotizador. Los precios por material se cargan en esta moneda. */
export const MONEDA = "USD";

/** Unidad de medida para ingresar dimensiones (internamente todo se guarda en mm). */
export type Unidad = "mm" | "cm" | "m";
/** Milímetros por unidad. */
export const MM_POR_UNIDAD: Record<Unidad, number> = { mm: 1, cm: 10, m: 1000 };

/** Plazo estándar de producción (RN-08). Editable por Granalto. */
export const PLAZO_DIAS_HABILES = 10;

/** Nota técnica: todo sobre requiere un contrasobre de soporte. */
export const NOTA_CONTRASOBRE =
  "Los sobres requieren un contrasobre de mínimo 18 mm para dar soporte al material del sobre.";

/** Precio por metro lineal de moldura básica (CRC). 0 = a confirmar. */
export const PRECIO_MOLDURA_ML = 0;

/**
 * Límites de medidas por pieza estándar, en mm (RN-13).
 * Máximo 3,10 m de largo y 1,40 m de ancho/profundidad. Lo que exceda cualquiera
 * de estos límites se deriva a cotización personalizada. No hay mínimo de piezas
 * por pedido (RN-14); solo se exigen números positivos.
 */
export const MEDIDAS_LIMITES = {
  largoMaxMm: 3100,
  profMaxMm: 1400,
};

/** true si la medida de una pieza supera el máximo estándar (deriva a personalizado). */
export function medidaExcedeMaximo(largoMm: number, profMm: number): boolean {
  return largoMm > MEDIDAS_LIMITES.largoMaxMm || profMm > MEDIDAS_LIMITES.profMaxMm;
}

/** Salpicadero: alturas en cm. */
export const SALPICADERO = {
  estandarCm: 10,
  customMinCm: 5,
  customMaxCm: 30,
};

/** Grosor estándar de la moldura (cm). Corte a 45°. Más grosor: consultar asesor. */
export const MOLDURA_GROSOR_ESTANDAR_CM = 3;

/** Catálogo de perfiles de moldura (Molduras Sobres Granalto). */
export type MolduraPerfil = { id: number; nombre: string; imagen: string };
export const MOLDURAS_PERFILES: MolduraPerfil[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  nombre: `Moldura ${i + 1}`,
  imagen: `/materiales/molduras/moldura-${i + 1}.png`,
}));

export function getMolduraPerfil(id: number | null | undefined): MolduraPerfil | undefined {
  return id == null ? undefined : MOLDURAS_PERFILES.find((m) => m.id === id);
}

/** Acabado de superficie. */
export type Acabado = "brillo" | "mate";
export const ACABADOS: { id: Acabado; nombre: string; desc: string }[] = [
  { id: "brillo", nombre: "Brillo", desc: "Superficie pulida y reflectante." },
  { id: "mate", nombre: "Mate", desc: "Superficie sin brillo, de aspecto natural." },
];

/** Esquina de la unión para el sobre en L (vista en planta). */
export type LUnion = "izquierda" | "derecha";
export const L_UNIONES: { id: LUnion; nombre: string }[] = [
  { id: "izquierda", nombre: "Unión a la izquierda" },
  { id: "derecha", nombre: "Unión a la derecha" },
];

export type TramoDef = { key: string; label: string };

export type Geometria = {
  id: string;
  nombre: string;
  descripcion: string;
  tramos: TramoDef[];
  /** true = genera precio automático; false = deriva a asesor. */
  autoPrecio: boolean;
  nota?: string;
};

/** Pantalla 1 — Tipo de proyecto (geometría). RN-05 excluye la U del catálogo. */
export const GEOMETRIAS: Geometria[] = [
  {
    id: "recto",
    nombre: "Sobre recto",
    descripcion: "Un tramo con largo y profundidad.",
    tramos: [{ key: "principal", label: "Sobre" }],
    autoPrecio: true,
  },
  {
    id: "barra",
    nombre: "Barra",
    descripcion: "Un tramo con largo y profundidad. Puede llevar moldura y salpicadero.",
    tramos: [{ key: "principal", label: "Barra" }],
    autoPrecio: true,
  },
  {
    id: "isla",
    nombre: "Isla",
    descripcion: "Pieza independiente con largo y profundidad, sin unión con otro tramo.",
    tramos: [{ key: "principal", label: "Isla" }],
    autoPrecio: true,
  },
  {
    id: "l",
    nombre: "Sobre en L",
    descripcion: "Dos tramos relacionados y una unión.",
    tramos: [
      { key: "a", label: "Tramo A" },
      { key: "b", label: "Tramo B" },
    ],
    autoPrecio: true,
    nota: "Las medidas de la L quedan sujetas a validación técnica posterior.",
  },
  {
    id: "paralela",
    nombre: "Cocina paralela",
    descripcion: "Dos tramos rectos dentro del mismo pedido. El total es la suma de ambos.",
    tramos: [
      { key: "a", label: "Sobre A" },
      { key: "b", label: "Sobre B" },
    ],
    autoPrecio: true,
  },
  {
    id: "personalizado",
    nombre: "Proyecto personalizado",
    descripcion: "¿Otra forma o un proyecto especial? Un asesor lo cotiza con vos.",
    tramos: [],
    autoPrecio: false,
    nota: "Los proyectos personalizados se atienden con un asesor; no generan precio automático.",
  },
];

export function getGeometria(id: string | null): Geometria | undefined {
  return GEOMETRIAS.find((g) => g.id === id);
}

export type Color = {
  id: string;
  nombre: string;
  swatch: string;
  /** Foto del material (textura/acabado). Si existe, se muestra en vez del swatch. */
  imagen?: string;
  /** true = material sin disponibilidad (no cotiza; se consulta con asesor). */
  agotado?: boolean;
  /** Precio por m² específico del color (anula el del material). */
  precioM2?: number;
};

export type MaterialCat = {
  id: string;
  nombre: string;
  espesorMm: number;
  /** Precio por m² en la moneda del cotizador (MONEDA). 0 = a confirmar. */
  precioM2: number;
  colores: Color[];
};

/** Precio por m² efectivo de un color (override del color o, si no, del material). */
export function precioM2Color(material: MaterialCat | undefined, color: Color | undefined): number {
  if (!material || !color || color.agotado) return 0;
  return color.precioM2 ?? material.precioM2;
}

/** Pantalla 2 — Material y color (RN-01, RN-02). Espesor automático. */
export const MATERIALES: MaterialCat[] = [
  {
    id: "cuarzo",
    nombre: "Cuarzo",
    espesorMm: 15,
    precioM2: 85,
    colores: [
      { id: "blanco-alpino", nombre: "Blanco Alpino", swatch: "#f1efe9", imagen: "/materiales/cuarzo-blanco-alpino.webp" },
      { id: "gris-vulcano", nombre: "Gris Vulcano", swatch: "#6f7276", imagen: "/materiales/cuarzo-gris-vulcano.webp", agotado: true },
      { id: "london-grey", nombre: "London Grey", swatch: "#b7b6b1", agotado: true },
      { id: "negro", nombre: "Negro", swatch: "#1d1d1d", imagen: "/materiales/cuarzo-negro.jpg", agotado: true },
      { id: "blanco-star", nombre: "Blanco Star", swatch: "#e9e6df", imagen: "/materiales/cuarzo-blanco-star.jpg", agotado: true },
    ],
  },
  {
    id: "porcelanico",
    nombre: "Porcelánico",
    espesorMm: 12,
    precioM2: 129,
    colores: [
      { id: "calacatta-gold", nombre: "Calacatta Gold", swatch: "#ece6da", imagen: "/materiales/porcelanico-calacatta-gold.webp" },
      { id: "calacatta-grey", nombre: "Calacatta Grey", swatch: "#e8e6e2", imagen: "/materiales/porcelanico-calacatta-grey.webp" },
      { id: "pireney-grey", nombre: "Pireney Grey", swatch: "#9a9b9d", imagen: "/materiales/porcelanico-pireney-grey.webp" },
      { id: "blanco", nombre: "Blanco", swatch: "#f4f3f0" },
      { id: "negro", nombre: "Negro", swatch: "#201f1d", imagen: "/materiales/porcelanico-negro.png" },
      { id: "triani-beige", nombre: "Triani Beige", swatch: "#cdbfa8", imagen: "/materiales/porcelanico-triani-beige.webp" },
    ],
  },
];

export function getMaterial(id: string | null): MaterialCat | undefined {
  return MATERIALES.find((m) => m.id === id);
}
