import { ImageGallery } from "@/components/galleries/ImageGallery";
import type { Project } from "@/types";

/**
 * Ficha de proyecto para la sección de Colecciones: a la izquierda el título,
 * el aliado y los créditos; a la derecha la galería de miniaturas que se abren
 * a pantalla completa (lightbox).
 */
export function ProjectShowcase({ project }: { project: Project }) {
  return (
    <article className="grid gap-8 border-t border-stone-beige py-12 first:border-t-0 first:pt-0 lg:grid-cols-3 lg:gap-12">
      <div className="lg:col-span-1">
        <h3 className="font-serif text-2xl text-ink">{project.title}</h3>
        {project.partner && (
          <p className="mt-2 text-sm text-charcoal/80">
            Trabajo realizado en conjunto con{" "}
            <span className="font-medium text-ink">{project.partner}</span>
          </p>
        )}

        {project.description && (
          <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
            {project.description}
          </p>
        )}

        {project.credits && project.credits.length > 0 && (
          <dl className="mt-6 space-y-3">
            {project.credits.map((c) => (
              <div key={c.label}>
                <dt className="text-xs uppercase tracking-wide text-mineral">
                  {c.label}
                </dt>
                <dd className="text-sm font-medium text-ink">{c.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="lg:col-span-2">
        <ImageGallery images={project.gallery} />
      </div>
    </article>
  );
}
