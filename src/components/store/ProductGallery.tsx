"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Imagen principal del producto con miniaturas para cambiar de foto. */
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [activa, setActiva] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-sm bg-stone-beige text-sm text-mineral">
        Sin imagen
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-sm bg-stone-beige">
        <Image
          src={images[activa]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActiva(i)}
                aria-label={`Ver foto ${i + 1} de ${images.length}`}
                aria-current={i === activa}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-sm border bg-stone-beige transition-colors",
                  i === activa ? "border-ink" : "border-transparent hover:border-mineral",
                )}
              >
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
