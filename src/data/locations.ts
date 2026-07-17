import type { Location } from "@/types";
import { siteConfig } from "@/config/site";

/**
 * Showrooms y ubicaciones de Granalto.
 * PENDIENTE_VALIDAR: horarios, teléfonos directos, coordenadas y URLs de
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
    schedule: [], // PENDIENTE_VALIDAR: horario de atención
    phone: siteConfig.contact.phone,
    whatsapp: siteConfig.contact.whatsapp,
    email: siteConfig.contact.email,
    mapUrl: undefined, // PENDIENTE_VALIDAR: URL de Google Maps
    coordinates: undefined, // PENDIENTE_VALIDAR
    image: {
      src: "/images/placeholders/showroom-lagunilla.svg",
      alt: "Showroom Granalto en Lagunilla, Heredia — imagen pendiente de reemplazo",
    },
    services: ["Showroom", "Asesoría personalizada", "Selección de materiales"],
  },
  {
    id: "loc-escazu",
    slug: "guachipelin-escazu",
    name: "Guachipelín, Escazú",
    address: "Diagonal a Distrito Cuatro, Guachipelín de Escazú, Costa Rica",
    province: "San José",
    schedule: [], // PENDIENTE_VALIDAR
    phone: siteConfig.contact.phone,
    whatsapp: siteConfig.contact.whatsapp,
    email: siteConfig.contact.email,
    mapUrl: undefined, // PENDIENTE_VALIDAR
    coordinates: undefined, // PENDIENTE_VALIDAR
    image: {
      src: "/images/placeholders/showroom-escazu.svg",
      alt: "Showroom Granalto en Guachipelín, Escazú — imagen pendiente de reemplazo",
    },
    services: ["Showroom", "Asesoría personalizada", "Selección de materiales"],
  },
  {
    id: "loc-liberia",
    slug: "liberia-guanacaste",
    name: "Liberia, Guanacaste",
    address: "Solarium, bodega 9, Liberia, Guanacaste, Costa Rica",
    province: "Guanacaste",
    schedule: [], // PENDIENTE_VALIDAR
    phone: siteConfig.contact.phone,
    whatsapp: siteConfig.contact.whatsapp,
    email: siteConfig.contact.email,
    mapUrl: undefined, // PENDIENTE_VALIDAR
    coordinates: undefined, // PENDIENTE_VALIDAR
    image: {
      src: "/images/placeholders/showroom-liberia.svg",
      alt: "Showroom Granalto en Liberia, Guanacaste — imagen pendiente de reemplazo",
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
