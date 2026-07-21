import type { SurfaceProduct } from "@/types/quote";

/**
 * Catálogo de MATERIALES del cotizador (independiente de la tienda).
 * Fotos reales de Granalto en /public/images/materials.
 *
 * ⚠️ PENDIENTE_GRANALTO: `pricePerSquareMeter` está en 0 = "Precio a confirmar".
 * Sustituí por las tarifas reales por m². Para conectar un catálogo dinámico
 * (CMS/ERP), reemplazá esta lista desde src/lib/api/product-service.ts.
 */
export const mockProducts: SurfaceProduct[] = [
  {
    id: "marmol-blanco-carrara",
    slug: "marmol-blanco-carrara",
    name: "Mármol Blanco Carrara",
    category: "Mármol",
    collection: "Natural",
    description: "Mármol blanco con vetas grises suaves. Elegante y atemporal.",
    imageUrl: "/images/materials/marmol-blanco-carrara.jpg",
    pricePerSquareMeter: 0,
    availableThicknesses: [20, 30],
    finishes: ["Pulido", "Mate"],
    colors: ["blanco"],
    tags: ["recomendado"],
    isActive: true,
  },
  {
    id: "marmol-negro-marquina",
    slug: "marmol-negro-marquina",
    name: "Mármol Negro Marquina",
    category: "Mármol",
    collection: "Natural",
    description: "Mármol negro profundo con vetas blancas contrastantes.",
    imageUrl: "/images/materials/marmol-negro-marquina.jpg",
    pricePerSquareMeter: 0,
    availableThicknesses: [20, 30],
    finishes: ["Pulido"],
    colors: ["negro"],
    tags: ["popular"],
    isActive: true,
  },
  {
    id: "marmol-gris",
    slug: "marmol-gris",
    name: "Mármol Gris",
    category: "Mármol",
    collection: "Natural",
    description: "Mármol gris de tonos nublados, sobrio y versátil.",
    imageUrl: "/images/materials/marmol-gris.jpg",
    pricePerSquareMeter: 0,
    availableThicknesses: [20, 30],
    finishes: ["Pulido", "Mate"],
    colors: ["gris"],
    isActive: true,
  },
  {
    id: "granito-santa-cecilia",
    slug: "granito-santa-cecilia",
    name: "Granito Santa Cecilia",
    category: "Granito",
    collection: "Natural",
    description: "Granito beige con motas doradas, grises y rojizas.",
    imageUrl: "/images/materials/granito-santa-cecilia.jpg",
    pricePerSquareMeter: 0,
    availableThicknesses: [20, 30],
    finishes: ["Pulido", "Texturizado"],
    colors: ["beige"],
    isActive: true,
  },
  {
    id: "terrazzo-blanco",
    slug: "terrazzo-blanco",
    name: "Terrazzo Blanco",
    category: "Terrazzo",
    collection: "Decorativa",
    description: "Base blanca con agregados verdes y naranjas. Look contemporáneo.",
    imageUrl: "/images/materials/terrazzo-blanco.jpg",
    pricePerSquareMeter: 0,
    availableThicknesses: [20],
    finishes: ["Pulido"],
    colors: ["blanco"],
    tags: ["nuevo"],
    isActive: true,
  },
];

export const PRODUCT_CATEGORIES = Array.from(new Set(mockProducts.map((p) => p.category)));
export const PRODUCT_COLLECTIONS = Array.from(new Set(mockProducts.map((p) => p.collection).filter(Boolean))) as string[];
export const PRODUCT_FINISHES = Array.from(new Set(mockProducts.flatMap((p) => p.finishes)));
export const PRODUCT_COLORS = Array.from(new Set(mockProducts.flatMap((p) => p.colors ?? [])));
