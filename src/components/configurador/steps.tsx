"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Pencil, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/store/format";
import { GeoDiagram } from "@/components/configurador/GeoDiagram";
import {
  GEOMETRIAS,
  MATERIALES,
  MEDIDAS_LIMITES,
  SALPICADERO,
  PLAZO_DIAS_HABILES,
  getGeometria,
  getMaterial,
} from "@/data/configurador";
import { calcularPrecio } from "@/lib/configurador/pricing";
import { useConfigurador, PASOS, MM_POR_UNIDAD, type Unidad } from "@/store/configuradorStore";

const card =
  "group relative flex w-full flex-col rounded-sm border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";
const cardOn = "border-ink bg-ivory/70";
const cardOff = "border-stone-beige bg-white hover:border-mineral";

function StepTitle({ n, title, subtitle }: { n: number; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-[0.2em] text-mineral">
        Paso {n} de {PASOS.length}
      </p>
      <h2 className="mt-1 font-serif text-2xl text-ink md:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 max-w-2xl text-sm text-charcoal/80">{subtitle}</p>}
    </div>
  );
}

/* ── Paso 1 — Tipo de proyecto ─────────────────────────────── */
export function StepTipo() {
  const geometriaId = useConfigurador((s) => s.geometriaId);
  const setGeometria = useConfigurador((s) => s.setGeometria);
  return (
    <div>
      <StepTitle n={1} title="¿Qué querés cotizar?" subtitle="Elegí la forma de tu sobre. Con eso ajustamos las medidas que te vamos a pedir." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GEOMETRIAS.map((g) => {
          const on = geometriaId === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setGeometria(g.id)}
              aria-pressed={on}
              className={cn(card, on ? cardOn : cardOff)}
            >
              {on && (
                <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-ivory">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
              <div className="mb-3 h-20 w-full text-ink/70">
                <GeoDiagram id={g.id} className="h-full w-full" />
              </div>
              <span className="font-medium text-ink">{g.nombre}</span>
              <span className="mt-1 text-xs leading-relaxed text-charcoal/70">{g.descripcion}</span>
              {!g.autoPrecio && (
                <span className="mt-2 inline-block rounded-sm bg-stone-beige px-2 py-0.5 text-[11px] text-charcoal">
                  Con asesor
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Paso 2 — Material y color ─────────────────────────────── */
export function StepMaterial() {
  const materialId = useConfigurador((s) => s.materialId);
  const colorId = useConfigurador((s) => s.colorId);
  const setMaterial = useConfigurador((s) => s.setMaterial);
  const setColor = useConfigurador((s) => s.setColor);
  const material = getMaterial(materialId);
  return (
    <div>
      <StepTitle n={2} title="Material y color" subtitle="El espesor se asigna solo según el material que elijas." />
      <div className="grid gap-4 sm:grid-cols-2">
        {MATERIALES.map((m) => {
          const on = materialId === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMaterial(m.id)}
              aria-pressed={on}
              className={cn(card, on ? cardOn : cardOff)}
            >
              {on && (
                <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-ivory">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
              <span className="font-medium text-ink">{m.nombre}</span>
              <span className="mt-1 text-xs text-charcoal/70">Espesor {m.espesorMm} mm · {m.colores.length} colores</span>
              <span className="mt-3 flex gap-1.5">
                {m.colores.slice(0, 6).map((c) => (
                  <span key={c.id} className="h-5 w-5 rounded-full border border-stone-beige" style={{ background: c.swatch }} />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      {material && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-medium text-ink">
            Color — {material.nombre} <span className="text-mineral">({material.espesorMm} mm)</span>
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {material.colores.map((c) => {
              const on = colorId === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  aria-pressed={on}
                  className={cn(
                    "flex items-center gap-3 rounded-sm border p-3 text-left transition-colors",
                    on ? cardOn : cardOff,
                  )}
                >
                  <span className="h-9 w-9 shrink-0 rounded-full border border-stone-beige" style={{ background: c.swatch }} />
                  <span className="text-sm text-ink">{c.nombre}</span>
                  {on && <Check className="ml-auto h-4 w-4 text-ink" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Paso 3 — Medidas ──────────────────────────────────────── */
/** Convierte mm a texto en la unidad elegida (sin ceros sobrantes). */
function mmAUnidadStr(mm: number, unidad: Unidad): string {
  if (!mm || mm <= 0) return "";
  const val = mm / MM_POR_UNIDAD[unidad];
  return String(parseFloat(val.toFixed(3)));
}

/** Campo de medida en la unidad elegida; guarda internamente en mm. */
function CampoMedida({
  label,
  mmValue,
  maxMm,
  unidad,
  onChangeMm,
}: {
  label: string;
  mmValue: number;
  maxMm: number;
  unidad: Unidad;
  onChangeMm: (mm: number) => void;
}) {
  const [draft, setDraft] = useState(() => mmAUnidadStr(mmValue, unidad));
  const factor = MM_POR_UNIDAD[unidad];
  const excede = mmValue > maxMm;
  const vacio = mmValue <= 0;
  const maxUnidad = parseFloat((maxMm / factor).toFixed(3));
  const step = unidad === "mm" ? 1 : unidad === "cm" ? 0.1 : 0.001;

  return (
    <label className="block">
      <span className="mb-1 block text-xs text-charcoal/80">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={draft}
          onChange={(e) => {
            const raw = e.target.value;
            setDraft(raw);
            const num = parseFloat(raw.replace(",", "."));
            onChangeMm(Number.isFinite(num) && num > 0 ? Math.round(num * factor) : 0);
          }}
          placeholder="0"
          className={cn(
            "w-full rounded-sm border bg-white px-3 py-2.5 pr-12 text-ink outline-none focus:border-ink",
            excede ? "border-[#b8863b]" : "border-stone-beige",
          )}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-mineral">{unidad}</span>
      </div>
      <span className="mt-1 block text-xs text-mineral">
        Máx. estándar {String(maxUnidad).replace(".", ",")} {unidad}
      </span>
      {excede && <span className="mt-0.5 block text-xs text-[#b8863b]">Supera el máximo estándar</span>}
      {vacio && <span className="mt-0.5 block text-xs text-mineral">Requerido</span>}
    </label>
  );
}

export function StepMedidas() {
  const geometriaId = useConfigurador((s) => s.geometriaId);
  const medidas = useConfigurador((s) => s.medidas);
  const setMedida = useConfigurador((s) => s.setMedida);
  const setDerivar = useConfigurador((s) => s.setDerivar);
  const setPaso = useConfigurador((s) => s.setPaso);
  const yaDerivado = useConfigurador((st) => st.derivar);
  const unidad = useConfigurador((st) => st.unidad);
  const setUnidad = useConfigurador((st) => st.setUnidad);
  const geo = getGeometria(geometriaId);
  const L = MEDIDAS_LIMITES;

  // Los sobres se miden siempre en metros.
  useEffect(() => {
    if (unidad !== "m") setUnidad("m");
  }, [unidad, setUnidad]);

  const excedeAlguno =
    !!geo &&
    geo.tramos.some((t) => {
      const m = medidas[t.key];
      return m && (m.largo > L.largoMaxMm || m.prof > L.profMaxMm);
    });

  // Si el usuario corrige y ninguna medida excede, volvemos al flujo normal.
  useEffect(() => {
    if (yaDerivado && !excedeAlguno) setDerivar(false);
  }, [yaDerivado, excedeAlguno, setDerivar]);

  if (!geo) return null;

  const derivar = () => {
    setDerivar(true);
    setPaso(6); // salta a datos / contacto
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <StepTitle n={3} title="Medidas" subtitle="Ingresá el largo y el ancho de cada tramo, en metros." />

      <div className="grid gap-6 lg:grid-cols-2">
        {geo.tramos.map((t) => (
          <div key={t.key} className="rounded-sm border border-stone-beige bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-ink">{t.label}</h3>
              <div className="h-10 w-16 text-ink/50">
                <GeoDiagram id={geo.id} className="h-full w-full" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <CampoMedida key={`${t.key}-largo`} label="Largo" mmValue={medidas[t.key]?.largo ?? 0} maxMm={L.largoMaxMm} unidad={unidad} onChangeMm={(n) => setMedida(t.key, "largo", n)} />
              <CampoMedida key={`${t.key}-ancho`} label="Ancho" mmValue={medidas[t.key]?.prof ?? 0} maxMm={L.profMaxMm} unidad={unidad} onChangeMm={(n) => setMedida(t.key, "prof", n)} />
            </div>
          </div>
        ))}
      </div>

      {excedeAlguno && (
        <div className="mt-6 rounded-sm border border-[#b8863b]/50 bg-[#b8863b]/10 p-4">
          <p className="text-sm text-ink">
            Alguna medida supera el máximo estándar (<strong>3,10 m de largo</strong> o <strong>1,40 m de ancho</strong>).
            Estas piezas se cotizan de forma personalizada con un asesor.
          </p>
          <button
            type="button"
            onClick={derivar}
            className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal"
          >
            Continuar con cotización personalizada
          </button>
        </div>
      )}

      <p className="mt-4 text-xs text-mineral">
        Las medidas son referenciales y quedan sujetas a validación técnica. {geo.nota ?? ""}
      </p>
    </div>
  );
}

/* ── Paso 4 — Moldura ──────────────────────────────────────── */
export function StepMoldura() {
  const moldura = useConfigurador((s) => s.moldura);
  const setMoldura = useConfigurador((s) => s.setMoldura);
  const opciones = [
    { v: false, t: "Sin moldura", d: "Canto estándar, línea limpia y minimalista." },
    { v: true, t: "Con moldura básica", d: "Borde con moldura para un acabado con más presencia." },
  ];
  return (
    <div>
      <StepTitle n={4} title="Moldura" subtitle="¿Querés un acabado de moldura en el borde del sobre?" />
      <div className="grid gap-4 sm:grid-cols-2">
        {opciones.map((o) => {
          const on = moldura === o.v;
          return (
            <button key={String(o.v)} type="button" onClick={() => setMoldura(o.v)} aria-pressed={on} className={cn(card, on ? cardOn : cardOff)}>
              {on && (
                <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-ivory">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
              <div className="mb-3 h-16 w-full">
                <svg viewBox="0 0 120 50" className="h-full w-full text-ink/70" aria-hidden="true">
                  <rect x="10" y="14" width="100" height="14" fill="rgba(38,58,44,0.06)" stroke="currentColor" strokeWidth="2" />
                  {o.v && <rect x="10" y="28" width="100" height="6" fill="rgba(38,58,44,0.18)" stroke="currentColor" strokeWidth="1.5" />}
                </svg>
              </div>
              <span className="font-medium text-ink">{o.t}</span>
              <span className="mt-1 text-xs text-charcoal/70">{o.d}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Paso 5 — Salpicadero ──────────────────────────────────── */
export function StepSalpicadero() {
  const tipo = useConfigurador((s) => s.salpicaderoTipo);
  const altura = useConfigurador((s) => s.salpicaderoAlturaCm);
  const setSalpicadero = useConfigurador((s) => s.setSalpicadero);
  const opciones = [
    { v: "no" as const, t: "Sin salpicadero", d: "El sobre no lleva pieza vertical." },
    { v: "10" as const, t: "10 cm", d: "Altura estándar de protección de pared." },
    { v: "custom" as const, t: "Altura personalizada", d: `Entre ${SALPICADERO.customMinCm} y ${SALPICADERO.customMaxCm} cm.` },
  ];
  const err =
    tipo === "custom" && altura > 0 && (altura < SALPICADERO.customMinCm || altura > SALPICADERO.customMaxCm)
      ? `Debe estar entre ${SALPICADERO.customMinCm} y ${SALPICADERO.customMaxCm} cm`
      : null;
  return (
    <div>
      <StepTitle n={5} title="Salpicadero" subtitle="Es la pieza vertical que protege la pared detrás del sobre." />
      <div className="grid gap-4 sm:grid-cols-3">
        {opciones.map((o) => {
          const on = tipo === o.v;
          return (
            <button key={o.v} type="button" onClick={() => setSalpicadero(o.v, o.v === "custom" ? altura : undefined)} aria-pressed={on} className={cn(card, on ? cardOn : cardOff)}>
              {on && (
                <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-ivory">
                  <Check className="h-3.5 w-3.5" />
                </span>
              )}
              <span className="font-medium text-ink">{o.t}</span>
              <span className="mt-1 text-xs text-charcoal/70">{o.d}</span>
            </button>
          );
        })}
      </div>
      {tipo === "custom" && (
        <label className="mt-6 block max-w-xs">
          <span className="mb-1 block text-xs text-charcoal/80">Altura del salpicadero</span>
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min={SALPICADERO.customMinCm}
              max={SALPICADERO.customMaxCm}
              value={altura || ""}
              onChange={(e) => setSalpicadero("custom", Math.max(0, Math.round(Number(e.target.value) || 0)))}
              className={cn("w-full rounded-sm border bg-white px-3 py-2.5 pr-10 text-ink outline-none focus:border-ink", err ? "border-[#a03826]" : "border-stone-beige")}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-mineral">cm</span>
          </div>
          {err && <span className="mt-1 block text-xs text-[#a03826]">{err}</span>}
        </label>
      )}
    </div>
  );
}

/* ── Paso 6 — Resumen y precio ─────────────────────────────── */
function ResumenFila({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-stone-beige/70 py-2.5 last:border-0">
      <span className="text-sm text-mineral">{label}</span>
      <span className="flex items-center gap-2 text-right text-sm text-ink">
        {value}
        {onEdit && (
          <button type="button" onClick={onEdit} className="text-mineral hover:text-ink" aria-label={`Editar ${label}`}>
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </span>
    </div>
  );
}

export function StepResumen() {
  const s = useConfigurador();
  const geo = getGeometria(s.geometriaId);
  const material = getMaterial(s.materialId);
  const color = material?.colores.find((c) => c.id === s.colorId);
  const price = calcularPrecio(s);
  const setPaso = s.setPaso;

  const uf = MM_POR_UNIDAD[s.unidad];
  const enUnidad = (mm: number) => String(parseFloat(((mm ?? 0) / uf).toFixed(3))).replace(".", ",");
  const medidasTxt = geo?.tramos
    .map((t) => `${t.label}: ${enUnidad(s.medidas[t.key]?.largo ?? 0)}×${enUnidad(s.medidas[t.key]?.prof ?? 0)} ${s.unidad}`)
    .join(" · ");
  const salpTxt =
    s.salpicaderoTipo === "no" ? "Sin salpicadero" : s.salpicaderoTipo === "10" ? "10 cm" : `${s.salpicaderoAlturaCm} cm`;

  return (
    <div>
      <StepTitle n={6} title="Resumen y precio" subtitle="Este es el costo final de tu sobre. Podés editar cualquier sección y el precio se recalcula al instante." />
      <div className="rounded-sm border border-stone-beige bg-white p-5">
        <ResumenFila label="Tipo de proyecto" value={geo?.nombre ?? "—"} onEdit={() => setPaso(0)} />
        <ResumenFila label="Material" value={material ? `${material.nombre} · ${material.espesorMm} mm` : "—"} onEdit={() => setPaso(1)} />
        <ResumenFila label="Color" value={color?.nombre ?? "—"} onEdit={() => setPaso(1)} />
        <ResumenFila label="Medidas" value={medidasTxt || "—"} onEdit={() => setPaso(2)} />
        <ResumenFila label="Moldura" value={s.moldura ? "Con moldura básica" : "Sin moldura"} onEdit={() => setPaso(3)} />
        <ResumenFila label="Salpicadero" value={salpTxt} onEdit={() => setPaso(4)} />
        <ResumenFila label="Área total" value={`${price.areaTotal.toFixed(2)} m²`} />
        {price.molduraMl > 0 && <ResumenFila label="Moldura (frente)" value={`${price.molduraMl.toFixed(2)} m`} />}
      </div>

      <div className="mt-5 rounded-sm border border-ink bg-ivory/60 p-5">
        {price.tienePrecio ? (
          <>
            <p className="mb-3 text-xs uppercase tracking-[0.14em] text-mineral">Cálculo del precio</p>
            <div className="flex items-center justify-between text-sm text-charcoal">
              <span>Material ({price.areaTotal.toFixed(2)} m² × {formatPrice(price.precioM2, price.moneda)}/m²)</span>
              <span>{formatPrice(price.materialCost, price.moneda)}</span>
            </div>
            {price.molduraCost > 0 && (
              <div className="mt-1 flex items-center justify-between text-sm text-charcoal">
                <span>Moldura ({price.molduraMl.toFixed(2)} m)</span>
                <span>{formatPrice(price.molduraCost, price.moneda)}</span>
              </div>
            )}
            <div className="mt-1 flex items-center justify-between text-sm text-charcoal">
              <span>Subtotal</span>
              <span>{formatPrice(price.subtotal, price.moneda)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-sm text-charcoal">
              <span>IVA (13%)</span>
              <span>{formatPrice(price.iva, price.moneda)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-stone-beige pt-2">
              <span className="font-serif text-lg text-ink">Costo final de tu sobre</span>
              <span className="font-serif text-2xl font-bold text-ink">{formatPrice(price.total, price.moneda)}</span>
            </div>
          </>
        ) : (
          <div className="text-sm text-ink">
            <p className="font-medium">Precio en preparación</p>
            <p className="mt-1 text-charcoal/80">
              Tu sobre mide <strong>{price.areaTotal.toFixed(2)} m²</strong>. Estamos terminando de cargar los
              precios por material para mostrarte el costo final al instante.
            </p>
          </div>
        )}
        <p className="mt-3 text-xs text-mineral">
          Plazo de producción estimado: <strong className="text-ink">{PLAZO_DIAS_HABILES} días hábiles</strong> desde la confirmación del pedido.
          Las medidas están sujetas a validación técnica.
        </p>
      </div>
    </div>
  );
}

/* ── Paso 7 — Datos y confirmación ─────────────────────────── */
const PROVINCIAS = ["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"];

export function StepDatos() {
  const router = useRouter();
  const s = useConfigurador();
  const geo = getGeometria(s.geometriaId);
  const esPersonalizado = geo?.autoPrecio === false || s.derivar;
  const c = s.cliente;
  const setCliente = s.setCliente;
  const setFolio = s.setFolio;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.correo);
  const telOk = c.telefono.replace(/\D/g, "").length >= 8;
  const dirOk = c.retiro || c.direccion.trim().length > 2;
  const puedeEnviar =
    c.nombre.trim().length > 1 && emailOk && telOk && c.provincia && c.canton.trim().length > 1 && dirOk && c.acepta;

  const submit = async () => {
    if (!puedeEnviar || busy) return;
    setBusy(true);
    setError(null);
    try {
      const price = calcularPrecio(s);
      const res = await fetch("/api/configurador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          geometriaId: s.geometriaId,
          materialId: s.materialId,
          colorId: s.colorId,
          medidas: s.medidas,
          moldura: s.moldura,
          salpicaderoTipo: s.salpicaderoTipo,
          salpicaderoAlturaCm: s.salpicaderoAlturaCm,
          unidad: s.unidad,
          derivar: s.derivar,
          personalizado: esPersonalizado,
          area: price.areaTotal,
          cliente: c,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.folio) throw new Error(data?.message || "No se pudo enviar.");
      setFolio(data.folio);
      router.push("/cotizar/exito");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar.");
      setBusy(false);
    }
  };

  const input = "w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-ink outline-none focus:border-ink";

  return (
    <div>
      <StepTitle
        n={7}
        title={esPersonalizado ? "Contanos de tu proyecto" : "Tus datos"}
        subtitle={
          esPersonalizado
            ? "Un asesor te contacta para cotizar tu proyecto personalizado."
            : "Con estos datos generamos tu pedido y te enviamos la confirmación."
        }
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs text-charcoal/80">Nombre completo *</span>
          <input className={input} value={c.nombre} onChange={(e) => setCliente({ nombre: e.target.value })} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-charcoal/80">Teléfono *</span>
          <input className={input} value={c.telefono} inputMode="tel" onChange={(e) => setCliente({ telefono: e.target.value })} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-charcoal/80">Correo *</span>
          <input className={input} value={c.correo} inputMode="email" onChange={(e) => setCliente({ correo: e.target.value })} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-charcoal/80">Provincia *</span>
          <select className={input} value={c.provincia} onChange={(e) => setCliente({ provincia: e.target.value })}>
            <option value="">Seleccione…</option>
            {PROVINCIAS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-charcoal/80">Cantón *</span>
          <input className={input} value={c.canton} onChange={(e) => setCliente({ canton: e.target.value })} />
        </label>

        <div className="sm:col-span-2">
          <span className="mb-1 block text-xs text-charcoal/80">Entrega</span>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setCliente({ retiro: false })} className={cn("rounded-sm border px-4 py-2 text-sm", !c.retiro ? cardOn : cardOff)}>
              Entrega a domicilio
            </button>
            <button type="button" onClick={() => setCliente({ retiro: true })} className={cn("rounded-sm border px-4 py-2 text-sm", c.retiro ? cardOn : cardOff)}>
              Retiro en tienda
            </button>
          </div>
        </div>

        {!c.retiro && (
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs text-charcoal/80">Dirección *</span>
            <input className={input} value={c.direccion} onChange={(e) => setCliente({ direccion: e.target.value })} />
          </label>
        )}

        <label className="flex items-start gap-2 sm:col-span-2">
          <input type="checkbox" checked={c.acepta} onChange={(e) => setCliente({ acepta: e.target.checked })} className="mt-0.5 h-4 w-4 accent-ink" />
          <span className="text-xs text-charcoal/80">
            Acepto los términos y condiciones y el tratamiento de mis datos para ser contactado por Granalto.
          </span>
        </label>
      </div>

      {error && <p className="mt-4 rounded-sm bg-[#a03826]/10 px-3 py-2 text-sm text-[#a03826]">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={!puedeEnviar || busy}
        className="mt-6 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {esPersonalizado ? "Enviar solicitud" : "Enviar pedido"}
      </button>
    </div>
  );
}
