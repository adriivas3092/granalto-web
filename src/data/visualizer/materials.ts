import type { Material, SurfaceKind } from "./types";

const T = "/visualizer/textures";

/**
 * Catálogo de materiales de demostración. Los datos viven aquí, separados de
 * la interfaz. Para agregar un material, añada una entrada con su textura
 * (archivo en /public/visualizer/textures) y las superficies compatibles.
 */
export const MATERIALS: Material[] = [
  // --- Cuarzo ---
  {
    id: "cuarzo-calacatta",
    name: "Cuarzo Calacatta",
    category: "cuarzo",
    collection: "Cambria",
    finish: "Pulido",
    texture: `${T}/quartz-calacatta.svg`,
    swatch: "#efe9df",
    availableFor: ["countertop", "vanity-top", "backsplash", "feature-wall", "facade"],
  },
  {
    id: "cuarzo-blanco",
    name: "Cuarzo Blanco Nieve",
    category: "cuarzo",
    collection: "Cambria",
    finish: "Pulido",
    texture: `${T}/quartz-white.svg`,
    swatch: "#f4f2ee",
    availableFor: ["countertop", "vanity-top", "backsplash", "feature-wall"],
  },
  // --- Granito ---
  {
    id: "granito-negro",
    name: "Granito Negro Absoluto",
    category: "granito",
    finish: "Pulido",
    texture: `${T}/granite-black.svg`,
    swatch: "#262724",
    availableFor: ["countertop", "vanity-top", "floor", "facade", "feature-wall", "backsplash"],
  },
  {
    id: "granito-juparana",
    name: "Granito Juparana",
    category: "granito",
    finish: "Pulido",
    texture: `${T}/granite-juparana.svg`,
    swatch: "#c7b6a0",
    availableFor: ["countertop", "facade", "feature-wall", "floor"],
  },
  // --- Mármol ---
  {
    id: "marmol-carrara",
    name: "Mármol Carrara",
    category: "marmol",
    finish: "Pulido",
    texture: `${T}/marble-carrara.svg`,
    swatch: "#eceef0",
    availableFor: ["countertop", "vanity-top", "wall", "shower-wall", "floor", "feature-wall", "backsplash", "niche"],
  },
  {
    id: "marmol-emperador",
    name: "Mármol Emperador",
    category: "marmol",
    finish: "Pulido",
    texture: `${T}/marble-emperador.svg`,
    swatch: "#5b4636",
    availableFor: ["feature-wall", "floor", "vanity-top", "niche", "facade"],
  },
  // --- Porcelánico / Porcelanato ---
  {
    id: "porcelanico-gris",
    name: "Porcelánico Gris Cemento",
    category: "porcelanico",
    finish: "Mate",
    texture: `${T}/porcelain-grey.svg`,
    swatch: "#c9c7c2",
    availableFor: ["floor", "wall", "shower-wall", "backsplash", "feature-wall", "facade"],
  },
  {
    id: "porcelanico-marmol",
    name: "Porcelánico Símil Mármol",
    category: "porcelanico",
    finish: "Pulido",
    texture: `${T}/porcelain-marble.svg`,
    swatch: "#efeeea",
    availableFor: ["wall", "shower-wall", "floor", "feature-wall", "countertop", "niche"],
  },
  {
    id: "porcelanato-arena",
    name: "Porcelanato Arena",
    category: "porcelanato",
    finish: "Natural",
    texture: `${T}/porcelanato-sand.svg`,
    swatch: "#ded3c0",
    availableFor: ["floor", "wall", "feature-wall", "facade"],
  },
  // --- Cerámica ---
  {
    id: "ceramica-metro",
    name: "Cerámica Metro Blanca",
    category: "ceramica",
    finish: "Brillante",
    texture: `${T}/ceramic-subway.svg`,
    swatch: "#f3f1ec",
    availableFor: ["backsplash", "wall", "shower-wall", "feature-wall", "niche"],
  },
  // --- Piedra / Travertino / Pizarra / Terrazzo ---
  {
    id: "travertino",
    name: "Travertino Clásico",
    category: "travertino",
    finish: "Natural",
    texture: `${T}/travertine.svg`,
    swatch: "#e3d6c1",
    availableFor: ["feature-wall", "floor", "wall", "facade"],
  },
  {
    id: "pizarra-antracita",
    name: "Pizarra Antracita",
    category: "piedra",
    finish: "Natural",
    texture: `${T}/slate-anthracite.svg`,
    swatch: "#33363a",
    availableFor: ["feature-wall", "facade", "floor", "backsplash"],
  },
  {
    id: "terrazzo-claro",
    name: "Terrazzo Claro",
    category: "piedra",
    finish: "Pulido",
    texture: `${T}/terrazzo-light.svg`,
    swatch: "#eceae4",
    availableFor: ["floor", "countertop", "feature-wall", "vanity-top"],
  },
  // --- Microcemento ---
  {
    id: "microcemento-gris",
    name: "Microcemento Gris",
    category: "microcemento",
    finish: "Mate",
    texture: `${T}/microcement-grey.svg`,
    swatch: "#b6b2ab",
    availableFor: ["wall", "shower-wall", "floor", "feature-wall", "facade"],
  },
  // --- Madera ---
  {
    id: "madera-roble",
    name: "Roble Natural",
    category: "madera",
    finish: "Barnizado",
    texture: `${T}/wood-oak.svg`,
    swatch: "#c9a878",
    availableFor: ["cabinets", "vanity", "floor", "feature-wall"],
  },
  {
    id: "madera-nogal",
    name: "Nogal Oscuro",
    category: "madera",
    finish: "Barnizado",
    texture: `${T}/wood-walnut.svg`,
    swatch: "#7a5537",
    availableFor: ["cabinets", "vanity", "feature-wall"],
  },
  // --- Lacados (color sólido) para gabinetes y muebles ---
  { id: "lacado-blanco", name: "Lacado Blanco", category: "lacado", color: "Blanco", finish: "Mate", swatch: "#f2f1ee", availableFor: ["cabinets", "vanity"] },
  { id: "lacado-grafito", name: "Lacado Grafito", category: "lacado", color: "Grafito", finish: "Mate", swatch: "#3c3f43", availableFor: ["cabinets", "vanity"] },
  { id: "lacado-salvia", name: "Verde Salvia", category: "lacado", color: "Salvia", finish: "Mate", swatch: "#8a9a82", availableFor: ["cabinets", "vanity"] },
  { id: "lacado-azul", name: "Azul Profundo", category: "lacado", color: "Azul", finish: "Mate", swatch: "#3f5266", availableFor: ["cabinets", "vanity"] },
  { id: "lacado-arena", name: "Arena", category: "lacado", color: "Arena", finish: "Mate", swatch: "#c9bda6", availableFor: ["cabinets", "vanity"] },
  // --- Metales: grifería / parrilla / ducha ---
  { id: "metal-cromo", name: "Cromo Pulido", category: "metal", color: "Cromo", finish: "Brillante", swatch: "#c7ccd1", availableFor: ["faucet", "shower", "grill"] },
  { id: "metal-negro", name: "Negro Mate", category: "metal", color: "Negro", finish: "Mate", swatch: "#2b2d2f", availableFor: ["faucet", "shower", "grill"] },
  { id: "metal-oro", name: "Oro Cepillado", category: "metal", color: "Oro", finish: "Cepillado", swatch: "#b79a5e", availableFor: ["faucet", "shower"] },
  { id: "metal-acero", name: "Acero Inoxidable", category: "metal", color: "Acero", finish: "Cepillado", swatch: "#b9bdc0", availableFor: ["grill", "sink", "faucet"] },
  // --- Sanitarios / fregaderos ---
  { id: "sanitario-blanco", name: "Cerámica Blanca", category: "sanitario", color: "Blanco", finish: "Brillante", swatch: "#f6f5f2", availableFor: ["sink", "washbasin"] },
  { id: "sanitario-negro", name: "Composite Negro", category: "sanitario", color: "Negro", finish: "Mate", swatch: "#2e2f30", availableFor: ["sink", "washbasin"] },
  { id: "sanitario-arena", name: "Composite Arena", category: "sanitario", color: "Arena", finish: "Mate", swatch: "#d8ccb6", availableFor: ["sink", "washbasin"] },
];

const BY_ID = new Map(MATERIALS.map((m) => [m.id, m]));

export function getMaterial(id: string | undefined): Material | undefined {
  return id ? BY_ID.get(id) : undefined;
}

/** Materiales compatibles con un tipo de superficie. */
export function materialsForSurface(kind: SurfaceKind): Material[] {
  return MATERIALS.filter((m) => m.availableFor.includes(kind));
}
