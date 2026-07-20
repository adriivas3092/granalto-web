import type { StudioProduct } from "@/lib/studio/types";

/**
 * Catálogo de demostración del configurador.
 * Las texturas son sin costura generadas provisionalmente; se reemplazan por
 * las texturas reales de producto cuando estén disponibles. El modelo está
 * preparado para conectar un catálogo real (ver panel administrativo futuro).
 */
export const studioProducts: StudioProduct[] = [
  {
    id: "prod-marmol-blanco",
    name: "Mármol Blanco",
    sku: "MB-6060",
    brand: "Granalto",
    collection: "Naturale",
    category: "Piedra natural",
    material: "Mármol",
    effect: "Mármol",
    color: "Blanco",
    format: "60×60",
    finish: "Pulido",
    texture: "/images/textures/marmol-blanco.jpg",
    surface: "ambos",
    usage: "interior",
  },
  {
    id: "prod-granito-negro",
    name: "Granito Negro",
    sku: "GN-6060",
    brand: "Granalto",
    collection: "Naturale",
    category: "Piedra natural",
    material: "Granito",
    effect: "Granito",
    color: "Negro",
    format: "60×60",
    finish: "Pulido",
    texture: "/images/textures/granito-negro.jpg",
    surface: "ambos",
    usage: "ambos",
  },
  {
    id: "prod-cuarzo-gris",
    name: "Cuarzo Gris",
    sku: "CG-3060",
    brand: "Cambria",
    collection: "Tecnica",
    category: "Superficie técnica",
    material: "Cuarzo",
    effect: "Piedra",
    color: "Gris",
    format: "30×60",
    finish: "Mate",
    texture: "/images/textures/cuarzo-gris.jpg",
    surface: "ambos",
    usage: "interior",
  },
  {
    id: "prod-travertino-beige",
    name: "Travertino Beige",
    sku: "TB-6060",
    brand: "Granalto",
    collection: "Naturale",
    category: "Piedra natural",
    material: "Travertino",
    effect: "Travertino",
    color: "Beige",
    format: "60×60",
    finish: "Honed",
    texture: "/images/textures/travertino-beige.jpg",
    surface: "piso",
    usage: "ambos",
  },
  {
    id: "prod-madera-natural",
    name: "Madera Natural",
    sku: "MN-2090",
    brand: "ABK",
    collection: "Legno",
    category: "Porcelánico",
    material: "Porcelánico",
    effect: "Madera",
    color: "Nogal",
    format: "20×90",
    finish: "Natural",
    texture: "/images/textures/madera-natural.jpg",
    surface: "piso",
    usage: "interior",
  },
  {
    id: "prod-concreto-gris",
    name: "Concreto Gris",
    sku: "CO-6060",
    brand: "ABK",
    collection: "Urban",
    category: "Porcelánico",
    material: "Porcelánico",
    effect: "Cemento",
    color: "Gris",
    format: "60×60",
    finish: "Natural",
    texture: "/images/textures/concreto-gris.jpg",
    surface: "ambos",
    usage: "ambos",
  },
  {
    id: "prod-porcelanato-marfil",
    name: "Porcelanato Marfil",
    sku: "PM-8080",
    brand: "ABK",
    collection: "Pietra",
    category: "Porcelánico",
    material: "Porcelánico",
    effect: "Piedra",
    color: "Marfil",
    format: "80×80",
    finish: "Pulido",
    texture: "/images/textures/porcelanato-marfil.jpg",
    surface: "ambos",
    usage: "interior",
  },
  {
    id: "prod-terrazzo-claro",
    name: "Terrazzo Claro",
    sku: "TE-6060",
    brand: "Santa Margherita",
    collection: "Deco",
    category: "Superficie decorativa",
    material: "Terrazzo",
    effect: "Terrazzo",
    color: "Claro",
    format: "60×60",
    finish: "Pulido",
    texture: "/images/textures/terrazzo-claro.jpg",
    surface: "piso",
    usage: "interior",
  },
];

export function getStudioProducts(): StudioProduct[] {
  return studioProducts;
}

export function getStudioProductById(id: string): StudioProduct | undefined {
  return studioProducts.find((p) => p.id === id);
}

/** Valores únicos para poblar filtros. */
export const studioFilters = {
  material: [...new Set(studioProducts.map((p) => p.material))],
  effect: [...new Set(studioProducts.map((p) => p.effect))],
  color: [...new Set(studioProducts.map((p) => p.color))],
  surface: ["piso", "pared", "ambos"] as const,
};
