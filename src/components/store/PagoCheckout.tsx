"use client";

import { CreditCard, ShieldCheck, Headset } from "lucide-react";
import { formatPrice } from "@/lib/store/format";
import { GreenpayPago } from "@/components/store/GreenpayPago";

type ItemLite = { id: string; product_name: string; quantity: number; line_total: number };
type OrderLite = { id: string; total: number; currency: string; items: ItemLite[] };

/**
 * Página de pago. Si la pasarela (GreenPay) está configurada, muestra el
 * formulario de tarjeta con 3D Secure; si no, ofrece coordinar con un asesor.
 */
export function PagoCheckout({
  order,
  metodo,
}: {
  order: OrderLite;
  metodo: "greenpay" | "coordinar";
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      {/* Columna de pago */}
      <div>
        {metodo === "greenpay" ? (
          <GreenpayPago order={{ id: order.id, total: order.total, currency: order.currency }} />
        ) : (
          <div className="rounded-sm border border-stone-beige bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-mineral">
              <ShieldCheck className="h-4 w-4 text-ink" /> Pago seguro
            </div>
            <h2 className="mt-2 font-serif text-2xl text-ink">Coordiná tu pago</h2>
            <div className="mt-6 rounded-sm border border-stone-beige bg-ivory/40 p-5">
              <div className="flex items-start gap-4">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-ink text-ivory">
                  <Headset className="h-5 w-5" />
                </span>
                <div className="flex-1 text-sm text-charcoal/80">
                  <p className="font-medium text-ink">Un asesor te contacta para el pago</p>
                  <p className="mt-1 text-xs leading-relaxed text-mineral">
                    Tu pedido quedó registrado. En breve te contactamos para coordinar el pago y la
                    entrega. También podés escribirnos por WhatsApp con el número de pedido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resumen del pedido */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-sm border border-stone-beige bg-white p-6">
          <h3 className="font-serif text-lg text-ink">Tu pedido</h3>
          <p className="text-xs text-mineral">#{order.id.slice(0, 8).toUpperCase()}</p>
          <ul className="mt-4 space-y-3 border-t border-stone-beige/70 pt-4">
            {order.items.map((it) => (
              <li key={it.id} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-charcoal/85">
                  {it.product_name}
                  <span className="text-mineral"> × {it.quantity}</span>
                </span>
                <span className="shrink-0 font-medium text-ink">
                  {formatPrice(it.line_total, order.currency)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-stone-beige pt-4">
            <span className="text-sm text-mineral">Total a pagar</span>
            <span className="text-xl font-bold text-ink">{formatPrice(order.total, order.currency)}</span>
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-mineral">
            <CreditCard className="h-3.5 w-3.5" /> Pago protegido con cifrado SSL
          </p>
        </div>
      </aside>
    </div>
  );
}
