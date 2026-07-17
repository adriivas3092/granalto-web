import { notFound } from "next/navigation";
import { Check, Info } from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { CTASection } from "@/components/sections/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ImageGallery } from "@/components/galleries/ImageGallery";
import { CatalogCard } from "@/components/cards/CatalogCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ViewTracker } from "@/components/sections/ViewTracker";
import { getMaterials, getMaterialBySlug, materialVariabilityNote } from "@/data/materials";
import { getCatalogsByIds } from "@/data/catalogs";
import { getProjectsByMaterial } from "@/data/projects";
import { buildMetadata } from "@/lib/metadata";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getMaterials().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const material = getMaterialBySlug(slug);
  if (!material) return {};
  return buildMetadata({ ...material.seo, path: `/materiales/${material.slug}` });
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-charcoal/85">
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-mineral" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function MaterialPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const material = getMaterialBySlug(slug);
  if (!material) notFound();

  const relatedCatalogs = getCatalogsByIds(material.catalogIds);
  const relatedProjects = getProjectsByMaterial(material.slug);

  return (
    <>
      <ViewTracker event={{ name: "material_view", params: { materialSlug: material.slug } }} />

      <HeroSection
        size="large"
        image={material.coverImage}
        eyebrow="Material"
        title={material.name}
        description={material.shortDescription}
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: "Materiales", path: "/materiales" },
            { name: material.name, path: `/materiales/${material.slug}` },
          ]}
        />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-lg leading-relaxed text-charcoal/85">
            {material.description}
          </p>
        </div>

        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <DetailList title="Características" items={material.features} />
          <DetailList title="Aplicaciones recomendadas" items={material.applications} />
          <DetailList title="Consideraciones de uso" items={material.considerations} />
          <div className="space-y-10">
            {material.finishes.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl text-ink">Acabados disponibles</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {material.finishes.map((finish) => (
                    <li
                      key={finish}
                      className="rounded-sm border border-stone-beige bg-white px-4 py-2 text-sm text-charcoal"
                    >
                      {finish}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {material.colors.length > 0 && (
              <div>
                <h2 className="font-serif text-2xl text-ink">Tonalidades</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {material.colors.map((color) => (
                    <li
                      key={color}
                      className="rounded-sm border border-stone-beige bg-white px-4 py-2 text-sm text-charcoal"
                    >
                      {color}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <p className="mt-14 flex max-w-3xl gap-3 rounded-sm border border-stone-beige bg-white p-5 text-sm leading-relaxed text-charcoal/80">
          <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-mineral" />
          {materialVariabilityNote}
        </p>
      </section>

      {material.gallery.length > 0 && (
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Galería"
              title={`${material.name} en ambientes`}
              description="Imágenes pendientes de reemplazo por fotografías reales."
            />
            <ImageGallery images={material.gallery} />
          </div>
        </section>
      )}

      {relatedCatalogs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <SectionHeading eyebrow="Recursos" title="Catálogos relacionados" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedCatalogs.map((catalog) => (
              <CatalogCard key={catalog.id} catalog={catalog} />
            ))}
          </div>
        </section>
      )}

      {relatedProjects.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <SectionHeading eyebrow="Proyectos" title="Proyectos con este material" />
          <div className="grid gap-8 md:grid-cols-3">
            {relatedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      <CTASection
        source={`material-${material.slug}`}
        title={`Consulte la disponibilidad de ${material.name.toLowerCase()}`}
        description="El inventario de láminas cambia constantemente. Escríbanos y le confirmamos colores, formatos y disponibilidad actual."
      />
    </>
  );
}
