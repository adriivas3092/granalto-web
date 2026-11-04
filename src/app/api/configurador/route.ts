import { NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/api/rate-limit";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { buildFicha } from "@/lib/configurador/ficha";
import { enviarNotificaciones } from "@/lib/configurador/email";
import { getDisponibilidad } from "@/lib/configurador/disponibilidad";
import { configuradorSchema, generarFolio } from "@/lib/configurador/schema";

/**
 * POST /api/configurador — registra una configuración de sobre (Documento 4).
 * Valida los datos, genera un folio único y (si hay Supabase service role)
 * intenta guardarlo. La integración con el flujo operativo es un entregable
 * posterior; aquí siempre devolvemos el folio para confirmar al cliente.
 */

const bodySchema = configuradorSchema;

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
  const d = parsed.data;

  // Disponibilidad actual (agotado/disponible) definida por el admin.
  const agotadoOverrides = await getDisponibilidad();

  // Ficha técnica: respaldo del cliente y paquete para los equipos internos.
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

  // Notificaciones: Dibujo (siempre) + Logística en copia si hay entrega a
  // domicilio + confirmación al cliente. Nunca bloquea la respuesta.
  const notif = await enviarNotificaciones({
    folio,
    secciones,
    esPersonalizado,
    entregaDomicilio,
    clienteCorreo: d.cliente.correo,
    clienteNombre: d.cliente.nombre,
  });

  // Persistencia opcional (no bloquea la confirmación al cliente).
  try {
    const supabase = createSupabaseServiceClient();
    if (supabase) {
      await supabase.from("configuraciones").insert({
        folio,
        payload: d,
        notificacion: notif,
        created_at: new Date().toISOString(),
      });
    }
  } catch {
    // Tabla ausente o error de guardado: se ignora; el folio ya fue generado.
  }

  return NextResponse.json({ folio, success: true });
}
