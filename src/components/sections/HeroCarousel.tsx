"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import type { Media } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  slides: Media[];
  title: string;
  description?: string;
  children?: ReactNode;
  /** Milisegundos entre diapositivas. */
  interval?: number;
};

/**
 * Carrusel de hero a pantalla completa con crossfade suave y zoom sutil.
 * Automático, con control de pausa accesible e indicadores; respeta
 * `prefers-reduced-motion` (sin auto-avance ni zoom en ese caso).
 */
export function HeroCarousel({
  slides,
  title,
  description,
  children,
  interval = 6000,
}: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return;
    timerRef.current = setInterval(
      () => setActive((i) => (i + 1) % slides.length),
      interval,
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reducedMotion, slides.length, interval]);

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Proyectos destacados de Granalto"
      className="relative flex min-h-svh items-end overflow-hidden bg-ink text-ivory"
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== active}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1500ms] ease-in-out",
            i === active ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn(
              "object-cover",
              !reducedMotion && i === active && "animate-hero-zoom",
            )}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-ink/25" />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <h1 className="max-w-3xl text-4xl leading-[1.08] md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory/85 md:text-lg">
            {description}
          </p>
        )}
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}

        {slides.length > 1 && (
          <div className="mt-10 flex items-center gap-4">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Reanudar carrusel" : "Pausar carrusel"}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/40 text-ivory transition-colors hover:border-ivory hover:bg-white/10"
            >
              {paused ? (
                <Play aria-hidden="true" className="h-4 w-4" />
              ) : (
                <Pause aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
            <div role="tablist" aria-label="Diapositivas" className="flex gap-2.5">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Ir a la diapositiva ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    i === active
                      ? "w-8 bg-ivory"
                      : "w-2.5 bg-ivory/40 hover:bg-ivory/70",
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
