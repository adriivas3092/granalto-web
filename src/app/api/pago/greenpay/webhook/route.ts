import { NextResponse } from "next/server";
import { parsearWebhookGreenpay } from "@/lib/pago/greenpay";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

/**
 * Webhook de GreenPay: confirmación REAL del pago (servidor-a-servidor).
 *
 * GreenPay llama a esta URL con el resultado de la transacción. Es la fuente
 * autoritativa del estado del pago: nunca confiamos en el "regreso" del
 * navegador para marcar un pedido como pagado de forma definitiva.
 *
 * Seguridad: la URL lleva un token compartido (GREENPAY_WEBHOOK_TOKEN) que se
 * configura en la consola de GreenPay, ya sea en el querystring (?token=…) o en
 * el header `x-greenpay-token` / `Authorization: Bearer …`. Sin ese token
 * configurado de nuestro lado, el webhook queda deshabilitado (responde 200
 * sin actuar, para que GreenPay no reintente en bucle).
 *
 * Configurar en GreenPay como URL de notificación:
 *   https://granaltocr.net/api/pago/greenpay/webhook?token=<GREENPAY_WEBHOOK_TOKEN>
 */
export async function POST(req: Request) {
  const esperado = process.env.GREENPAY_WEBHOOK_TOKEN?.trim();
  if (!esperado) {
    // Webhook aún no habilitado: aceptamos y no hacemos nada.
    return NextResponse.json({ ok: true, ignored: true });
  }

  const url = new URL(req.url);
  const recibido =
    url.searchParams.get("token") ||
    req.headers.get("x-greenpay-token") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";
  if (recibido !== esperado) {
    return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 });
  }

  let payload: unknown = null;
  try {
    payload = await req.json();
  } catch {
    try {
      const form = await req.formData();
      payload = Object.fromEntries(form.entries());
    } catch {
      payload = null;
    }
  }

  // Registramos la forma real del payload para poder afinar el mapeo si hace
  // falta (GreenPay documenta el formato, pero esto confirma el caso real).
  console.log("[greenpay] webhook", JSON.stringify(payload ?? {}).slice(0, 1500));

  const result = parsearWebhookGreenpay(payload);
  if (!result) {
    return NextResponse.json({ ok: false, message: "Payload no reconocido" }, { status: 400 });
  }

  if (result.aprobado) {
    const supabase = createSupabaseServiceClient();
    if (supabase) {
      // Idempotente: solo marca pagado si sigue pendiente, para no pisar notas
      // ni reprocesar un pedido ya confirmado por la autorización server-side.
      const { data: order } = await supabase
        .from("orders")
        .select("id, status, notes")
        .eq("id", result.orderId)
        .maybeSingle();
      if (order && order.status !== "pagado") {
        const nota = result.referencia
          ? `Pago GreenPay (webhook) · ${result.referencia}`
          : "Pago GreenPay (webhook)";
        await supabase
          .from("orders")
          .update({
            status: "pagado",
            notes: [order.notes, nota].filter(Boolean).join("\n"),
          })
          .eq("id", result.orderId);
      }
    }
  }

  // Siempre 200 cuando el payload fue reconocido, para que GreenPay no reintente.
  return NextResponse.json({ ok: true });
}
