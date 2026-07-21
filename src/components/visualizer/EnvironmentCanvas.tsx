"use client";

import { forwardRef, useMemo } from "react";
import { getMaterial } from "@/data/visualizer/materials";
import { getLighting } from "@/data/visualizer/lighting";
import type { Environment } from "@/data/visualizer/types";

const TILE = 130;

type Props = {
  environment: Environment;
  /** Devuelve el id de material aplicado a una superficie. */
  resolve: (surfaceId: string) => string | undefined;
  lightingId: string;
  idPrefix: string;
  activeSurfaceId?: string | null;
  /** Permite seleccionar superficies haciendo clic sobre la escena. */
  onPickSurface?: (surfaceId: string) => void;
  className?: string;
};

/** Lienzo vectorial por capas. Cada superficie se rellena con su textura. */
export const EnvironmentCanvas = forwardRef<SVGSVGElement, Props>(function EnvironmentCanvas(
  { environment, resolve, lightingId, idPrefix, activeSurfaceId, onPickSurface, className },
  ref,
) {
  const light = getLighting(lightingId);
  const surfaces = useMemo(
    () => [...environment.surfaces].sort((a, b) => a.z - b.z),
    [environment],
  );

  return (
    <svg
      ref={ref}
      viewBox={environment.viewBox}
      className={className}
      role="img"
      aria-label={`Vista del ambiente: ${environment.name}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ filter: light.filter }}
    >
      <defs>
        {surfaces.map((s) => {
          const mat = getMaterial(resolve(s.id));
          if (!mat?.texture) return null;
          const scale = s.textureScale ?? 1;
          const rot = s.textureRotation ?? 0;
          return (
            <pattern
              key={s.id}
              id={`${idPrefix}-pat-${s.id}`}
              patternUnits="userSpaceOnUse"
              width={TILE}
              height={TILE}
              patternTransform={`scale(${scale}) rotate(${rot})`}
            >
              <image href={mat.texture} width={TILE} height={TILE} preserveAspectRatio="xMidYMid slice" />
            </pattern>
          );
        })}
      </defs>

      <rect x="0" y="0" width="1200" height="800" fill={environment.baseFill} />
      {environment.decor && <g dangerouslySetInnerHTML={{ __html: environment.decor }} />}

      {surfaces.map((s) => {
        const mat = getMaterial(resolve(s.id));
        const fill = mat?.texture ? `url(#${idPrefix}-pat-${s.id})` : mat?.swatch ?? "#d8d4cc";
        const isActive = activeSurfaceId === s.id;
        return (
          <g key={s.id}>
            <path
              d={s.path}
              fill={fill}
              className="visualizer-surface"
              style={{ transition: "fill 240ms ease", cursor: onPickSurface ? "pointer" : undefined }}
              onClick={onPickSurface ? () => onPickSurface(s.id) : undefined}
              tabIndex={onPickSurface ? 0 : undefined}
              role={onPickSurface ? "button" : undefined}
              aria-label={onPickSurface ? `Seleccionar superficie ${s.name}` : undefined}
              onKeyDown={
                onPickSurface
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onPickSurface(s.id);
                      }
                    }
                  : undefined
              }
            />
            {s.shade ? <path d={s.path} fill="#000" opacity={s.shade} pointerEvents="none" /> : null}
            {onPickSurface && isActive ? (
              <path
                d={s.path}
                fill="none"
                stroke="#ffffff"
                strokeWidth={5}
                strokeDasharray="14 8"
                pointerEvents="none"
                style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.6))" }}
              />
            ) : null}
          </g>
        );
      })}

      {environment.overlay && <g dangerouslySetInnerHTML={{ __html: environment.overlay }} pointerEvents="none" />}

      {light.overlayOpacity > 0 && (
        <rect
          x="0"
          y="0"
          width="1200"
          height="800"
          fill={light.overlay}
          opacity={light.overlayOpacity}
          style={{ mixBlendMode: light.blend }}
          pointerEvents="none"
        />
      )}
    </svg>
  );
});
