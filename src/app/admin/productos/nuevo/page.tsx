import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/store/queries";
import { createProduct } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Nuevo producto", robots: { index: false } };

export default async function NewProductPage() {
  await requireAdmin();
  const categories = await getCategories();
  return (
    <AdminShell>
      <Link href="/admin/productos" className="text-sm text-mineral hover:text-ink">
        ← Volver
      </Link>
      <h1 className="mb-6 mt-2 font-sans text-2xl font-bold text-ink">Nuevo producto</h1>
      <ProductForm categories={categories} action={createProduct} />
    </AdminShell>
  );
}
