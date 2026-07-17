import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Collection } from "@/types";

/** Tarjeta editorial de colección con hover elegante sobre la imagen. */
export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={`/colecciones/${collection.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-stone-beige">
        <Image
          src={collection.coverImage.src}
          alt={collection.coverImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <h3 className="font-serif text-2xl text-ivory md:text-3xl">
            {collection.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ivory/85">
            {collection.shortDescription}
          </p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-ivory underline-offset-4 group-hover:underline">
            Ver colección
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
