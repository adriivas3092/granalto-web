import Link from "next/link";
import { Package } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAllOrders } from "@/lib/store/admin";
import { formatPrice } from "@/lib/store/format";
import { OrderStatusBadge } from "@/components/store/OrderStatusBadge";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/store";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Pedidos", robots: { index: false } };

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  await requireAdmin();
  const { estado } = await searchParams;
  const orders = await getAllOrders(estado);
  const statuses = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

  return (
    <AdminShell>
      <div>
        <h1 className="font-sans text-2xl font-bold text-ink">Pedidos</h1>
        <p className="text-sm text-charcoal/70">{orders.length} pedido(s)</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/admin/pedidos"
          className={cn(
            "rounded-sm border px-3 py-1.5 text-sm",
            !estado ? "border-ink bg-ink text-ivory" : "border-stone-beige text-charcoal hover:border-mineral",
          )}
        >
          Todos
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/pedidos?estado=${s}`}
            className={cn(
              "rounded-sm border px-3 py-1.5 text-sm",
              estado === s ? "border-ink bg-ink text-ivory" : "border-stone-beige text-charcoal hover:border-mineral",
            )}
          >
            {ORDER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-stone-beige bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-stone-beige text-left text-xs uppercase tracking-wide text-mineral">
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-stone-beige/60 last:border-0 hover:bg-ivory/60">
                <td className="px-4 py-3">
                  <Link href={`/admin/pedidos/${o.id}`} className="font-mono text-ink hover:underline">
                    #{o.id.slice(0, 8).toUpperCase()}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="text-ink">{o.customer_name || "—"}</span>
                  <span className="block text-xs text-mineral">{o.customer_email}</span>
                </td>
                <td className="px-4 py-3 text-charcoal">{fmtDate(o.created_at)}</td>
                <td className="px-4 py-3 font-medium text-ink">{formatPrice(o.total, o.currency)}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={o.status as OrderStatus} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-mineral">
                  <Package aria-hidden="true" className="mx-auto mb-2 h-7 w-7" />
                  Aún no hay pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
