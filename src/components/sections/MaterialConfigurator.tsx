"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Material } from "@/types";
import { configSpaces, getMaterialFill } from "@/data/configurator";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Assignments = Record<string, Record<string, string>>; // space -> zone -> materialSlug

/**
 * Configurador de superficies. El usuario elige espacio (cocina/baño), zona
 * (sobres, salpicadero, revestimiento, piso) y material; la escena vectorial
 * muestra el material aplicado con transiciones suaves. Preparado para usar
 * texturas reales sin costura por material en el futuro.
 */
export function MaterialConfigurator({ materials }: { materials: Material[] }) {
  const [spaceId, setSpaceId] = useState<string>(configSpaces[0].id);
  const [zoneId, setZoneId] = useState<string>(configSpaces[0].zones[0].id);
  const [assignments, setAssignments] = useState<Assignments>(() =>
    Object.fromEntries(configSpaces.map((s) => [s.id, { ...s.defaults }])),
  );

  const space = configSpaces.find((s) => s.id === spaceId)!;
  const zone = space.zones.find((z) => z.id === zoneId) ?? space.zones[0];

  // Mapa superficie -> relleno del material asignado.
  const surfaceFills = useMemo(() => {
    const map: Record<string, { base: string; vein: string }> = {};
    for (const z of space.zones) {
      const slug = assignments[space.id]?.[z.id];
      const fill = getMaterialFill(slug);
      for (const sid of z.surfaceIds) map[sid] = fill;
    }
    return map;
  }, [space, assignments]);

  const applyMaterial = (slug: string) => {
    setAssignments((prev) => ({
      ...prev,
      [space.id]: { ...prev[space.id], [zone.id]: slug },
    }));
    trackEvent({ name: "material_view", params: { materialSlug: slug } });
  };

  const selectSpace = (id: string) => {
    setSpaceId(id);
    const first = configSpaces.find((s) => s.id === id)!.zones[0];
    setZoneId(first.id);
  };

  const materialForZone = (zid: string) =>
    materials.find((m) => m.slug === assignments[space.id]?.[zid]);

  const fillFor = (id: string) => surfaceFills[id] ?? { base: "#d7d0c5", vein: "#9b9b96" };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      {/* Escena */}
      <div>
        {/* Selector de espacio */}
        <div role="tablist" aria-label="Espacio" className="mb-4 flex gap-2">
          {configSpaces.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === spaceId}
              onClick={() => selectSpace(s.id)}
              className={cn(
                "min-h-[40px] rounded-sm border px-5 py-2 text-sm transition-colors",
                s.id === spaceId
                  ? "border-ink bg-ink text-ivory"
                  : "border-stone-beige bg-white text-charcoal hover:border-mineral",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-sm border border-stone-beige bg-white">
          {spaceId === "cocina" ? (
            <KitchenScene fillFor={fillFor} activeSurfaces={zone.surfaceIds} onPickZone={setZoneId} />
          ) : (
            <BathScene fillFor={fillFor} activeSurfaces={zone.surfaceIds} onPickZone={setZoneId} />
          )}
        </div>

        {/* Zonas */}
        <div role="tablist" aria-label="Zona a configurar" className="mt-4 flex flex-wrap gap-2">
          {space.zones.map((z) => {
            const mat = materialForZone(z.id);
            return (
              <button
                key={z.id}
                type="button"
                role="tab"
                aria-selected={z.id === zoneId}
                onClick={() => setZoneId(z.id)}
                className={cn(
                  "flex min-h-[40px] items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors",
                  z.id === zoneId
                    ? "border-ink bg-ink/5 text-ink"
                    : "border-stone-beige bg-white text-charcoal hover:border-mineral",
                )}
              >
                <span
                  aria-hidden="true"
                  className="h-4 w-4 rounded-full border border-black/10"
                  style={{ background: getMaterialFill(mat?.slug ?? "").base }}
                />
                {z.label}
                {mat && <span className="text-mineral">· {mat.name}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel de materiales */}
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-mineral">
          Aplicar a: {zone.label}
        </p>
        <h3 className="mt-1 font-sans text-xl font-bold text-ink">
          Elija un material
        </h3>
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3">
          {materials.map((m) => {
            const fill = getMaterialFill(m.slug);
            const selected = assignments[space.id]?.[zone.id] === m.slug;
            return (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => applyMaterial(m.slug)}
                  aria-pressed={selected}
                  className={cn(
                    "group w-full rounded-sm border p-1.5 text-left transition-colors",
                    selected ? "border-ink" : "border-transparent hover:border-stone-beige",
                  )}
                >
                  <span
                    className="block aspect-square w-full rounded-sm border border-black/10"
                    style={{ background: fill.base }}
                  />
                  <span className="mt-1.5 block text-xs leading-tight text-charcoal">
                    {m.name}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 rounded-sm bg-ivory p-4">
          <p className="text-sm font-medium text-ink">Su combinación</p>
          <ul className="mt-2 space-y-1 text-sm text-charcoal/80">
            {space.zones.map((z) => (
              <li key={z.id} className="flex justify-between gap-3">
                <span>{z.label}</span>
                <span className="text-ink">{materialForZone(z.id)?.name ?? "—"}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/contacto"
            onClick={() => trackEvent({ name: "cta_advisory_click", params: { source: "configurador" } })}
            className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-charcoal"
          >
            Consultar esta combinación
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <p className="mt-3 text-xs text-mineral">
          Vista referencial. La apariencia, tonalidad y veta reales pueden variar
          según el lote; en piedra natural cada pieza es única.
        </p>
      </div>
    </div>
  );
}

/* ---------- Escenas vectoriales ---------- */

type SceneProps = {
  fillFor: (id: string) => { base: string; vein: string };
  activeSurfaces: string[];
  onPickZone: (zoneId: string) => void;
};

/** Superficie rellenable con transición suave de color y sutil brillo. */
function Surface({
  id,
  d,
  fillFor,
  active,
  zoneId,
  onPickZone,
  sheen = true,
}: {
  id: string;
  d: string;
  fillFor: SceneProps["fillFor"];
  active: boolean;
  zoneId: string;
  onPickZone: (z: string) => void;
  sheen?: boolean;
}) {
  const { base } = fillFor(id);
  return (
    <g
      onClick={() => onPickZone(zoneId)}
      className="cursor-pointer"
      style={{ transition: "fill 500ms ease" }}
    >
      <path d={d} style={{ fill: base, transition: "fill 500ms ease" }} />
      {sheen && <path d={d} fill="url(#sheen)" opacity={0.5} />}
      <path
        d={d}
        fill="none"
        stroke={active ? "#111111" : "rgba(17,17,17,0.12)"}
        strokeWidth={active ? 3 : 1}
        style={{ transition: "stroke 200ms ease, stroke-width 200ms ease" }}
      />
    </g>
  );
}

function SceneDefs() {
  return (
    <defs>
      <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="1" stopColor="#000000" stopOpacity="0.06" />
      </linearGradient>
    </defs>
  );
}

const WOOD = "#b39a76";
const WOOD_DARK = "#9c8360";

function KitchenScene({ fillFor, activeSurfaces, onPickZone }: SceneProps) {
  const isActive = (id: string) => activeSurfaces.includes(id);
  return (
    <svg viewBox="0 0 1000 600" className="w-full" role="img" aria-label="Cocina configurable">
      <SceneDefs />
      {/* Pared */}
      <rect x="0" y="0" width="1000" height="600" fill="#f4f1eb" />
      {/* Piso */}
      <Surface id="k-floor" d="M0 520 H1000 V600 H0 Z" fillFor={fillFor} active={isActive("k-floor")} zoneId="piso" onPickZone={onPickZone} />
      {/* Muebles superiores */}
      <rect x="150" y="70" width="470" height="120" fill={WOOD} />
      <line x1="307" y1="70" x2="307" y2="190" stroke={WOOD_DARK} strokeWidth="2" />
      <line x1="464" y1="70" x2="464" y2="190" stroke={WOOD_DARK} strokeWidth="2" />
      {/* Campana */}
      <rect x="360" y="70" width="100" height="40" fill="#c9c4bb" />
      {/* Salpicadero */}
      <Surface id="k-backsplash" d="M150 210 H620 V282 H150 Z" fillFor={fillFor} active={isActive("k-backsplash")} zoneId="salpicadero" onPickZone={onPickZone} />
      {/* Sobre */}
      <Surface id="k-counter" d="M138 282 H632 V304 H138 Z" fillFor={fillFor} active={isActive("k-counter")} zoneId="sobres" onPickZone={onPickZone} />
      {/* Muebles inferiores */}
      <rect x="150" y="304" width="470" height="170" fill={WOOD} />
      <line x1="307" y1="304" x2="307" y2="474" stroke={WOOD_DARK} strokeWidth="2" />
      <line x1="464" y1="304" x2="464" y2="474" stroke={WOOD_DARK} strokeWidth="2" />
      <rect x="185" y="330" width="90" height="10" rx="4" fill={WOOD_DARK} opacity="0.5" />
      {/* Isla */}
      <rect x="700" y="360" width="230" height="150" fill={WOOD} />
      <Surface id="k-island-top" d="M688 338 H942 V362 H688 Z" fillFor={fillFor} active={isActive("k-island-top")} zoneId="sobres" onPickZone={onPickZone} />
      {/* Grifo */}
      <path d="M400 282 q0 -34 26 -34 q22 0 22 22" fill="none" stroke="#8a8a85" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function BathScene({ fillFor, activeSurfaces, onPickZone }: SceneProps) {
  const isActive = (id: string) => activeSurfaces.includes(id);
  return (
    <svg viewBox="0 0 1000 600" className="w-full" role="img" aria-label="Baño configurable">
      <SceneDefs />
      <rect x="0" y="0" width="1000" height="600" fill="#f4f1eb" />
      {/* Revestimiento de pared */}
      <Surface id="b-wall" d="M60 40 H940 V470 H60 Z" fillFor={fillFor} active={isActive("b-wall")} zoneId="revestimiento" onPickZone={onPickZone} />
      {/* Piso */}
      <Surface id="b-floor" d="M0 520 H1000 V600 H0 Z" fillFor={fillFor} active={isActive("b-floor")} zoneId="piso" onPickZone={onPickZone} />
      {/* Espejo */}
      <rect x="200" y="90" width="260" height="180" rx="4" fill="#dfe6e6" stroke="#c9c4bb" strokeWidth="3" />
      <rect x="210" y="100" width="240" height="160" rx="3" fill="#eef2f2" opacity="0.6" />
      {/* Mueble de baño */}
      <rect x="170" y="330" width="320" height="140" fill={WOOD} />
      <line x1="330" y1="330" x2="330" y2="470" stroke={WOOD_DARK} strokeWidth="2" />
      {/* Sobre de baño */}
      <Surface id="b-counter" d="M160 300 H500 V330 H160 Z" fillFor={fillFor} active={isActive("b-counter")} zoneId="sobres" onPickZone={onPickZone} />
      {/* Lavamanos */}
      <ellipse cx="330" cy="315" rx="70" ry="12" fill="#ffffff" stroke="#c9c4bb" strokeWidth="2" />
      {/* Grifo */}
      <path d="M330 300 q0 -30 24 -30 q20 0 20 20" fill="none" stroke="#8a8a85" strokeWidth="6" strokeLinecap="round" />
      {/* Ducha / mampara a la derecha */}
      <rect x="600" y="120" width="300" height="350" rx="4" fill="#eef2f2" opacity="0.35" stroke="#c9c4bb" strokeWidth="2" />
      <circle cx="750" cy="160" r="14" fill="none" stroke="#8a8a85" strokeWidth="5" />
    </svg>
  );
}
