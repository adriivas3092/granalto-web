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
          // Las fotos son apaisadas (16:9) y la tarjeta es cuadrada: al recortar,
          // la imagen se muestra ~1,8× más ancha que la tarjeta. `sizes` lo
          // contempla para que el navegador pida una versión con definición
          // suficiente (antes pedía una muy chica y se veía borrosa).
          sizes="(max-width: 640px) 130vw, (max-width: 768px) 85vw, (max-width: 1024px) 60vw, 45vw"
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
