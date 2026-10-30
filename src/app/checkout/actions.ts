"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { bnConfigurado, crearTransaccionBN } from "@/lib/pago/bn";
import {
  crearOrdenGreenpay,
  greenpayConfigurado,
  autorizarGreenpay,
  type OrdenGreenpay,
  type TarjetaAutorizacion,
} from "@/lib/pago/greenpay";
import { debeBloquearPorStock } from "@/lib/store/stock";
import { getStockAlertaActiva } from "@/lib/store/settings";
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

  // Descuento de stock + bloqueo automático a ≤1 unidad. Usa el cliente de
  // servicio (service role) porque actualizar productos requiere permisos de
  // admin por RLS. Si no está configurado, el stock no se descuenta.
  try {
    const service = createSupabaseServiceClient();
    if (service) {
      const alertaActiva = await getStockAlertaActiva();
      for (const it of items) {
        const prod = byId.get(it.product_id);
        if (!prod) continue;
        const nuevoStock = Math.max(0, (prod.stock ?? 0) - it.quantity);
        const patch: { stock: number; available?: boolean } = { stock: nuevoStock };
        if (alertaActiva && debeBloquearPorStock(nuevoStock)) patch.available = false;
        await service.from("products").update(patch).eq("id", prod.id);
      }
    }
  } catch {
    // No bloquear la compra si falla el ajuste de stock.
  }

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

export type IniciarGreenpayResult =
  | { ok: true; orden: OrdenGreenpay; amount: number; currency: string }
  | { ok: false; error: string };

/**
 * Crea la orden de pago en GreenPay para un pedido del usuario y devuelve los
 * datos ({ session, token, terminalId, env }) que el navegador usará con el
 * SDK oficial para capturar la tarjeta y correr el 3D Secure. El `secret` solo
 * se usa aquí, en el servidor.
 */
export async function crearOrdenPagoGreenpay(orderId: string): Promise<IniciarGreenpayResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Tu sesión expiró. Iniciá sesión de nuevo." };

  const { data: order } = await supabase
    .from("orders")
    .select("id, customer_id, status, total, currency, customer_name, customer_email")
    .eq("id", orderId)
    .maybeSingle();

  if (!order || order.customer_id !== user.id) return { ok: false, error: "Pedido no encontrado." };
  if (order.status !== "pendiente")
    return { ok: false, error: "Este pedido ya no está pendiente de pago." };
  if (!greenpayConfigurado())
    return { ok: false, error: "La pasarela de pago no está configurada todavía." };

  try {
    const orden = await crearOrdenGreenpay({
      amount: order.total,
      currency: order.currency,
      description: `Pedido Granalto ${order.id.slice(0, 8).toUpperCase()}`,
      orderReference: order.id,
      customer: {
        name: order.customer_name || undefined,
        email: order.customer_email || undefined,
      },
    });
    return { ok: true, orden, amount: order.total, currency: order.currency };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "No se pudo iniciar el pago." };
  }
}

/**
 * Marca un pedido como pagado tras un 3D Secure exitoso en el navegador.
 *
 * NOTA DE SEGURIDAD: la confirmación autoritativa del pago debe venir del
 * WEBHOOK de GreenPay (servidor-a-servidor). Mientras integramos ese webhook,
 * esta acción marca el pedido como pagado a partir del resultado del navegador.
 * Pendiente: validar contra el webhook/estado real de GreenPay antes de
 * producción.
 */
export async function confirmarPagoGreenpay(
  orderId: string,
  referencia?: string,
): Promise<{ ok: boolean }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { data: order } = await supabase
    .from("orders")
    .select("id, customer_id, status, notes")
    .eq("id", orderId)
    .maybeSingle();
  if (!order || order.customer_id !== user.id) return { ok: false };
  if (order.status === "pagado") return { ok: true };

  const service = createSupabaseServiceClient();
  const client = service ?? supabase;
  const patch: { status: string; notes?: string } = { status: "pagado" };
  if (referencia) {
    const ref = referencia.slice(0, 200);
    patch.notes = [order.notes, `Pago GreenPay: ${ref}`].filter(Boolean).join("\n");
  }
  const { error } = await client.from("orders").update(patch).eq("id", orderId);
  if (error) return { ok: false };

  revalidatePath("/cuenta");
  revalidatePath("/cuenta/pedidos");
  revalidatePath("/admin/pedidos");
  return { ok: true };
}

/**
 * Autoriza (cobra) el pago de un pedido tras el 3D Secure. Corre en el
 * servidor: recibe los datos de la tarjeta del navegador, construye el `ed`
 * estándar y llama al endpoint de autorización de GreenPay con la session y el
 * token de la orden. Si el banco aprueba, marca el pedido como pagado.
 */
export async function autorizarPagoGreenpay(
  orderId: string,
  session: string,
  token: string,
  card: TarjetaAutorizacion,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Tu sesión expiró. Iniciá sesión de nuevo." };

  const { data: order } = await supabase
    .from("orders")
    .select("id, customer_id, status, notes")
    .eq("id", orderId)
    .maybeSingle();
  if (!order || order.customer_id !== user.id) return { ok: false, error: "Pedido no encontrado." };
  if (order.status === "pagado") return { ok: true };
  if (order.status !== "pendiente")
    return { ok: false, error: "Este pedido ya no está pendiente de pago." };

  let r;
  try {
    r = await autorizarGreenpay({ token, session, card });
  } catch {
    return { ok: false, error: "No se pudo procesar el cobro. Intentá de nuevo." };
  }
  if (!r.aprobado) {
    return {
      ok: false,
      error:
        r.mensaje ||
        "El pago no fue aprobado por el banco. Revisá los datos o probá con otra tarjeta.",
    };
  }

  const service = createSupabaseServiceClient();
  const client = service ?? supabase;
  const ref = [
    r.authorization && `Aut: ${r.authorization}`,
    r.transactionId && `Tx: ${r.transactionId}`,
    r.brand && r.last4 && `${r.brand} ****${r.last4}`,
  ]
    .filter(Boolean)
    .join(" · ")
    .slice(0, 200);
  const { error } = await client
    .from("orders")
    .update({
      status: "pagado",
      notes: [order.notes, `Pago GreenPay · ${ref}`].filter(Boolean).join("\n"),
    })
    .eq("id", orderId);
  if (error) return { ok: false, error: "El cobro se aprobó pero no se pudo actualizar el pedido." };

  revalidatePath("/cuenta");
  revalidatePath("/cuenta/pedidos");
  revalidatePath("/admin/pedidos");
  return { ok: true };
}
