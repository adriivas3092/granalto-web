"use client";

import { useFormStatus } from "react-dom";
import { CreditCard, ShieldCheck, Lock, Loader2, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/store/format";
import { iniciarPagoBN } from "@/app/checkout/actions";

type ItemLite = { id: string; product_name: string; quantity: number; line_total: number };
type OrderLite = { id: string; total: number; currency: string; items: ItemLite[] };

function SubmitButton({ total, currency }: { total: number; currency: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-charcoal disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Redirigiendo al pago seguro…
        </>
      ) : (
        <>
          <Lock className="h-4 w-4" /> Pagar {formatPrice(total, currency)}
          <ChevronRight className="h-4 w-4 -translate-x-1 opacity-70 transition-transform group-hover:translate-x-0" />
        </>
      )}
    </button>
  );
}

/** Página de pago: diseño propio; el cobro se procesa en la página segura del BN. */
export function PagoCheckout({ order }: { order: OrderLite }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      {/* Columna de pago */}
      <div>
        <div className="rounded-sm border border-stone-beige bg-white p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-mineral">
            <ShieldCheck className="h-4 w-4 text-ink" /> Pago seguro
          </div>
          <h2 className="mt-2 font-serif text-2xl text-ink">Elegí cómo pagar</h2>

          {/* Método: tarjeta (Banco Nacional) */}
          <div className="mt-6 rounded-sm border-2 border-ink bg-ivory/40 p-5">
            <div className="flex items-start gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-ink text-ivory">
                <CreditCard className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-medium text-ink">Tarjeta de crédito o débito</p>
                <p className="mt-0.5 text-sm text-charcoal/75">
                  Visa, Mastercard y más. Procesado por <strong>Banco Nacional</strong>.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-mineral">
                  Al continuar, te llevamos a la <strong>página segura del Banco Nacional</strong> para completar el
                  pago. Tus datos de tarjeta se ingresan ahí y <strong>nunca pasan por nuestro sitio</strong>.
                </p>
              </div>
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-ink">
                <span className="h-2.5 w-2.5 rounded-full bg-ink" />
              </span>
            </div>
          </div>

          <form action={iniciarPagoBN.bind(null, order.id)} className="mt-6">
            <SubmitButton total={order.total} currency={order.currency} />
          </form>

          {/* Sellos de confianza */}
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-mineral">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Conexión cifrada (SSL)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> No almacenamos tu tarjeta
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5" /> Procesado por Banco Nacional
            </span>
          </div>
        </div>
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
                <span className="shrink-0 font-medium text-ink">{formatPrice(it.line_total, order.currency)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-stone-beige pt-4">
            <span className="text-sm text-mineral">Total a pagar</span>
            <span className="text-xl font-bold text-ink">{formatPrice(order.total, order.currency)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
