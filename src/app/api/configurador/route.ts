import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, clientIp } from "@/lib/api/rate-limit";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

/**
 * POST /api/configurador — registra una configuración de sobre (Documento 4).
 * Valida los datos, genera un folio único y (si hay Supabase service role)
 * intenta guardarlo. La integración con el flujo operativo es un entregable
 * posterior; aquí siempre devolvemos el folio para confirmar al cliente.
 */

const medidaSchema = z.object({
  largo: z.coerce.number().nonnegative(),
  prof: z.coerce.number().nonnegative(),
});

const bodySchema = z.object({
  geometriaId: z.string().min(1),
  materialId: z.string().nullable().optional(),
  colorId: z.string().nullable().optional(),
  medidas: z.record(z.string(), medidaSchema).optional(),
  moldura: z.boolean().nullable().optional(),
  salpicaderoTipo: z.enum(["no", "10", "custom"]).optional(),
  salpicaderoAlturaCm: z.coerce.number().nonnegative().optional(),
  personalizado: z.boolean().optional(),
  area: z.coerce.number().nonnegative().optional(),
  cliente: z.object({
    nombre: z.string().min(2),
    telefono: z.string().min(6),
    correo: z.string().email(),
    provincia: z.string().min(2),
    canton: z.string().min(2),
    direccion: z.string().optional().default(""),
    retiro: z.boolean().optional().default(false),
    acepta: z.literal(true, { message: "Debe aceptar los términos." }),
  }),
});

function generarFolio(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GRA-${ymd}-${rand}`;
}

export async function POST(req: Request) {
  if (!rateLimit(`configurador:${clientIp(req)}`, 20, 60_000)) {
    return NextResponse.json({ message: "Demasiadas solicitudes." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ message: "JSON inválido." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Datos incompletos o inválidos.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const folio = generarFolio();

  // Persistencia opcional (no bloquea la confirmación al cliente).
  try {
    const supabase = createSupabaseServiceClient();
    if (supabase) {
      await supabase.from("configuraciones").insert({
        folio,
        payload: parsed.data,
        created_at: new Date().toISOString(),
      });
    }
  } catch {
    // Tabla ausente o error de guardado: se ignora; el folio ya fue generado.
  }

  return NextResponse.json({ folio, success: true });
}
