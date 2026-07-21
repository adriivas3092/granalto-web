import type { Catalog } from "@/types";

/**
 * Catálogos descargables.
 * PENDIENTE_VALIDAR: Granalto debe aportar los archivos PDF reales
 * (colocarlos en `public/catalogs/`) y completar `fileUrl`, año, idioma y
 * tamaño. Un catálogo sin `fileUrl` se muestra como "Disponible próximamente"
 * y no genera botones sin acción.
 */
export const catalogs: Catalog[] = [
  {
    id: "cat-granalto-superficies",
    slug: "granalto-superficies",
    title: "Catálogo Granalto 2026",
    brand: "Granalto",
    category: "Superficies",
    description:
      "Selección de piedras naturales y superficies técnicas disponibles para sobres, revestimientos y proyectos a la medida.",
    year: 2026,
    language: "Español",
    fileSize: "18 MB",
    coverImage: {
      src: "/images/catalogs/catalogo-granalto-portada.jpg",
      alt: "Portada del Catálogo Granalto 2026",
    },
    fileUrl: "/catalogs/Catalogo-Granalto-2026_compressed.pdf",
    featured: true,
  },
  {
    id: "cat-tenax-mantenimiento",
    slug: "tenax-mantenimiento",
    title: "Productos Tenax para el cuidado de la piedra",
    brand: "Tenax",
    category: "Mantenimiento",
    description:
      "Selladores, limpiadores y productos especializados para el tratamiento y mantenimiento de superficies de piedra.",
    year: 2026,
    language: "Español",
    fileSize: "708 KB",
    coverImage: {
      src: "/images/catalogs/catalogo-tenax-portada.jpg",
      alt: "Portada del catálogo de productos Tenax",
    },
    fileUrl: "/catalogs/Catalogo-Tenax_compressed.pdf",
    featured: true,
  },
  {
    id: "cat-wilsonart-hpl",
    slug: "wilsonart-hpl",
    title: "Láminas decorativas Wilsonart",
    brand: "Wilsonart",
    category: "Superficies",
    description:
      "Diseños y texturas de laminado de alta presión para mobiliario, paneles y superficies verticales.",
    year: 2026,
    language: "Español",
    fileSize: "1.9 MB",
    coverImage: {
      src: "/images/catalogs/catalogo-wilsonart-portada.jpg",
      alt: "Portada del catálogo Wilsonart",
    },
    fileUrl: "/catalogs/Catalogo-Wilsonart_compressed.pdf",
    featured: true,
  },
];

export const catalogFilters = [
  "Todos",
  "Granalto",
  "Tenax",
  "Wilsonart",
  "Superficies",
  "Mantenimiento",
  "Arquitectura y diseño",
] as const;

export function getCatalogs(): Catalog[] {
  return catalogs;
}

export function getFeaturedCatalogs(): Catalog[] {
  return catalogs.filter((c) => c.featured);
}

export function getCatalogsByIds(ids: string[]): Catalog[] {
  return catalogs.filter((c) => ids.includes(c.id));
}
