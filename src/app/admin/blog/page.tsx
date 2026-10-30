import Link from "next/link";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogList } from "@/components/admin/BlogList";
import { getAllBlogPostsAdmin } from "@/lib/blog/queries";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Blog", robots: { index: false } };

export default async function AdminBlogPage() {
  await requireAdmin();
  const posts = await getAllBlogPostsAdmin();
  const publicados = posts.filter((p) => p.published).length;

  return (
    <AdminShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-sans text-2xl font-bold text-ink">Blog</h1>
          <p className="text-sm text-charcoal/70">
            {posts.length} artículo(s) · {publicados} publicado(s). Se muestran en /blog.
          </p>
        </div>
        <Link
          href="/admin/blog/nuevo"
          className="inline-flex min-h-[40px] items-center gap-2 rounded-sm bg-ink px-4 py-2 text-sm font-medium text-ivory hover:bg-charcoal"
        >
          <Plus className="h-4 w-4" /> Nuevo artículo
        </Link>
      </div>
      <BlogList posts={posts} />
    </AdminShell>
  );
}
