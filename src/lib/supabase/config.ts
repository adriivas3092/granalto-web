/**
 * Configuración pública de Supabase.
 * La URL y la llave publishable son de uso público (protegidas por RLS);
 * pueden ir embebidas. Se permiten override por variables de entorno.
 */
export const supabaseConfig = {
  url:
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    "https://cpskcszsbuytnuaelzte.supabase.co",
  anonKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "sb_publishable_DdpndITO1dVCbnYi1gps2A_mKt1tjUV",
};
