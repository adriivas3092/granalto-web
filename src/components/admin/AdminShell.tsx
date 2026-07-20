import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/admin/actions";

/** Marco del panel de administración (barra superior + contenido). */
export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh bg-ivory">
      <header className="border-b border-stone-beige bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="font-serif text-lg uppercase tracking-[0.1em] text-ink">
              Granalto · Admin
            </Link>
            <Link href="/tienda" className="text-sm text-mineral hover:text-ink">
              Ver tienda ↗
            </Link>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-sm border border-stone-beige px-3 py-1.5 text-sm text-charcoal hover:border-ink"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
