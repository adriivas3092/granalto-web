import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfig } from "@/lib/supabase/config";

/**
 * Refresca la sesión de Supabase en cada request y protege /admin:
 * si no hay usuario autenticado, redirige a /admin/login.
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
  if (isAdmin && !isAdminLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  if (isAdminLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
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
