"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";

/** Genera un slug web a partir de un texto (sin acentos ni símbolos). */
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

/** Minutos de lectura estimados (~200 palabras/min, mínimo 1). */
function calcularTiempoLectura(content: string): number {
  const palabras = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 200));
}

type Campos = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published_at: string;
  reading_time: number;
  cover_image_url: string | null;
  cover_image_alt: string;
  featured: boolean;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

function parseForm(formData: FormData): Campos {
  const str = (k: string) => ((formData.get(k) as string) || "").trim();
  const title = str("title");
  if (!title) throw new Error("El título es obligatorio.");

  const content = str("content");
  const slug = slugify(str("slug") || title);
  if (!slug) throw new Error("No se pudo generar la dirección web (slug) del artículo.");

  const rt = Math.round(Number(formData.get("reading_time")) || 0);
  const reading_time = rt > 0 ? rt : calcularTiempoLectura(content);

  const fecha = str("published_at");
  const published_at = /^\d{4}-\d{2}-\d{2}$/.test(fecha)
    ? fecha
    : new Date().toISOString().slice(0, 10);

  return {
    slug,
    title,
    excerpt: str("excerpt"),
    content,
    category: str("category") || "Novedades",
    author: str("author") || "Equipo Granalto",
    published_at,
    reading_time,
    cover_image_url: str("cover_image_url") || null,
    cover_image_alt: str("cover_image_alt"),
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
    published: formData.get("published") === "on" || formData.get("published") === "true",
    seo_title: str("seo_title") || null,
    seo_description: str("seo_description") || null,
  };
}

function revalidarBlog(slug?: string) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export async function crearPost(formData: FormData) {
  await requireAdmin();
  const campos = parseForm(formData);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("blog_posts").insert(campos);
  if (error) {
    if (error.code === "23505") throw new Error(`Ya existe un artículo con el slug «${campos.slug}».`);
    throw new Error(error.message);
  }
  revalidarBlog(campos.slug);
  redirect("/admin/blog");
}

export async function actualizarPost(id: string, formData: FormData) {
  await requireAdmin();
  const campos = parseForm(formData);
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("blog_posts").update(campos).eq("id", id);
  if (error) {
    if (error.code === "23505") throw new Error(`Ya existe un artículo con el slug «${campos.slug}».`);
    throw new Error(error.message);
  }
  revalidarBlog(campos.slug);
  redirect("/admin/blog");
}

export async function eliminarPost(id: string) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidarBlog();
}

export async function togglePublicado(id: string, publicado: boolean) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .update({ published: publicado })
    .eq("id", id)
    .select("slug")
    .maybeSingle();
  if (error) throw new Error(error.message);
  revalidarBlog(data?.slug);
}
