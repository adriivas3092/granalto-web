import { createSupabaseServerClient } from "@/lib/supabase/server";
import { tenaxLabel } from "@/lib/store/tenax";
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
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  let products = (data as Product[]) ?? [];

  // Sólo cargamos las categorías si hacen falta (filtro por chip o búsqueda).
  const needCategories = Boolean(options?.categorySlug || options?.search);
  const categories = needCategories ? await getCategories() : [];

  // Filtro por categoría (chips de la tienda).
  if (options?.categorySlug) {
    const cat = categories.find((c) => c.slug === options.categorySlug);
    if (cat) products = products.filter((p) => p.category_id === cat.id);
  }

  // Búsqueda libre: coincide por nombre o SKU/descripción del producto, o por
  // el nombre de su categoría (p. ej. "selladores" encuentra los productos de
  // esa categoría). Insensible a mayúsculas/acentos.
  if (options?.search) {
    const needle = normalize(options.search);
    if (needle) {
      const catIds = new Set(
        categories.filter((c) => normalize(c.name).includes(needle)).map((c) => c.id),
      );
      products = products.filter((p) => {
        const haystack = normalize(
          `${p.name} ${p.sku ?? ""} ${p.description ?? ""} ${tenaxLabel(p.tenax_category) ?? ""}`,
        );
        return haystack.includes(needle) || (p.category_id != null && catIds.has(p.category_id));
      });
    }
  }

  return products;
}

/** Minúsculas y sin acentos, para comparar texto de forma tolerante. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
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
