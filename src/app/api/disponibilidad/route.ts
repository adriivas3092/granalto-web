import { NextResponse } from "next/server";
import { getDisponibilidad } from "@/lib/configurador/disponibilidad";

/**
 * GET /api/disponibilidad — disponibilidad actual de materiales/colores del
 * cotizador (mapa { "material:color": agotado }). Siempre sin caché: lo
 * consume el cotizador para reflejar en tiempo real los cambios que hace el
 * admin en /admin/materiales.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const disponibilidad = await getDisponibilidad();
  return NextResponse.json(
    { disponibilidad },
    { headers: { "Cache-Control": "no-store, max-age=0, must-revalidate" } },
  );
}
