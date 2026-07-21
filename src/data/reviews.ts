/**
 * Reseñas de Google.
 *
 * Modo automático (recomendado): definí en el entorno
 *   GOOGLE_PLACES_API_KEY  y  GOOGLE_PLACE_ID
 * y el sitio trae en vivo la calificación y las reseñas desde Google.
 *
 * Modo manual (respaldo): mientras no haya API, se muestran estas reseñas.
 * ⚠️ PENDIENTE_GRANALTO: reemplazá por reseñas reales y poné el enlace a tu
 * ficha de Google (googleProfileUrl).
 */

export type Review = {
  author: string;
  rating: number; // 1–5
  text: string;
  relativeTime?: string;
  avatarUrl?: string;
};

export const reviewsConfig = {
  /** Enlace público a tu ficha de Google (para "Ver todas en Google"). */
  googleProfileUrl: "https://www.google.com/search?q=Granalto+Costa+Rica",
  /** Se muestran si no hay API configurada. */
  fallbackRating: 4.9,
  fallbackTotal: 87,
};

export const manualReviews: Review[] = [
  {
    author: "María F.",
    rating: 5,
    text: "Excelente atención y calidad. La encimera de cuarzo quedó impecable y la instalación fue puntual.",
    relativeTime: "hace 2 semanas",
  },
  {
    author: "Carlos M.",
    rating: 5,
    text: "Gran variedad de materiales y muy buen asesoramiento para elegir el granito de la cocina. Recomendados.",
    relativeTime: "hace 1 mes",
  },
  {
    author: "Ana R.",
    rating: 5,
    text: "El proceso fue claro desde la cotización hasta la instalación. El acabado del mármol superó mis expectativas.",
    relativeTime: "hace 1 mes",
  },
  {
    author: "Jose P.",
    rating: 4,
    text: "Muy buen producto y servicio. Coordinaron la medición en sitio sin problema.",
    relativeTime: "hace 2 meses",
  },
];
