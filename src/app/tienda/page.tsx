import Link from "next/link";
import { Search } from "lucide-react";
import { CTASection } from "@/components/sections/CTASection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { StoreProductCard } from "@/components/store/StoreProductCard";
import { getCategories, getProducts } from "@/lib/store/queries";
import { TENAX_CATEGORIAS } from "@/lib/store/tenax";
import { buildMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export const metadata = buildMetadata({
  title: "Tienda | Productos y superficies",
  description:
    "Explore y adquiera superficies, láminas, grifería y productos de cuidado de Granalto. Precios, disponibilidad y cotización.",
  path: "/tienda",
});

export const dynamic = "force-dynamic";

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; tenax?: string; q?: string }>;
}) {
  const { categoria, tenax, q } = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: categoria, tenaxCategory: tenax, search: q }),
  ]);

  // Enlace de un chip de categoría general (conserva búsqueda; limpia Tenax).
  const buildHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("categoria", slug);
    if (q) params.set("q", q);
    const s = params.toString();
    return `/tienda${s ? `?${s}` : ""}`;
  };

  // Enlace de un chip de subcategoría Tenax (conserva búsqueda; limpia general).
  const buildTenaxHref = (slug?: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("tenax", slug);
    if (q) params.set("q", q);
    const s = params.toString();
    return `/tienda${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <section className="bg-ink pb-14 pt-28 text-ivory md:pb-16 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-stone-beige">
            Tienda
          </p>
          <h1 className="max-w-3xl text-4xl leading-[1.08] md:text-6xl">
            Superficies y productos
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory/85 md:text-lg">
            Explore nuestros productos con precio y disponibilidad. Solicite una
            cotización o consúltenos por WhatsApp.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Tienda", path: "/tienda" }]} />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-2 sm:px-6 md:pb-28 lg:px-8">
        <form action="/tienda" method="get" className="mb-6 max-w-md">
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mineral"
            />
            <label htmlFor="store-q" className="sr-only">
              Buscar productos
            </label>
            <input
              id="store-q"
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Buscar por nombre o categoría…"
              className="w-full rounded-sm border border-stone-beige bg-white py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-mineral focus:border-ink focus:outline-none"
            />
            {categoria && <input type="hidden" name="categoria" value={categoria} />}
            {tenax && <input type="hidden" name="tenax" value={tenax} />}
          </div>
        </form>

        {/* Filtro por categoría general */}
        {categories.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium uppercase tracking-wide text-mineral">
              Categoría
            </span>
            <Link
              href={buildHref()}
              className={cn(
                "rounded-sm border px-3 py-1.5 text-sm transition-colors",
                !categoria
                  ? "border-ink bg-ink text-ivory"
                  : "border-stone-beige text-charcoal hover:border-mineral",
              )}
            >
              Todas
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={buildHref(c.slug)}
                className={cn(
                  "rounded-sm border px-3 py-1.5 text-sm transition-colors",
                  categoria === c.slug
                    ? "border-ink bg-ink text-ivory"
                    : "border-stone-beige text-charcoal hover:border-mineral",
                )}
              >
                {c.name}
              </Link>
            ))}
          </div>
        )}

        {/* Filtro por subcategoría Tenax */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium uppercase tracking-wide text-mineral">
            Tenax
          </span>
          <Link
            href={buildTenaxHref()}
            className={cn(
              "rounded-sm border px-3 py-1.5 text-sm transition-colors",
              !tenax
                ? "border-ink bg-ink text-ivory"
                : "border-stone-beige text-charcoal hover:border-mineral",
            )}
          >
            Todas
          </Link>
          {TENAX_CATEGORIAS.map((c) => (
            <Link
              key={c.value}
              href={buildTenaxHref(c.value)}
              className={cn(
                "rounded-sm border px-3 py-1.5 text-sm transition-colors",
                tenax === c.value
                  ? "border-ink bg-ink text-ivory"
                  : "border-stone-beige text-charcoal hover:border-mineral",
              )}
            >
              {c.label}
            </Link>
          ))}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <StoreProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No hay productos"
            description="No encontramos productos con esos criterios. Pronto agregaremos más."
          />
        )}

        <div className="mt-10">
          <SectionHeading
            title=""
            description="Los precios y la disponibilidad se actualizan constantemente. Para pedidos grandes o proyectos, solicite una cotización personalizada."
          />
        </div>
      </section>

      <CTASection
        source="tienda"
        title="¿Necesita asesoría o una cotización?"
        description="Nuestro equipo le ayuda a elegir el producto correcto y coordinar entrega e instalación."
      />
    </>
  );
}
