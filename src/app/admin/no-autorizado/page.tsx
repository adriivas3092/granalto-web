import { signOut } from "@/app/admin/actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Acceso no autorizado", robots: { index: false } };

export default function NoAutorizadoPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-ivory px-4">
      <div className="w-full max-w-md rounded-sm border border-stone-beige bg-white p-8 text-center">
        <h1 className="font-sans text-xl font-bold text-ink">Acceso no autorizado</h1>
        <p className="mt-3 text-sm text-charcoal/80">
          Tu cuenta inició sesión correctamente, pero no está habilitada como
          administrador. Pide que agreguen tu usuario a la lista de administradores
          y vuelve a iniciar sesión.
        </p>
        <form action={signOut} className="mt-6">
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}
