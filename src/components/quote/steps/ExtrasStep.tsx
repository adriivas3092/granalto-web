"use client";

import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useQuote } from "@/store/quoteStore";
import { CUTOUT_OPTIONS, ADDITIONAL_ELEMENT_TYPES } from "@/data/quote-config";
import { formatPrice } from "@/lib/store/format";
import { trackEvent } from "@/lib/analytics";
import type { AdditionalElement } from "@/types/quote";
import { cn } from "@/lib/utils";

const inputCls = "w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";
const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : `e-${Date.now()}`);

const SINK_IDS = ["fregadero-bajo", "fregadero-sobrepuesto", "personalizado"];
const SINK_OPTIONS = [
  { value: "fregadero-bajo", label: "Fregadero bajo cubierta" },
  { value: "fregadero-sobrepuesto", label: "Fregadero sobrepuesto" },
  { value: "personalizado", label: "Belfast / frontal" },
  { value: "none", label: "Sin corte de fregadero" },
];
const EXTRA_CUTOUTS = ["tomacorriente", "dispensador", "escurridor", "canal-drenaje"];

/** Paso 6: qué necesita el sobre (guiado) + elementos verticales. */
export function ExtrasStep() {
  const configuration = useQuote((s) => s.configuration);
  const updateConfiguration = useQuote((s) => s.updateConfiguration);
  const cutouts = configuration.cutouts;

  const qty = (id: string) => cutouts.find((c) => c.cutoutId === id)?.quantity ?? 0;
  const setQty = (id: string, q: number) => {
    const others = cutouts.filter((c) => c.cutoutId !== id);
    updateConfiguration({ cutouts: q > 0 ? [...others, { cutoutId: id, quantity: q }] : others });
    if (q > 0) trackEvent({ name: "quote_extra_selected", params: { type: id } });
  };

  const currentSink = SINK_IDS.find((id) => qty(id) > 0) ?? "none";
  const setSink = (value: string) => {
    const withoutSinks = cutouts.filter((c) => !SINK_IDS.includes(c.cutoutId));
    updateConfiguration({ cutouts: value === "none" ? withoutSinks : [...withoutSinks, { cutoutId: value, quantity: 1 }] });
    if (value !== "none") trackEvent({ name: "quote_extra_selected", params: { type: value } });
  };

  const hob = qty("cocina") > 0;
  const taps = qty("griferia");

  // Elementos verticales
  const [el, setEl] = useState({ typeId: ADDITIONAL_ELEMENT_TYPES[0].id, length: "", height: "", quantity: "1" });
  const addElement = () => {
    const length = Number(el.length), height = Number(el.height), quantity = Number(el.quantity) || 1;
    if (!(length > 0) || !(height > 0)) return;
    const item: AdditionalElement = { id: uid(), typeId: el.typeId, length, height, quantity };
    updateConfiguration({ additionalElements: [...configuration.additionalElements, item] });
    trackEvent({ name: "quote_extra_selected", params: { type: el.typeId } });
    setEl((s) => ({ ...s, length: "", height: "" }));
  };
  const removeElement = (id: string) =>
    updateConfiguration({ additionalElements: configuration.additionalElements.filter((e) => e.id !== id) });

  const [advanced, setAdvanced] = useState(false);

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-2xl md:text-3xl">¿Qué necesita tu sobre?</h2>
      <p className="mt-2 text-sm text-charcoal/80">
        Contanos sobre los electrodomésticos y accesorios para incluirlos en la estimación.
      </p>

      {/* Tipo de fregadero */}
      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-medium text-ink">Tipo de fregadero</legend>
        <div className="space-y-2">
          {SINK_OPTIONS.map((o) => (
            <label
              key={o.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-sm border px-4 py-3 text-sm transition-colors",
                currentSink === o.value ? "border-ink bg-stone-beige/40" : "border-stone-beige bg-white hover:border-mineral",
              )}
            >
              <input type="radio" name="sink" checked={currentSink === o.value} onChange={() => setSink(o.value)} className="h-4 w-4" />
              <span className="text-ink">{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Cocina empotrada */}
      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-medium text-ink">¿Se empotra una cocina en el sobre?</legend>
        <div className="grid grid-cols-2 gap-2">
          {[{ v: true, l: "Sí" }, { v: false, l: "No" }].map((o) => (
            <button
              key={o.l}
              type="button"
              aria-pressed={hob === o.v}
              onClick={() => setQty("cocina", o.v ? 1 : 0)}
              className={cn(
                "min-h-[44px] rounded-sm border px-4 py-2 text-sm transition-colors",
                hob === o.v ? "border-ink bg-ink text-ivory" : "border-stone-beige bg-white text-charcoal hover:border-mineral",
              )}
            >
              {o.l}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Perforaciones de grifería */}
      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-medium text-ink">¿Cuántas perforaciones de grifería?</legend>
        <div className="inline-flex items-center rounded-sm border border-stone-beige">
          <button type="button" aria-label="Menos perforaciones" onClick={() => setQty("griferia", Math.max(0, taps - 1))} className="flex h-11 w-11 items-center justify-center text-charcoal hover:bg-stone-beige/60">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm text-ink" aria-live="polite">{taps}</span>
          <button type="button" aria-label="Más perforaciones" onClick={() => setQty("griferia", taps + 1)} className="flex h-11 w-11 items-center justify-center text-charcoal hover:bg-stone-beige/60">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </fieldset>

      {/* Más cortes (avanzado) */}
      <div className="mt-6">
        <button type="button" onClick={() => setAdvanced((a) => !a)} aria-expanded={advanced} className="text-sm text-mineral underline-offset-2 hover:text-ink hover:underline">
          {advanced ? "Ocultar" : "Más cortes y perforaciones"}
        </button>
        {advanced && (
          <ul className="mt-3 space-y-2">
            {CUTOUT_OPTIONS.filter((c) => EXTRA_CUTOUTS.includes(c.id)).map((c) => {
              const q = qty(c.id);
              return (
                <li key={c.id} className="flex items-center justify-between gap-3 rounded-sm border border-stone-beige bg-white p-3">
                  <div>
                    <p className="text-sm font-medium text-ink">{c.name}</p>
                    <p className="text-xs text-mineral">{formatPrice(c.unitPrice)} c/u</p>
                  </div>
                  <div className="inline-flex items-center rounded-sm border border-stone-beige">
                    <button type="button" aria-label={`Menos ${c.name}`} onClick={() => setQty(c.id, Math.max(0, q - 1))} className="flex h-9 w-9 items-center justify-center text-charcoal hover:bg-stone-beige/60"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-8 text-center text-sm text-ink">{q}</span>
                    <button type="button" aria-label={`Más ${c.name}`} onClick={() => setQty(c.id, q + 1)} className="flex h-9 w-9 items-center justify-center text-charcoal hover:bg-stone-beige/60"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Elementos verticales */}
      <section className="mt-8">
        <h3 className="mb-2 text-sm font-medium text-ink">Elementos verticales (splashback, faldón, cascada…)</h3>
        <div className="rounded-sm border border-stone-beige bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="sm:col-span-4">
              <label htmlFor="el-type" className="mb-1 block text-xs text-charcoal">Tipo</label>
              <select id="el-type" className={inputCls} value={el.typeId} onChange={(e) => setEl((s) => ({ ...s, typeId: e.target.value }))}>
                {ADDITIONAL_ELEMENT_TYPES.map((t) => <option key={t.id} value={t.id}>{t.name} · {formatPrice(t.pricePerM2)}/m²</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="el-l" className="mb-1 block text-xs text-charcoal">Largo (m)</label>
              <input id="el-l" type="number" step="any" inputMode="decimal" className={inputCls} value={el.length} onChange={(e) => setEl((s) => ({ ...s, length: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="el-h" className="mb-1 block text-xs text-charcoal">Alto (m)</label>
              <input id="el-h" type="number" step="any" inputMode="decimal" className={inputCls} value={el.height} onChange={(e) => setEl((s) => ({ ...s, height: e.target.value }))} />
            </div>
            <div>
              <label htmlFor="el-q" className="mb-1 block text-xs text-charcoal">Cantidad</label>
              <input id="el-q" type="number" min={1} inputMode="numeric" className={inputCls} value={el.quantity} onChange={(e) => setEl((s) => ({ ...s, quantity: e.target.value }))} />
            </div>
            <div className="sm:col-span-4">
              <button type="button" onClick={addElement} className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-4 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal">
                <Plus className="h-4 w-4" /> Agregar elemento
              </button>
            </div>
          </div>
        </div>
        {configuration.additionalElements.length > 0 && (
          <ul className="mt-3 space-y-2">
            {configuration.additionalElements.map((e) => {
              const type = ADDITIONAL_ELEMENT_TYPES.find((t) => t.id === e.typeId);
              return (
                <li key={e.id} className="flex items-center justify-between gap-3 rounded-sm border border-stone-beige bg-white p-3">
                  <p className="text-sm text-ink">{type?.name} · {e.length}×{e.height} m · x{e.quantity}</p>
                  <button type="button" onClick={() => removeElement(e.id)} aria-label="Eliminar elemento" className="flex h-8 w-8 items-center justify-center rounded-sm border border-stone-beige text-[#a03826] hover:border-[#a03826]"><Trash2 className="h-4 w-4" /></button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
