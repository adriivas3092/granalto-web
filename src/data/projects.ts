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
