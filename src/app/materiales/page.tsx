import { HeroSection } from "@/components/sections/HeroSection";
import { CTASection } from "@/components/sections/CTASection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MaterialExplorer } from "@/components/sections/MaterialExplorer";
import { getMaterials } from "@/data/materials";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Materiales | Piedra natural y superficies técnicas",
  description:
    "Explore cuarcita, granito, mármol, cuarzo, porcelánico, superficie sólida, HPL, travertino, ónix y terrazzo. Muestrario digital de Granalto Costa Rica.",
  path: "/materiales",
});

export default function MaterialsPage() {
  const materials = getMaterials();

  return (
    <>
      <HeroSection
        size="medium"
        image={{
          src: "/images/materiales/header-materiales.jpg",
          alt: "Muestras de mármol, cuarzo, travertino, cuarcita, granito, HPL, Cambria y porcelánico",
        }}
        eyebrow="Materiales"
        title="Materiales seleccionados para proyectos únicos"
        description="Explore una selección de superficies naturales, técnicas y decorativas para cocinas, baños, mobiliario, revestimientos y espacios arquitectónicos."
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Materiales", path: "/materiales" }]} />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 md:pb-28 lg:px-8">
        <MaterialExplorer materials={materials} />
      </section>

      <CTASection
        source="materiales"
        title="¿No encuentra el material que busca?"
        description="Nuestro inventario cambia constantemente. Consúltenos y le ayudamos a encontrar la superficie ideal para su proyecto."
      />
    </>
  );
}
