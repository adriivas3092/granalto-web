import Link from "next/link";
import { COMPRA_EN_LINEA } from "@/config/tienda";
import { notFound, redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { getSessionUser, getMyOrderById } from "@/lib/store/account";
import { formatPrice } from "@/lib/store/format";
import { OrderStatusBadge } from "@/components/store/OrderStatusBadge";
import type { OrderStatus } from "@/types/store";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata({
  title: "Detalle de pedido",
  description: "Detalle de tu pedido en Granalto.",
  path: "/cuenta/pedidos",
  noIndex: true,
});

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("es-CR", {
    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/cuenta/login");
  const { id } = await params;
  const order = await getMyOrderById(id);
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-28 sm:px-6 lg:pt-36">
      <Link href="/cuenta" className="text-sm text-mineral hover:text-ink">← Mis pedidos</Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl">Pedido #{order.id.slice(0, 8).toUpperCase()}</h1>
        <OrderStatusBadge status={order.status as OrderStatus} />
      </div>
      <p className="mt-2 text-sm text-mineral">{fmtDate(order.created_at)}</p>

      {/* Pendiente de pago → el cliente puede pagar ahora */}
      {COMPRA_EN_LINEA && order.status === "pendiente" && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-ink/30 bg-ivory/60 p-5">
          <div>
            <p className="font-medium text-ink">Tu pedido está pendiente de pago</p>
            <p className="mt-0.5 text-sm text-charcoal/75">Completá el pago para que procesemos tu pedido.</p>
          </div>
          <Link
            href={`/checkout/pago?pedido=${order.id}`}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal"
          >
            <Lock className="h-4 w-4" /> Pagar ahora · {formatPrice(order.total, order.currency)}
          </Link>
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-sm border border-stone-beige bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-beige text-left text-xs uppercase tracking-wide text-mineral">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Cant.</th>
              <th className="px-4 py-3 text-right font-medium">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((it) => (
              <tr key={it.id} className="border-b border-stone-beige/60 last:border-0">
                <td className="px-4 py-3">
                  {it.product_slug ? (
                    <Link href={`/tienda/${it.product_slug}`} className="text-ink hover:underline">
                      {it.product_name}
                    </Link>
                  ) : (
                    <span className="text-ink">{it.product_name}</span>
                  )}
                  <span className="ml-2 text-xs text-mineral">{formatPrice(it.unit_price, order.currency)} c/u</span>
                </td>
                <td className="px-4 py-3 text-charcoal">{it.quantity}</td>
                <td className="px-4 py-3 text-right text-ink">{formatPrice(it.line_total, order.currency)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-stone-beige">
              <td colSpan={2} className="px-4 py-3 text-right font-medium text-charcoal">Total</td>
              <td className="px-4 py-3 text-right text-base font-bold text-ink">
                {formatPrice(order.total, order.currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-sm border border-stone-beige bg-white p-5 text-sm">
          <h2 className="mb-2 font-sans font-bold text-ink">Datos de entrega</h2>
          <p className="text-charcoal">{order.customer_name}</p>
          <p className="text-charcoal">{order.customer_email}</p>
          {order.customer_phone && <p className="text-charcoal">{order.customer_phone}</p>}
          {order.shipping_address && <p className="mt-2 text-charcoal">{order.shipping_address}</p>}
        </div>
        {order.notes && (
          <div className="rounded-sm border border-stone-beige bg-white p-5 text-sm">
            <h2 className="mb-2 font-sans font-bold text-ink">Notas</h2>
            <p className="text-charcoal">{order.notes}</p>
          </div>
        )}
      </div>

      <p className="mt-6 text-xs text-mineral">
        {order.status === "pendiente"
          ? "El pago se procesa de forma segura. Si preferís coordinar el pago por otro medio, escribinos por WhatsApp."
          : "Gracias por tu compra. Ante cualquier consulta sobre tu pedido, escribinos."}
      </p>
    </div>
  );
}
