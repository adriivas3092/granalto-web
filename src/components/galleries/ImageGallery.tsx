"use client";

import Image from "next/image";
import { useState } from "react";
import type { Media } from "@/types";
import { Lightbox } from "@/components/galleries/Lightbox";

/** Galería en grid con apertura en lightbox accesible. */
export function ImageGallery({ images }: { images: Media[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, i) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Ampliar imagen: ${image.alt}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-sm bg-stone-beige focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            </button>
            {image.caption && (
              <p className="mt-2 text-xs text-mineral">{image.caption}</p>
            )}
          </li>
        ))}
      </ul>
      {openIndex !== null && (
        <Lightbox
          images={images}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
