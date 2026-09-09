import {
  IVA_RATE,
  PRECIO_MOLDURA_ML,
  getGeometria,
  getMaterial,
} from "@/data/configurador";

export type Medida = { largo: number; prof: number }; // en mm
export type SalpicaderoTipo = "no" | "10" | "custom";

export type ConfigInput = {
  geometriaId: string | null;
  materialId: string | null;
  colorId: string | null;
  medidas: Record<string, Medida>;
  moldura: boolean | null;
  salpicaderoTipo: SalpicaderoTipo;
  salpicaderoAlturaCm: number;
};

export type PriceResult = {
  /** Área de los tramos, en m². */
  areaTramos: number;
  /** Área adicional del salpicadero, en m². */
  areaSalpicadero: number;
  /** Área total facturable, en m². */
  areaTotal: number;
  /** Metros lineales de moldura (frente). */
  molduraMl: number;
  /** true si hay precios cargados para calcular montos. */
  tienePrecio: boolean;
  subtotal: number;
  iva: number;
  total: number;
  moneda: string;
};

const mm2m = (mm: number) => (Number.isFinite(mm) && mm > 0 ? mm / 1000 : 0);

/** Suma de áreas de los tramos con medidas válidas (m²). */
export function areaDeTramos(input: ConfigInput): number {
  const geo = getGeometria(input.geometriaId);
  if (!geo) return 0;
  let area = 0;
  for (const t of geo.tramos) {
    const m = input.medidas[t.key];
    if (m) area += mm2m(m.largo) * mm2m(m.prof);
  }
  return area;
}

/** Frente total (suma de largos de los tramos), en metros. */
export function frenteTotalM(input: ConfigInput): number {
  const geo = getGeometria(input.geometriaId);
  if (!geo) return 0;
  return geo.tramos.reduce((acc, t) => {
    const m = input.medidas[t.key];
    return acc + (m ? mm2m(m.largo) : 0);
  }, 0);
}

export function alturaSalpicaderoCm(input: ConfigInput): number {
  if (input.salpicaderoTipo === "no") return 0;
  if (input.salpicaderoTipo === "10") return 10;
  return input.salpicaderoAlturaCm > 0 ? input.salpicaderoAlturaCm : 0;
}

/** Cálculo completo del precio. Si no hay precios cargados, tienePrecio=false. */
export function calcularPrecio(input: ConfigInput): PriceResult {
  const material = getMaterial(input.materialId);
  const geo = getGeometria(input.geometriaId);

  const areaTramos = areaDeTramos(input);
  const frente = frenteTotalM(input);
  const alturaM = alturaSalpicaderoCm(input) / 100;
  const areaSalpicadero = frente > 0 && alturaM > 0 ? frente * alturaM : 0;
  const areaTotal = areaTramos + areaSalpicadero;
  const molduraMl = input.moldura ? frente : 0;

  const precioM2 = material?.precioM2 ?? 0;
  const autoPrecio = geo?.autoPrecio ?? false;
  const tienePrecio = autoPrecio && precioM2 > 0;

  let subtotal = 0;
  if (tienePrecio) {
    subtotal = areaTotal * precioM2 + molduraMl * PRECIO_MOLDURA_ML;
  }
  const iva = tienePrecio ? subtotal * IVA_RATE : 0;
  const total = subtotal + iva;

  return {
    areaTramos: round2(areaTramos),
    areaSalpicadero: round2(areaSalpicadero),
    areaTotal: round2(areaTotal),
    molduraMl: round2(molduraMl),
    tienePrecio,
    subtotal: Math.round(subtotal),
    iva: Math.round(iva),
    total: Math.round(total),
    moneda: "CRC",
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
