"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Material } from "@/types";
import { MaterialCard } from "@/components/cards/MaterialCard";

/**
 * Carrusel lineal horizontal de materiales: una fila desplazable con
 * scroll-snap, flechas anterior/siguiente y arrastre. Muestra todos los
 * materiales del catálogo. Accesible por teclado y táctil.
 */
export function MaterialsCarousel({ materials }: { materials: Material[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByCards = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    // Desplaza aproximadamente el ancho de una tarjeta.
    const card = el.querySelector("li");
    const amount = card ? card.clientWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {materials.map((material) => (
          <li
            key={material.id}
            className="w-[70%] shrink-0 snap-start sm:w-[45%] md:w-[31%] lg:w-[23%]"
          >
            <MaterialCard material={material} />
          </li>
        ))}
      </ul>

      {/* Flechas de navegación */}
      <button
        type="button"
        onClick={() => scrollByCards(-1)}
        disabled={!canPrev}
        aria-label="Materiales anteriores"
        className="absolute -left-3 top-[38%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-stone-beige bg-white text-ink shadow-sm transition-all hover:bg-ink hover:text-ivory disabled:cursor-not-allowed disabled:opacity-0 md:flex"
      >
        <ChevronLeft aria-hidden="true" className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCards(1)}
        disabled={!canNext}
        aria-label="Materiales siguientes"
        className="absolute -right-3 top-[38%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-stone-beige bg-white text-ink shadow-sm transition-all hover:bg-ink hover:text-ivory disabled:cursor-not-allowed disabled:opacity-0 md:flex"
      >
        <ChevronRight aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );
}
