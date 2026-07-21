import type { NavItem } from "@/types";

/** Navegación principal del sitio (editable). */
export const mainNavigation: NavItem[] = [
  {
    label: "Colecciones",
    href: "/colecciones",
    children: [
      { label: "Cocina", href: "/colecciones/cocina" },
      { label: "Baño", href: "/colecciones/bano" },
      { label: "Hogar", href: "/colecciones/hogar" },
    ],
  },
  { label: "Materiales", href: "/materiales" },
  { label: "Tienda", href: "/tienda" },
  { label: "Visualizador", href: "/visualizador" },
  { label: "Catálogos", href: "/catalogos" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

export const footerNavigation: NavItem[] = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Colecciones", href: "/colecciones" },
  { label: "Materiales", href: "/materiales" },
  { label: "Catálogos", href: "/catalogos" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

export const legalNavigation: NavItem[] = [
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
  { label: "Términos y condiciones", href: "/terminos-y-condiciones" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
];
