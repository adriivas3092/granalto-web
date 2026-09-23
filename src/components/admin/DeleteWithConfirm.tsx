"use client";

import { Trash2 } from "lucide-react";

/** Botón de eliminar con confirmación. Recibe un server action ya vinculado. */
export function DeleteWithConfirm({
  action,
  label = "Eliminar",
  confirmText = "¿Eliminar? Esta acción no se puede deshacer.",
}: {
  action: () => Promise<void>;
  label?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <button
        type="submit"
        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm border border-[#a03826] px-4 py-2.5 text-sm font-medium text-[#a03826] transition-colors hover:bg-[#a03826] hover:text-white"
      >
        <Trash2 aria-hidden="true" className="h-4 w-4" />
        {label}
      </button>
    </form>
  );
}
