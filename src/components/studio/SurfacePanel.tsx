"use client";

import { Plus, Trash2, Eye, EyeOff, Check, X, RotateCw, Lock, Unlock } from "lucide-react";
import type { StudioSurface, SurfaceTransform } from "@/lib/studio/types";
import { cn } from "@/lib/utils";

type Props = {
  surfaces: StudioSurface[];
  selectedId?: string;
  tool: "draw" | "select";
  draftLength: number;
  productNameFor: (s: StudioSurface) => string | undefined;
  onNewSurface: () => void;
  onCloseDraft: () => void;
  onCancelDraft: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onToggleHidden: (id: string) => void;
  onToggleLocked: (id: string) => void;
  onChangeTransform: (patch: Partial<SurfaceTransform>) => void;
};

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <label className="block">
      <span className="flex justify-between text-xs text-charcoal">
        <span>{label}</span>
        <span className="text-mineral">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1 w-full accent-ink"
      />
    </label>
  );
}

export function SurfacePanel({
  surfaces,
  selectedId,
  tool,
  draftLength,
  productNameFor,
  onNewSurface,
  onCloseDraft,
  onCancelDraft,
  onSelect,
  onDelete,
  onRename,
  onToggleHidden,
  onToggleLocked,
  onChangeTransform,
}: Props) {
  const selected = surfaces.find((s) => s.id === selectedId);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Superficies</h3>
          {tool === "select" && (
            <button
              type="button"
              onClick={onNewSurface}
              className="inline-flex items-center gap-1 rounded-sm border border-ink px-2.5 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-ink hover:text-ivory"
            >
              <Plus aria-hidden="true" className="h-3.5 w-3.5" />
              Nueva
            </button>
          )}
        </div>

        {tool === "draw" && (
          <div className="mt-3 rounded-sm border border-ink/30 bg-ink/5 p-3">
            <p className="text-xs text-charcoal">
              Toque sobre la imagen para marcar el contorno de la superficie
              ({draftLength} {draftLength === 1 ? "punto" : "puntos"}). Necesita
              al menos 3.
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={onCloseDraft}
                disabled={draftLength < 3}
                className="inline-flex items-center gap-1 rounded-sm bg-ink px-2.5 py-1.5 text-xs font-medium text-ivory disabled:opacity-40"
              >
                <Check aria-hidden="true" className="h-3.5 w-3.5" />
                Cerrar
              </button>
              <button
                type="button"
                onClick={onCancelDraft}
                className="inline-flex items-center gap-1 rounded-sm border border-stone-beige px-2.5 py-1.5 text-xs text-charcoal"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
                Cancelar
              </button>
            </div>
          </div>
        )}

        <ul className="mt-3 space-y-1.5">
          {surfaces.length === 0 && tool === "select" && (
            <li className="text-xs text-mineral">
              No hay superficies. Pulse “Nueva” y dibuje un contorno.
            </li>
          )}
          {surfaces.map((s) => (
            <li
              key={s.id}
              className={cn(
                "flex items-center gap-2 rounded-sm border px-2 py-1.5",
                s.id === selectedId ? "border-ink bg-ink/5" : "border-stone-beige",
              )}
            >
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                className="flex-1 truncate text-left text-sm text-ink"
              >
                {s.name}
                {productNameFor(s) && (
                  <span className="text-mineral"> · {productNameFor(s)}</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => onToggleLocked(s.id)}
                aria-label={s.locked ? "Desbloquear superficie" : "Bloquear superficie"}
                className={cn("hover:text-ink", s.locked ? "text-ink" : "text-mineral")}
              >
                {s.locked ? (
                  <Lock aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Unlock aria-hidden="true" className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => onToggleHidden(s.id)}
                aria-label={s.hidden ? "Mostrar superficie" : "Ocultar superficie"}
                className="text-mineral hover:text-ink"
              >
                {s.hidden ? (
                  <EyeOff aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <Eye aria-hidden="true" className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => onDelete(s.id)}
                aria-label="Borrar superficie"
                className="text-mineral hover:text-[#a03826]"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selected && (
        <fieldset
          disabled={selected.locked}
          className="space-y-4 border-t border-stone-beige pt-4 disabled:opacity-60"
        >
          {selected.locked && (
            <p className="flex items-center gap-1.5 text-xs text-mineral">
              <Lock aria-hidden="true" className="h-3.5 w-3.5" />
              Superficie bloqueada. Desbloquéela para editarla.
            </p>
          )}
          <div>
            <label htmlFor="surf-name" className="text-xs text-charcoal">
              Nombre
            </label>
            <input
              id="surf-name"
              type="text"
              value={selected.name}
              onChange={(e) => onRename(selected.id, e.target.value)}
              className="mt-1 w-full rounded-sm border border-stone-beige bg-white px-2.5 py-1.5 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <span className="text-xs text-charcoal">Rotación rápida</span>
            <div className="mt-1 flex gap-1.5">
              {[0, 45, 90].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => onChangeTransform({ rotation: deg })}
                  className={cn(
                    "flex-1 rounded-sm border px-2 py-1.5 text-xs transition-colors",
                    selected.transform.rotation === deg
                      ? "border-ink bg-ink text-ivory"
                      : "border-stone-beige text-charcoal hover:border-mineral",
                  )}
                >
                  {deg}°
                </button>
              ))}
              <button
                type="button"
                onClick={() =>
                  onChangeTransform({
                    rotation: (selected.transform.rotation + 15) % 360,
                  })
                }
                aria-label="Girar 15 grados"
                className="rounded-sm border border-stone-beige px-2 py-1.5 text-charcoal hover:border-mineral"
              >
                <RotateCw aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <Slider
            label="Escala (formato)"
            value={selected.transform.scale}
            min={0.3}
            max={3}
            step={0.05}
            display={`${selected.transform.scale.toFixed(2)}×`}
            onChange={(v) => onChangeTransform({ scale: v })}
          />
          <Slider
            label="Rotación"
            value={selected.transform.rotation}
            min={0}
            max={359}
            step={1}
            display={`${Math.round(selected.transform.rotation)}°`}
            onChange={(v) => onChangeTransform({ rotation: v })}
          />
          <Slider
            label="Opacidad"
            value={selected.transform.opacity}
            min={0.2}
            max={1}
            step={0.02}
            display={`${Math.round(selected.transform.opacity * 100)}%`}
            onChange={(v) => onChangeTransform({ opacity: v })}
          />
          <Slider
            label="Brillo"
            value={selected.transform.brightness}
            min={0.6}
            max={1.4}
            step={0.02}
            display={selected.transform.brightness.toFixed(2)}
            onChange={(v) => onChangeTransform({ brightness: v })}
          />

          <div>
            <span className="text-xs text-charcoal">Patrón de colocación</span>
            <div className="mt-1 grid grid-cols-2 gap-1.5">
              {(
                [
                  ["recto", "Recto"],
                  ["desplazado", "Desplazado"],
                  ["diagonal", "Diagonal"],
                  ["mosaico", "Mosaico"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChangeTransform({ pattern: value })}
                  aria-pressed={selected.transform.pattern === value}
                  className={cn(
                    "rounded-sm border px-2 py-1.5 text-xs transition-colors",
                    selected.transform.pattern === value
                      ? "border-ink bg-ink text-ivory"
                      : "border-stone-beige text-charcoal hover:border-mineral",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Slider
            label="Ancho de junta"
            value={selected.transform.groutWidth}
            min={0}
            max={10}
            step={0.5}
            display={selected.transform.groutWidth === 0 ? "Sin junta" : `${selected.transform.groutWidth}`}
            onChange={(v) => onChangeTransform({ groutWidth: v })}
          />

          <label className="flex items-center justify-between text-xs text-charcoal">
            <span>Color de junta</span>
            <input
              type="color"
              value={selected.transform.groutColor}
              onChange={(e) => onChangeTransform({ groutColor: e.target.value })}
              className="h-7 w-12 cursor-pointer rounded-sm border border-stone-beige bg-white"
              aria-label="Color de junta"
            />
          </label>

          <label
            className={cn(
              "flex items-start gap-2 text-xs",
              selected.points.length === 4 ? "text-charcoal" : "text-mineral",
            )}
          >
            <input
              type="checkbox"
              checked={selected.transform.perspective}
              disabled={selected.points.length !== 4}
              onChange={(e) => onChangeTransform({ perspective: e.target.checked })}
              className="mt-0.5 h-4 w-4 accent-ink"
            />
            <span>
              Ajustar a la perspectiva
              {selected.points.length !== 4 && " (marque la superficie con 4 puntos)"}
            </span>
          </label>
        </fieldset>
      )}
    </div>
  );
}
