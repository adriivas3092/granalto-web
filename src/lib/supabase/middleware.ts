import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfig } from "@/lib/supabase/config";

/**
 * Refresca la sesión de Supabase en cada request y protege /admin:
 * sin sesión redirige a /admin/login, y una sesión que no sea de
 * administrador (cliente de la tienda) no puede entrar al panel.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // --- Panel de administración ---
  const isAdmin = path.startsWith("/admin");
  const isAdminLogin = path === "/admin/login";
  // Páginas de acceso público dentro de /admin (login y recuperación de clave).
  // La recuperación no puede exigir sesión: el usuario llega sin estar logueado.
  const isAdminPublic = isAdminLogin || path === "/admin/reset";
  if (isAdmin && !isAdminPublic && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  // El panel es exclusivo de administradores. Una sesión de CLIENTE (cuenta de
  // la tienda) no da acceso: se la trata como si no hubiera sesión de admin.
  if (isAdmin && user) {
    const { data: adminRow } = await supabase
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    const esAdmin = Boolean(adminRow);
    if (isAdminLogin && esAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    if (!esAdmin && !isAdminPublic) {
      // Cliente intentando entrar al panel: se lo devuelve a su cuenta, sin
      // mostrar nada del panel.
      const url = request.nextUrl.clone();
      url.pathname = "/cuenta";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // --- Cuenta de clientes / checkout ---
  const isAccountAuth = path === "/cuenta/login" || path === "/cuenta/registro";
  const needsCustomer = path.startsWith("/cuenta") || path.startsWith("/checkout");
  if (needsCustomer && !isAccountAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/cuenta/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }
  if (isAccountAuth && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/cuenta";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
