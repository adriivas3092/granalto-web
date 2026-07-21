"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

/** Bottom sheet para los controles en móvil. No cubre toda la imagen. */
export function MobileControls({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Personalizar ambiente">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[78svh] overflow-y-auto rounded-t-xl bg-white p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <span className="h-1 w-10 rounded-full bg-stone-beige" aria-hidden="true" />
          <button onClick={onClose} aria-label="Cerrar controles" className="rounded-sm p-1 text-charcoal hover:bg-stone-beige">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
