import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAllOrders } from "@/lib/store/admin";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/store";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Pedidos", robots: { index: false } };

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

      <OrdersTable key={estado ?? "todos"} orders={orders} />
    </AdminShell>
  );
}
