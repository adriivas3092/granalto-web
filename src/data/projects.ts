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
      "Proyecto de demostración: isla protagonista en cuarcita natural con veta continua y salpicadero a juego. Pendiente de reemplazo por un proyecto real documentado.",
    coverImage: {
      src: "/images/placeholders/proyecto-cocina.svg",
      alt: "Cocina con isla en cuarcita — imagen pendiente de reemplazo",
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
      "Proyecto de demostración: sobre de baño y revestimiento de pared en mármol con lavamanos de diseño. Pendiente de reemplazo por un proyecto real documentado.",
    coverImage: {
      src: "/images/placeholders/proyecto-bano.svg",
      alt: "Baño principal en mármol — imagen pendiente de reemplazo",
    },
    gallery: [],
    featured: true,
  },
  {
    id: "proj-hogar-chimenea",
    slug: "chimenea-porcelanico-gran-formato",
    title: "Chimenea en porcelánico de gran formato",
    category: "hogar",
    materials: ["porcelanico"],
    description:
      "Proyecto de demostración: muro de chimenea revestido en porcelánico de gran formato con juntas mínimas. Pendiente de reemplazo por un proyecto real documentado.",
    coverImage: {
      src: "/images/placeholders/proyecto-hogar.svg",
      alt: "Chimenea revestida en porcelánico — imagen pendiente de reemplazo",
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
