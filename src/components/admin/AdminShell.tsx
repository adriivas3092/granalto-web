import Link from "next/link";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminBack } from "@/components/admin/AdminBack";

/** Marco del panel de administración (barra superior + contenido). */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-ivory">
      <header className="sticky top-0 z-20 border-b border-stone-beige bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <Link
            href="/admin"
            className="font-serif text-lg uppercase tracking-[0.1em] text-ink"
          >
            Granalto <span className="text-mineral">· Admin</span>
          </Link>
          <div className="order-3 w-full sm:order-2 sm:w-auto sm:flex-1 sm:px-4">
            <AdminNav />
          </div>
          <div className="order-2 flex items-center gap-3 sm:order-3">
            <Link href="/tienda" className="hidden text-sm text-mineral hover:text-ink sm:inline">
              Ver tienda ↗
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-sm border border-stone-beige px-3 py-1.5 text-sm text-charcoal hover:border-ink"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <AdminBack />
        {children}
      </main>
    </div>
  );
}
