import type { BlogPost, FAQ, Location } from "@/types";
import { siteConfig, getSiteUrl } from "@/config/site";

/**
 * Generadores de datos estructurados Schema.org (JSON-LD).
 * Se renderizan mediante el componente <JsonLd />.
 */

export function organizationSchema() {
  const socials = Object.values(siteConfig.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: getSiteUrl(),
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    description: siteConfig.description,
    ...(socials.length > 0 ? { sameAs: socials } : {}),
  };
}

export function localBusinessSchema(location: Location) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${siteConfig.name} — ${location.name}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressRegion: location.province,
      addressCountry: "CR",
    },
    ...(location.phone ? { telephone: location.phone } : {}),
    ...(location.email ? { email: location.email } : {}),
    ...(location.coordinates
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: location.coordinates.latitude,
            longitude: location.coordinates.longitude,
          },
        }
      : {}),
    url: `${getSiteUrl()}/ubicaciones/${location.slug}`,
    parentOrganization: { "@type": "Organization", name: siteConfig.legalName },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${getSiteUrl()}${item.path}`,
    })),
  };
}

export function articleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: siteConfig.legalName },
    mainEntityOfPage: `${getSiteUrl()}/blog/${post.slug}`,
    image: `${getSiteUrl()}${post.coverImage.src}`,
  };
}

export function faqSchema(items: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
