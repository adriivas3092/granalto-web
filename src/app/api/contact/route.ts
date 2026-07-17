import { NextResponse } from "next/server";
import {
  isSpam,
  validateContactForm,
  type ContactFormData,
} from "@/lib/validation";

/**
 * Endpoint del formulario de contacto.
 *
 * Primera versión: valida la solicitud y, si existe CONTACT_WEBHOOK_URL,
 * reenvía los datos a ese webhook (Kommo, Zapier, Make, API propia…).
 * Sin webhook configurado, actúa como endpoint de prueba (registra en
 * consola del servidor y responde OK) — ver README para las integraciones.
 */
export async function POST(request: Request) {
  let data: ContactFormData;
  try {
    data = (await request.json()) as ContactFormData;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  // Honeypot: responder OK sin procesar para no dar pistas a los bots.
  if (isSpam(data)) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateContactForm(data);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Datos incompletos.", fields: errors }, { status: 422 });
  }

  const payload = {
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    clientType: data.clientType,
    projectType: data.projectType,
    province: data.province,
    message: data.message.trim(),
    submittedAt: new Date().toISOString(),
    source: "granalto-web",
  };

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Webhook respondió ${res.status}`);
    } catch (error) {
      console.error("[contacto] Error reenviando al webhook:", error);
      return NextResponse.json(
        { error: "No se pudo procesar la solicitud." },
        { status: 502 },
      );
    }
  } else {
    // Modo de prueba: sin integración configurada todavía.
    console.info("[contacto] Solicitud recibida (modo prueba):", payload);
  }

  return NextResponse.json({ ok: true });
}
