import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Order, OrderItem, Product } from "@/types/store";

/** Consultas del panel (requieren sesión admin; RLS lo permite). */
export async function getAllProducts(categoryId?: string): Promise<Product[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data } = await query;
  return (data as Product[]) ?? [];
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  return (data as Product) ?? null;
}

/** Todos los pedidos (admin). */
export async function getAllOrders(status?: string): Promise<Order[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data } = await query;
  return (data as Order[]) ?? [];
}

/** Un pedido con sus ítems (admin). */
export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = await createSupabaseServerClient();
  const { data: order } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (!order) return null;
  const { data: items } = await supabase.from("order_items").select("*").eq("order_id", id);
  return { ...(order as Order), items: (items as OrderItem[]) ?? [] };
}

export type CustomerSummary = {
  customer_id: string;
  name: string;
  email: string;
  phone: string | null;
  orders: number;
  total: number;
  currency: string;
  last_order: string;
};

/** Resumen de clientes que han comprado (agrupado desde pedidos). */
export async function getCustomers(): Promise<CustomerSummary[]> {
  const orders = await getAllOrders();
  const map = new Map<string, CustomerSummary>();
  for (const o of orders) {
    const existing = map.get(o.customer_id);
    if (existing) {
      existing.orders += 1;
      existing.total += o.total;
      if (o.created_at > existing.last_order) existing.last_order = o.created_at;
      if (!existing.phone && o.customer_phone) existing.phone = o.customer_phone;
    } else {
      map.set(o.customer_id, {
        customer_id: o.customer_id,
        name: o.customer_name || "—",
        email: o.customer_email,
        phone: o.customer_phone,
        orders: 1,
        total: o.total,
        currency: o.currency,
        last_order: o.created_at,
      });
    }
  }
  return [...map.values()].sort((a, b) => (a.last_order > b.last_order ? -1 : 1));
}
