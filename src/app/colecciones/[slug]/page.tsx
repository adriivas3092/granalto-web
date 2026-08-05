import { notFound } from "next/navigation";
import { HeroSection } from "@/components/sections/HeroSection";
import { CTASection } from "@/components/sections/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ImageGallery } from "@/components/galleries/ImageGallery";
import { MaterialCard } from "@/components/cards/MaterialCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { getCollections, getCollectionBySlug } from "@/data/collections";
import { getFeaturedMaterials } from "@/data/materials";
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
  const cardProjects = projects.filter((p) => p.gallery.length === 0);
  const materials = getFeaturedMaterials().slice(0, 5);

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

        <div className="mt-12">
          <h2 className="mb-6 font-serif text-2xl text-ink">
            Soluciones de la colección
          </h2>
          <ul className="flex flex-wrap gap-2">
            {collection.subcategories.map((sub) => (
              <li
                key={sub}
                className="rounded-sm border border-stone-beige bg-white px-4 py-2 text-sm text-charcoal"
              >
                {sub}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {collection.gallery.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Galería"
              title="Inspiración"
              description="Ambientes y detalles de la colección (imágenes pendientes de reemplazo)."
            />
            <ImageGallery images={collection.gallery} />
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <SectionHeading
            eyebrow="Proyectos"
            title="Proyectos relacionados"
          />

          {showcaseProjects.length > 0 && (
            <div className="mt-4">
              {showcaseProjects.map((project) => (
                <ProjectShowcase key={project.id} project={project} />
              ))}
            </div>
          )}

          {cardProjects.length > 0 && (
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {cardProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Materiales"
            title="Materiales recomendados"
            description="Superficies que funcionan especialmente bien en esta colección."
          />
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {materials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        </div>
      </section>

      <CTASection source={`coleccion-${collection.slug}`} />
    </>
  );
}
