"use client";

import { useEffect } from "react";
import Link from "next/link";
import { logError } from "@/lib/logger";

/**
 * Frontera de error de rutas. Captura errores de render en cualquier página,
 * los registra (logger → Runtime Logs de Vercel) y muestra una pantalla
 * amigable con opción de reintentar.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, { digest: error.digest, boundary: "route" });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-4 py-32 text-center sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-mineral">Algo salió mal</p>
      <h1 className="mt-4 text-3xl leading-tight text-ink md:text-4xl">Tuvimos un inconveniente</h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-charcoal/80">
        Ocurrió un error inesperado. Podés reintentar o volver al inicio. Si persiste, escribinos y lo resolvemos.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex min-h-[44px] items-center rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center rounded-sm border border-stone-beige bg-white px-6 py-3 text-sm text-charcoal hover:border-ink"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
