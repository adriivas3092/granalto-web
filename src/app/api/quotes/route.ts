import { NextResponse } from "next/server";
import { submissionSchema } from "@/lib/validations/quote-schemas";
import { getProductsByIds } from "@/lib/api/product-service";
import { calculateQuote } from "@/lib/quote-engine/calculate-quote";
import { rateLimit, clientIp } from "@/lib/api/rate-limit";

/** Genera un identificador legible: GRA-2026-000123. */
function generateQuoteId(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 900000 + 100000);
  return `GRA-${year}-${seq}`;
}

/**
 * POST /api/quotes — registra la solicitud de cotización.
 * Revalida datos con Zod y RECALCULA los totales en el servidor (nunca confía
 * en los valores del cliente).
 */
export async function POST(req: Request) {
  if (!rateLimit(`quote:${clientIp(req)}`, 6)) {
    return NextResponse.json({ success: false, message: "Demasiadas solicitudes. Intentá más tarde." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Solicitud inválida." }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Revisá los campos señalados.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;

  try {
    // Fuente de verdad: recalcular en servidor con las tarifas reales.
    const products = await getProductsByIds(data.productIds);
    if (products.length === 0) {
      return NextResponse.json({ success: false, message: "No se encontraron los materiales." }, { status: 404 });
    }
    const pieces = data.pieces.map((p) => ({ ...p, id: p.id ?? crypto.randomUUID() }));
    const estimates = calculateQuote({ products, pieces, configuration: data.configuration });

    const quoteId = generateQuoteId();
    const record = {
      quoteId,
      source: data.source,
      project: data.project,
      selectedProducts: products,
      pieces: data.pieces,
      configuration: data.configuration,
      calculations: estimates,
      selectedOptionId: data.selectedOptionId,
      customer: data.customer,
      consent: data.consent,
      createdAt: new Date().toISOString(),
    };

    // 🔌 PENDIENTE_GRANALTO: persistir y notificar.
    //   1) Guardar en base de datos / CRM (p. ej. Supabase, HubSpot, Kommo).
    //   2) Enviar correo de confirmación al cliente (CONTACT_EMAIL / servicio SMTP).
    //   3) Notificar al equipo de Granalto.
    // Si QUOTE_WEBHOOK_URL está configurado, se reenvía el lead a ese endpoint.
    const webhook = process.env.QUOTE_WEBHOOK_URL;
    if (webhook) {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      }).catch(() => {
        /* no bloquear la respuesta al usuario si el webhook falla */
      });
    } else if (process.env.NODE_ENV !== "production") {
      console.info("[quote] nueva solicitud (mock persistence):", quoteId);
    }

    return NextResponse.json({
      success: true,
      quoteId,
      estimates,
      message: "Cotización registrada correctamente",
    });
  } catch {
    return NextResponse.json({ success: false, message: "No se pudo registrar la cotización." }, { status: 500 });
  }
}
