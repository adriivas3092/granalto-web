"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cartStore";
import { cn } from "@/lib/utils";

/** Ícono de carrito con contador (header). */
export function CartButton({ isTransparent }: { isTransparent: boolean }) {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = mounted ? items.reduce((n, i) => n + i.quantity, 0) : 0;

  return (
    <Link
      href="/carrito"
      aria-label={`Carrito (${count})`}
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-sm transition-colors",
        isTransparent
          ? "text-ivory hover:bg-white/10"
          : "text-charcoal hover:bg-stone-beige/60",
      )}
    >
      <ShoppingBag aria-hidden="true" className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#a03826] px-1 text-[0.6rem] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
