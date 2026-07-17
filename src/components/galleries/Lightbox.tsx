"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Media } from "@/types";

type Props = {
  images: Media[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

/** Lightbox accesible: teclado (Escape, flechas) y foco gestionado. */
export function Lightbox({ images, index, onIndexChange, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const image = images[index];

  const prev = useCallback(
    () => onIndexChange((index - 1 + images.length) % images.length),
    [index, images.length, onIndexChange],
  );
  const next = useCallback(
    () => onIndexChange((index + 1) % images.length),
    [index, images.length, onIndexChange],
  );

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Imagen ${index + 1} de ${images.length}: ${image.alt}`}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4"
      onClick={onClose}
    >
      <div
        className="relative h-[80svh] w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Cerrar visor de imágenes"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-sm text-ivory hover:bg-white/10"
      >
        <X aria-hidden="true" className="h-6 w-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Imagen anterior"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm text-ivory hover:bg-white/10 md:left-6"
          >
            <ChevronLeft aria-hidden="true" className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Imagen siguiente"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-sm text-ivory hover:bg-white/10 md:right-6"
          >
            <ChevronRight aria-hidden="true" className="h-7 w-7" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-ivory/80">
            {index + 1} / {images.length}
          </p>
        </>
      )}
    </div>
  );
}
