import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getOrderById } from "@/lib/store/admin";
import { formatPrice } from "@/lib/store/format";
import { OrderStatusBadge } from "@/components/store/OrderStatusBadge";
import { updateOrderStatus, updateOrderDetails, deleteOrder } from "@/app/admin/actions";
import { DeleteWithConfirm } from "@/components/admin/DeleteWithConfirm";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Detalle de pedido", robots: { index: false } };

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("es-CR", {
    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const action = updateOrderStatus.bind(null, id);
  const editAction = updateOrderDetails.bind(null, id);
  const del = deleteOrder.bind(null, id);
  const statuses = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];
  const inputCls =
    "w-full rounded-sm border border-stone-beige bg-white px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none";

  return (
    <AdminShell>
      <Link href="/admin/pedidos" className="text-sm text-mineral hover:text-ink">← Pedidos</Link>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-sans text-2xl font-bold text-ink">
          Pedido #{order.id.slice(0, 8).toUpperCase()}
        </h1>
        <OrderStatusBadge status={order.status as OrderStatus} />
      </div>
      <p className="mt-1 text-sm text-mineral">{fmtDate(order.created_at)}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div className="overflow-x-auto rounded-sm border border-stone-beige bg-white">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-stone-beige text-left text-xs uppercase tracking-wide text-mineral">
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Cant.</th>
                <th className="px-4 py-3 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((it) => (
                <tr key={it.id} className="border-b border-stone-beige/60 last:border-0">
                  <td className="px-4 py-3 text-ink">{it.product_name}</td>
                  <td className="px-4 py-3 text-charcoal">{formatPrice(it.unit_price, order.currency)}</td>
                  <td className="px-4 py-3 text-charcoal">{it.quantity}</td>
                  <td className="px-4 py-3 text-right text-ink">{formatPrice(it.line_total, order.currency)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-stone-beige">
                <td colSpan={3} className="px-4 py-3 text-right font-medium text-charcoal">Total</td>
                <td className="px-4 py-3 text-right text-base font-bold text-ink">
                  {formatPrice(order.total, order.currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="space-y-6">
          <div className="rounded-sm border border-stone-beige bg-white p-5">
            <h2 className="mb-3 font-sans font-bold text-ink">Cambiar estado</h2>
            <form action={action} className="space-y-3">
              <select
                name="status"
                defaultValue={order.status}
                className="w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                ))}
              </select>
              <button
                type="submit"
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal"
              >
                Guardar estado
              </button>
            </form>
          </div>

          <div className="rounded-sm border border-stone-beige bg-white p-5">
            <h2 className="mb-3 font-sans font-bold text-ink">Modificar pedido</h2>
            <form action={editAction} className="space-y-3 text-sm">
              <label className="block">
                <span className="mb-1 block text-xs text-charcoal/80">Nombre</span>
                <input name="customer_name" defaultValue={order.customer_name ?? ""} className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-charcoal/80">Correo</span>
                <input name="customer_email" defaultValue={order.customer_email ?? ""} className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-charcoal/80">Teléfono</span>
                <input name="customer_phone" defaultValue={order.customer_phone ?? ""} className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-charcoal/80">Dirección</span>
                <textarea name="shipping_address" defaultValue={order.shipping_address ?? ""} rows={2} className={inputCls} />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs text-charcoal/80">Notas</span>
                <textarea name="notes" defaultValue={order.notes ?? ""} rows={2} className={inputCls} />
              </label>
              <button
                type="submit"
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-sm border border-ink px-5 py-2.5 text-sm font-medium text-ink hover:bg-ink hover:text-ivory"
              >
                Guardar cambios
              </button>
            </form>
          </div>

          <div className="rounded-sm border border-stone-beige bg-white p-5">
            <h2 className="mb-3 font-sans font-bold text-ink">Eliminar pedido</h2>
            <p className="mb-3 text-xs text-charcoal/70">
              Se elimina el pedido y su detalle de forma permanente.
            </p>
            <DeleteWithConfirm
              action={del}
              label="Eliminar pedido"
              confirmText={`¿Eliminar el pedido #${order.id.slice(0, 8).toUpperCase()}? Esta acción no se puede deshacer.`}
            />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
