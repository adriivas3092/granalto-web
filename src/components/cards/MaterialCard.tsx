import Image from "next/image";
import Link from "next/link";
import type { Material } from "@/types";

const categoryLabels: Record<Material["category"], string> = {
  natural: "Piedra natural",
  tecnico: "Superficie técnica",
  decorativo: "Superficie decorativa",
};

/** Tarjeta de material tipo muestrario digital. */
export function MaterialCard({ material }: { material: Material }) {
  return (
    <Link
      href={`/materiales/${material.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <div className="relative aspect-square overflow-hidden rounded-sm bg-stone-beige">
        <Image
          src={material.coverImage.src}
          alt={material.coverImage.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="pt-4">
        <p className="text-xs uppercase tracking-[0.15em] text-mineral">
          {categoryLabels[material.category]}
        </p>
        <h3 className="mt-1 font-serif text-xl text-ink group-hover:underline group-hover:underline-offset-4">
          {material.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-charcoal/75">
          {material.shortDescription}
        </p>
      </div>
    </Link>
  );
}
