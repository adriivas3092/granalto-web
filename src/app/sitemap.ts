import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/site";
import { getCollections } from "@/data/collections";
import { getMaterials } from "@/data/materials";
import { getBlogPosts } from "@/data/blog";
import { getLocations } from "@/data/locations";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes = [
    "",
    "/colecciones",
    "/materiales",
    "/cotizar",
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
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const collections = getCollections().map((c) => ({
    url: `${base}/colecciones/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const materials = getMaterials().map((m) => ({
    url: `${base}/materiales/${m.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const posts = getBlogPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const locations = getLocations().map((l) => ({
    url: `${base}/ubicaciones/${l.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...collections, ...materials, ...posts, ...locations];
}
