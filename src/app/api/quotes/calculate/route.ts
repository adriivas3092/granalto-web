import { NextResponse } from "next/server";
import { calculateRequestSchema } from "@/lib/validations/quote-schemas";
import { getProductsByIds } from "@/lib/api/product-service";
import { calculateQuote } from "@/lib/quote-engine/calculate-quote";
import { rateLimit, clientIp } from "@/lib/api/rate-limit";

/**
 * POST /api/quotes/calculate — recalcula la cotización en el SERVIDOR.
 * Nunca confía en precios enviados por el cliente: reobtiene los productos
 * (con sus tarifas) desde el catálogo del servidor.
 */
export async function POST(req: Request) {
  if (!rateLimit(`calc:${clientIp(req)}`, 30)) {
    return NextResponse.json({ success: false, message: "Demasiadas solicitudes. Intentá en un momento." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Solicitud inválida." }, { status: 400 });
  }

  const parsed = calculateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Datos incompletos.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const products = await getProductsByIds(parsed.data.productIds);
    if (products.length === 0) {
      return NextResponse.json({ success: false, message: "No se encontraron los materiales." }, { status: 404 });
    }
    const pieces = parsed.data.pieces.map((p) => ({ ...p, id: p.id ?? crypto.randomUUID() }));
    const estimates = calculateQuote({ products, pieces, configuration: parsed.data.configuration });
    return NextResponse.json({ success: true, estimates });
  } catch {
    return NextResponse.json({ success: false, message: "No se pudo calcular la cotización." }, { status: 500 });
  }
}
