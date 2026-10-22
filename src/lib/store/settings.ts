import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Ajustes generales (interruptores del admin), guardados en app_settings.
 * Si la tabla/fila no existe, se usa el valor por defecto.
 */
export const STOCK_ALERTA_KEY = "stock_alerta_activa";

/** ¿Está activa la alerta + bloqueo automático por stock? (por defecto: sí). */
export async function getStockAlertaActiva(): Promise<boolean> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from("app_settings")
      .select("valor")
      .eq("clave", STOCK_ALERTA_KEY)
      .maybeSingle();
    if (!data) return true; // por defecto activada
    return !!data.valor;
  } catch {
    return true;
  }
}
