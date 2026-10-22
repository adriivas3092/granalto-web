import Link from "next/link";
import { Plus, Eye, EyeOff } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { StockAlertaToggle } from "@/components/admin/StockAlertaToggle";
import { getAllProducts } from "@/lib/store/admin";
import { getCategories } from "@/lib/store/queries";
import { getStockAlertaActiva } from "@/lib/store/settings";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { bulkAvailability } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Productos", robots: { index: false } };

export default async function AdminProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  await requireAdmin();
  const { categoria } = await searchParams;
  const categories = await getCategories();
  const activeCat = categoria ? categories.find((c) => c.slug === categoria) : undefined;
  const products = await getAllProducts(activeCat?.id);
  const alertaActiva = await getStockAlertaActiva();

  const visibleCount = products.filter((p) => p.available).length;
  const hiddenCount = products.length - visibleCount;
  const scopeLabel = activeCat ? `de ${activeCat.name}` : "";

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl font-bold text-ink">Productos</h1>
          <p className="text-sm text-charcoal/70">
            {products.length} en total · {visibleCount} visibles · {hiddenCount} ocultos
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StockAlertaToggle activa={alertaActiva} />
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal"
          >
            <Plus aria-hidden="true" className="h-4 w-4" />
            Nuevo producto
          </Link>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/admin/productos"
          className={cn(
            "rounded-sm border px-3 py-1.5 text-sm",
            !activeCat ? "border-ink bg-ink text-ivory" : "border-stone-beige text-charcoal hover:border-mineral",
          )}
        >
          Todas
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/admin/productos?categoria=${c.slug}`}
            className={cn(
              "rounded-sm border px-3 py-1.5 text-sm",
              activeCat?.id === c.id
                ? "border-ink bg-ink text-ivory"
                : "border-stone-beige text-charcoal hover:border-mineral",
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Acciones masivas */}
      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-sm border border-stone-beige bg-ivory/60 p-3">
        <span className="text-sm text-charcoal">
          Mostrar u ocultar {activeCat ? "los productos " + scopeLabel : "todos los productos"}:
        </span>
        <form action={bulkAvailability}>
          <input type="hidden" name="available" value="true" />
          <input type="hidden" name="categoria" value={activeCat?.slug ?? ""} />
          <button
            type="submit"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-sm bg-ink px-4 py-2 text-sm font-medium text-ivory hover:bg-charcoal"
          >
            <Eye aria-hidden="true" className="h-4 w-4" /> Mostrar todos
          </button>
        </form>
        <form action={bulkAvailability}>
          <input type="hidden" name="available" value="false" />
          <input type="hidden" name="categoria" value={activeCat?.slug ?? ""} />
          <button
            type="submit"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-sm border border-stone-beige bg-white px-4 py-2 text-sm font-medium text-charcoal hover:border-ink"
          >
            <EyeOff aria-hidden="true" className="h-4 w-4" /> Ocultar todos
          </button>
        </form>
      </div>

      <div className="mt-6">
        <ProductsTable products={products} categories={categories} alertaActiva={alertaActiva} />
      </div>
    </AdminShell>
  );
}
