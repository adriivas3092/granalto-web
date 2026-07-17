import Image from "next/image";
import type { Project } from "@/types";
import { projectCategories } from "@/data/projects";

/**
 * Tarjeta de proyecto. La página /proyectos se activará en una segunda fase,
 * por lo que la tarjeta es informativa (sin enlace) hasta entonces.
 */
export function ProjectCard({ project }: { project: Project }) {
  const categoryLabel =
    projectCategories.find((c) => c.value === project.category)?.label ??
    project.category;

  return (
    <article className="group">
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-beige">
        <Image
          src={project.coverImage.src}
          alt={project.coverImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="pt-4">
        <p className="text-xs uppercase tracking-[0.15em] text-mineral">
          {categoryLabel}
          {project.location ? ` · ${project.location}` : ""}
        </p>
        <h3 className="mt-1 font-serif text-xl text-ink">{project.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-charcoal/75">
          {project.description}
        </p>
      </div>
    </article>
  );
}
