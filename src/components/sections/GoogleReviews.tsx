import { Star } from "lucide-react";
import { getReviews } from "@/lib/reviews";

function Stars({ rating, className = "h-4 w-4" }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex" aria-label={`${rating} de 5 estrellas`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={className}
          fill={i < Math.round(rating) ? "#f5b400" : "none"}
          stroke={i < Math.round(rating) ? "#f5b400" : "#c9c4ba"}
        />
      ))}
    </span>
  );
}

/** Reseñas de Google (en vivo con API o respaldo manual). */
export async function GoogleReviews() {
  const { rating, total, reviews, profileUrl } = await getReviews();
  const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";

  return (
    <section className="bg-ivory py-16 md:py-24" aria-labelledby="reviews-heading">
      <div className={container}>
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-mineral">Reseñas</p>
          <h2 id="reviews-heading" className="text-3xl md:text-4xl">Lo que dicen nuestros clientes</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-3xl font-bold text-ink">{rating.toFixed(1)}</span>
            <Stars rating={rating} className="h-5 w-5" />
            <span className="text-sm text-mineral">{total}+ reseñas en Google</span>
          </div>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.slice(0, 4).map((r, i) => (
            <li key={i} className="flex flex-col rounded-sm border border-stone-beige bg-white p-5">
              <Stars rating={r.rating} />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-charcoal/85">“{r.text}”</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-ink">{r.author}</span>
                {r.relativeTime && <span className="text-xs text-mineral">{r.relativeTime}</span>}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-ivory"
          >
            Ver todas las reseñas en Google
          </a>
        </div>
      </div>
    </section>
  );
}
