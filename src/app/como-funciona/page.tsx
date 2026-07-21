import { Layers, Calculator, Ruler, Hammer, Truck, MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CTASection } from "@/components/sections/CTASection";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Cómo funciona",
  description:
    "Del material a la instalación: así trabajamos en Granalto. Elegí tu superficie, cotizá en línea y nosotros medimos, fabricamos e instalamos.",
  path: "/como-funciona",
});

const STEPS = [
  {
    icon: Layers,
    title: "Elegí tu material",
    text: "Explorá nuestra selección de piedras naturales y superficies técnicas. ¿No te decidís? Compará hasta 4 opciones en el cotizador.",
  },
  {
    icon: Calculator,
    title: "Cotizá en línea",
    text: "Ingresá la forma y medidas de tu proyecto, el acabado y los extras. Obtené una estimación al instante, por m² o por metro lineal.",
  },
  {
    icon: Ruler,
    title: "Medición en sitio",
    text: "Coordinamos una visita para tomar las medidas exactas (plantillado) y confirmar detalles antes de fabricar.",
  },
  {
    icon: Hammer,
    title: "Fabricación a medida",
    text: "Cortamos, pulimos y preparamos tu superficie con precisión, incluyendo cantos, cortes de fregadero y perforaciones.",
  },
  {
    icon: Truck,
    title: "Instalación y entrega",
    text: "Instalamos tu superficie con acabado profesional y dejamos tu espacio listo para usar.",
  },
];

export default function ComoFuncionaPage() {
  return (
    <>
      <section className="bg-ink pb-12 pt-28 text-ivory md:pb-14 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-stone-beige">Cómo funciona</p>
          <h1 className="max-w-3xl text-3xl leading-[1.08] md:text-5xl">Del material a la instalación, sin complicaciones</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/85">
            Un proceso claro y acompañado en cada paso. Empezá con una estimación en línea y nosotros nos
            encargamos del resto.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Cómo funciona", path: "/como-funciona" }]} />
      </div>

      <section className="mx-auto max-w-4xl px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <ol className="space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4 rounded-sm border border-stone-beige bg-white p-5">
              <div className="flex shrink-0 flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-ivory">
                  {i + 1}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <s.icon aria-hidden="true" className="h-5 w-5 text-ink" />
                  <h2 className="font-sans text-lg font-bold text-ink">{s.title}</h2>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-charcoal/85">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/cotizar">Cotizar mi proyecto</ButtonLink>
          <ButtonLink href="/materiales" variant="outline">Ver materiales</ButtonLink>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-mineral">
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
          ¿Dudas? Escribinos y te asesoramos sin compromiso.
        </p>
      </section>

      <CTASection source="como-funciona" />
    </>
  );
}
