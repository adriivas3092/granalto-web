import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Garantiza que el usuario actual esté autenticado y sea administrador.
 * Si no, redirige al login. Devuelve el usuario para uso opcional.
 */
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  // Usuario autenticado pero sin permisos de admin: enviamos a una página
  // dentro de /admin (no a /login) para evitar el bucle de redirección con
  // el middleware, que devuelve /admin/login → /admin cuando hay sesión.
  if (!data) redirect("/admin/no-autorizado");
  return user;
}
