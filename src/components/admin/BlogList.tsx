"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, Eye, EyeOff, Loader2, Star } from "lucide-react";
import { togglePublicado, eliminarPost } from "@/app/admin/blog/actions";
import type { BlogPostRow } from "@/lib/blog/queries";

export function BlogList({ posts }: { posts: BlogPostRow[] }) {
  const [pending, startTransition] = useTransition();

  if (posts.length === 0) {
    return (
      <div className="rounded-sm border border-stone-beige bg-white p-10 text-center text-sm text-mineral">
        No hay artículos todavía. Creá el primero con «Nuevo artículo».
        <br />
        <span className="text-xs">
          Si acabás de crear la tabla, corré primero <code>supabase/blog.sql</code> en Supabase.
        </span>
      </div>
    );
  }

  return (
    <section className="overflow-x-auto rounded-sm border border-stone-beige bg-white">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-stone-beige text-left text-xs uppercase tracking-wide text-mineral">
            <th className="px-4 py-3 font-medium">Título</th>
            <th className="px-4 py-3 font-medium">Categoría</th>
            <th className="px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Estado</th>
            <th className="px-4 py-3 font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id} className="border-b border-stone-beige/60 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 font-medium text-ink">
                  {p.featured && <Star className="h-3.5 w-3.5 text-[#b8863b]" aria-label="Destacado" />}
                  {p.title}
                </div>
                <div className="font-mono text-xs text-mineral">/blog/{p.slug}</div>
              </td>
              <td className="px-4 py-3 text-charcoal">{p.category}</td>
              <td className="px-4 py-3 text-charcoal">{p.published_at}</td>
              <td className="px-4 py-3">
                <span
                  className={
                    p.published
                      ? "inline-flex items-center gap-1 rounded-full bg-[#263a2c]/10 px-2.5 py-1 text-xs font-medium text-ink"
                      : "inline-flex items-center gap-1 rounded-full bg-stone-beige px-2.5 py-1 text-xs font-medium text-mineral"
                  }
                >
                  {p.published ? "Publicado" : "Borrador"}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/blog/${p.id}`}
                    className="inline-flex items-center gap-1 rounded-sm border border-stone-beige px-2.5 py-1.5 text-xs text-charcoal hover:border-ink"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </Link>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => startTransition(() => togglePublicado(p.id, !p.published))}
                    className="inline-flex items-center gap-1 rounded-sm border border-stone-beige px-2.5 py-1.5 text-xs text-charcoal hover:border-ink disabled:opacity-40"
                  >
                    {pending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : p.published ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                    {p.published ? "Ocultar" : "Publicar"}
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    aria-label={`Eliminar ${p.title}`}
                    onClick={() => {
                      if (!confirm(`¿Eliminar el artículo «${p.title}»? Esta acción no se puede deshacer.`))
                        return;
                      startTransition(() => eliminarPost(p.id));
                    }}
                    className="inline-flex items-center gap-1 rounded-sm border border-stone-beige px-2.5 py-1.5 text-xs text-charcoal transition-colors hover:border-[#a03826] hover:text-[#a03826] disabled:opacity-40"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
