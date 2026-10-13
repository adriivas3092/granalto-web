"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Check, Pencil, Loader2, AlertTriangle, MessageCircle, ZoomIn, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/store/format";
import { getWhatsAppUrl } from "@/config/site";
import { GeoDiagram } from "@/components/configurador/GeoDiagram";
import {
  GEOMETRIAS,
  MATERIALES,
  MEDIDAS_LIMITES,
  SALPICADERO,
  PLAZO_DIAS_HABILES,
  NOTA_CONTRASOBRE,
  ACABADOS,
  getGeometria,
  getMaterial,
  resolveAgotado,
  type Color,
} from "@/data/configurador";
import { calcularPrecio } from "@/lib/configurador/pricing";
import { useConfigurador, PASOS, MM_POR_UNIDAD, type Unidad } from "@/store/configuradorStore";

const card =
  "group relative flex w-full flex-col rounded-sm border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";
const cardOn = "border-ink bg-ivory/70";
const cardOff = "border-stone-beige bg-white hover:border-mineral";

/** Visor 3D cargado solo en el cliente (Three.js no se renderiza en el servidor). */
const SobreViewer3D = dynamic(
  () => import("@/components/configurador/SobreViewer3D").then((m) => m.SobreViewer3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[340px] w-full items-center justify-center rounded-sm border border-stone-beige bg-ivory/40 text-sm text-mineral">
        Cargando vista 3D…
      </div>
    ),
  },
);

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

/** Aviso de material sin disponibilidad, con contacto directo a un asesor. */
function DisclaimerAgotado({ nombre }: { nombre?: string }) {
  const msg = `Hola, me interesa el acabado${nombre ? ` ${nombre}` : ""} que aparece agotado en el cotizador. ¿Me ayudan a consultar disponibilidad?`;
  return (
    <div className="mt-6 rounded-sm border border-[#b8863b]/50 bg-[#b8863b]/10 p-4">
      <p className="flex items-start gap-2 text-sm text-ink">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#b8863b]" aria-hidden="true" />
        <span>
          <strong>{nombre ?? "Este acabado"} está agotado.</strong> Por el momento no hay disponibilidad de
          este material. Podés consultar con un asesor si habrá reposición o ver otras opciones disponibles.
        </span>
      </p>
      <a
        href={getWhatsAppUrl(msg)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal"
      >
        <MessageCircle className="h-4 w-4" /> Consultar disponibilidad con un asesor
      </a>
    </div>
  );
}

/* ── Paso 2 — Material y color ─────────────────────────────── */
export function StepMaterial() {
  const materialId = useConfigurador((s) => s.materialId);
  const colorId = useConfigurador((s) => s.colorId);
  const acabado = useConfigurador((s) => s.acabado);
  const setMaterial = useConfigurador((s) => s.setMaterial);
  const setColor = useConfigurador((s) => s.setColor);
  const setAcabado = useConfigurador((s) => s.setAcabado);
  const overrides = useConfigurador((s) => s.agotadoOverrides);
  const material = getMaterial(materialId);
  const colorSel = material?.colores.find((c) => c.id === colorId);
  const colorSelAgotado = resolveAgotado(materialId, colorSel, overrides);
  const [zoom, setZoom] = useState(false);
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

          {/* Vista grande del material elegido */}
          <MaterialPreview
            material={material.nombre}
            color={colorSel}
            agotado={colorSelAgotado}
            acabado={acabado}
            onZoom={() => colorSel && setZoom(true)}
          />

          <p className="mb-2 mt-6 text-xs text-mineral">Elegí un color para verlo en grande:</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {material.colores.map((c) => {
              const on = colorId === c.id;
              const ago = resolveAgotado(materialId, c, overrides);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  aria-pressed={on}
                  className={cn(
                    "group/color relative flex flex-col overflow-hidden rounded-sm border text-left transition-colors",
                    on ? "border-ink ring-1 ring-ink" : "border-stone-beige hover:border-mineral",
                    ago && !on && "opacity-80",
                  )}
                >
                  {/* Vista del material (foto si existe; si no, el color) */}
                  <span
                    className="relative block h-24 w-full bg-cover bg-center"
                    style={c.imagen ? { backgroundImage: `url(${c.imagen})` } : { background: c.swatch }}
                  >
                    {on && (
                      <span className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-ivory">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                    {ago && (
                      <span className="absolute left-2 top-2 rounded-sm bg-[#b8863b] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                        Agotado
                      </span>
                    )}
                  </span>
                  <span className="px-3 py-2 text-sm text-ink">{c.nombre}</span>
                </button>
              );
            })}
          </div>

          {colorSelAgotado && colorSel && <DisclaimerAgotado nombre={colorSel.nombre} />}

          {/* Acabado: brillo o mate */}
          <div className="mt-8">
            <h3 className="mb-3 text-sm font-medium text-ink">Acabado</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {ACABADOS.map((a) => {
                const on = acabado === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAcabado(a.id)}
                    aria-pressed={on}
                    className={cn(card, on ? cardOn : cardOff)}
                  >
                    {on && (
                      <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-ivory">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <span className="font-medium text-ink">{a.nombre}</span>
                    <span className="mt-1 text-xs text-charcoal/70">{a.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {zoom && colorSel && (
        <MaterialLightbox
          material={material?.nombre ?? ""}
          color={colorSel}
          agotado={colorSelAgotado}
          acabado={acabado}
          onClose={() => setZoom(false)}
        />
      )}
    </div>
  );
}

/** Vista grande y atractiva del material seleccionado, con botón para ampliar. */
function MaterialPreview({
  material,
  color,
  agotado,
  acabado,
  onZoom,
}: {
  material: string;
  color: Color | undefined;
  agotado?: boolean;
  acabado: "brillo" | "mate" | null;
  onZoom: () => void;
}) {
  if (!color) {
    return (
      <div className="flex h-48 w-full items-center justify-center rounded-sm border border-dashed border-stone-beige bg-ivory/40 text-sm text-mineral sm:h-60">
        Elegí un color para previsualizar el material.
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onZoom}
      className="group relative block h-56 w-full overflow-hidden rounded-sm border border-stone-beige sm:h-72 lg:h-80"
      aria-label={`Ampliar ${material} ${color.nombre}`}
    >
      <span
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={color.imagen ? { backgroundImage: `url(${color.imagen})` } : { background: color.swatch }}
      />
      {/* Brillo sutil cuando el acabado es brillante */}
      {acabado === "brillo" && (
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-white/35 mix-blend-screen" />
      )}
      {/* Degradado inferior para legibilidad del texto */}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />

      {agotado && (
        <span className="absolute left-3 top-3 rounded-sm bg-[#b8863b] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-white">
          Agotado
        </span>
      )}

      <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-sm bg-black/40 px-2.5 py-1.5 text-xs text-white backdrop-blur-sm transition-colors group-hover:bg-black/60">
        <ZoomIn className="h-3.5 w-3.5" /> Ampliar
      </span>

      <span className="absolute inset-x-0 bottom-0 flex flex-col p-4 text-left text-white">
        <span className="font-serif text-xl md:text-2xl">{color.nombre}</span>
        <span className="mt-0.5 text-xs text-white/85">
          {material}
          {acabado ? ` · Acabado ${acabado === "brillo" ? "brillo" : "mate"}` : ""}
        </span>
      </span>
    </button>
  );
}

/** Lightbox a pantalla completa del material. */
function MaterialLightbox({
  material,
  color,
  agotado,
  acabado,
  onClose,
}: {
  material: string;
  color: { nombre: string; swatch: string; imagen?: string; agotado?: boolean };
  agotado?: boolean;
  acabado: "brillo" | "mate" | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        aria-label="Cerrar"
      >
        <X className="h-5 w-5" />
      </button>
      <figure className="flex max-h-full w-full max-w-4xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full overflow-hidden rounded-sm">
          <div
            className="aspect-[4/3] w-full bg-cover bg-center"
            style={color.imagen ? { backgroundImage: `url(${color.imagen})` } : { background: color.swatch }}
          />
          {acabado === "brillo" && (
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25 mix-blend-screen" />
          )}
        </div>
        <figcaption className="mt-4 text-center text-white">
          <p className="font-serif text-2xl">{color.nombre}</p>
          <p className="mt-1 text-sm text-white/80">
            {material}
            {acabado ? ` · Acabado ${acabado === "brillo" ? "brillo" : "mate"}` : ""}
            {agotado ? " · Agotado" : ""}
          </p>
        </figcaption>
      </figure>
    </div>
  );
}

/** Diagrama de referencia de la L: parte larga, parte corta y la unión. */
function LReferenceDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 240" className={className} role="img" aria-label="Diagrama del sobre en L: largo, corto y unión">
      {/* Perfil de la L (parte larga vertical + parte corta horizontal) */}
      <polygon
        points="50,20 85,20 85,150 180,150 180,185 50,185"
        fill="rgba(38,58,44,0.06)"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Línea de la unión (donde se junta la parte larga con la corta) */}
      <line x1="50" y1="150" x2="85" y2="150" stroke="#b8863b" strokeWidth="3.5" />

      {/* Etiqueta: Largo */}
      <line x1="112" y1="70" x2="92" y2="70" stroke="currentColor" strokeWidth="1.3" />
      <polygon points="88,70 96,66 96,74" fill="currentColor" />
      <text x="118" y="75" fontSize="16" fill="currentColor">Largo</text>

      {/* Etiqueta: Unión */}
      <line x1="112" y1="140" x2="90" y2="149" stroke="currentColor" strokeWidth="1.3" />
      <polygon points="85,151 94,145 95,153" fill="#b8863b" />
      <text x="118" y="146" fontSize="16" fill="#8a5f24">Unión</text>

      {/* Etiqueta: Corto */}
      <line x1="115" y1="212" x2="115" y2="189" stroke="currentColor" strokeWidth="1.3" />
      <polygon points="115,185 111,193 119,193" fill="currentColor" />
      <text x="115" y="230" fontSize="16" fill="currentColor" textAnchor="middle">Corto</text>
    </svg>
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
  const notas = useConfigurador((st) => st.notas);
  const setNotas = useConfigurador((st) => st.setNotas);
  const geo = getGeometria(geometriaId);
  const L = MEDIDAS_LIMITES;
  const esL = geo?.id === "l";

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

  // El ancho de la L es común a los dos tramos: al cambiarlo se aplica a ambos.
  const setAnchoL = (n: number) => {
    setMedida("a", "prof", n);
    setMedida("b", "prof", n);
  };

  return (
    <div>
      <StepTitle n={3} title="Medidas" subtitle="Ingresá las medidas en metros." />

      {esL ? (
        <>
          <div className="mb-6 flex flex-col items-center gap-4 rounded-sm border border-stone-beige bg-white p-5 sm:flex-row sm:items-center">
            <div className="h-40 w-full max-w-[220px] shrink-0 text-ink/70">
              <LReferenceDiagram className="h-full w-full" />
            </div>
            <div className="text-sm text-charcoal/80">
              <p>
                El <strong>Tramo A</strong> es la parte <strong>larga</strong> y el <strong>Tramo B</strong> la parte{" "}
                <strong>corta</strong>. El <strong>ancho</strong> es común a toda la L.
              </p>
              <p className="mt-2">
                La <strong className="text-[#8a5f24]">unión</strong> es donde se junta la parte larga con la corta. Si
                querés indicar hacia qué lado va la parte corta u otra orientación, usá el campo de especificaciones de
                abajo.
              </p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-sm border border-stone-beige bg-white p-5">
              <h3 className="mb-4 font-medium text-ink">Tramo A — parte larga</h3>
              <CampoMedida label="Largo" mmValue={medidas.a?.largo ?? 0} maxMm={L.largoMaxMm} unidad={unidad} onChangeMm={(n) => setMedida("a", "largo", n)} />
            </div>
            <div className="rounded-sm border border-stone-beige bg-white p-5">
              <h3 className="mb-4 font-medium text-ink">Tramo B — parte corta</h3>
              <CampoMedida label="Largo" mmValue={medidas.b?.largo ?? 0} maxMm={L.largoMaxMm} unidad={unidad} onChangeMm={(n) => setMedida("b", "largo", n)} />
            </div>
            <div className="rounded-sm border border-stone-beige bg-white p-5">
              <h3 className="mb-4 font-medium text-ink">Ancho (común)</h3>
              <CampoMedida label="Ancho" mmValue={medidas.a?.prof ?? 0} maxMm={L.profMaxMm} unidad={unidad} onChangeMm={setAnchoL} />
            </div>
          </div>
        </>
      ) : (
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
      )}

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

      {/* Especificaciones libres del cliente (armado / orientación) */}
      <div className="mt-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Especificaciones (opcional)</span>
          <span className="mb-2 block text-xs text-charcoal/70">
            {esL
              ? "Contanos cómo querés que quede armada y orientada la L (hacia qué lado va la parte corta, ubicación del fregadero o la cocina, etc.)."
              : "¿Algún detalle que debamos tener en cuenta para armar y orientar bien tu sobre?"}
          </span>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={3}
            maxLength={600}
            placeholder="Ej.: la parte corta va hacia la derecha; el fregadero queda sobre el tramo largo…"
            className="w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ink"
          />
        </label>
      </div>

      <p className="mt-4 text-xs text-mineral">
        Las medidas son referenciales y quedan sujetas a validación técnica. {geo.nota ?? ""}
      </p>
    </div>
  );
}

/**
 * Ilustración del canto del sobre según el tipo de moldura:
 *  - "no": canto recto, solo se pule (brilla) la orilla.
 *  - "2" / "4": corte a 45° con bajante de 2 o 4 cm (se diferencia la altura).
 */
function MolduraDiagram({ tipo, className }: { tipo: "no" | "2" | "4"; className?: string }) {
  const top = 24;
  const under = 38; // cara inferior del sobre
  const left = 16;
  const right = 120;
  const bfx = 102; // inicio del frente de la moldura
  const bottom = tipo === "2" ? 56 : tipo === "4" ? 80 : under;
  return (
    <svg viewBox="0 0 168 96" className={className} aria-hidden="true">
      {tipo === "no" ? (
        <>
          {/* Sobre con canto recto */}
          <rect
            x={left}
            y={top}
            width={right - left}
            height={under - top}
            fill="rgba(38,58,44,0.06)"
            stroke="currentColor"
            strokeWidth="2"
          />
          {/* Orilla pulida (brillo) en el canto frontal */}
          <line x1={right - 1.5} y1={top + 1} x2={right - 1.5} y2={under - 1} stroke="currentColor" strokeWidth="3" strokeOpacity="0.5" />
          <path d="M126 23 l3 3 l-3 3 l-3 -3 z" fill="currentColor" opacity="0.6" />
          <text x={right - 2} y={under + 15} fontSize="10" fill="currentColor" textAnchor="end">
            orilla pulida
          </text>
        </>
      ) : (
        <>
          {/* Perfil con moldura: bajante con corte a 45° */}
          <polygon
            points={`${left},${top} ${right},${top} ${right},${bottom} ${bfx},${bottom} ${bfx},${under} ${left},${under}`}
            fill="rgba(38,58,44,0.06)"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Junta del inglete a 45° en la esquina frontal superior */}
          <line x1={right} y1={top} x2={bfx} y2={top + (right - bfx)} stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x={left + 2} y={top - 6} fontSize="10" fill="currentColor">
            45°
          </text>
          {/* Cota de la bajante */}
          <line x1={right + 10} y1={top} x2={right + 10} y2={bottom} stroke="currentColor" strokeWidth="1" />
          <line x1={right + 6} y1={top} x2={right + 14} y2={top} stroke="currentColor" strokeWidth="1" />
          <line x1={right + 6} y1={bottom} x2={right + 14} y2={bottom} stroke="currentColor" strokeWidth="1" />
          <text x={right + 18} y={(top + bottom) / 2 + 4} fontSize="12" fill="currentColor">
            {tipo} cm
          </text>
        </>
      )}
    </svg>
  );
}

/* ── Paso 4 — Moldura ──────────────────────────────────────── */
export function StepMoldura() {
  const moldura = useConfigurador((s) => s.moldura);
  const grosor = useConfigurador((s) => s.molduraGrosorCm);
  const setMoldura = useConfigurador((s) => s.setMoldura);
  const setGrosor = useConfigurador((s) => s.setMolduraGrosor);

  const opciones = [
    {
      tipo: "no" as const,
      t: "Sin moldura",
      d: "Solo se pule (brilla) la orilla del sobre. Canto recto, línea limpia.",
      sel: moldura === false,
      aplicar: () => setMoldura(false),
    },
    {
      tipo: "2" as const,
      t: "Moldura de 2 cm",
      d: "Corte a 45° con 2 cm de bajante. Versión más corta.",
      sel: moldura === true && grosor === 2,
      aplicar: () => {
        setMoldura(true);
        setGrosor(2);
      },
    },
    {
      tipo: "4" as const,
      t: "Moldura de 4 cm",
      d: "Corte a 45° con 4 cm de bajante. Más presencia.",
      sel: moldura === true && grosor === 4,
      aplicar: () => {
        setMoldura(true);
        setGrosor(4);
      },
    },
  ];

  return (
    <div>
      <StepTitle n={4} title="Moldura" subtitle="¿Cómo querés el canto del sobre?" />
      <div className="grid gap-4 sm:grid-cols-3">
        {opciones.map((o) => (
          <button
            key={o.tipo}
            type="button"
            onClick={o.aplicar}
            aria-pressed={o.sel}
            className={cn(card, o.sel ? cardOn : cardOff)}
          >
            {o.sel && (
              <span className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink text-ivory">
                <Check className="h-3.5 w-3.5" />
              </span>
            )}
            <div className="mb-3 h-24 w-full text-ink/70">
              <MolduraDiagram tipo={o.tipo} className="h-full w-full" />
            </div>
            <span className="font-medium text-ink">{o.t}</span>
            <span className="mt-1 text-xs text-charcoal/70">{o.d}</span>
          </button>
        ))}
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

      {/* Vista 3D del sobre */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium text-ink">Vista 3D de tu sobre</h3>
        <SobreViewer3D />
      </div>

      <div className="rounded-sm border border-stone-beige bg-white p-5">
        <ResumenFila label="Tipo de proyecto" value={geo?.nombre ?? "—"} onEdit={() => setPaso(0)} />
        <ResumenFila label="Material" value={material ? `${material.nombre} · ${material.espesorMm} mm` : "—"} onEdit={() => setPaso(1)} />
        <ResumenFila label="Color" value={color?.nombre ?? "—"} onEdit={() => setPaso(1)} />
        <ResumenFila label="Acabado" value={s.acabado ? (s.acabado === "brillo" ? "Brillo" : "Mate") : "—"} onEdit={() => setPaso(1)} />
        <ResumenFila label="Medidas" value={medidasTxt || "—"} onEdit={() => setPaso(2)} />
        <ResumenFila
          label="Moldura"
          value={s.moldura ? `Con moldura · ${s.molduraGrosorCm ?? ""} cm`.trim() : "Sin moldura"}
          onEdit={() => setPaso(3)}
        />
        <ResumenFila label="Salpicadero" value={salpTxt} onEdit={() => setPaso(4)} />
        {s.notas.trim() && <ResumenFila label="Especificaciones" value={s.notas.trim()} onEdit={() => setPaso(2)} />}
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
        ) : price.agotado ? (
          <div className="text-sm text-ink">
            <p className="flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4 text-[#b8863b]" aria-hidden="true" /> Material sin disponibilidad
            </p>
            <p className="mt-1 text-charcoal/80">
              El acabado <strong>{color?.nombre}</strong> está agotado, por lo que no podemos calcular el precio
              automáticamente. Consultá con un asesor la disponibilidad o elegí otro acabado.
            </p>
            <a
              href={getWhatsAppUrl(
                `Hola, me interesa el acabado ${color?.nombre ?? ""} que aparece agotado en el cotizador. ¿Me ayudan a consultar disponibilidad?`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal"
            >
              <MessageCircle className="h-4 w-4" /> Consultar disponibilidad con un asesor
            </a>
          </div>
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

      {/* Nota técnica: contrasobre de soporte */}
      <div className="mt-4 flex items-start gap-2 rounded-sm border border-stone-beige bg-ivory/60 p-4">
        <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#b8863b]" />
        <p className="text-xs leading-relaxed text-charcoal/85">{NOTA_CONTRASOBRE}</p>
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
          acabado: s.acabado,
          moldura: s.moldura,
          molduraGrosorCm: s.molduraGrosorCm,
          molduraPerfil: s.molduraPerfil,
          salpicaderoTipo: s.salpicaderoTipo,
          salpicaderoAlturaCm: s.salpicaderoAlturaCm,
          lUnion: s.lUnion,
          notas: s.notas,
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
