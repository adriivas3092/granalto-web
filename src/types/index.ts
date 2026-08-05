/**
 * Modelos de datos centrales del sitio de Granalto.
 * Todo el contenido empresarial se define con estos tipos en `src/data/*`
 * para poder migrar a un CMS (Sanity, Strapi, Contentful, Supabase)
 * sin modificar los componentes visuales.
 */

export type Media = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
};

export type SEOData = {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  noIndex?: boolean;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  coverImage: Media;
  gallery: Media[];
  subcategories: string[];
  featured: boolean;
  seo: SEOData;
};

export type Material = {
  id: string;
  slug: string;
  name: string;
  category: "natural" | "tecnico" | "decorativo";
  shortDescription: string;
  description: string;
  features: string[];
  applications: string[];
  considerations: string[];
  finishes: string[];
  colors: string[];
  brands: string[];
  coverImage: Media;
  gallery: Media[];
  catalogIds: string[];
  featured: boolean;
  seo: SEOData;
};

export type Catalog = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  category: string;
  description: string;
  year?: number;
  language: string;
  coverImage: Media;
  fileUrl: string;
  fileSize?: string;
  featured: boolean;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Contenido en bloques de párrafos y subtítulos (## título). */
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  coverImage: Media;
  featured: boolean;
  seo: SEOData;
};

export type Location = {
  id: string;
  slug: string;
  name: string;
  address: string;
  province: string;
  schedule: string[];
  phone?: string;
  whatsapp?: string;
  email?: string;
  mapUrl?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  image?: Media;
  services: string[];
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  logo: Media;
  /**
   * Logo oficial de la marca (archivo provisto). Si está presente se muestra
   * la imagen; si no, se muestra el nombre de la marca como wordmark en
   * Montserrat. Ver public/images/brands/.
   */
  officialLogo?: Media;
  website?: string;
  catalogIds: string[];
  active: boolean;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  category:
    | "cocina"
    | "bano"
    | "hogar"
    | "comercial"
    | "revestimientos"
    | "pisos"
    | "exteriores";
  location?: string;
  materials: string[];
  brand?: string;
  description: string;
  /** Aliado con quien se realizó el proyecto (p. ej. estudio de diseño). */
  partner?: string;
  /** Créditos del proyecto: diseño, instalación, material del sobre, etc. */
  credits?: { label: string; value: string }[];
  coverImage: Media;
  gallery: Media[];
  featured: boolean;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  category?: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

/** Evento analítico tipado. Ver `src/lib/analytics.ts`. */
export type AnalyticsEvent =
  | { name: "whatsapp_click"; params?: { source?: string } }
  | { name: "phone_click"; params?: { phone?: string } }
  | { name: "email_click"; params?: { email?: string } }
  | { name: "contact_form_submit"; params?: { projectType?: string } }
  | { name: "catalog_download"; params: { catalogId: string } }
  | { name: "catalog_open"; params: { catalogId: string } }
  | { name: "directions_click"; params: { locationId: string } }
  | { name: "material_view"; params: { materialSlug: string } }
  | { name: "collection_view"; params: { collectionSlug: string } }
  | { name: "cta_advisory_click"; params?: { source?: string } }
  // Cotizador de superficies (/cotizar)
  | { name: "quote_started" }
  | { name: "quote_step_viewed"; params: { step: number; stepName?: string } }
  | { name: "quote_product_added"; params: { category?: string; count: number } }
  | { name: "quote_product_removed"; params: { count: number } }
  | { name: "quote_dimensions_added"; params: { area?: number } }
  | { name: "quote_extra_selected"; params: { type: string } }
  | { name: "quote_estimate_viewed"; params: { options: number; area?: number; total?: number } }
  | { name: "quote_option_selected"; params: { total?: number } }
  | { name: "quote_contact_started" }
  | { name: "quote_submitted"; params: { total?: number; options?: number } }
  | { name: "quote_abandoned"; params?: { step?: number } };
