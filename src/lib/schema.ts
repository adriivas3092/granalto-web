import type { BlogPost, FAQ, Location } from "@/types";
import { siteConfig, getSiteUrl } from "@/config/site";

/**
 * Generadores de datos estructurados Schema.org (JSON-LD).
 * Se renderizan mediante el componente <JsonLd />.
 */

const orgId = () => `${getSiteUrl()}/#organization`;

export function organizationSchema() {
  const socials = Object.values(siteConfig.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId(),
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: getSiteUrl(),
    logo: {
      "@type": "ImageObject",
      url: `${getSiteUrl()}/images/logo/logo-granalto-dark.png`,
    },
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    description: siteConfig.description,
    areaServed: { "@type": "Country", name: "Costa Rica" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: siteConfig.contact.phone,
        areaServed: "CR",
        availableLanguage: ["Spanish", "English"],
      },
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: siteConfig.contact.whatsapp,
        areaServed: "CR",
        availableLanguage: ["Spanish", "English"],
      },
    ],
    ...(socials.length > 0 ? { sameAs: socials } : {}),
  };
}

/** Nombre del sitio para Google (lo que aparece arriba de cada resultado). */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    name: siteConfig.name,
    alternateName: [siteConfig.legalName, "granaltocr.net"],
    url: `${getSiteUrl()}/`,
    inLanguage: "es-CR",
    publisher: { "@id": orgId() },
  };
}

export function localBusinessSchema(location: Location) {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${getSiteUrl()}/ubicaciones/${location.slug}#negocio`,
    name: `${siteConfig.name} ${location.name}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      ...(location.locality ? { addressLocality: location.locality } : {}),
      addressRegion: location.province,
      addressCountry: "CR",
    },
    ...(location.image ? { image: `${getSiteUrl()}${location.image.src}` } : {}),
    ...(location.openingHours?.length
      ? {
          openingHoursSpecification: location.openingHours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.days,
            opens: h.opens,
            closes: h.closes,
          })),
        }
      : {}),
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
    parentOrganization: { "@id": orgId() },
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
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    inLanguage: "es-CR",
    author: { "@type": "Organization", name: post.author, url: getSiteUrl() },
    publisher: { "@id": orgId() },
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
