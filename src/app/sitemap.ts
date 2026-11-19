import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/site";
import { COTIZADOR_EN_CONSTRUCCION } from "@/lib/configurador/estado";
import { getCollections } from "@/data/collections";
import { getMaterials } from "@/data/materials";
import { getBlogPosts } from "@/data/blog";
import { getLocations } from "@/data/locations";

/**
 * Sin changefreq ni priority (Google los ignora). lastModified solo donde hay
 * una fecha real (posts); la fecha del build no aporta información.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  const staticRoutes = [
    "",
    "/colecciones",
    "/materiales",
    ...(COTIZADOR_EN_CONSTRUCCION ? [] : ["/cotizar"]),
    "/como-funciona",
    "/portafolio",
    "/catalogos",
    "/blog",
    "/contacto",
    "/ubicaciones",
    "/nosotros",
    "/preguntas-frecuentes",
    "/politica-de-privacidad",
    "/terminos-y-condiciones",
  ].map((path) => ({
    url: `${base}${path}`,
  }));

  const collections = getCollections().map((c) => ({
    url: `${base}/colecciones/${c.slug}`,
  }));

  const materials = getMaterials().map((m) => ({
    url: `${base}/materiales/${m.slug}`,
  }));

  const posts = getBlogPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
  }));

  const locations = getLocations().map((l) => ({
    url: `${base}/ubicaciones/${l.slug}`,
  }));

  return [...staticRoutes, ...collections, ...materials, ...posts, ...locations];
}
