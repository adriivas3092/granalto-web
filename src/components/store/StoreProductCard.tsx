import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/store";
import { formatPrice } from "@/lib/store/queries";

/** Tarjeta de producto para la tienda pública. */
export function StoreProductCard({ product }: { product: Product }) {
  const onSale = product.compare_at_price != null && product.compare_at_price > product.price;
  const discountPct = onSale
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;
  return (
    <Link
      href={`/tienda/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-stone-beige bg-white transition-colors hover:border-mineral focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <div className="relative aspect-square bg-stone-beige">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-mineral">
            Sin imagen
          </div>
        )}
        {onSale && (
          <span className="absolute left-2 top-2 rounded-sm bg-[#a03826] px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white">
            Oferta{discountPct > 0 ? ` -${discountPct}%` : ""}
          </span>
        )}
        {!product.available && (
          <span className="absolute right-2 top-2 rounded-sm bg-ink/80 px-2 py-1 text-[0.65rem] uppercase tracking-wide text-ivory">
            No disponible
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {product.attributes?.material && (
          <p className="text-[0.7rem] uppercase tracking-[0.15em] text-mineral">
            {product.attributes.material}
          </p>
        )}
        <h3 className="mt-1 font-sans text-sm font-bold text-ink">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold text-ink">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-xs text-mineral line-through">
              {formatPrice(product.compare_at_price, product.currency)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
