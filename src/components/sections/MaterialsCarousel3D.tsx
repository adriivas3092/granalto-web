"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import type { Material } from "@/types";

/**
 * Carrusel 3D de materiales: los materiales se disponen alrededor de un
 * cilindro y giran 360° en horizontal, de forma automática y continua.
 * Permite arrastrar para girar, botones anterior/siguiente, pausa, y respeta
 * `prefers-reduced-motion` (sin giro automático; navegable con controles).
 *
 * La página /materiales mantiene la cuadrícula accesible con buscador y
 * filtros como forma alternativa de explorar todos los materiales.
 */
export function MaterialsCarousel3D({ materials }: { materials: Material[] }) {
  const n = materials.length;
  const step = 360 / n;

  const [rotation, setRotation] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [dims, setDims] = useState({ radius: 380, cardW: 240, cardH: 320 });

  const rotationRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const dragStartX = useRef(0);
  const dragStartRot = useRef(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Preferencia de movimiento reducido.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Dimensiones responsivas del anillo según el ancho disponible.
  useEffect(() => {
    const compute = () => {
      const w = wrapperRef.current?.clientWidth ?? 1024;
      let cardW = 240;
      if (w < 480) cardW = 158;
      else if (w < 768) cardW = 190;
      else if (w < 1024) cardW = 215;
      const cardH = Math.round(cardW * 1.32);
      // Radio del cilindro para N tarjetas, con holgura entre ellas.
      const radius = Math.round((cardW / (2 * Math.tan(Math.PI / n))) * 1.15);
      setDims({ radius, cardW, cardH });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [n]);

  // Bucle de animación: giro automático, easing hacia un objetivo, o arrastre.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const speed = 9; // grados por segundo (giro automático suave)

    const frame = (t: number) => {
      const dt = Math.min(t - last, 60);
      last = t;

      if (draggingRef.current) {
        // La rotación la fija el manejador de puntero.
      } else if (targetRef.current !== null) {
        const diff = targetRef.current - rotationRef.current;
        if (Math.abs(diff) < 0.15) {
          rotationRef.current = targetRef.current;
          targetRef.current = null;
        } else {
          rotationRef.current += diff * Math.min(1, (dt / 1000) * 5);
        }
      } else if (!paused && !reducedMotion) {
        rotationRef.current += speed * (dt / 1000);
      }

      setRotation(rotationRef.current);
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [paused, reducedMotion]);

  const nudge = useCallback(
    (dir: -1 | 1) => {
      const base = targetRef.current ?? rotationRef.current;
      targetRef.current = Math.round(base / step) * step + dir * step;
    },
    [step],
  );

  const onPointerDown = (e: ReactPointerEvent) => {
    draggingRef.current = true;
    dragStartX.current = e.clientX;
    dragStartRot.current = rotationRef.current;
    targetRef.current = null;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartX.current;
    rotationRef.current = dragStartRot.current + dx * 0.35;
  };
  const onPointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <div>
      <div
        ref={wrapperRef}
        className="relative mx-auto w-full select-none"
        style={{ height: dims.cardH + 90, perspective: "1400px" }}
        role="group"
        aria-roledescription="carrusel de materiales"
        aria-label="Materiales de Granalto"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="absolute left-1/2 top-1/2 touch-pan-y"
          style={{
            transformStyle: "preserve-3d",
            transform: `translate(-50%, -50%) rotateY(${rotation}deg)`,
            width: dims.cardW,
            height: dims.cardH,
          }}
        >
          {materials.map((material, i) => {
            const cardAngle = i * step;
            const eff = (((rotation + cardAngle) % 360) + 360) % 360;
            const delta = eff > 180 ? 360 - eff : eff; // 0 = al frente
            const front = delta < step / 2;
            const opacity = 0.28 + 0.72 * Math.max(0, Math.cos((delta * Math.PI) / 180));

            return (
              <Link
                key={material.id}
                href={`/materiales/${material.slug}`}
                aria-hidden={!front}
                tabIndex={front ? 0 : -1}
                className="group absolute inset-0 block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{
                  transform: `rotateY(${cardAngle}deg) translateZ(${dims.radius}px)`,
                  opacity,
                  pointerEvents: delta < 90 ? "auto" : "none",
                }}
                draggable={false}
              >
                <div className="relative h-full w-full overflow-hidden rounded-sm bg-stone-beige shadow-[0_10px_40px_rgba(17,17,17,0.18)]">
                  <Image
                    src={material.coverImage.src}
                    alt={material.coverImage.alt}
                    fill
                    sizes="240px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[0.65rem] uppercase tracking-[0.18em] text-stone-beige">
                      Material
                    </p>
                    <h3 className="mt-1 font-sans text-lg font-bold text-ivory">
                      {material.name}
                    </h3>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Controles */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Material anterior"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Reanudar giro" : "Pausar giro"}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
        >
          {paused ? (
            <Play aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Pause aria-hidden="true" className="h-4 w-4" />
          )}
        </button>
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Material siguiente"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-ivory"
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
      <p className="mt-4 text-center text-xs text-mineral">
        Arrastre para girar o use las flechas · toque un material para ver su ficha
      </p>
    </div>
  );
}
