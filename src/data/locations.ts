import type { Location } from "@/types";
import { siteConfig } from "@/config/site";

/**
 * Showrooms y ubicaciones de Granalto.
 * Horarios tomados del post "Granito en Costa Rica" del blog (publicado por Granalto).
 * PENDIENTE_VALIDAR: teléfonos directos, coordenadas y URLs de
 * Google Maps de cada sede (ver CONTENT_TODO.md). No se inventan datos:
 * los campos sin confirmar quedan vacíos/undefined y la UI los omite.
 */
export const locations: Location[] = [
  {
    id: "loc-lagunilla",
    slug: "lagunilla-heredia",
    name: "Lagunilla, Heredia",
    address: "Bodegas Lagunilla #2, Lagunilla de Heredia, Costa Rica",
    province: "Heredia",
    schedule: ["Lunes a viernes: 8:00 a.m. a 5:00 p.m.", "Sábados: 8:00 a.m. a 1:00 p.m."],
    openingHours: [{ days: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "17:00" }, { days: ["Saturday"], opens: "08:00", closes: "13:00" }],
    locality: "Lagunilla",
    phone: siteConfig.contact.phone,
    whatsapp: siteConfig.contact.whatsapp,
    email: siteConfig.contact.email,
    mapUrl: undefined, // PENDIENTE_VALIDAR: URL de Google Maps
    coordinates: undefined, // PENDIENTE_VALIDAR
    image: {
      src: "/images/photos/showroom-lagunilla.jpg",
      alt: "Showroom Granalto en Lagunilla, Heredia",
    },
    services: ["Showroom", "Asesoría personalizada", "Selección de materiales"],
  },
  {
    id: "loc-escazu",
    slug: "guachipelin-escazu",
    name: "Guachipelín, Escazú",
    address: "Diagonal a Distrito Cuatro, Guachipelín de Escazú, Costa Rica",
    province: "San José",
    schedule: ["Lunes a viernes: 8:00 a.m. a 5:00 p.m.", "Sábados: 9:00 a.m. a 2:00 p.m."],
    openingHours: [{ days: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "17:00" }, { days: ["Saturday"], opens: "09:00", closes: "14:00" }],
    locality: "Escazú",
    phone: siteConfig.contact.phone,
    whatsapp: siteConfig.contact.whatsapp,
    email: siteConfig.contact.email,
    mapUrl: undefined, // PENDIENTE_VALIDAR
    coordinates: undefined, // PENDIENTE_VALIDAR
    image: {
      src: "/images/photos/showroom-escazu.jpg",
      alt: "Showroom Granalto en Guachipelín, Escazú",
    },
    services: ["Showroom", "Asesoría personalizada", "Selección de materiales"],
  },
  {
    id: "loc-liberia",
    slug: "liberia-guanacaste",
    name: "Liberia, Guanacaste",
    address: "Solarium, bodega 9, Liberia, Guanacaste, Costa Rica",
    province: "Guanacaste",
    schedule: ["Lunes a viernes: 8:30 a.m. a 5:30 p.m.", "Sábados: 8:00 a.m. a 1:00 p.m."],
    openingHours: [{ days: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:30", closes: "17:30" }, { days: ["Saturday"], opens: "08:00", closes: "13:00" }],
    locality: "Liberia",
    phone: siteConfig.contact.phone,
    whatsapp: siteConfig.contact.whatsapp,
    email: siteConfig.contact.email,
    mapUrl: undefined, // PENDIENTE_VALIDAR
    coordinates: undefined, // PENDIENTE_VALIDAR
    image: {
      src: "/images/photos/showroom-liberia.jpg",
      alt: "Showroom Granalto en Liberia, Guanacaste",
    },
    services: ["Showroom", "Asesoría personalizada", "Selección de materiales"],
  },
];

export function getLocations(): Location[] {
  return locations;
}

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
