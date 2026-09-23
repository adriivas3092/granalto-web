import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/store/queries";
import { getProductById } from "@/lib/store/admin";
import { updateProduct } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Editar producto", robots: { index: false } };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const [product, categories] = await Promise.all([getProductById(id), getCategories()]);
  if (!product) notFound();

  const action = updateProduct.bind(null, id);

  return (
    <AdminShell>
      <Link href="/admin/productos" className="text-sm text-mineral hover:text-ink">
        ← Volver
      </Link>
      <h1 className="mb-6 mt-2 font-sans text-2xl font-bold text-ink">Editar producto</h1>
      <ProductForm categories={categories} product={product} action={action} />
    </AdminShell>
  );
}
