"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Printer, MessageCircle, RotateCcw } from "lucide-react";
import { useQuote } from "@/store/quoteStore";
import { formatPrice } from "@/lib/store/format";
import { getWhatsAppUrl } from "@/config/site";

/** Confirmación tras enviar la cotización. */
export default function CotizarExitoPage() {
  const [mounted, setMounted] = useState(false);
  const quoteId = useQuote((s) => s.quoteId);
  const estimates = useQuote((s) => s.estimates);
  const selectedEstimateId = useQuote((s) => s.selectedEstimateId);
  const resetQuote = useQuote((s) => s.resetQuote);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="min-h-svh" />;

  const chosen = estimates.find((e) => e.productId === selectedEstimateId) ?? estimates[0];

  if (!quoteId) {
    return (
      <section className="mx-auto max-w-xl px-4 pb-24 pt-32 text-center">
        <h1 className="text-2xl">No hay una cotización reciente</h1>
        <p className="mt-3 text-charcoal/80">Iniciá una nueva cotización para ver tu estimación.</p>
        <Link href="/cotizar" className="mt-6 inline-flex min-h-[44px] items-center rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal">
          Ir al cotizador
        </Link>
      </section>
    );
  }

  const wa = getWhatsAppUrl(`Hola, envié la cotización ${quoteId} desde el sitio. Quisiera continuar.`);

  return (
    <section className="mx-auto max-w-2xl px-4 pb-24 pt-32 text-center">
      <CheckCircle2 aria-hidden="true" className="mx-auto h-14 w-14 text-ink" />
      <h1 className="mt-5 text-3xl md:text-4xl">Tu solicitud fue enviada correctamente</h1>
      <p className="mt-3 text-charcoal/85">Nuestro equipo revisará tu proyecto y te contactará con la cotización definitiva.</p>

      <div className="mt-8 rounded-sm border border-stone-beige bg-white p-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-mineral">Número de solicitud</span>
          <span className="font-mono text-ink">{quoteId}</span>
        </div>
        {chosen && (
          <>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-beige pt-3">
              <span className="text-sm text-mineral">Material</span>
              <span className="text-ink">{chosen.productName}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm text-mineral">Total estimado</span>
              <span className="text-lg font-bold text-ink">{formatPrice(chosen.total, chosen.currency)}</span>
            </div>
          </>
        )}
        <p className="mt-4 text-xs leading-relaxed text-mineral">
          El precio está sujeto a revisión técnica. Un asesor confirmará medidas, acabados y condiciones de
          instalación. Tiempo aproximado de respuesta: 1 a 2 días hábiles.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={() => window.print()} className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-stone-beige bg-white px-5 py-2.5 text-sm font-medium text-charcoal hover:border-ink">
          <Printer className="h-4 w-4" /> Imprimir resumen
        </button>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-stone-beige bg-white px-5 py-2.5 text-sm font-medium text-charcoal hover:border-ink">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <Link href="/cotizar" onClick={() => resetQuote()} className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal">
          <RotateCcw className="h-4 w-4" /> Nueva cotización
        </Link>
        <Link href="/" className="inline-flex min-h-[44px] items-center rounded-sm border border-stone-beige bg-white px-5 py-2.5 text-sm font-medium text-charcoal hover:border-ink">
          Volver al sitio
        </Link>
      </div>
    </section>
  );
}
