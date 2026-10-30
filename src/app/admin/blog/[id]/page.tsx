import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { getBlogPostByIdAdmin } from "@/lib/blog/queries";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Editar artículo", robots: { index: false } };

export default async function AdminBlogEditarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const post = await getBlogPostByIdAdmin(id);
  if (!post) notFound();

  return (
    <AdminShell>
      <h1 className="mb-6 font-sans text-2xl font-bold text-ink">Editar artículo</h1>
      <BlogEditor post={post} />
    </AdminShell>
  );
}
