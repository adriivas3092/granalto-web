import { CTASection } from "@/components/sections/CTASection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Studio } from "@/components/studio/Studio";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Configurador de superficies",
  description:
    "Visualice materiales en su espacio: elija un ambiente o cargue su foto, marque las superficies y aplique acabados de piso, pared y encimera con las superficies de Granalto.",
  path: "/configurador",
});

export default function ConfiguratorPage() {
  return (
    <>
      <section className="bg-ink pb-14 pt-28 text-ivory md:pb-16 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-stone-beige">
            Configurador
          </p>
          <h1 className="max-w-3xl text-4xl leading-[1.08] md:text-6xl">
            Visualice los materiales en su espacio
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/85 md:text-lg">
            Elija un ambiente o cargue una fotografía de su espacio, marque las
            superficies (piso, pared, encimera) y aplique diferentes acabados
            para ver cómo se verían. Ajuste escala, rotación y compare el antes y
            el después.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Configurador", path: "/configurador" }]} />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-2 sm:px-6 md:pb-28 lg:px-8">
        <SectionHeading
          eyebrow="Estudio de superficies"
          title="Su espacio, con nuestros materiales"
          description="Herramienta de visualización referencial. Los resultados son una simulación para inspirarse; el equipo de Granalto confirma disponibilidad, medidas e instalación."
        />
        <Studio />
      </section>

      <CTASection
        source="configurador"
        title="¿Le gustó una combinación?"
        description="Descargue su diseño o compártalo con nuestro equipo y lo ayudamos a hacerlo realidad."
      />
    </>
  );
}
