import { AdminShell } from "@/components/admin/AdminShell";
import { CategoriesManager } from "@/components/admin/CategoriesManager";
import { getCategories } from "@/lib/store/queries";
import { getAllProducts } from "@/lib/store/admin";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Categorías", robots: { index: false } };

export default async function AdminCategoriasPage() {
  await requireAdmin();
  const [categories, products] = await Promise.all([getCategories(), getAllProducts()]);

  const counts = new Map<string, number>();
  for (const p of products) {
    if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  }
  const rows = categories.map((c) => ({ ...c, productCount: counts.get(c.id) ?? 0 }));

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-sans text-2xl font-bold text-ink">Categorías</h1>
        <p className="text-sm text-charcoal/70">
          {categories.length} categoría(s). Se usan en el desplegable al crear/editar productos y
          en los filtros y la búsqueda de la tienda.
        </p>
      </div>
      <CategoriesManager categories={rows} />
    </AdminShell>
  );
}
