"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useQuote } from "@/store/quoteStore";

/** Confirmación al salir del cotizador. */
export function ExitQuoteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const resetQuote = useQuote((s) => s.resetQuote);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Salir del cotizador"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-sm bg-white p-6">
        <div className="mb-2 flex items-start justify-between">
          <h2 className="font-sans text-lg font-bold text-ink">¿Querés salir del cotizador?</h2>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-sm p-1 text-charcoal hover:bg-stone-beige">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        <p className="text-sm text-charcoal/80">
          Tu progreso está guardado en este dispositivo y podés retomarlo después.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={onClose} className="min-h-[44px] flex-1 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal">
            Seguir cotizando
          </button>
          <button
            onClick={() => router.push("/")}
            className="min-h-[44px] rounded-sm border border-stone-beige px-5 py-2.5 text-sm font-medium text-charcoal hover:border-ink"
          >
            Guardar y salir
          </button>
          <button
            onClick={() => {
              resetQuote();
              router.push("/");
            }}
            className="min-h-[44px] rounded-sm border border-stone-beige px-5 py-2.5 text-sm font-medium text-[#a03826] hover:border-[#a03826]"
          >
            Descartar
          </button>
        </div>
      </div>
    </div>
  );
}
