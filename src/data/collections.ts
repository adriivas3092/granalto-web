import type { Collection } from "@/types";

/**
 * Colecciones por tipo de espacio.
 * Las imágenes actuales son placeholders locales (ver CONTENT_TODO.md).
 */
export const collections: Collection[] = [
  {
    id: "col-cocina",
    slug: "cocina",
    name: "Cocina",
    shortDescription:
      "Superficies, sobres, islas, salpicaderos y detalles diseñados para convertir la cocina en el centro del hogar.",
    description:
      "La cocina es el espacio donde el material trabaja más y se ve más. Seleccionamos superficies que resisten el uso diario sin renunciar al carácter: cuarcitas y granitos naturales, cuarzos técnicos, porcelánicos de gran formato y superficies sólidas. Nuestro equipo acompaña la elección del sobre, la isla, el salpicadero y cada detalle, desde la lámina hasta la instalación final.",
    coverImage: {
      src: "/images/photos/hero-1.jpg",
      alt: "Cocina con isla y salpicadero en cuarcita taupe y mobiliario de madera",
    },
    gallery: [
      {
        src: "/images/photos/hero-3.jpg",
        alt: "Cocina contemporánea en negro con isla de piedra oscura y detalles dorados",
      },
      {
        src: "/images/photos/hero-5.jpg",
        alt: "Isla de cocina en cuarcita beige con mobiliario de madera clara",
      },
      {
        src: "/images/photos/hero-2.jpg",
        alt: "Cocina exterior junto a la piscina con isla en piedra de vetas doradas",
      },
    ],
    subcategories: [
      "Sobres",
      "Islas",
      "Salpicaderos",
      "Revestimientos",
      "Barras",
      "Cooking Surface",
      "Accesorios",
    ],
    featured: true,
    seo: {
      title: "Colección Cocina | Sobres y superficies para cocina",
      description:
        "Sobres de cocina, islas, salpicaderos y superficies premium en piedra natural, cuarzo y porcelánico. Asesoría, fabricación e instalación en Costa Rica.",
    },
  },
  {
    id: "col-bano",
    slug: "bano",
    name: "Baño",
    shortDescription:
      "Superficies, revestimientos, lavamanos, mobiliario, grifería y soluciones para crear espacios funcionales y sofisticados.",
    description:
      "En el baño, el material define la atmósfera. Trabajamos sobres de baño en piedra natural y superficies técnicas, revestimientos de pared y piso, lavamanos integrados y esculpidos, y complementos de grifería y sanitarios de marcas seleccionadas. Cada proyecto se resuelve a la medida, cuidando la continuidad de vetas y el detalle de los encuentros.",
    coverImage: {
      src: "/images/photos/hero-4.jpg",
      alt: "Baño principal con sobre de piedra clara, tina esculpida y grifería dorada",
    },
    gallery: [
      {
        src: "/images/placeholders/coleccion-bano-1.svg",
        alt: "Lavamanos integrado en superficie sólida — imagen pendiente de reemplazo",
      },
      {
        src: "/images/placeholders/coleccion-bano-2.svg",
        alt: "Revestimiento de ducha en porcelánico — imagen pendiente de reemplazo",
      },
    ],
    subcategories: [
      "Sobres de baño",
      "Lavamanos",
      "Revestimientos",
      "Pisos",
      "Grifería",
      "Sanitarios",
      "Duchas y accesorios",
    ],
    featured: true,
    seo: {
      title: "Colección Baño | Superficies y revestimientos para baño",
      description:
        "Sobres de baño, lavamanos, revestimientos, grifería y sanitarios premium. Soluciones a la medida para baños residenciales y comerciales en Costa Rica.",
    },
  },
  {
    id: "col-hogar",
    slug: "hogar",
    name: "Hogar",
    shortDescription:
      "Chimeneas, barras, mesas, revestimientos, pisos, paredes, áreas sociales y piezas personalizadas.",
    description:
      "Más allá de la cocina y el baño, la piedra y las superficies técnicas transforman todo el hogar: chimeneas revestidas, mesas y barras fabricadas a la medida, paredes y pisos de gran formato, escaleras y piezas personalizadas. Diseñamos junto a arquitectos, diseñadores y propietarios para que cada espacio tenga identidad propia.",
    coverImage: {
      src: "/images/photos/coleccion-hogar.jpg",
      alt: "Mueble con sobre en mármol negro y panel de listones, junto a área social",
    },
    gallery: [
      {
        src: "/images/photos/coleccion-hogar-1.jpg",
        alt: "Repisa de ventana en piedra beige con mobiliario de madera clara",
      },
    ],
    subcategories: [
      "Chimeneas",
      "Mesas",
      "Barras",
      "Paredes",
      "Pisos",
      "Escaleras",
      "Áreas sociales",
      "Piezas personalizadas",
    ],
    featured: true,
    seo: {
      title: "Colección Hogar | Superficies para espacios residenciales",
      description:
        "Chimeneas, mesas, barras, paredes, pisos y piezas personalizadas en piedra natural y superficies técnicas para el hogar en Costa Rica.",
    },
  },
];

export function getCollections(): Collection[] {
  return collections;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getFeaturedCollections(): Collection[] {
  return collections.filter((c) => c.featured);
}
