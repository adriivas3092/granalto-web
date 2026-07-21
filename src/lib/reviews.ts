import { manualReviews, reviewsConfig, type Review } from "@/data/reviews";

export type ReviewsData = {
  rating: number;
  total: number;
  reviews: Review[];
  profileUrl: string;
  source: "google" | "manual";
};

/**
 * Devuelve la calificación y reseñas. Si hay GOOGLE_PLACES_API_KEY y
 * GOOGLE_PLACE_ID, consulta la API de Google Places (Place Details) y cachea
 * el resultado; si no, usa las reseñas manuales de respaldo.
 */
export async function getReviews(): Promise<ReviewsData> {
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
      if (data.status === "OK" && data.result) {
        const r = data.result;
        const reviews: Review[] = (r.reviews ?? []).slice(0, 6).map((rev: Record<string, unknown>) => ({
          author: String(rev.author_name ?? "Cliente"),
          rating: Number(rev.rating ?? 5),
          text: String(rev.text ?? ""),
          relativeTime: rev.relative_time_description as string | undefined,
          avatarUrl: rev.profile_photo_url as string | undefined,
        }));
        return {
          rating: Number(r.rating ?? reviewsConfig.fallbackRating),
          total: Number(r.user_ratings_total ?? reviewsConfig.fallbackTotal),
          reviews: reviews.length ? reviews : manualReviews,
          profileUrl: (r.url as string) || reviewsConfig.googleProfileUrl,
          source: "google",
        };
      }
    } catch {
      /* cae al respaldo manual */
    }
  }

  return {
    rating: reviewsConfig.fallbackRating,
    total: reviewsConfig.fallbackTotal,
    reviews: manualReviews,
    profileUrl: reviewsConfig.googleProfileUrl,
    source: "manual",
  };
}
