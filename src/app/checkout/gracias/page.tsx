import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getMyOrderById } from "@/lib/store/account";
import { formatPrice } from "@/lib/store/format";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata({
  title: "Pedido confirmado",
  description: "Gracias por tu pedido en Granalto.",
  path: "/checkout/gracias",
  noIndex: true,
});

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string }>;
}) {
  const { pedido } = await searchParams;
  const order = pedido ? await getMyOrderById(pedido) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-32 text-center sm:px-6 lg:pt-40">
      <CheckCircle2 aria-hidden="true" className="mx-auto h-14 w-14 text-ink" />
      <h1 className="mt-5 text-3xl md:text-4xl">¡Pedido confirmado!</h1>
      <p className="mt-4 text-charcoal/85">
        Gracias por tu compra. Registramos tu pedido y te contactaremos para
        coordinar el pago y la entrega.
      </p>

      {order && (
        <div className="mt-8 rounded-sm border border-stone-beige bg-white p-6 text-left">
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <span className="text-mineral">Pedido</span>
            <span className="font-mono text-ink">#{order.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-mineral">Total</span>
            <span className="font-semibold text-ink">{formatPrice(order.total, order.currency)}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/cuenta"
          className="inline-flex min-h-[44px] items-center rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal"
        >
          Ver mis pedidos
        </Link>
        <Link
          href="/tienda"
          className="inline-flex min-h-[44px] items-center rounded-sm border border-stone-beige px-6 py-3 text-sm font-medium text-charcoal hover:border-ink"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
