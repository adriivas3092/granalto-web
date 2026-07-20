import type { StudioRoom } from "@/lib/studio/types";

/**
 * Ambientes prediseñados de demostración. Reutilizan fotografías del sitio;
 * en producción conviene fotos con superficies amplias y bien iluminadas.
 */
export const studioRooms: StudioRoom[] = [
  {
    id: "room-cocina-clara",
    name: "Cocina clara",
    style: "Contemporáneo cálido",
    image: "/images/photos/hero-1.jpg",
    surfacesCount: 3,
  },
  {
    id: "room-cocina-beige",
    name: "Cocina beige",
    style: "Minimalista",
    image: "/images/photos/hero-5.jpg",
    surfacesCount: 2,
  },
  {
    id: "room-bano-marmol",
    name: "Baño principal",
    style: "Sofisticado",
    image: "/images/photos/hero-4.jpg",
    surfacesCount: 3,
  },
  {
    id: "room-cocina-negra",
    name: "Cocina oscura",
    style: "Contemporáneo",
    image: "/images/photos/hero-3.jpg",
    surfacesCount: 2,
  },
  {
    id: "room-exterior",
    name: "Cocina exterior",
    style: "Exterior",
    image: "/images/photos/hero-2.jpg",
    surfacesCount: 2,
  },
];

export function getStudioRooms(): StudioRoom[] {
  return studioRooms;
}

export function getStudioRoomById(id: string): StudioRoom | undefined {
  return studioRooms.find((r) => r.id === id);
}
