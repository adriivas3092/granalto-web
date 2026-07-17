import type { Metadata } from "next";
import type { SEOData } from "@/types";
import { siteConfig, getSiteUrl } from "@/config/site";

/**
 * Construye la metadata de Next.js a partir de un objeto SEOData,
 * aplicando los valores por defecto del sitio (Open Graph, Twitter, canonical).
 */
export function buildMetadata(seo: Partial<SEOData> & { path?: string }): Metadata {
  const title = seo.title ?? siteConfig.seo.defaultTitle;
  const description = seo.description ?? siteConfig.seo.defaultDescription;
  const url = seo.canonical ?? (seo.path ? `${getSiteUrl()}${seo.path}` : undefined);
  const image = seo.image ?? siteConfig.seo.defaultOgImage;

  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    robots: seo.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.seo.locale,
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
