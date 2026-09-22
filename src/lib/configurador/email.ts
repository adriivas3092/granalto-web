import type { FichaSeccion } from "@/lib/configurador/ficha";

/**
 * Notificaciones del cotizador hacia los equipos internos y el cliente.
 *
 * - DIBUJO recibe SIEMPRE la solicitud (valida disponibilidad de material,
 *   medidas y lleva el control).
 * - LOGÍSTICA queda en copia cuando la modalidad es entrega a domicilio.
 * - El CLIENTE recibe una confirmación (respaldo) con la ficha completa.
 *
 * Envío por Resend (HTTP, sin dependencias). Requiere RESEND_API_KEY y un
 * remitente verificado (CONFIGURADOR_FROM). Sin API key, cae a un webhook
 * (CONFIGURADOR_WEBHOOK_URL) si existe, y siempre registra en consola. Nunca
 * lanza: un fallo de correo no debe romper el registro del pedido.
 */

const FROM = process.env.CONFIGURADOR_FROM || "Granalto <pedidos@granalto.net>";
const DIBUJO = process.env.DIBUJO_EMAIL || "dibujo@granalto.net";
const LOGISTICA = process.env.LOGISTICA_EMAIL || "logistica@granalto.net";
const VENTAS = process.env.VENTAS_EMAIL || "info@granalto.net";

function esc(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] as string);
}

function fichaHtml(secciones: FichaSeccion[], titulo: string): string {
  const bloques = secciones
    .map(
      (sec) => `
      <tr><td style="padding:16px 0 6px;font:600 13px/1.4 Arial,sans-serif;color:#263a2c;text-transform:uppercase;letter-spacing:.06em;">${esc(sec.titulo)}</td></tr>
      ${sec.filas
        .map(
          (f) => `<tr>
            <td style="padding:4px 0;font:400 14px/1.5 Arial,sans-serif;color:#5b5b57;width:45%;">${esc(f.label)}</td>
            <td style="padding:4px 0;font:600 14px/1.5 Arial,sans-serif;color:#1e1e1e;">${esc(f.value)}</td>
          </tr>`,
        )
        .join("")}`,
    )
    .join("");
  return `<div style="max-width:640px;margin:0 auto;padding:24px;background:#faf9f6;">
    <h1 style="font:700 20px/1.3 Arial,sans-serif;color:#263a2c;margin:0 0 4px;">GRANALTO</h1>
    <p style="font:400 15px/1.4 Arial,sans-serif;color:#1e1e1e;margin:0 0 16px;">${esc(titulo)}</p>
    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e6e3db;border-radius:4px;padding:0 16px;">
      <tbody>${bloques}</tbody>
    </table>
    <p style="font:400 12px/1.5 Arial,sans-serif;color:#8a8a86;margin:16px 0 0;">
      Las medidas están sujetas a validación técnica. Este mensaje se generó automáticamente desde el cotizador de granalto.net.
    </p>
  </div>`;
}

async function resendSend(opts: {
  to: string[];
  cc?: string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: opts.to,
        cc: opts.cc && opts.cc.length ? opts.cc : undefined,
        subject: opts.subject,
        html: opts.html,
        reply_to: opts.replyTo,
      }),
    });
    if (!res.ok) {
      console.error("[configurador] Resend respondió", res.status, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error("[configurador] Error enviando con Resend:", e);
    return false;
  }
}

export async function enviarNotificaciones(params: {
  folio: string;
  secciones: FichaSeccion[];
  esPersonalizado: boolean;
  entregaDomicilio: boolean;
  clienteCorreo: string;
  clienteNombre: string;
}): Promise<{ interno: boolean; cliente: boolean; canal: "resend" | "webhook" | "ninguno" }> {
  const tipo = params.esPersonalizado ? "Cotización personalizada" : "Pedido";
  const asuntoInterno = `${tipo} ${params.folio}${params.entregaDomicilio ? " · Entrega a domicilio" : " · Retiro"}`;

  // Copia a Logística solo si hay que gestionar entrega.
  const cc = [VENTAS, ...(params.entregaDomicilio ? [LOGISTICA] : [])];

  let interno = false;
  let cliente = false;
  let canal: "resend" | "webhook" | "ninguno" = "ninguno";

  // 1) Correo interno a Dibujo (+ Logística en copia si aplica).
  interno = await resendSend({
    to: [DIBUJO],
    cc,
    subject: `Granalto · ${asuntoInterno}`,
    html: fichaHtml(
      params.secciones,
      `Nueva solicitud desde el cotizador. Dibujo: validar disponibilidad de material y medidas.${
        params.entregaDomicilio ? " Logística en copia para gestionar la entrega." : ""
      }`,
    ),
    replyTo: params.clienteCorreo,
  });

  // 2) Confirmación (respaldo) al cliente.
  if (params.clienteCorreo) {
    cliente = await resendSend({
      to: [params.clienteCorreo],
      subject: `Tu solicitud ${params.folio} — Granalto`,
      html: fichaHtml(
        params.secciones,
        `Hola ${params.clienteNombre}, recibimos tu solicitud. Este es tu respaldo; un asesor te contactará para confirmar los detalles.`,
      ),
    });
  }

  if (interno || cliente) canal = "resend";

  // Fallback: webhook (si no hay Resend o falló), para no perder la solicitud.
  if (canal === "ninguno") {
    const webhook = process.env.CONFIGURADOR_WEBHOOK_URL;
    if (webhook) {
      try {
        const res = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            folio: params.folio,
            tipo,
            entregaDomicilio: params.entregaDomicilio,
            destinatarios: { dibujo: DIBUJO, copia: cc },
            secciones: params.secciones,
          }),
        });
        if (res.ok) canal = "webhook";
      } catch (e) {
        console.error("[configurador] Error en webhook de respaldo:", e);
      }
    }
    if (canal === "ninguno") {
      console.info("[configurador] Notificación no enviada (sin RESEND_API_KEY ni webhook). Folio:", params.folio);
    }
  }

  return { interno, cliente, canal };
}
