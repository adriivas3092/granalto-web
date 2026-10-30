import { AdminShell } from "@/components/admin/AdminShell";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Nuevo artículo", robots: { index: false } };

export default async function AdminBlogNuevoPage() {
  await requireAdmin();
  return (
    <AdminShell>
      <h1 className="mb-6 font-sans text-2xl font-bold text-ink">Nuevo artículo</h1>
      <BlogEditor />
    </AdminShell>
  );
}
