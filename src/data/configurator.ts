/**
 * Datos del configurador de superficies.
 *
 * Nivel actual: relleno por color/veta representativa de cada material sobre
 * una escena vectorial (alzado arquitectónico). Está preparado para subir de
 * nivel: si un material recibe una textura sin costura (`texture`), la escena
 * puede usarla como patrón en lugar del color. Ver README/CONTENT_TODO.
 */

export type MaterialFill = {
  /** Color base (transicionable) de la superficie. */
  base: string;
  /** Color de la veta/acento para los trazos sutiles. */
  vein: string;
  /** Textura sin costura opcional (nivel 2). Ruta en /images/textures/. */
  texture?: string;
};

/** Relleno representativo por material (slug de src/data/materials.ts). */
export const materialFills: Record<string, MaterialFill> = {
  cuarzo: { base: "#e8e5df", vein: "#c7c2b8" },
  cuarcita: { base: "#d9d3c7", vein: "#a9a293" },
  marmol: { base: "#f1efe9", vein: "#b6afa2" },
  granito: { base: "#37383c", vein: "#5c5d63" },
  cambria: { base: "#eae7e1", vein: "#b6b0a3" },
  "superficie-solida": { base: "#eeece6", vein: "#d6d3ca" },
  porcelanico: { base: "#ddd7cd", vein: "#b4ab9d" },
  travertino: { base: "#d9c7ab", vein: "#b09872" },
  hpl: { base: "#ccb896", vein: "#a98f68" },
};

export function getMaterialFill(slug: string): MaterialFill {
  return materialFills[slug] ?? { base: "#d7d0c5", vein: "#9b9b96" };
}

export type ConfigZone = {
  id: string;
  label: string;
  /** Ids de superficies de la escena que cambian con esta zona. */
  surfaceIds: string[];
};

export type ConfigSpace = {
  id: "cocina" | "bano";
  label: string;
  zones: ConfigZone[];
  /** Material inicial por zona (slug). */
  defaults: Record<string, string>;
};

export const configSpaces: ConfigSpace[] = [
  {
    id: "cocina",
    label: "Cocina",
    zones: [
      { id: "sobres", label: "Sobres e isla", surfaceIds: ["k-counter", "k-island-top"] },
      { id: "salpicadero", label: "Salpicadero", surfaceIds: ["k-backsplash"] },
      { id: "piso", label: "Piso", surfaceIds: ["k-floor"] },
    ],
    defaults: { sobres: "cuarcita", salpicadero: "marmol", piso: "porcelanico" },
  },
  {
    id: "bano",
    label: "Baño",
    zones: [
      { id: "sobres", label: "Sobre de baño", surfaceIds: ["b-counter"] },
      { id: "revestimiento", label: "Revestimiento", surfaceIds: ["b-wall"] },
      { id: "piso", label: "Piso", surfaceIds: ["b-floor"] },
    ],
    defaults: { sobres: "marmol", revestimiento: "porcelanico", piso: "travertino" },
  },
];
