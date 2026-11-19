import { manualReviews, reviewsConfig, type Review } from "@/data/reviews";

export type ReviewsData = {
  rating: number;
  total: number;
  reviews: Review[];
  profileUrl: string;
  source: "google" | "manual";
};

/**
 * Devuelve calificación y reseñas reales. Con GOOGLE_PLACES_API_KEY y
 * GOOGLE_PLACE_ID las trae en vivo de Google; si no, usa las reseñas reales
 * copiadas a mano en src/data/reviews.ts. Sin datos, retorna null y la
 * sección no se muestra.
 */
export async function getReviews(): Promise<ReviewsData | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (key && placeId) {
    try {
      const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
      url.searchParams.set("place_id", placeId);
      url.searchParams.set("fields", "rating,user_ratings_total,reviews,url");
      url.searchParams.set("language", "es");
      url.searchParams.set("reviews_sort", "newest");
      url.searchParams.set("key", key);

      const res = await fetch(url, { next: { revalidate: 86400 } }); // 1 día
      const data = await res.json();
      if (data.status === "OK" && data.result && (data.result.reviews ?? []).length > 0) {
        const r = data.result;
        const reviews: Review[] = (r.reviews ?? []).slice(0, 6).map((rev: Record<string, unknown>) => ({
          author: String(rev.author_name ?? "Cliente"),
          rating: Number(rev.rating ?? 5),
          text: String(rev.text ?? ""),
          relativeTime: rev.relative_time_description as string | undefined,
          avatarUrl: rev.profile_photo_url as string | undefined,
        }));
        return {
          rating: Number(r.rating ?? 0),
          total: Number(r.user_ratings_total ?? reviews.length),
          reviews,
          profileUrl: (r.url as string) || reviewsConfig.googleProfileUrl,
          source: "google",
        };
      }
    } catch {
      /* cae a las reseñas copiadas a mano */
    }
  }

  const { fallbackRating, fallbackTotal, googleProfileUrl } = reviewsConfig;
  if (manualReviews.length === 0 || fallbackRating <= 0 || fallbackTotal <= 0) return null;

  return {
    rating: fallbackRating,
    total: fallbackTotal,
    reviews: manualReviews,
    profileUrl: googleProfileUrl,
    source: "manual",
  };
}
