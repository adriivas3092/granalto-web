"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { crearPost, actualizarPost } from "@/app/admin/blog/actions";
import { blogCategories } from "@/data/blog";
import type { BlogPostRow } from "@/lib/blog/queries";

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const field =
  "w-full rounded-sm border border-stone-beige bg-white px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none";
const label = "mb-1 block text-sm font-medium text-charcoal";
const hint = "mt-1 text-xs text-mineral";

/** Formulario de creación/edición de un artículo del blog. */
export function BlogEditor({ post }: { post?: BlogPostRow }) {
  const editando = Boolean(post);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEditado, setSlugEditado] = useState(Boolean(post));

  const onSubmit = (fd: FormData) => {
    setError(null);
    startTransition(async () => {
      try {
        if (post) await actualizarPost(post.id, fd);
        else await crearPost(fd);
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo guardar el artículo.");
      }
    });
  };

  return (
    <form action={onSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1.5 text-sm text-mineral hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al blog
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-sm bg-ink px-5 py-2 text-sm font-medium text-ivory hover:bg-charcoal disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {editando ? "Guardar cambios" : "Crear artículo"}
        </button>
      </div>

      {error && (
        <div className="rounded-sm border border-[#a03826]/40 bg-[#a03826]/10 p-3 text-sm text-[#a03826]">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Columna principal */}
        <div className="space-y-5">
          <div>
            <label htmlFor="title" className={label}>
              Título
            </label>
            <input
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugEditado) setSlug(slugify(e.target.value));
              }}
              placeholder="Ej. Cómo cuidar un sobre de cuarzo"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="slug" className={label}>
              Dirección web (slug)
            </label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEditado(true);
              }}
              placeholder="como-cuidar-un-sobre-de-cuarzo"
              className={`${field} font-mono`}
            />
            <p className={hint}>La URL pública será /blog/{slug || "…"}</p>
          </div>

          <div>
            <label htmlFor="excerpt" className={label}>
              Resumen (extracto)
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              defaultValue={post?.excerpt ?? ""}
              placeholder="Una o dos frases que aparecen en la tarjeta y en el encabezado."
              className={field}
            />
          </div>

          <div>
            <label htmlFor="content" className={label}>
              Contenido
            </label>
            <textarea
              id="content"
              name="content"
              rows={18}
              defaultValue={post?.content ?? ""}
              placeholder={"Escribí el artículo en párrafos.\n\nDejá una línea en blanco entre párrafos.\n\n## Usá dos almohadillas para los subtítulos"}
              className={`${field} font-mono leading-relaxed`}
            />
            <p className={hint}>
              Separá los párrafos con una línea en blanco. Para un subtítulo, empezá la línea
              con <code>## </code>.
            </p>
          </div>
        </div>

        {/* Barra lateral de ajustes */}
        <aside className="space-y-5 rounded-sm border border-stone-beige bg-white p-5">
          <div>
            <label htmlFor="published" className="flex items-center gap-2 text-sm font-medium text-ink">
              <input
                id="published"
                name="published"
                type="checkbox"
                defaultChecked={post?.published ?? false}
                className="h-4 w-4 accent-ink"
              />
              Publicado (visible en la web)
            </label>
            <p className={hint}>Si está desmarcado, queda como borrador.</p>
          </div>

          <div>
            <label htmlFor="featured" className="flex items-center gap-2 text-sm font-medium text-ink">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                defaultChecked={post?.featured ?? false}
                className="h-4 w-4 accent-ink"
              />
              Destacado
            </label>
          </div>

          <div>
            <label htmlFor="category" className={label}>
              Categoría
            </label>
            <select
              id="category"
              name="category"
              defaultValue={post?.category ?? blogCategories[0]}
              className={field}
            >
              {blogCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="author" className={label}>
              Autor
            </label>
            <input
              id="author"
              name="author"
              defaultValue={post?.author ?? "Equipo Granalto"}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="published_at" className={label}>
              Fecha de publicación
            </label>
            <input
              id="published_at"
              name="published_at"
              type="date"
              defaultValue={post?.published_at ?? new Date().toISOString().slice(0, 10)}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="reading_time" className={label}>
              Minutos de lectura
            </label>
            <input
              id="reading_time"
              name="reading_time"
              type="number"
              min={0}
              step={1}
              defaultValue={post?.reading_time ?? 0}
              className={field}
            />
            <p className={hint}>Dejalo en 0 para calcularlo automáticamente.</p>
          </div>

          <div>
            <label htmlFor="cover_image_url" className={label}>
              Imagen de portada (URL o ruta)
            </label>
            <input
              id="cover_image_url"
              name="cover_image_url"
              defaultValue={post?.cover_image_url ?? ""}
              placeholder="/images/blog/mi-articulo.jpg"
              className={field}
            />
            <p className={hint}>
              Una ruta del sitio (p. ej. <code>/images/blog/…</code>) o un enlace completo
              (<code>https://…</code>).
            </p>
          </div>

          <div>
            <label htmlFor="cover_image_alt" className={label}>
              Texto alternativo de la imagen
            </label>
            <input
              id="cover_image_alt"
              name="cover_image_alt"
              defaultValue={post?.cover_image_alt ?? ""}
              placeholder="Descripción breve de la imagen"
              className={field}
            />
          </div>

          <hr className="border-stone-beige" />

          <div>
            <label htmlFor="seo_title" className={label}>
              SEO · Título
            </label>
            <input
              id="seo_title"
              name="seo_title"
              defaultValue={post?.seo_title ?? ""}
              placeholder="(opcional, por defecto usa el título)"
              className={field}
            />
          </div>

          <div>
            <label htmlFor="seo_description" className={label}>
              SEO · Descripción
            </label>
            <textarea
              id="seo_description"
              name="seo_description"
              rows={3}
              defaultValue={post?.seo_description ?? ""}
              placeholder="(opcional, por defecto usa el resumen)"
              className={field}
            />
          </div>
        </aside>
      </div>
    </form>
  );
}
