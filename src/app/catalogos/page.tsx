import { HeroSection } from "@/components/sections/HeroSection";
import { CTASection } from "@/components/sections/CTASection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CatalogExplorer } from "@/components/sections/CatalogExplorer";
import { getCatalogs } from "@/data/catalogs";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Catálogos | Recursos descargables",
  description:
    "Catálogos de superficies Granalto, productos Tenax, láminas Wilsonart y más recursos para desarrollar su próximo proyecto.",
  path: "/catalogos",
});

export default function CatalogsPage() {
  const catalogs = getCatalogs();

  return (
    <>
      <HeroSection
        size="medium"
        image={{
          src: "/images/placeholders/material-marmol.svg",
          alt: "Superficies y materiales de catálogo — imagen pendiente de reemplazo",
        }}
        eyebrow="Recursos"
        title="Catálogos y recursos"
        description="Consulte colecciones, fichas y soluciones disponibles para desarrollar su próximo proyecto."
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Catálogos", path: "/catalogos" }]} />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 md:pb-28 lg:px-8">
        <CatalogExplorer catalogs={catalogs} />
      </section>

      <CTASection
        source="catalogos"
        title="¿Necesita una ficha técnica específica?"
        description="Escríbanos y le compartimos la información técnica del material o producto que le interesa."
      />
    </>
  );
}
