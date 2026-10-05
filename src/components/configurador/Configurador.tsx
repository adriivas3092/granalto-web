"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/store/format";
import {
  MEDIDAS_LIMITES,
  SALPICADERO,
  PLAZO_DIAS_HABILES,
  getGeometria,
  getMaterial,
} from "@/data/configurador";
import { calcularPrecio } from "@/lib/configurador/pricing";
import { useConfigurador, PASOS, TOTAL_PASOS } from "@/store/configuradorStore";
import {
  StepTipo,
  StepMaterial,
  StepMedidas,
  StepMoldura,
  StepSalpicadero,
  StepResumen,
  StepDatos,
} from "@/components/configurador/steps";

const stepComponents = [
  StepTipo,
  StepMaterial,
  StepMedidas,
  StepMoldura,
  StepSalpicadero,
  StepResumen,
  StepDatos,
];

export function Configurador() {
  const [mounted, setMounted] = useState(false);
  const s = useConfigurador();
  useEffect(() => setMounted(true), []);

  const geo = getGeometria(s.geometriaId);
  const geoPersonalizado = geo?.autoPrecio === false;

  // Pasos visibles:
  //  - geometría personalizada → tipo + datos.
  //  - derivado por medidas fuera de rango → tipo, material, medidas + datos.
  //  - normal → todos.
  const visibles = useMemo(() => {
    if (geoPersonalizado) return [0, TOTAL_PASOS - 1];
    if (s.derivar) return [0, 1, 2, TOTAL_PASOS - 1];
    return [...Array(TOTAL_PASOS).keys()];
  }, [geoPersonalizado, s.derivar]);

  if (!mounted) return <div className="min-h-[60svh]" />;

  const paso = visibles.includes(s.paso) ? s.paso : 0;
  const idxVisible = visibles.indexOf(paso);
  const esUltimo = idxVisible === visibles.length - 1; // paso de datos
  const Current = stepComponents[paso];

  const puedeAvanzar = validar(paso, s);

  const goNext = () => {
    if (!puedeAvanzar) return;
    const next = visibles[Math.min(visibles.length - 1, idxVisible + 1)];
    s.setPaso(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goPrev = () => {
    const prev = visibles[Math.max(0, idxVisible - 1)];
    s.setPaso(prev);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        {/* Barra de progreso */}
        <ol className="mb-8 flex flex-wrap gap-x-4 gap-y-2 text-xs">
          {visibles.map((pi, i) => {
            const done = i < idxVisible;
            const active = pi === paso;
            return (
              <li key={pi} className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full border text-[11px]",
                    active
                      ? "border-ink bg-ink text-ivory"
                      : done
                        ? "border-ink bg-ivory text-ink"
                        : "border-stone-beige text-mineral",
                  )}
                >
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className={cn("hidden sm:inline", active ? "text-ink" : "text-mineral")}>
                  {PASOS[pi].label}
                </span>
              </li>
            );
          })}
        </ol>

        <div className="min-h-[40svh]">
          <Current />
        </div>

        {/* Navegación */}
        {!esUltimo && (
          <div className="mt-10 flex items-center justify-between gap-3 border-t border-stone-beige pt-6">
            <button
              type="button"
              onClick={goPrev}
              disabled={idxVisible === 0}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-stone-beige bg-white px-5 py-2.5 text-sm text-charcoal transition-colors hover:border-ink disabled:invisible"
            >
              <ArrowLeft className="h-4 w-4" /> Atrás
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!puedeAvanzar}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-6 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-40"
            >
              {paso === 5 ? "Continuar" : "Siguiente"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
        {esUltimo && idxVisible > 0 && (
          <div className="mt-10 border-t border-stone-beige pt-6">
            <button
              type="button"
              onClick={goPrev}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-stone-beige bg-white px-5 py-2.5 text-sm text-charcoal hover:border-ink"
            >
              <ArrowLeft className="h-4 w-4" /> Atrás
            </button>
          </div>
        )}
      </div>

      {/* Resumen en vivo */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <LiveSummary />
      </aside>
    </div>
  );
}

function LiveSummary() {
  const s = useConfigurador();
  const geo = getGeometria(s.geometriaId);
  const material = getMaterial(s.materialId);
  const color = material?.colores.find((c) => c.id === s.colorId);
  const price = calcularPrecio(s);
  const esPersonalizado = geo?.autoPrecio === false || s.derivar;

  return (
    <div className="rounded-sm border border-stone-beige bg-white p-5">
      <h3 className="text-sm font-medium text-ink">Tu configuración</h3>
      <dl className="mt-3 space-y-2 text-sm">
        <Row label="Proyecto" value={geo?.nombre} />
        {!esPersonalizado && (
          <>
            <Row label="Material" value={material ? `${material.nombre} · ${material.espesorMm} mm` : undefined} />
            <Row label="Color" value={color?.nombre} />
            <Row label="Moldura" value={s.moldura == null ? undefined : s.moldura ? "Con moldura" : "Sin moldura"} />
            <Row
              label="Salpicadero"
              value={
                s.salpicaderoTipo === "no"
                  ? undefined
                  : s.salpicaderoTipo === "10"
                    ? "10 cm"
                    : s.salpicaderoAlturaCm
                      ? `${s.salpicaderoAlturaCm} cm`
                      : undefined
              }
            />
            {price.areaTotal > 0 && <Row label="Área total" value={`${price.areaTotal.toFixed(2)} m²`} />}
          </>
        )}
      </dl>

      <div className="mt-4 border-t border-stone-beige pt-4">
        {esPersonalizado ? (
          <p className="text-sm text-charcoal/80">Proyecto personalizado — te cotiza un asesor.</p>
        ) : price.tienePrecio ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-mineral">Costo final</span>
            <span className="text-lg font-bold text-ink">{formatPrice(price.total, price.moneda)}</span>
          </div>
        ) : (
          <p className="text-sm text-ink">
            <span className="font-medium">Calculando…</span>
            <span className="mt-1 block text-xs text-charcoal/70">
              {price.areaTotal > 0 ? `${price.areaTotal.toFixed(2)} m² · ` : ""}precios por material en preparación.
            </span>
          </p>
        )}
        <p className="mt-3 text-[11px] leading-relaxed text-mineral">
          Plazo estimado: {PLAZO_DIAS_HABILES} días hábiles. Medidas sujetas a validación técnica.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-mineral">{label}</dt>
      <dd className={cn("text-right", value ? "text-ink" : "text-stone-beige")}>{value ?? "—"}</dd>
    </div>
  );
}

/** Reglas de avance por paso. */
function validar(paso: number, s: ReturnType<typeof useConfigurador.getState>): boolean {
  switch (paso) {
    case 0:
      return !!s.geometriaId;
    case 1:
      return !!s.materialId && !!s.colorId;
    case 2: {
      const geo = getGeometria(s.geometriaId);
      if (!geo || geo.tramos.length === 0) return false;
      const L = MEDIDAS_LIMITES;
      // Válido para continuar automáticamente: todas las piezas positivas y
      // dentro del máximo estándar. Si alguna excede, no avanza por aquí: se
      // ofrece derivar a cotización personalizada en el propio paso.
      return geo.tramos.every((t) => {
        const m = s.medidas[t.key];
        return (
          m &&
          m.largo > 0 &&
          m.prof > 0 &&
          m.largo <= L.largoMaxMm &&
          m.prof <= L.profMaxMm
        );
      });
    }
    case 3:
      return s.moldura !== null;
    case 4:
      if (s.salpicaderoTipo === "custom") {
        return (
          s.salpicaderoAlturaCm >= SALPICADERO.customMinCm &&
          s.salpicaderoAlturaCm <= SALPICADERO.customMaxCm
        );
      }
      return true;
    default:
      return true;
  }
}
