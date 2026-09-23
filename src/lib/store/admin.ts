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

export type SalesStats = {
  revenue: number;
  currency: string;
  orders: number;
  avgTicket: number;
  last30Orders: number;
  last30Revenue: number;
  unitsSold: number;
  byStatus: Record<string, number>;
  topProducts: { name: string; qty: number; total: number }[];
};

/** Estadísticas de ventas para el panel (pedidos de la tienda). */
export async function getSalesStats(): Promise<SalesStats> {
  const supabase = await createSupabaseServerClient();
  const orders = await getAllOrders();

  const paid = orders.filter((o) => o.status !== "cancelado");
  const revenue = paid.reduce((a, o) => a + (o.total ?? 0), 0);
  const currency = orders[0]?.currency ?? "CRC";
  const avgTicket = paid.length ? Math.round(revenue / paid.length) : 0;

  const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const last30 = paid.filter((o) => new Date(o.created_at).getTime() >= since);
  const last30Revenue = last30.reduce((a, o) => a + (o.total ?? 0), 0);

  const byStatus: Record<string, number> = {};
  for (const o of orders) byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;

  // Productos más vendidos (desde order_items).
  const { data: items } = await supabase
    .from("order_items")
    .select("product_name, quantity, line_total");
  const agg = new Map<string, { name: string; qty: number; total: number }>();
  let unitsSold = 0;
  for (const it of (items as { product_name: string; quantity: number; line_total: number }[]) ?? []) {
    unitsSold += it.quantity ?? 0;
    const cur = agg.get(it.product_name) ?? { name: it.product_name, qty: 0, total: 0 };
    cur.qty += it.quantity ?? 0;
    cur.total += it.line_total ?? 0;
    agg.set(it.product_name, cur);
  }
  const topProducts = [...agg.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);

  return {
    revenue,
    currency,
    orders: orders.length,
    avgTicket,
    last30Orders: last30.length,
    last30Revenue,
    unitsSold,
    byStatus,
    topProducts,
  };
}

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
