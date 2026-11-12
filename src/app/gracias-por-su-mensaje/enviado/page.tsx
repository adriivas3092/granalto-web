import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { getWhatsAppUrl } from "@/config/site";

/**
 * Página de confirmación del formulario de contacto.
 *
 * La ruta contiene "/gracias-por-su-mensaje/" a propósito: es la condición de
 * los activadores de Google Tag Manager que registran la conversión de
 * formulario (Google Ads y GA4). Se llega con una carga completa de página
 * para que GTM dispare su evento "DOM preparado".
 */
export const metadata = buildMetadata({
  title: "Gracias por su mensaje",
  description: "Recibimos su mensaje. Un asesor de Granalto le contactará pronto.",
  path: "/gracias-por-su-mensaje/enviado",
  noIndex: true,
});

export default function GraciasPorSuMensajePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-32 text-center sm:px-6 lg:pt-40">
      <CheckCircle2 aria-hidden="true" className="mx-auto h-14 w-14 text-ink" />
      <h1 className="mt-5 text-3xl md:text-4xl">¡Gracias por su mensaje!</h1>
      <p className="mt-4 text-charcoal/85">
        Recibimos su consulta. Un asesor de Granalto le contactará a la brevedad.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal"
        >
          Volver al inicio
        </Link>
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[48px] items-center rounded-sm border border-stone-beige px-6 py-3 text-sm font-medium text-charcoal hover:border-ink"
        >
          Escribir por WhatsApp
        </a>
      </div>
    </div>
  );
}
