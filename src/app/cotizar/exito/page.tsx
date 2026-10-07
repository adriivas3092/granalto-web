"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Printer, MessageCircle, RotateCcw } from "lucide-react";
import { useConfigurador } from "@/store/configuradorStore";
import { getGeometria } from "@/data/configurador";
import { buildFicha } from "@/lib/configurador/ficha";
import { getWhatsAppUrl } from "@/config/site";

/** Confirmación y respaldo completo tras enviar la configuración. */
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
  const esPersonalizado = geo?.autoPrecio === false || s.derivar;
  const tieneCliente = s.cliente.nombre.trim().length > 0;

  const { secciones } = buildFicha({
    geometriaId: s.geometriaId,
    materialId: s.materialId,
    colorId: s.colorId,
    medidas: s.medidas,
    acabado: s.acabado,
    moldura: s.moldura,
    molduraGrosorCm: s.molduraGrosorCm,
    molduraPerfil: s.molduraPerfil,
    salpicaderoTipo: s.salpicaderoTipo,
    salpicaderoAlturaCm: s.salpicaderoAlturaCm,
    lUnion: s.lUnion,
    derivar: s.derivar,
    unidad: s.unidad,
    cliente: tieneCliente ? s.cliente : undefined,
    folio,
    fecha: new Date().toLocaleString("es-CR"),
  });

  const wa = getWhatsAppUrl(`Hola, envié la solicitud ${folio} desde el cotizador. Quisiera continuar.`);

  return (
    <section className="mx-auto max-w-2xl px-4 pb-24 pt-32">
      <div className="text-center">
        <CheckCircle2 aria-hidden="true" className="mx-auto h-14 w-14 text-ink" />
        <h1 className="mt-5 text-3xl md:text-4xl">
          {esPersonalizado ? "Recibimos tu solicitud" : "Tu pedido fue enviado"}
        </h1>
        <p className="mt-3 text-charcoal/85">
          Guardá este resumen como respaldo. Nuestro equipo revisará tu proyecto y te contactará para confirmar los detalles.
        </p>
      </div>

      {/* Respaldo completo de la solicitud */}
      <div className="mt-8 rounded-sm border border-stone-beige bg-white p-6 text-left">
        {secciones.map((sec) => (
          <div key={sec.titulo} className="border-b border-stone-beige/70 py-3 first:pt-0 last:border-0 last:pb-0">
            <h2 className="mb-2 text-xs uppercase tracking-[0.14em] text-mineral">{sec.titulo}</h2>
            <dl className="space-y-1.5">
              {sec.filas.map((f) => (
                <div key={f.label} className="flex flex-wrap items-start justify-between gap-3">
                  <dt className="text-sm text-charcoal/80">{f.label}</dt>
                  <dd className="text-right text-sm font-medium text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
        <p className="mt-4 text-xs leading-relaxed text-mineral">
          Las medidas están sujetas a validación técnica. Tiempo de respuesta: 1 a 2 días hábiles.
          Recibirás también este respaldo por correo.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={() => window.print()} className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-stone-beige bg-white px-5 py-2.5 text-sm font-medium text-charcoal hover:border-ink">
          <Printer className="h-4 w-4" /> Imprimir / guardar PDF
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
