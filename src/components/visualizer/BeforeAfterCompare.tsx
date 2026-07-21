"use client";

import { useState } from "react";
import { EnvironmentCanvas } from "./EnvironmentCanvas";
import type { Environment } from "@/data/visualizer/types";

/** Comparador antes/después con control deslizante accesible. */
export function BeforeAfterCompare({
  environment,
  resolveCustom,
  lightingId,
}: {
  environment: Environment;
  resolveCustom: (surfaceId: string) => string | undefined;
  lightingId: string;
}) {
  const [pos, setPos] = useState(50);
  const resolveOriginal = (surfaceId: string) =>
    environment.surfaces.find((s) => s.id === surfaceId)?.defaultMaterialId;

  return (
    <div className="relative overflow-hidden rounded-sm bg-stone-beige">
      {/* Antes (original) */}
      <EnvironmentCanvas
        environment={environment}
        resolve={resolveOriginal}
        lightingId={lightingId}
        idPrefix="cmp-before"
        className="block h-auto w-full"
      />
      {/* Después (personalizado), recortado */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <EnvironmentCanvas
          environment={environment}
          resolve={resolveCustom}
          lightingId={lightingId}
          idPrefix="cmp-after"
          className="block h-auto w-full"
        />
      </div>

      {/* Divisor */}
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -ml-px w-0.5 bg-white shadow-[0_0_4px_rgba(0,0,0,0.5)]" />
        <div className="absolute top-1/2 -ml-4 -mt-4 flex h-8 w-8 -translate-y-0 items-center justify-center rounded-full bg-white text-ink shadow">
          <span aria-hidden="true" className="text-xs">⇆</span>
        </div>
      </div>

      <span className="absolute left-3 top-3 rounded-sm bg-black/55 px-2 py-1 text-[0.65rem] uppercase tracking-wide text-white">
        Antes
      </span>
      <span className="absolute right-3 top-3 rounded-sm bg-black/55 px-2 py-1 text-[0.65rem] uppercase tracking-wide text-white">
        Después
      </span>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Comparar antes y después"
        className="absolute inset-x-0 bottom-0 top-0 m-auto h-10 w-full cursor-ew-resize appearance-none bg-transparent [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:w-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:opacity-0"
      />
    </div>
  );
}
