"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/store/cartStore";
import { formatPrice } from "@/lib/store/format";

export default function CartPage() {
  const { items, setQuantity, remove, subtotal } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="min-h-svh" />;
  }

  const total = subtotal();
  const currency = items[0]?.currency ?? "CRC";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:pt-36">
      <h1 className="text-3xl md:text-4xl">Carrito</h1>

      {items.length === 0 ? (
        <div className="mt-10 rounded-sm border border-stone-beige bg-white p-10 text-center">
          <ShoppingBag aria-hidden="true" className="mx-auto h-8 w-8 text-mineral" />
          <p className="mt-4 text-charcoal">Tu carrito está vacío.</p>
          <Link
            href="/tienda"
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal"
          >
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
          <ul className="divide-y divide-stone-beige rounded-sm border border-stone-beige bg-white">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 p-4">
                <Link
                  href={`/tienda/${item.slug}`}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-stone-beige"
                >
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill sizes="80px" className="object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[0.6rem] text-mineral">
                      Sin imagen
                    </span>
                  )}
                </Link>

                <div className="flex flex-1 flex-col">
                  <Link href={`/tienda/${item.slug}`} className="text-sm font-bold text-ink hover:underline">
                    {item.name}
                  </Link>
                  <span className="mt-1 text-sm text-mineral">
                    {formatPrice(item.price, item.currency)} c/u
                  </span>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex items-center rounded-sm border border-stone-beige">
                      <button
                        type="button"
                        aria-label="Disminuir"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center text-charcoal hover:bg-stone-beige/60"
                      >
                        <Minus aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-medium text-ink">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="Aumentar"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="flex h-9 w-9 items-center justify-center text-charcoal hover:bg-stone-beige/60"
                      >
                        <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="inline-flex items-center gap-1 text-xs text-mineral hover:text-[#a03826]"
                    >
                      <Trash2 aria-hidden="true" className="h-3.5 w-3.5" /> Quitar
                    </button>
                  </div>
                </div>

                <div className="text-right text-sm font-semibold text-ink">
                  {formatPrice(item.price * item.quantity, item.currency)}
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-sm border border-stone-beige bg-white p-5">
            <h2 className="font-sans text-lg font-bold text-ink">Resumen</h2>
            <div className="mt-4 flex justify-between border-b border-stone-beige pb-3 text-sm">
              <span className="text-charcoal">Subtotal</span>
              <span className="font-semibold text-ink">{formatPrice(total, currency)}</span>
            </div>
            <p className="mt-3 text-xs text-mineral">
              El envío se coordina al confirmar el pedido.
            </p>
            <Link
              href="/checkout"
              className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal"
            >
              Finalizar compra <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/tienda"
              className="mt-3 block text-center text-sm text-mineral hover:text-ink"
            >
              Seguir comprando
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
