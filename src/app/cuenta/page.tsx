import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, ShoppingBag } from "lucide-react";
import { getSessionUser, getMyProfile, getMyOrders } from "@/lib/store/account";
import { formatPrice } from "@/lib/store/format";
import { OrderStatusBadge } from "@/components/store/OrderStatusBadge";
import { signOutCustomer } from "@/app/cuenta/actions";
import type { OrderStatus } from "@/types/store";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata({
  title: "Mi cuenta",
  description: "Gestiona tu cuenta y revisa tus pedidos en Granalto.",
  path: "/cuenta",
  noIndex: true,
});

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function CuentaPage() {
  const user = await getSessionUser();
  if (!user) redirect("/cuenta/login");
  const [profile, orders] = await Promise.all([getMyProfile(), getMyOrders()]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:pt-36">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl">Mi cuenta</h1>
          <p className="mt-2 text-sm text-charcoal/80">
            {profile?.full_name ? `${profile.full_name} · ` : ""}
            {user.email}
          </p>
        </div>
        <form action={signOutCustomer}>
          <button
            type="submit"
            className="rounded-sm border border-stone-beige px-4 py-2 text-sm text-charcoal hover:border-ink"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-sm border border-stone-beige bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-mineral">Pedidos</p>
          <p className="mt-1 text-2xl font-bold text-ink">{orders.length}</p>
        </div>
        <div className="rounded-sm border border-stone-beige bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-mineral">Teléfono</p>
          <p className="mt-1 text-sm text-ink">{profile?.phone ?? "—"}</p>
        </div>
        <div className="rounded-sm border border-stone-beige bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-mineral">Dirección</p>
          <p className="mt-1 line-clamp-2 text-sm text-ink">{profile?.address ?? "—"}</p>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-sans text-xl font-bold text-ink">Mis pedidos</h2>
        <Link href="/tienda" className="inline-flex items-center gap-1 text-sm text-mineral hover:text-ink">
          <ShoppingBag aria-hidden="true" className="h-4 w-4" /> Ir a la tienda
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="mt-4 rounded-sm border border-stone-beige bg-white p-10 text-center">
          <Package aria-hidden="true" className="mx-auto h-8 w-8 text-mineral" />
          <p className="mt-3 text-charcoal">Aún no tienes pedidos.</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/cuenta/pedidos/${o.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-stone-beige bg-white p-4 transition-colors hover:border-mineral"
              >
                <div>
                  <span className="font-mono text-sm text-ink">#{o.id.slice(0, 8).toUpperCase()}</span>
                  <span className="ml-3 text-sm text-mineral">{fmtDate(o.created_at)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={o.status as OrderStatus} />
                  <span className="text-sm font-semibold text-ink">{formatPrice(o.total, o.currency)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
