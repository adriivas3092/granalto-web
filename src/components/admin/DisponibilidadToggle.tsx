"use client";

import { useState, useTransition } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { setMaterialDisponibilidad } from "@/app/admin/actions";

/** Interruptor de disponibilidad de un color (Disponible / Agotado). */
export function DisponibilidadToggle({
  materialId,
  colorId,
  agotado,
}: {
  materialId: string;
  colorId: string;
  agotado: boolean;
}) {
  const [val, setVal] = useState(agotado);
  const [pending, start] = useTransition();

  const toggle = () => {
    const next = !val;
    setVal(next); // optimista
    start(async () => {
      try {
        await setMaterialDisponibilidad(materialId, colorId, next);
      } catch {
        setVal(!next); // revertir si falla
      }
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={!val}
      className={cn(
        "inline-flex min-h-[34px] items-center gap-1.5 rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-60",
        val
          ? "border-[#b8863b]/50 bg-[#b8863b]/10 text-[#8a5f24] hover:border-[#b8863b]"
          : "border-emerald-600/40 bg-emerald-50 text-emerald-700 hover:border-emerald-600",
      )}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : val ? (
        <X className="h-4 w-4" />
      ) : (
        <Check className="h-4 w-4" />
      )}
      {val ? "Agotado" : "Disponible"}
    </button>
  );
}
