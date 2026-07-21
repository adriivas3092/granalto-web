"use client";

import { forwardRef, useMemo } from "react";
import { getMaterial } from "@/data/visualizer/materials";
import { getLighting } from "@/data/visualizer/lighting";
import type { Environment, Surface } from "@/data/visualizer/types";

const TILE = 130;
const W = 1200;
const H = 800;

type Props = {
  environment: Environment;
  resolve: (surfaceId: string) => string | undefined;
  lightingId: string;
  idPrefix: string;
  activeSurfaceId?: string | null;
  onPickSurface?: (surfaceId: string) => void;
  className?: string;
};

/**
 * Lienzo por capas. Dos modos:
 *  - Foto: dibuja la fotografía real y compone cada material sobre su máscara
 *    tomando la iluminación de la foto (blend "luminosity") → realista.
 *  - Vectorial: escena SVG ilustrada (fallback sin foto).
 */
export const EnvironmentCanvas = forwardRef<SVGSVGElement, Props>(function EnvironmentCanvas(
  { environment, resolve, lightingId, idPrefix, activeSurfaceId, onPickSurface, className },
  ref,
) {
  const light = getLighting(lightingId);
  const surfaces = useMemo(() => [...environment.surfaces].sort((a, b) => a.z - b.z), [environment]);
  const photoMode = Boolean(environment.photo);
  const lightStrength = environment.photoLightStrength ?? 0.9;

  const interactionProps = (s: Surface) =>
    onPickSurface
      ? {
          onClick: () => onPickSurface(s.id),
          tabIndex: 0,
          role: "button",
          "aria-label": `Seleccionar superficie ${s.name}`,
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onPickSurface(s.id);
            }
          },
          style: { cursor: "pointer" as const },
        }
      : {};

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
        {photoMode &&
          surfaces.map((s) => (
            <clipPath key={s.id} id={`${idPrefix}-clip-${s.id}`}>
              <path d={s.path} />
            </clipPath>
          ))}
      </defs>

      {/* Base */}
      {photoMode ? (
        <image href={environment.photo!} x="0" y="0" width={W} height={H} preserveAspectRatio="xMidYMid slice" />
      ) : (
        <>
          <rect x="0" y="0" width={W} height={H} fill={environment.baseFill} />
          {environment.decor && <g dangerouslySetInnerHTML={{ __html: environment.decor }} />}
        </>
      )}

      {/* Superficies */}
      {surfaces.map((s) => {
        const mat = getMaterial(resolve(s.id));
        const fill = mat?.texture ? `url(#${idPrefix}-pat-${s.id})` : mat?.swatch ?? "#d8d4cc";
        const isActive = activeSurfaceId === s.id;

        if (photoMode) {
          const clip = `url(#${idPrefix}-clip-${s.id})`;
          return (
            <g key={s.id}>
              {mat && (
                <g clipPath={clip} style={{ transition: "opacity 240ms ease" }}>
                  <rect x="0" y="0" width={W} height={H} fill={fill} />
                  {/* Iluminación real de la foto sobre el material */}
                  <image
                    href={environment.photo!}
                    x="0"
                    y="0"
                    width={W}
                    height={H}
                    preserveAspectRatio="xMidYMid slice"
                    opacity={lightStrength}
                    style={{ mixBlendMode: "luminosity" }}
                  />
                </g>
              )}
              {/* Zona de interacción */}
              <path d={s.path} fill="#000" fillOpacity={0} {...interactionProps(s)} />
              {onPickSurface && isActive && (
                <path
                  d={s.path}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={5}
                  strokeDasharray="14 8"
                  pointerEvents="none"
                  style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.7))" }}
                />
              )}
            </g>
          );
        }

        // Modo vectorial
        return (
          <g key={s.id}>
            <path d={s.path} fill={fill} style={{ transition: "fill 240ms ease" }} {...interactionProps(s)} />
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
          width={W}
          height={H}
          fill={light.overlay}
          opacity={light.overlayOpacity}
          style={{ mixBlendMode: light.blend }}
          pointerEvents="none"
        />
      )}
    </svg>
  );
});
