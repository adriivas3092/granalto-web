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
  /** Calificación y total tal como aparecen HOY en la ficha de Google. */
  fallbackRating: 4.0,
  fallbackTotal: 63,
};

/**
 * Reseñas REALES copiadas a mano de la ficha de Google (nombre como aparece
 * en Google y texto sin editar). La sección se muestra cuando hay al menos una
 * reseña y la calificación/total de arriba están completos.
 */
export const manualReviews: Review[] = [
  {
    author: "Helenna Vilchez",
    rating: 5,
    text: "Excelente!!!!!!si buscan granito mármol o cualquier piedra natural aquí es el lugar indicado",
    relativeTime: "Hace 2 meses",
  },
  {
    author: "DILANA GARCIA DAVILA",
    rating: 5,
    text: "Excelente servicio, me siento satisfecha por los trabajos contratados, el seguimiento en el proceso de la compra fue atento y personalizado, productos en vanguardia, bastantes opciones estéticas para elegir, realmente satisfecha por los resultados,",
    relativeTime: "Hace un año",
  },
  {
    author: "Edward Turner",
    rating: 5,
    text: "Great selection at fair prices. They have everything from standard to wow. Staff is bilingual, knowledgeable and helpful.",
    relativeTime: "Hace 4 años",
  },
  {
    author: "Paula Mastroeni Carvajal",
    rating: 5,
    text: "Muy buena atención al cliente 👍🏻 fueron amables, me brindaron la información que ocupaba y fui muy bien asesorada con el granito y el cuarzo.",
    relativeTime: "Hace 5 años",
  },
  {
    author: "Javier Segura",
    rating: 4,
    text: "Really good place for stone, quarts and granite tables and furniture tops. Mostly expensive place, but some of the sales assistant are very kind, so, if you need a solution with a more limited budget, asking would for sure, got an option.",
    relativeTime: "Hace 5 años",
  },
];
