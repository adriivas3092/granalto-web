import { Loader2 } from "lucide-react";

/** Indicador de carga accesible. */
export function LoadingState({ label = "Cargando contenido…" }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center gap-3 py-16 text-charcoal/70">
      <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
