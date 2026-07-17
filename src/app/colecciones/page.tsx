import { HeroSection } from "@/components/sections/HeroSection";
import { CTASection } from "@/components/sections/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CollectionCard } from "@/components/cards/CollectionCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { getCollections } from "@/data/collections";
import { getFeaturedProjects } from "@/data/projects";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Colecciones | Cocina, baño y hogar",
  description:
    "Explore las colecciones de Granalto por tipo de espacio: superficies y soluciones para cocina, baño y hogar en Costa Rica.",
  path: "/colecciones",
});

export default function CollectionsPage() {
  const collections = getCollections();
  const projects = getFeaturedProjects(3);

  return (
    <>
      <HeroSection
        size="medium"
        image={{
          src: "/images/photos/hero-3.jpg",
          alt: "Cocina contemporánea en negro con isla de piedra oscura y detalles dorados",
        }}
        eyebrow="Colecciones"
        title="Un material para cada espacio"
        description="Superficies y soluciones organizadas según el espacio que quiere transformar: cocina, baño y el resto del hogar."
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Colecciones", path: "/colecciones" }]} />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 md:pb-28 lg:px-8">
        <SectionHeading
          title="Explore por tipo de espacio"
          description="Cada colección reúne materiales, aplicaciones y proyectos pensados para ese espacio."
        />
        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Proyectos"
            title="Proyectos destacados"
            description="Espacios transformados con nuestras superficies (contenido de demostración, pendiente de proyectos reales)."
          />
          <div className="grid gap-8 md:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      <CTASection source="colecciones" />
    </>
  );
}
