"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Printer, MessageCircle, RotateCcw } from "lucide-react";
import { useConfigurador } from "@/store/configuradorStore";
import { getGeometria, getMaterial, PLAZO_DIAS_HABILES } from "@/data/configurador";
import { calcularPrecio } from "@/lib/configurador/pricing";
import { formatPrice } from "@/lib/store/format";
import { getWhatsAppUrl } from "@/config/site";

/** Confirmación tras enviar la configuración. */
export default function CotizarExitoPage() {
  const [mounted, setMounted] = useState(false);
  const s = useConfigurador();
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="min-h-svh" />;

  const { folio } = s;
  if (!folio) {
    return (
      <section className="mx-auto max-w-xl px-4 pb-24 pt-32 text-center">
        <h1 className="text-2xl">No hay una solicitud reciente</h1>
        <p className="mt-3 text-charcoal/80">Iniciá una nueva configuración para ver tu estimación.</p>
        <Link href="/cotizar" className="mt-6 inline-flex min-h-[44px] items-center rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal">
          Ir al cotizador
        </Link>
      </section>
    );
  }

  const geo = getGeometria(s.geometriaId);
  const material = getMaterial(s.materialId);
  const price = calcularPrecio(s);
  const esPersonalizado = geo?.autoPrecio === false;
  const wa = getWhatsAppUrl(`Hola, envié la solicitud ${folio} desde el cotizador. Quisiera continuar.`);

  return (
    <section className="mx-auto max-w-2xl px-4 pb-24 pt-32 text-center">
      <CheckCircle2 aria-hidden="true" className="mx-auto h-14 w-14 text-ink" />
      <h1 className="mt-5 text-3xl md:text-4xl">
        {esPersonalizado ? "Recibimos tu solicitud" : "Tu pedido fue enviado"}
      </h1>
      <p className="mt-3 text-charcoal/85">
        Nuestro equipo revisará tu proyecto y te contactará para confirmar los detalles.
      </p>

      <div className="mt-8 rounded-sm border border-stone-beige bg-white p-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-mineral">Número de solicitud</span>
          <span className="font-mono text-ink">{folio}</span>
        </div>
        {geo && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-stone-beige pt-3">
            <span className="text-sm text-mineral">Proyecto</span>
            <span className="text-ink">{geo.nombre}</span>
          </div>
        )}
        {!esPersonalizado && material && (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-mineral">Material</span>
            <span className="text-ink">{material.nombre} · {material.espesorMm} mm</span>
          </div>
        )}
        {!esPersonalizado && (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-mineral">Total estimado</span>
            <span className="text-lg font-bold text-ink">
              {price.tienePrecio ? formatPrice(price.total, price.moneda) : "A confirmar"}
            </span>
          </div>
        )}
        <p className="mt-4 text-xs leading-relaxed text-mineral">
          Plazo de producción estimado: {PLAZO_DIAS_HABILES} días hábiles desde la confirmación del pedido y el pago.
          Las medidas están sujetas a validación técnica. Tiempo de respuesta: 1 a 2 días hábiles.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={() => window.print()} className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-stone-beige bg-white px-5 py-2.5 text-sm font-medium text-charcoal hover:border-ink">
          <Printer className="h-4 w-4" /> Imprimir resumen
        </button>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-stone-beige bg-white px-5 py-2.5 text-sm font-medium text-charcoal hover:border-ink">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <Link href="/cotizar" onClick={() => s.reset()} className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal">
          <RotateCcw className="h-4 w-4" /> Nueva cotización
        </Link>
        <Link href="/" className="inline-flex min-h-[44px] items-center rounded-sm border border-stone-beige bg-white px-5 py-2.5 text-sm font-medium text-charcoal hover:border-ink">
          Volver al sitio
        </Link>
      </div>
    </section>
  );
}
