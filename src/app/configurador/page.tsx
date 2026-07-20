import { CTASection } from "@/components/sections/CTASection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MaterialConfigurator } from "@/components/sections/MaterialConfigurator";
import { getMaterials } from "@/data/materials";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Configurador de superficies",
  description:
    "Combine materiales en cocinas y baños y visualice el resultado: elija sobres, salpicaderos, revestimientos y pisos con las superficies de Granalto.",
  path: "/configurador",
});

export default function ConfiguratorPage() {
  const materials = getMaterials();

  return (
    <>
      <section className="bg-ink pb-14 pt-28 text-ivory md:pb-16 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-stone-beige">
            Configurador
          </p>
          <h1 className="max-w-3xl text-4xl leading-[1.08] md:text-6xl">
            Combine materiales y visualice su espacio
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory/85 md:text-lg">
            Elija el material para cada zona de la cocina o el baño y vea cómo se
            combinan. Una herramienta para inspirarse antes de solicitar asesoría.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Configurador", path: "/configurador" }]} />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 md:pb-28 lg:px-8">
        <SectionHeading
          eyebrow="Pruebe combinaciones"
          title="Su espacio, a su manera"
          description="Seleccione una zona (sobres, salpicadero, revestimiento o piso) y aplíquele un material. Puede tocar directamente sobre la escena para elegir la zona."
        />
        <MaterialConfigurator materials={materials} />
      </section>

      <CTASection
        source="configurador"
        title="¿Le gustó una combinación?"
        description="Compártala con nuestro equipo y le ayudamos a hacerla realidad con asesoría, medidas e instalación."
      />
    </>
  );
}
