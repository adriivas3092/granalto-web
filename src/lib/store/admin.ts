import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Product } from "@/types/store";

/** Consultas del panel (requieren sesión autenticada; RLS lo permite). */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Product[]) ?? [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  return (data as Product) ?? null;
}
