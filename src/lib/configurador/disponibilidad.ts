import { createSupabaseServerClient } from "@/lib/supabase/server";
import { claveDisponibilidad } from "@/data/configurador";

export type DisponibilidadMap = Record<string, boolean>;

/**
 * Lee la disponibilidad de materiales desde Supabase (tabla
 * material_disponibilidad). Devuelve un mapa { "material:color": agotado }.
 * Si la tabla no existe o hay error, devuelve {} y el cotizador usa el
 * valor del catálogo como respaldo.
 */
export async function getDisponibilidad(): Promise<DisponibilidadMap> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("material_disponibilidad")
      .select("material_id, color_id, agotado");
    if (error || !data) return {};
    const map: DisponibilidadMap = {};
    for (const r of data as { material_id: string; color_id: string; agotado: boolean }[]) {
      map[claveDisponibilidad(r.material_id, r.color_id)] = !!r.agotado;
    }
    return map;
  } catch {
    return {};
  }
}
