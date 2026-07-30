import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase/config";

/**
 * Cliente de Supabase con permisos de SERVICIO (service_role).
 * SOLO debe usarse en el servidor (rutas API / acciones), NUNCA en el cliente,
 * porque la llave omite las políticas RLS.
 *
 * Requiere la variable de entorno SUPABASE_SERVICE_ROLE_KEY.
 * Devuelve null si no está configurada (para responder con un error claro).
 */
export function createSupabaseServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createClient(supabaseConfig.url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
