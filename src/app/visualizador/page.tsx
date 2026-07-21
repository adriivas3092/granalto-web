import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Visualizer } from "@/components/visualizer/Visualizer";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Visualizador de Ambientes",
  description:
    "Diseñe su cocina, baño, enchape de pared o BBQ aplicando materiales de Granalto sobre ambientes reales. Compare, guarde favoritos y solicite su cotización.",
  path: "/visualizador",
});

export default function VisualizadorPage() {
  return (
    <>
      <section className="bg-ink pb-10 pt-28 text-ivory md:pb-12 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-stone-beige">
            Visualizador de Ambientes
          </p>
          <h1 className="max-w-3xl text-3xl leading-[1.08] md:text-5xl">
            Imagine su proyecto con nuestros materiales
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ivory/85">
            Elija un ambiente, seleccione cada superficie y pruebe distintos materiales,
            acabados e iluminación. Compare el antes y el después y solicite su cotización.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Visualizador de Ambientes", path: "/visualizador" }]} />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6 lg:px-8 lg:pb-20">
        <Visualizer />
      </section>
    </>
  );
}
