import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/types/store";

// Reexportado para conservar compatibilidad con importaciones existentes.
export { formatPrice } from "@/lib/store/format";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("position", { ascending: true });
  return (data as Category[]) ?? [];
}

export async function getProducts(options?: {
  categorySlug?: string;
  search?: string;
}): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  if (options?.search) {
    query = query.ilike("name", `%${options.search}%`);
  }
  const { data } = await query;
  let products = (data as Product[]) ?? [];

  if (options?.categorySlug) {
    const categories = await getCategories();
    const cat = categories.find((c) => c.slug === options.categorySlug);
    if (cat) products = products.filter((p) => p.category_id === cat.id);
  }
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  return (data as Product) ?? null;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("featured", true)
    .limit(limit);
  return (data as Product[]) ?? [];
}
