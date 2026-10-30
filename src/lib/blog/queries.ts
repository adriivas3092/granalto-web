import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getBlogPosts as getStaticPosts,
  getBlogPostBySlug as getStaticBySlug,
  getRelatedPosts as getStaticRelated,
} from "@/data/blog";
import type { BlogPost } from "@/types";

/** Fila de la tabla public.blog_posts. */
export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published_at: string;
  reading_time: number;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  featured: boolean;
  published: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at?: string;
  updated_at?: string;
};

const SELECT =
  "id, slug, title, excerpt, content, category, author, published_at, reading_time, cover_image_url, cover_image_alt, featured, published, seo_title, seo_description";

/** Convierte una fila de la BD al tipo que consumen las páginas públicas. */
export function rowToPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    author: row.author,
    publishedAt: row.published_at,
    readingTime: row.reading_time,
    coverImage: {
      src: row.cover_image_url || "/images/placeholders/blog-granito.svg",
      alt: row.cover_image_alt || row.title,
    },
    featured: row.featured,
    seo: {
      title: row.seo_title || row.title,
      description: row.seo_description || row.excerpt,
    },
  };
}

/**
 * Artículos publicados para la web pública. Lee de la BD (RLS deja ver solo los
 * publicados). Si la tabla aún no existe o está vacía, usa los artículos
 * estáticos de src/data/blog.ts como respaldo.
 */
export async function getBlogPostsPublic(): Promise<BlogPost[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(SELECT)
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error || !data || data.length === 0) return getStaticPosts();
    return (data as BlogPostRow[]).map(rowToPost);
  } catch {
    return getStaticPosts();
  }
}

export async function getBlogPostBySlugPublic(slug: string): Promise<BlogPost | undefined> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(SELECT)
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !data) return getStaticBySlug(slug);
    return rowToPost(data as BlogPostRow);
  } catch {
    return getStaticBySlug(slug);
  }
}

export async function getRelatedPostsPublic(slug: string, count = 3): Promise<BlogPost[]> {
  const posts = await getBlogPostsPublic();
  if (posts.length <= 1) return getStaticRelated(slug, count);
  const current = posts.find((p) => p.slug === slug);
  return posts
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aScore = a.category === current?.category ? 1 : 0;
      const bScore = b.category === current?.category ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, count);
}

/** Admin: todos los artículos (borradores incluidos). Requiere sesión admin. */
export async function getAllBlogPostsAdmin(): Promise<BlogPostRow[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(SELECT)
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return data as BlogPostRow[];
}

export async function getBlogPostByIdAdmin(id: string): Promise<BlogPostRow | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as BlogPostRow;
}
