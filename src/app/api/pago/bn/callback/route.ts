import { NextResponse } from "next/server";
import { verificarCallbackBN } from "@/lib/pago/bn";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

/**
 * Callback/webhook del Banco Nacional: confirmación real del pago.
 * El BN llama a esta URL con el resultado de la transacción. Validamos la
 * firma (en el adaptador) y, si el pago fue aprobado, marcamos la orden como
 * "pagado". Nunca confiamos en el "regreso" del navegador para esto.
 *
 * Se termina de implementar con la documentación técnica del BN
 * (formato del payload y validación de firma).
 */
export async function POST(req: Request) {
  let payload: unknown = null;
  try {
    payload = await req.json();
  } catch {
    try {
      // Algunos gateways envían form-urlencoded.
      const form = await req.formData();
      payload = Object.fromEntries(form.entries());
    } catch {
      payload = null;
    }
  }

  const result = await verificarCallbackBN(payload, req.headers);
  if (!result) {
    return NextResponse.json({ ok: false, message: "No verificado" }, { status: 400 });
  }

  if (result.aprobado) {
    const supabase = createSupabaseServiceClient();
    if (supabase) {
      await supabase.from("orders").update({ status: "pagado" }).eq("id", result.orderId);
    }
  }

  return NextResponse.json({ ok: true });
}
