/**
 * Configuración pública de Supabase.
 * La URL y la llave publishable son de uso público (protegidas por RLS);
 * pueden ir embebidas. Se permiten override por variables de entorno.
 */
export const supabaseConfig = {
  url:
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    "https://hzwzjykaxnswaypoxajt.supabase.co",
  anonKey:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6d3pqeWtheG5zd2F5cG94YWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ1NzQ5NjYsImV4cCI6MjEwMDE1MDk2Nn0.vYqLJS69IdUYYzfwzO9RgTS4rd7kqYgMSlmWhU2IMjE",
};
