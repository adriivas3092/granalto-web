import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PagoCheckout } from "@/components/store/PagoCheckout";
import { getMyOrderById } from "@/lib/store/account";
import { greenpayConfigurado } from "@/lib/pago/greenpay";
import { buildMetadata } from "@/lib/metadata";

export const dynamic = "force-dynamic";
export const metadata = buildMetadata({
  title: "Pago seguro",
  description: "Completá el pago de tu pedido de forma segura.",
  path: "/checkout/pago",
  noIndex: true,
});

export default async function PagoPage({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string }>;
}) {
  const { pedido } = await searchParams;
  const order = pedido ? await getMyOrderById(pedido) : null;

  if (!order) redirect("/carrito");
  if (order.status !== "pendiente") redirect(`/checkout/gracias?pedido=${order.id}`);

  const metodo = greenpayConfigurado() ? "greenpay" : "coordinar";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:pt-36">
      <Breadcrumbs
        items={[
          { name: "Carrito", path: "/carrito" },
          { name: "Finalizar compra", path: "/checkout" },
          { name: "Pago", path: "/checkout/pago" },
        ]}
      />
      <h1 className="mb-2 mt-3 text-3xl md:text-4xl">Pago seguro</h1>
      <p className="mb-8 max-w-2xl text-charcoal/80">
        Estás a un paso. Revisá tu pedido y completá el pago con tarjeta. El cobro se procesa con verificación
        3D Secure y tus datos de tarjeta no se almacenan en nuestro sitio.
      </p>
      <PagoCheckout
        metodo={metodo}
        order={{
          id: order.id,
          total: order.total,
          currency: order.currency,
          items: (order.items ?? []).map((it) => ({
            id: it.id,
            product_name: it.product_name,
            quantity: it.quantity,
            line_total: it.line_total,
          })),
        }}
      />
    </div>
  );
}
