import type { Media } from "@/types";

/**
 * Diapositivas del carrusel del hero de portada.
 * Los archivos viven en public/images/photos/. Para cambiar una fotografía
 * basta reemplazar el archivo por otro con el mismo nombre (1920px+ de
 * ancho recomendado) o editar esta lista.
 */
export const heroSlides: Media[] = [
  {
    src: "/images/photos/hero-1.jpg",
    alt: "Cocina con isla y salpicadero en cuarcita taupe, mobiliario de madera y cielo raso de madera",
  },
  {
    src: "/images/photos/hero-2.jpg",
    alt: "Cocina exterior junto a la piscina con isla en piedra tipo calacatta con vetas doradas",
  },
  {
    src: "/images/photos/hero-3.jpg",
    alt: "Cocina contemporánea en negro con isla de mármol negro y detalles dorados",
  },
  {
    src: "/images/photos/hero-4.jpg",
    alt: "Baño principal con sobre de mármol claro, tina esculpida y grifería dorada",
  },
  {
    src: "/images/photos/hero-5.jpg",
    alt: "Isla de cocina en cuarcita beige con mobiliario de madera clara",
  },
];
