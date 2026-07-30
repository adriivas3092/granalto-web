import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { getAllProducts } from "@/lib/store/admin";
import { getCategories } from "@/lib/store/queries";
import { formatPrice } from "@/lib/store/format";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { bulkAvailability, toggleAvailability } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Productos", robots: { index: false } };

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  await requireAdmin();
  const { categoria } = await searchParams;
  const categories = await getCategories();
  const activeCat = categoria ? categories.find((c) => c.slug === categoria) : undefined;
  const products = await getAllProducts(activeCat?.id);
  const catName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "—";

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
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal"
        >
          <Plus aria-hidden="true" className="h-4 w-4" />
          Nuevo producto
        </Link>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/admin"
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
            href={`/admin?categoria=${c.slug}`}
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

      <div className="mt-6 overflow-x-auto rounded-sm border border-stone-beige bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-stone-beige text-left text-xs uppercase tracking-wide text-mineral">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Visibilidad</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-stone-beige/60 last:border-0">
                <td className="px-4 py-3">
                  <span className="font-medium text-ink">{p.name}</span>
                  {p.sku && <span className="ml-2 text-xs text-mineral">{p.sku}</span>}
                </td>
                <td className="px-4 py-3 text-charcoal">{catName(p.category_id)}</td>
                <td className="px-4 py-3 text-ink">{formatPrice(p.price, p.currency)}</td>
                <td className="px-4 py-3 text-charcoal">{p.stock}</td>
                <td className="px-4 py-3">
                  {/* Interruptor rápido por producto */}
                  <form action={toggleAvailability.bind(null, p.id, !p.available)}>
                    <button
                      type="submit"
                      title={p.available ? "Ocultar de la tienda" : "Mostrar en la tienda"}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs transition-colors",
                        p.available
                          ? "bg-[#e2ede2] text-[#3f6b41] hover:brightness-95"
                          : "bg-stone-beige text-charcoal hover:brightness-95",
                      )}
                    >
                      {p.available ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      {p.available ? "Visible" : "Oculto"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/productos/${p.id}`}
                      className="inline-flex items-center gap-1 rounded-sm border border-stone-beige px-2.5 py-1.5 text-xs text-charcoal hover:border-ink"
                    >
                      <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                      Editar
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-mineral">
                  No hay productos en esta categoría. Pulse “Nuevo producto” para agregar uno.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
