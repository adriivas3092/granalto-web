"use client";

import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useQuote } from "@/store/quoteStore";
import { CUTOUT_OPTIONS, ADDITIONAL_ELEMENT_TYPES } from "@/data/quote-config";
import { formatPrice } from "@/lib/store/format";
import { trackEvent } from "@/lib/analytics";
import type { AdditionalElement } from "@/types/quote";

const inputCls = "w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";
const uid = () => (crypto?.randomUUID ? crypto.randomUUID() : `e-${Date.now()}`);

/** Paso 6: cortes/perforaciones y elementos adicionales (splashback, faldón…). */
export function ExtrasStep() {
  const configuration = useQuote((s) => s.configuration);
  const updateConfiguration = useQuote((s) => s.updateConfiguration);

  const cutoutQty = (id: string) => configuration.cutouts.find((c) => c.cutoutId === id)?.quantity ?? 0;
  const setCutout = (id: string, qty: number) => {
    const others = configuration.cutouts.filter((c) => c.cutoutId !== id);
    updateConfiguration({ cutouts: qty > 0 ? [...others, { cutoutId: id, quantity: qty }] : others });
    if (qty > 0) trackEvent({ name: "quote_extra_selected", params: { type: id } });
  };

  const [el, setEl] = useState<{ typeId: string; length: string; height: string; quantity: string }>({
    typeId: ADDITIONAL_ELEMENT_TYPES[0].id,
    length: "",
    height: "",
    quantity: "1",
  });

  const addElement = () => {
    const length = Number(el.length);
    const height = Number(el.height);
    const quantity = Number(el.quantity) || 1;
    if (!(length > 0) || !(height > 0)) return;
    const item: AdditionalElement = { id: uid(), typeId: el.typeId, length, height, quantity };
    updateConfiguration({ additionalElements: [...configuration.additionalElements, item] });
    trackEvent({ name: "quote_extra_selected", params: { type: el.typeId } });
    setEl((s) => ({ ...s, length: "", height: "" }));
  };

  const removeElement = (id: string) =>
    updateConfiguration({ additionalElements: configuration.additionalElements.filter((e) => e.id !== id) });

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl md:text-3xl">Cortes y elementos</h2>
      <p className="mt-2 text-sm text-charcoal/80">Agregá cortes, perforaciones y piezas verticales. Todo es opcional.</p>

      <section className="mt-6">
        <h3 className="mb-2 text-sm font-medium text-ink">Cortes y perforaciones</h3>
        <ul className="space-y-2">
          {CUTOUT_OPTIONS.map((c) => {
            const qty = cutoutQty(c.id);
            return (
              <li key={c.id} className="flex items-center justify-between gap-3 rounded-sm border border-stone-beige bg-white p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{c.name}</p>
                  <p className="text-xs text-mineral">{formatPrice(c.unitPrice)} c/u{c.help ? ` · ${c.help}` : ""}</p>
                </div>
                <div className="inline-flex items-center rounded-sm border border-stone-beige">
                  <button type="button" aria-label={`Menos ${c.name}`} onClick={() => setCutout(c.id, Math.max(0, qty - 1))} className="flex h-9 w-9 items-center justify-center text-charcoal hover:bg-stone-beige/60">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm text-ink" aria-live="polite">{qty}</span>
                  <button type="button" aria-label={`Más ${c.name}`} onClick={() => setCutout(c.id, qty + 1)} className="flex h-9 w-9 items-center justify-center text-charcoal hover:bg-stone-beige/60">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

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
            <div className="flex items-end">
              <button type="button" onClick={addElement} className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm bg-ink px-4 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal">
                <Plus className="h-4 w-4" /> Agregar
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
                  <p className="text-sm text-ink">
                    {type?.name} · {e.length}×{e.height} m · x{e.quantity}
                  </p>
                  <button type="button" onClick={() => removeElement(e.id)} aria-label="Eliminar elemento" className="flex h-8 w-8 items-center justify-center rounded-sm border border-stone-beige text-[#a03826] hover:border-[#a03826]">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
