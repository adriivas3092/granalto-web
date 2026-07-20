"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/actions";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
        setBusy(true);
        await deleteProduct(id);
        setBusy(false);
      }}
      aria-label={`Eliminar ${name}`}
      className="inline-flex items-center gap-1 rounded-sm border border-stone-beige px-2.5 py-1.5 text-xs text-charcoal transition-colors hover:border-[#a03826] hover:text-[#a03826] disabled:opacity-50"
    >
      <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
      Eliminar
    </button>
  );
}
