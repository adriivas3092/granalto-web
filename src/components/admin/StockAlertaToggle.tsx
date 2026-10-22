"use client";

import { useState, useTransition } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { setStockAlerta } from "@/app/admin/actions";

/** Interruptor: activa/desactiva la alerta y el bloqueo automático por stock. */
export function StockAlertaToggle({ activa }: { activa: boolean }) {
  const [on, setOn] = useState(activa);
  const [pending, start] = useTransition();

  const toggle = () => {
    const next = !on;
    setOn(next); // optimista
    start(async () => {
      try {
        await setStockAlerta(next);
      } catch {
        setOn(!next);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={on}
      title="Al activarlo, los productos con 1 unidad o menos se bloquean solos y se avisa aquí."
      className={cn(
        "inline-flex min-h-[40px] items-center gap-2 rounded-sm border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60",
        on
          ? "border-[#b8863b]/50 bg-[#b8863b]/10 text-[#8a5f24] hover:border-[#b8863b]"
          : "border-stone-beige bg-white text-charcoal hover:border-ink",
      )}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : on ? (
        <Bell className="h-4 w-4" />
      ) : (
        <BellOff className="h-4 w-4" />
      )}
      Alerta de stock: {on ? "Activada" : "Desactivada"}
    </button>
  );
}
