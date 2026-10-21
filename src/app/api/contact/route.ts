import { NextResponse } from "next/server";
import {
  isSpam,
  validateContactForm,
  type ContactFormData,
} from "@/lib/validation";

/**
 * Endpoint del formulario de contacto.
 *
 * Envía el mensaje por correo (Resend) al buzón de contacto (CONTACT_TO, por
 * defecto info@granalto.net). Si además hay CONTACT_WEBHOOK_URL, reenvía los
 * datos a ese webhook (Kommo, Zapier, Make…). Si nada está configurado,
 * registra en consola y responde OK.
 */

const CONTACT_TO = process.env.CONTACT_TO || "info@granalto.net";
const CONTACT_FROM = process.env.CONTACT_FROM || "Granalto <onboarding@resend.dev>";

function esc(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] as string);
}

async function enviarCorreoContacto(p: {
  fullName: string;
  email: string;
  phone: string;
  clientType: string;
  projectType: string;
  province: string;
  message: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const filas: [string, string][] = [
    ["Nombre", p.fullName],
    ["Correo", p.email],
    ["Teléfono", p.phone],
    ["Tipo de cliente", p.clientType],
    ["Tipo de proyecto", p.projectType],
    ["Provincia", p.province],
  ];
  const html = `<div style="max-width:600px;margin:0 auto;font:400 15px/1.5 Arial,sans-serif;color:#1e1e1e;">
    <h2 style="color:#263a2c;margin:0 0 12px;">Nuevo mensaje de contacto — granaltocr.net</h2>
    <table style="width:100%;border-collapse:collapse;">
      ${filas
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 8px;color:#5b5b57;width:40%;">${esc(k)}</td><td style="padding:4px 8px;font-weight:700;">${esc(v || "—")}</td></tr>`,
        )
        .join("")}
    </table>
    <p style="margin:16px 0 4px;color:#5b5b57;">Mensaje:</p>
    <p style="white-space:pre-wrap;background:#faf9f6;border:1px solid #e6e3db;border-radius:4px;padding:12px;">${esc(p.message)}</p>
  </div>`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: p.email,
        subject: `Contacto web: ${p.fullName}`,
        html,
      }),
    });
    if (!res.ok) {
      console.error("[contacto] Resend respondió", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[contacto] Error enviando con Resend:", e);
    return false;
  }
}

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

  // 1) Correo por Resend al buzón de contacto.
  const correoOk = await enviarCorreoContacto(payload);

  // 2) Webhook opcional (CRM/automatización), si está configurado.
  let webhookOk: boolean | null = null;
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      webhookOk = res.ok;
      if (!res.ok) throw new Error(`Webhook respondió ${res.status}`);
    } catch (error) {
      console.error("[contacto] Error reenviando al webhook:", error);
      webhookOk = false;
    }
  }

  // Si no se pudo entregar por ningún canal configurado, avisar.
  if (!correoOk && webhookOk !== true) {
    if (!process.env.RESEND_API_KEY && !webhookUrl) {
      // Nada configurado aún: no perder la solicitud.
      console.info("[contacto] Solicitud recibida (sin canal configurado):", payload);
    } else {
      return NextResponse.json(
        { error: "No se pudo procesar la solicitud." },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
