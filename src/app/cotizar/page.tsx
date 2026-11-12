import { Configurador } from "@/components/configurador/Configurador";
import { buildMetadata } from "@/lib/metadata";
import { getDisponibilidad } from "@/lib/configurador/disponibilidad";

export const metadata = buildMetadata({
  title: "Cotizador de sobres",
  description:
    "Configurá tu sobre de cocina o baño paso a paso: forma, material y color, medidas, moldura y salpicadero. Obtené un estimado y el plazo de producción.",
  path: "/cotizar",
});

// Dinámica: la disponibilidad de materiales puede cambiar desde el admin.
export const dynamic = "force-dynamic";

/**
 * Mientras se afinan detalles, el cotizador queda oculto y la página muestra
 * solo un aviso. Para volver a publicarlo, poner en `false`.
 */
const EN_CONSTRUCCION = true;

export default async function CotizarPage() {
  if (EN_CONSTRUCCION) {
    return (
      <section className="mx-auto flex min-h-[60svh] max-w-6xl items-center justify-center px-4 pb-16 pt-24 text-center sm:px-6 lg:px-8 lg:pt-32">
        <h1 className="font-serif text-3xl text-ink md:text-4xl">Bajo construcción</h1>
      </section>
    );
  }

  const disponibilidad = await getDisponibilidad();
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-32">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-mineral">Cotizador</p>
        <h1 className="mt-2 font-serif text-3xl text-ink md:text-4xl">
          Configurá tu sobre en pocos pasos
        </h1>
        <p className="mt-3 text-charcoal/80">
          Te guiamos con opciones claras. Al final ves tu estimado y el plazo, y un asesor confirma los detalles.
        </p>
      </header>
      <Configurador disponibilidad={disponibilidad} />
    </section>
  );
}
