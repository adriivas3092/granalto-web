"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { calcularPrecio } from "@/lib/configurador/pricing";
import { buildFicha } from "@/lib/configurador/ficha";
import { getDisponibilidad } from "@/lib/configurador/disponibilidad";
import { enviarNotificaciones } from "@/lib/configurador/email";
import { configuradorSchema, generarFolio } from "@/lib/configurador/schema";

export type CrearPedidoSobreResult =
  | { ok: true; orderId: string; folio: string }
  | { ok: false; error: string; needLogin?: boolean };

/**
 * Crea un PEDIDO a partir de una cotización de sobre con "Costo final" y lo deja
 * listo para pagar con GreenPay (reutiliza el flujo /checkout/pago).
 *
 * - Exige sesión (el pedido queda en la cuenta del cliente).
 * - Recalcula el precio EN EL SERVIDOR (nunca confía en el monto del cliente).
 * - Solo permite el pago cuando hay un costo final (no personalizado ni agotado).
 * - Registra también la configuración (tabla configuraciones) y envía las
 *   notificaciones internas, igual que el envío normal del cotizador.
 */
export async function crearPedidoSobre(payload: unknown): Promise<CrearPedidoSobreResult> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, needLogin: true, error: "Iniciá sesión para pagar tu pedido." };

  const parsed = configuradorSchema.safeParse(payload);
  if (!parsed.success) return { ok: false, error: "Datos incompletos o inválidos." };
  const d = parsed.data;

  // Disponibilidad y precio REALES calculados en el servidor.
  const agotadoOverrides = await getDisponibilidad();
  const price = calcularPrecio({
    geometriaId: d.geometriaId,
    materialId: d.materialId ?? null,
    colorId: d.colorId ?? null,
    medidas: d.medidas ?? {},
    moldura: d.moldura ?? null,
    salpicaderoTipo: d.salpicaderoTipo ?? "no",
    salpicaderoAlturaCm: d.salpicaderoAlturaCm ?? 0,
    agotadoOverrides,
  });

  if (d.personalizado || !price.tienePrecio || price.agotado || price.total <= 0) {
    return {
      ok: false,
      error: "Este proyecto se cotiza con un asesor; no se puede pagar en línea.",
    };
  }

  const folio = generarFolio();
  const { secciones, esPersonalizado, entregaDomicilio } = buildFicha({
    geometriaId: d.geometriaId,
    agotadoOverrides,
    materialId: d.materialId ?? null,
    colorId: d.colorId ?? null,
    medidas: d.medidas ?? {},
    acabado: d.acabado ?? null,
    moldura: d.moldura ?? null,
    molduraGrosorCm: d.molduraGrosorCm ?? null,
    molduraPerfil: d.molduraPerfil ?? null,
    salpicaderoTipo: d.salpicaderoTipo ?? "no",
    salpicaderoAlturaCm: d.salpicaderoAlturaCm ?? 0,
    lUnion: d.lUnion ?? null,
    notas: d.notas ?? null,
    derivar: d.derivar,
    unidad: d.unidad ?? "mm",
    cliente: d.cliente,
    folio,
    fecha: new Date().toLocaleString("es-CR"),
  });

  // Notificaciones internas + al cliente (no bloquean el pago si fallan).
  const notif = await enviarNotificaciones({
    folio,
    secciones,
    esPersonalizado,
    entregaDomicilio,
    clienteCorreo: d.cliente.correo,
    clienteNombre: d.cliente.nombre,
  }).catch(() => null);

  // Registro de la configuración (ficha completa) para "Pedidos de sobres".
  try {
    const service = createSupabaseServiceClient();
    if (service) {
      await service.from("configuraciones").insert({
        folio,
        payload: d,
        notificacion: notif,
        estado: "pendiente_pago",
      });
    }
  } catch {
    // Si la tabla no existe o falla, no bloqueamos el pedido/pago.
  }

  // Resumen legible de la ficha para las notas del pedido.
  const resumen = secciones
    .map((sec) => `${sec.titulo}:\n` + sec.filas.map((f) => `  · ${f.label}: ${f.value}`).join("\n"))
    .join("\n");
  const notes = `Pedido de sobre (cotizador) · Folio ${folio}\n\n${resumen}`.slice(0, 4000);

  // Pedido (reutiliza orders + checkout/pago + GreenPay). RLS permite al
  // usuario crear su propio pedido (igual que el checkout de la tienda).
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_id: user.id,
      status: "pendiente",
      currency: price.moneda,
      subtotal: price.subtotal,
      total: price.total,
      customer_name: d.cliente.nombre,
      customer_email: d.cliente.correo || user.email || "",
      customer_phone: d.cliente.telefono || null,
      shipping_address: d.cliente.retiro ? "Retiro en tienda" : d.cliente.direccion || null,
      notes,
    })
    .select("id")
    .single();
  if (error || !order) return { ok: false, error: "No se pudo crear el pedido. Intentá de nuevo." };

  // Línea del pedido (sobre a medida; sin product_id porque no es un producto).
  await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: null,
    product_name: `Sobre a medida · Folio ${folio}`,
    unit_price: price.total,
    quantity: 1,
    line_total: price.total,
  });

  revalidatePath("/cuenta");
  revalidatePath("/cuenta/pedidos");
  revalidatePath("/admin/pedidos");
  revalidatePath("/admin/solicitudes");

  return { ok: true, orderId: order.id, folio };
}
