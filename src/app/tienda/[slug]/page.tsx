import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, MessageCircle } from "lucide-react";
import { CTASection } from "@/components/sections/CTASection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { getProductBySlug, formatPrice } from "@/lib/store/queries";
import { getWhatsAppUrl } from "@/config/site";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return buildMetadata({
    title: `${product.name} | Tienda`,
    description: product.description ?? `Compre ${product.name} en Granalto.`,
    path: `/tienda/${product.slug}`,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const waMessage = `Hola, me interesa el producto "${product.name}"${
    product.sku ? ` (${product.sku})` : ""
  }. ¿Me pueden dar más información?`;

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-2 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <Breadcrumbs
          items={[
            { name: "Tienda", path: "/tienda" },
            { name: product.name, path: `/tienda/${product.slug}` },
          ]}
        />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-sm bg-stone-beige">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-mineral">
                Sin imagen
              </div>
            )}
          </div>

          <div>
            {product.attributes?.material && (
              <p className="text-xs uppercase tracking-[0.2em] text-mineral">
                {product.attributes.material}
              </p>
            )}
            <h1 className="mt-2 text-3xl leading-tight md:text-4xl">{product.name}</h1>
            {product.sku && <p className="mt-2 text-sm text-mineral">Código: {product.sku}</p>}

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-ink">
                {formatPrice(product.price, product.currency)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-lg text-mineral line-through">
                  {formatPrice(product.compare_at_price, product.currency)}
                </span>
              )}
            </div>

            <p className="mt-3 text-sm">
              {product.available && product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-ink">
                  <Check aria-hidden="true" className="h-4 w-4" /> Disponible
                </span>
              ) : (
                <span className="text-mineral">Consultar disponibilidad</span>
              )}
            </p>

            {product.description && (
              <p className="mt-6 text-base leading-relaxed text-charcoal/85">
                {product.description}
              </p>
            )}

            {Object.keys(product.attributes ?? {}).length > 0 && (
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-stone-beige pt-6 text-sm">
                {Object.entries(product.attributes).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-stone-beige/60 py-1.5">
                    <dt className="capitalize text-mineral">{k}</dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>

            <div className="mt-4">
              <a
                href={getWhatsAppUrl(waMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-stone-beige px-6 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-ink"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
                Consultar por WhatsApp
              </a>
            </div>
            <p className="mt-3 text-xs text-mineral">
              Agregue al carrito y finalice su pedido en línea. El pago con tarjeta
              estará disponible próximamente; por ahora coordinamos el pago al
              confirmar el pedido.
            </p>
          </div>
        </div>
      </section>

      <CTASection source={`producto-${product.slug}`} />
    </>
  );
}
