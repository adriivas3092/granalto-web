/**
 * Configuración general del sitio de Granalto.
 * Este archivo centraliza datos de la empresa, contactos, redes y SEO base.
 * PENDIENTE_VALIDAR: los campos marcados requieren confirmación de Granalto
 * antes de publicar en producción (ver CONTENT_TODO.md).
 */

export const siteConfig = {
  name: "Granalto",
  legalName: "Granalto Costa Rica",
  domain: "https://granaltocr.net", // PENDIENTE_VALIDAR: dominio final de producción
  description:
    "Superficies, materiales y acabados premium para arquitectura, diseño de interiores y construcción en Costa Rica.",
  tagline: "Superficies que transforman espacios",

  contact: {
    phone: "+506 4101-4800",
    phoneHref: "tel:+50641014800",
    whatsapp: "+506 6090-3269",
    whatsappNumber: "50660903269",
    email: "info@granalto.net",
    emailHref: "mailto:info@granalto.net",
  },

  whatsappMessages: {
    default:
      "Hola, me gustaría recibir información sobre los productos y servicios de Granalto.",
    advisory: "Hola, me gustaría recibir asesoría para un proyecto.",
  },

  // PENDIENTE_VALIDAR: URLs reales de redes sociales. Vacías = no se muestran.
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
    pinterest: "",
    youtube: "",
    linkedin: "",
  } as Record<string, string>,

  seo: {
    defaultTitle: "Granalto | Superficies y acabados premium en Costa Rica",
    titleTemplate: "%s | Granalto Costa Rica",
    defaultDescription:
      "Granalto selecciona, comercializa y transforma superficies premium: cuarcita, granito, mármol, cuarzo, porcelánico y más, para cocinas, baños y proyectos arquitectónicos en Costa Rica.",
    defaultOgImage: "/images/og/og-default.svg", // PENDIENTE_VALIDAR: imagen OG definitiva (1200x630 JPG/PNG)
    locale: "es_CR",
  },

  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
    gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? "",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  },
} as const;

export function getWhatsAppUrl(message?: string): string {
  const number =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? siteConfig.contact.whatsappNumber;
  const text = encodeURIComponent(message ?? siteConfig.whatsappMessages.default);
  return `https://wa.me/${number}?text=${text}`;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.domain;
}
