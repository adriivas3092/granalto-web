import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Order, OrderItem, Profile } from "@/types/store";

/** Devuelve el usuario autenticado (o null). */
export async function getSessionUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Perfil del usuario actual. */
export async function getMyProfile(): Promise<Profile | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return (data as Profile) ?? null;
}

/** Pedidos del usuario actual (más recientes primero). */
export async function getMyOrders(): Promise<Order[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Order[]) ?? [];
}

/** Un pedido del usuario con sus ítems (RLS restringe a los propios). */
export async function getMyOrderById(id: string): Promise<Order | null> {
  const supabase = await createSupabaseServerClient();
  const { data: order } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (!order) return null;
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);
  return { ...(order as Order), items: (items as OrderItem[]) ?? [] };
}
