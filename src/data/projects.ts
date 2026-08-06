import type { Project } from "@/types";

/**
 * Proyectos realizados por Granalto.
 * CONTENIDO DE DEMOSTRACIÓN: proyectos provisionales que ilustran la
 * estructura. Granalto debe aportar proyectos reales con fotografías y
 * autorización de publicación (ver CONTENT_TODO.md). La página dedicada
 * /proyectos se activará en una segunda fase; por ahora se muestran como
 * sección en portada y en páginas relacionadas.
 */
export const projectCategories = [
  { value: "cocina", label: "Cocina" },
  { value: "bano", label: "Baño" },
  { value: "hogar", label: "Hogar" },
  { value: "comercial", label: "Comercial" },
  { value: "revestimientos", label: "Revestimientos" },
  { value: "pisos", label: "Pisos" },
  { value: "exteriores", label: "Áreas exteriores" },
] as const;

export const projects: Project[] = [
  {
    id: "proj-hogar-materiales-varios",
    slug: "hogar-materiales-varios",
    title: "Materiales varios",
    category: "hogar",
    materials: [],
    partner: "Vital Design y otros",
    description: "",
    coverImage: {
      src: "/images/proyectos/hogar-materiales-varios-1.jpg",
      alt: "Cocina exterior con parrilla, sobre en piedra y muebles de madera",
    },
    gallery: [
      { src: "/images/proyectos/hogar-materiales-varios-1.jpg", alt: "Cocina exterior con parrilla y sobre en piedra sobre mueble de madera" },
      { src: "/images/proyectos/hogar-materiales-varios-2.jpg", alt: "Tocador con espejo iluminado y sobre en piedra clara" },
      { src: "/images/proyectos/hogar-materiales-varios-3.jpg", alt: "Repisa flotante para TV en terrazo oscuro con detalles dorados" },
      { src: "/images/proyectos/hogar-materiales-varios-4.jpg", alt: "Vestidor de madera con isla central y sobre en piedra clara" },
      { src: "/images/proyectos/hogar-materiales-varios-5.jpg", alt: "Parrilla exterior con sobre en terrazo negro con detalles dorados y mueble de madera" },
      { src: "/images/proyectos/hogar-materiales-varios-6.jpg", alt: "Isla exterior de parrilla en terrazo negro con frente de madera" },
      { src: "/images/proyectos/hogar-materiales-varios-7.jpg", alt: "Cocina exterior con barra flotante en ónix de vetas doradas y parrilla" },
    ],
    featured: true,
  },
  {
    id: "proj-superficie-solida-bano",
    slug: "superficie-solida-bano",
    title: "Superficie Sólida",
    category: "bano",
    materials: ["superficie-solida"],
    partner: "Vital Design",
    credits: [
      { label: "Diseño", value: "Vital Design" },
      { label: "Instalación de sobres", value: "Granalto" },
      { label: "Material del sobre", value: "Superficie sólida" },
    ],
    description: "",
    coverImage: {
      src: "/images/proyectos/superficie-solida-bano-1.jpg",
      alt: "Baño con sobre en superficie sólida negra sobre mueble de madera y pared verde tropical",
    },
    gallery: [
      { src: "/images/proyectos/superficie-solida-bano-1.jpg", alt: "Baño con sobre en superficie sólida negra, mueble de madera y papel tapiz tropical" },
      { src: "/images/proyectos/superficie-solida-bano-2.jpg", alt: "Detalle del mueble de madera con sobre en superficie sólida negra y espejo redondo" },
      { src: "/images/proyectos/superficie-solida-bano-3.jpg", alt: "Vista del baño con sobre en superficie sólida negra, ducha y revestimiento hexagonal" },
    ],
    featured: true,
  },
  {
    id: "proj-volakas",
    slug: "volakas",
    title: "Volakas",
    category: "bano",
    materials: ["marmol"],
    partner: "Vital Design",
    credits: [
      { label: "Diseño", value: "Vital Design" },
      { label: "Instalación de sobres de baño", value: "Granalto" },
      { label: "Material del sobre", value: "Mármol Volakas" },
    ],
    description: "",
    coverImage: {
      src: "/images/proyectos/volakas-1.jpg",
      alt: "Baño con sobre de lavamanos en mármol Volakas y mueble de madera",
    },
    gallery: [
      { src: "/images/proyectos/volakas-1.jpg", alt: "Detalle del sobre de lavamanos en mármol Volakas con cuadro de coral" },
      { src: "/images/proyectos/volakas-2.jpg", alt: "Lavamanos con sobre en mármol Volakas y botiquín de madera con espejo" },
      { src: "/images/proyectos/volakas-3.jpg", alt: "Baño con doble lavamanos y sobre en mármol Volakas" },
      { src: "/images/proyectos/volakas-4.jpg", alt: "Mueble de baño en madera con sobre en mármol Volakas y doble lavamanos" },
      { src: "/images/proyectos/volakas-5.jpg", alt: "Vista del sobre en mármol Volakas sobre mueble de madera con doble lavamanos" },
    ],
    featured: true,
  },
  {
    id: "proj-calacatta-gold",
    slug: "calacatta-gold",
    title: "Calacatta Gold",
    category: "cocina",
    materials: ["porcelanico"],
    partner: "Vital Design",
    credits: [
      { label: "Diseño", value: "Vital Design" },
      { label: "Instalación de sobres", value: "Granalto" },
      { label: "Material del sobre", value: "Porcelánico Calacatta Gold" },
    ],
    description: "",
    coverImage: {
      src: "/images/proyectos/calacatta-gold-1.jpg",
      alt: "Cocina de madera con isla y salpicadero en porcelánico Calacatta Gold",
    },
    gallery: [
      { src: "/images/proyectos/calacatta-gold-1.jpg", alt: "Cocina de madera con barra e isla en porcelánico Calacatta Gold" },
      { src: "/images/proyectos/calacatta-gold-2.jpg", alt: "Área de bar con sobre en Calacatta Gold y panel de vinos en madera" },
      { src: "/images/proyectos/calacatta-gold-3.jpg", alt: "Detalle del salpicadero en porcelánico Calacatta Gold sobre mueble de madera" },
      { src: "/images/proyectos/calacatta-gold-4.jpg", alt: "Bar húmedo con sobre y salpicadero en Calacatta Gold y mobiliario gris" },
      { src: "/images/proyectos/calacatta-gold-5.jpg", alt: "Isla con barra de madera y sobre en porcelánico Calacatta Gold" },
    ],
    featured: true,
  },
  {
    id: "proj-porcelanico-bottega-acero",
    slug: "porcelanico-bottega-acero",
    title: "Porcelánico",
    category: "cocina",
    materials: ["porcelanico"],
    partner: "The Kitchen",
    credits: [
      { label: "Diseño", value: "The Kitchen" },
      { label: "Instalación de sobres", value: "Granalto" },
      { label: "Material del sobre", value: "Porcelánico Bottega Acero" },
    ],
    description: "",
    coverImage: {
      src: "/images/proyectos/porcelanico-bottega-1.jpg",
      alt: "Cocina en negro mate con sobres en porcelánico Bottega Acero",
    },
    gallery: [
      { src: "/images/proyectos/porcelanico-bottega-1.jpg", alt: "Cocina en negro mate con sobres en porcelánico Bottega Acero y salpicadero de madera" },
      { src: "/images/proyectos/porcelanico-bottega-2.jpg", alt: "Isla central con sobre en porcelánico Bottega Acero y bancos negros" },
      { src: "/images/proyectos/porcelanico-bottega-3.jpg", alt: "Vista general de la cocina en negro con isla en porcelánico Bottega Acero" },
      { src: "/images/proyectos/porcelanico-bottega-4.jpg", alt: "Detalle de los sobres en porcelánico Bottega Acero con mobiliario negro" },
    ],
    featured: true,
  },
  {
    id: "proj-calacatta-grey",
    slug: "calacatta-grey",
    title: "Calacatta Grey",
    category: "cocina",
    materials: ["porcelanico"],
    partner: "Vital Design",
    credits: [
      { label: "Diseño", value: "Vital Design" },
      { label: "Instalación de sobres", value: "Granalto" },
      { label: "Material del sobre", value: "Aria White" },
    ],
    description: "",
    coverImage: {
      src: "/images/proyectos/calacatta-grey-1.jpg",
      alt: "Cocina con mobiliario azul e isla con sobre en Aria White",
    },
    gallery: [
      { src: "/images/proyectos/calacatta-grey-1.jpg", alt: "Cocina con mobiliario azul e isla con sobre en Aria White" },
      { src: "/images/proyectos/calacatta-grey-2.jpg", alt: "Isla central con sobre en Aria White y bancos de madera" },
      { src: "/images/proyectos/calacatta-grey-3.jpg", alt: "Vista frontal de la cocina con isla en Aria White" },
      { src: "/images/proyectos/calacatta-grey-4.jpg", alt: "Detalle de los sobres en L en Aria White sobre mobiliario azul" },
      { src: "/images/proyectos/calacatta-grey-5.jpg", alt: "Detalle del canto del sobre en Aria White en la isla" },
    ],
    featured: true,
  },
  {
    id: "proj-cocina-cuarcita",
    slug: "cocina-isla-cuarcita",
    title: "Cocina con isla en cuarcita",
    category: "cocina",
    location: undefined, // PENDIENTE_VALIDAR: publicar solo con autorización
    materials: ["cuarcita"],
    description:
      "Isla protagonista y salpicadero en piedra natural con veta continua, integrados con mobiliario de madera. (Datos del proyecto pendientes de validación.)",
    coverImage: {
      src: "/images/photos/hero-5.jpg",
      alt: "Cocina con isla en cuarcita beige y mobiliario de madera clara",
    },
    gallery: [],
    featured: true,
  },
  {
    id: "proj-bano-marmol",
    slug: "bano-principal-marmol",
    title: "Baño principal en mármol",
    category: "bano",
    materials: ["marmol"],
    description:
      "Sobre de baño y revestimientos en piedra clara con tina esculpida y grifería dorada. (Datos del proyecto pendientes de validación.)",
    coverImage: {
      src: "/images/photos/hero-4.jpg",
      alt: "Baño principal con sobre de piedra clara, tina esculpida y grifería dorada",
    },
    gallery: [],
    featured: true,
  },
  {
    id: "proj-cocina-exterior",
    slug: "cocina-exterior-piscina",
    title: "Cocina exterior junto a la piscina",
    category: "exteriores",
    materials: [],
    description:
      "Isla exterior en piedra de vetas doradas con área de asado integrada, resistente a la intemperie. (Datos del proyecto pendientes de validación.)",
    coverImage: {
      src: "/images/photos/hero-2.jpg",
      alt: "Cocina exterior junto a la piscina con isla en piedra de vetas doradas",
    },
    gallery: [],
    featured: true,
  },
];

export function getProjects(): Project[] {
  return projects;
}

export function getFeaturedProjects(count = 6): Project[] {
  return projects.filter((p) => p.featured).slice(0, count);
}

export function getProjectsByMaterial(materialSlug: string): Project[] {
  return projects.filter((p) => p.materials.includes(materialSlug));
}

export function getProjectsByCategory(category: Project["category"]): Project[] {
  return projects.filter((p) => p.category === category);
}

/** Proyectos con galería para mostrar como ficha (miniaturas + créditos). */
export function getShowcaseProjects(category?: Project["category"]): Project[] {
  return projects.filter(
    (p) =>
      p.gallery.length > 0 &&
      (category ? p.category === category : true),
  );
}
