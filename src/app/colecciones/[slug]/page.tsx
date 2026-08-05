import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { CTASection } from "@/components/sections/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { getCollections, getCollectionBySlug } from "@/data/collections";
import { getProjectsByCategory } from "@/data/projects";
import { buildMetadata } from "@/lib/metadata";
import type { Project } from "@/types";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};
  return buildMetadata({ ...collection.seo, path: `/colecciones/${collection.slug}` });
}

export default async function CollectionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  // Las colecciones principales coinciden con categorías de proyecto.
  const projects = ["cocina", "bano", "hogar"].includes(slug)
    ? getProjectsByCategory(slug as Project["category"])
    : [];
  const showcaseProjects = projects.filter((p) => p.gallery.length > 0);

  return (
    <>
      <HeroSection
        size="large"
        image={collection.coverImage}
        eyebrow="Colección"
        title={collection.name}
        description={collection.shortDescription}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: "Colecciones", path: "/colecciones" },
            { name: collection.name, path: `/colecciones/${collection.slug}` },
          ]}
        />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed text-charcoal/85">
            {collection.description}
          </p>
        </div>
      </section>

      {showcaseProjects.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <SectionHeading
            eyebrow="Proyectos"
            title="Proyectos relacionados"
          />
          <div className="mt-4">
            {showcaseProjects.map((project) => (
              <ProjectShowcase key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      <CTASection source={`coleccion-${collection.slug}`} />
    </>
  );
}
