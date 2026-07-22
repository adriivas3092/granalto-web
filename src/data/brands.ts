import type { Brand } from "@/types";

/**
 * Marcas representadas o comercializadas por Granalto.
 * PENDIENTE_VALIDAR: confirmar la lista, descripciones y sitios web con
 * Granalto antes de producción. `active: false` oculta la marca del sitio.
 * Los logos son placeholders locales (ver CONTENT_TODO.md).
 */
export const brands: Brand[] = [
  {
    id: "brand-granalto",
    slug: "granalto",
    name: "Granalto",
    description:
      "Nuestra propia línea de superficies y fabricación a la medida: selección de piedra natural, corte de precisión e instalación profesional.",
    category: "Superficies y fabricación",
    logo: { src: "/images/placeholders/logo-granalto.svg", alt: "Logo Granalto" },
    officialLogo: { src: "/images/logo/logo-granalto-dark.png", alt: "Logo Granalto" },
    website: "",
    catalogIds: [],
    active: true,
  },
  {
    id: "brand-tenax",
    slug: "tenax",
    name: "Tenax",
    description:
      "Productos para el tratamiento, mantenimiento y cuidado de la piedra: selladores, adhesivos, abrasivos y químicos especializados.",
    category: "Cuidado y tratamiento de piedra",
    logo: { src: "/images/placeholders/logo-tenax.svg", alt: "Logo Tenax" },
    officialLogo: { src: "/images/brands/tenax.png", alt: "Logo Tenax" },
    website: "https://www.tenax.it/es/",
    catalogIds: [],
    active: true,
  },
  {
    id: "brand-wilsonart",
    slug: "wilsonart",
    name: "Wilsonart",
    description:
      "Láminas decorativas HPL y superficies sólidas para mobiliario, paneles y proyectos comerciales y residenciales.",
    category: "Laminados y superficies sólidas",
    logo: { src: "/images/placeholders/logo-wilsonart.svg", alt: "Logo Wilsonart" },
    officialLogo: { src: "/images/brands/wilsonart.avif", alt: "Logo Wilsonart" },
    website: "https://www.wilsonart.com/",
    catalogIds: [],
    active: true,
  },
  {
    id: "brand-abk",
    slug: "abk",
    name: "ABK",
    description:
      "Porcelánico italiano de gran formato para pisos, paredes, fachadas y sobres, con diseños inspirados en piedras naturales.",
    category: "Porcelánico",
    logo: { src: "/images/placeholders/logo-abk.svg", alt: "Logo ABK" },
    officialLogo: { src: "/images/brands/abk.png", alt: "Logo ABK" },
    website: "https://www.abk.it/en/",
    catalogIds: [],
    active: true,
  },
  {
    id: "brand-newform",
    slug: "newform",
    name: "Newform",
    description:
      "Grifería italiana de diseño para cocina y baño, con acabados contemporáneos.",
    category: "Grifería",
    logo: { src: "/images/placeholders/logo-newform.svg", alt: "Logo Newform" },
    officialLogo: { src: "/images/brands/newform.jpg", alt: "Logo Newform" },
    website: "https://www.newform.it/",
    catalogIds: [],
    active: true,
  },
  {
    id: "brand-flaminia",
    slug: "flaminia",
    name: "Flaminia",
    description:
      "Sanitarios y lavamanos de cerámica italiana con diseño de autor.",
    category: "Sanitarios",
    logo: { src: "/images/placeholders/logo-flaminia.svg", alt: "Logo Flaminia" },
    officialLogo: { src: "/images/brands/flaminia.png", alt: "Logo Flaminia" },
    website: "https://www.ceramicaflaminia.it/en/",
    catalogIds: [],
    active: true,
  },
  {
    id: "brand-santa-margherita",
    slug: "santa-margherita",
    name: "Santa Margherita",
    description:
      "Superficies compuestas de mármol y cuarzo de fabricación italiana para pisos, revestimientos y sobres.",
    category: "Superficies compuestas",
    logo: {
      src: "/images/placeholders/logo-santa-margherita.svg",
      alt: "Logo Santa Margherita",
    },
    officialLogo: {
      src: "/images/brands/santa-margherita.png",
      alt: "Logo Santa Margherita",
    },
    website: "https://www.santamargherita.net/es/",
    catalogIds: [],
    active: true,
  },
  {
    id: "brand-cambria",
    slug: "cambria",
    name: "Cambria",
    description:
      "Superficies de cuarzo de alta gama fabricadas en Estados Unidos, con diseños exclusivos.",
    category: "Cuarzo",
    logo: { src: "/images/placeholders/logo-cambria.svg", alt: "Logo Cambria" },
    officialLogo: { src: "/images/brands/cambria.webp", alt: "Logo Cambria" },
    website: "https://www.cambriausa.com/",
    catalogIds: [],
    active: true,
  },
];

export function getActiveBrands(): Brand[] {
  return brands.filter((b) => b.active);
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}
