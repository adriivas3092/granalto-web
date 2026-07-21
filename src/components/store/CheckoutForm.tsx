"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cartStore";
import { formatPrice } from "@/lib/store/format";
import { createOrder } from "@/app/checkout/actions";

type Props = {
  defaultName: string;
  defaultPhone: string;
  defaultAddress: string;
  email: string;
};

export function CheckoutForm({ defaultName, defaultPhone, defaultAddress, email }: Props) {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="min-h-svh" />;

  if (items.length === 0) {
    return (
      <div className="rounded-sm border border-stone-beige bg-white p-10 text-center">
        <ShoppingBag aria-hidden="true" className="mx-auto h-8 w-8 text-mineral" />
        <p className="mt-4 text-charcoal">Tu carrito está vacío.</p>
        <Link
          href="/tienda"
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const total = subtotal();
  const currency = items[0]?.currency ?? "CRC";

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    formData.set("cart", JSON.stringify(items.map((i) => ({ id: i.id, quantity: i.quantity }))));
    // Vaciamos el carrito localmente; el pedido ya se registra en el servidor.
    clear();
    try {
      await createOrder(formData);
    } catch {
      setSubmitting(false);
      router.push("/carrito");
    }
  }

  return (
    <form action={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-4">
        <div>
          <label htmlFor="full_name" className="mb-1 block text-sm text-charcoal">
            Nombre completo *
          </label>
          <input
            id="full_name"
            name="full_name"
            required
            defaultValue={defaultName}
            className="w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-charcoal">
              Correo
            </label>
            <input
              id="email"
              value={email}
              disabled
              className="w-full rounded-sm border border-stone-beige bg-stone-beige/40 px-3 py-2.5 text-sm text-charcoal"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm text-charcoal">
              Teléfono *
            </label>
            <input
              id="phone"
              name="phone"
              required
              defaultValue={defaultPhone}
              className="w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label htmlFor="address" className="mb-1 block text-sm text-charcoal">
            Dirección de entrega *
          </label>
          <textarea
            id="address"
            name="address"
            required
            rows={3}
            defaultValue={defaultAddress}
            className="w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="notes" className="mb-1 block text-sm text-charcoal">
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            placeholder="Referencias, horario de entrega, etc."
            className="w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink placeholder:text-mineral focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      <aside className="h-fit rounded-sm border border-stone-beige bg-white p-5">
        <h2 className="font-sans text-lg font-bold text-ink">Tu pedido</h2>
        <ul className="mt-4 space-y-2 border-b border-stone-beige pb-4 text-sm">
          {items.map((i) => (
            <li key={i.id} className="flex justify-between gap-3">
              <span className="text-charcoal">
                {i.name} <span className="text-mineral">× {i.quantity}</span>
              </span>
              <span className="text-ink">{formatPrice(i.price * i.quantity, i.currency)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between text-sm font-semibold">
          <span className="text-charcoal">Total</span>
          <span className="text-ink">{formatPrice(total, currency)}</span>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal disabled:opacity-60"
        >
          {submitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
          Confirmar pedido
        </button>
        <p className="mt-3 text-xs text-mineral">
          Al confirmar, registramos tu pedido y te contactamos para coordinar el
          pago y la entrega. El pago con tarjeta en línea estará disponible pronto.
        </p>
      </aside>
    </form>
  );
}
