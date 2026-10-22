"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { bnConfigurado, crearTransaccionBN } from "@/lib/pago/bn";
import { getSiteUrl } from "@/config/site";
import type { Product } from "@/types/store";

type IncomingItem = { id: string; quantity: number };

/**
 * Crea un pedido. Recibe los ítems del carrito (id + cantidad) desde el
 * navegador, pero los precios se recalculan SIEMPRE desde la base de datos
 * para no confiar en valores del cliente.
 */
export async function createOrder(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/cuenta/login?next=/checkout");

  let cart: IncomingItem[] = [];
  try {
    cart = JSON.parse((formData.get("cart") as string) || "[]");
  } catch {
    cart = [];
  }
  cart = cart.filter((c) => c && c.id && c.quantity > 0);
  if (cart.length === 0) redirect("/carrito");

  // Precios reales desde la BD.
  const ids = cart.map((c) => c.id);
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .in("id", ids)
    .eq("available", true);
  const byId = new Map((products as Product[] | null ?? []).map((p) => [p.id, p]));

  const items = cart
    .map((c) => {
      const p = byId.get(c.id);
      if (!p) return null;
      const quantity = Math.max(1, Math.round(c.quantity));
      return {
        product_id: p.id,
        product_name: p.name,
        product_slug: p.slug,
        unit_price: p.price,
        quantity,
        line_total: p.price * quantity,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (items.length === 0) redirect("/carrito");

  const subtotal = items.reduce((n, i) => n + i.line_total, 0);
  const currency = byId.get(items[0].product_id)?.currency ?? "CRC";

  const fullName = ((formData.get("full_name") as string) || "").trim();
  const phone = ((formData.get("phone") as string) || "").trim();
  const address = ((formData.get("address") as string) || "").trim();
  const notes = ((formData.get("notes") as string) || "").trim();

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_id: user.id,
      status: "pendiente",
      currency,
      subtotal,
      total: subtotal,
      customer_name: fullName,
      customer_email: user.email ?? "",
      customer_phone: phone || null,
      shipping_address: address || null,
      notes: notes || null,
    })
    .select("id")
    .single();

  if (error || !order) throw new Error(error?.message ?? "No se pudo crear el pedido");

  const rows = items.map((i) => ({ ...i, order_id: order.id }));
  const { error: itemsError } = await supabase.from("order_items").insert(rows);
  if (itemsError) throw new Error(itemsError.message);

  // Guarda/actualiza datos de contacto en el perfil.
  await supabase
    .from("profiles")
    .upsert({ id: user.id, full_name: fullName || null, phone: phone || null, address: address || null });

  revalidatePath("/cuenta");
  revalidatePath("/admin/pedidos");
  // Tras crear la orden (pendiente de pago) → página de pago.
  redirect(`/checkout/pago?pedido=${order.id}`);
}

/**
 * Inicia el pago de una orden con la pasarela del Banco Nacional.
 * Verifica que la orden sea del usuario y esté pendiente, crea la transacción
 * en el BN y redirige a su página de pago segura. Si el BN aún no está
 * configurado (sin credenciales), deja la orden pendiente y manda a la
 * confirmación, donde un asesor coordina el pago.
 */
export async function iniciarPagoBN(orderId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/cuenta/login?next=/checkout");

  const { data: order } = await supabase
    .from("orders")
    .select("id, customer_id, status, total, currency, customer_email, customer_name")
    .eq("id", orderId)
    .maybeSingle();

  if (!order || order.customer_id !== user.id) redirect("/cuenta/pedidos");
  if (order.status !== "pendiente") redirect(`/checkout/gracias?pedido=${orderId}`);

  if (!bnConfigurado()) {
    // Sin credenciales del BN todavía: se coordina el pago con un asesor.
    redirect(`/checkout/gracias?pedido=${orderId}&pago=coordinar`);
  }

  const tx = await crearTransaccionBN({
    orderId: order.id,
    amount: order.total,
    currency: order.currency,
    returnUrl: `${getSiteUrl()}/checkout/gracias?pedido=${order.id}`,
    customerEmail: order.customer_email ?? undefined,
    customerName: order.customer_name ?? undefined,
  });

  if (tx?.redirectUrl) redirect(tx.redirectUrl);
  redirect(`/checkout/gracias?pedido=${orderId}&pago=coordinar`);
}
