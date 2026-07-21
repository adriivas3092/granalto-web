"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { pieceSchema, type PieceForm as PieceFormValues } from "@/lib/validations/quote-schemas";

type PieceFormInput = z.input<typeof pieceSchema>;
import { THICKNESS_OPTIONS } from "@/data/quote-config";
import { useQuote } from "@/store/quoteStore";
import { trackEvent } from "@/lib/analytics";
import { calculateArea } from "@/lib/quote-engine/calculate-area";

const SHAPES: { value: PieceFormValues["shape"]; label: string }[] = [
  { value: "recto", label: "Tramo recto" },
  { value: "l", label: "Forma en L" },
  { value: "u", label: "Forma en U" },
  { value: "isla", label: "Isla" },
  { value: "barra", label: "Barra" },
  { value: "splashback", label: "Splashback" },
  { value: "personalizado", label: "Personalizada" },
];

const inputCls = "w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";
const errCls = "mt-1 text-xs text-[#a03826]";

/** Formulario para agregar una pieza (RHF + Zod). */
export function PieceForm() {
  const addPiece = useQuote((s) => s.addPiece);
  const pieces = useQuote((s) => s.pieces);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PieceFormInput, unknown, PieceFormValues>({
    resolver: zodResolver(pieceSchema),
    defaultValues: { name: "", shape: "recto", unit: "cm", quantity: 1, thickness: 20, length: undefined, width: undefined },
  });

  const onSubmit = (values: PieceFormValues) => {
    addPiece({ ...values, id: crypto.randomUUID() });
    const { billableArea } = calculateArea([...pieces, { ...values, id: "tmp" }], undefined);
    trackEvent({ name: "quote_dimensions_added", params: { area: billableArea } });
    reset({ name: "", shape: values.shape, unit: values.unit, quantity: 1, thickness: values.thickness, length: undefined, width: undefined });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-sm border border-stone-beige bg-white p-4">
      <p className="mb-3 text-sm font-medium text-ink">Agregar pieza</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="pf-name" className="mb-1 block text-xs text-charcoal">Nombre / identificador</label>
          <input id="pf-name" className={inputCls} placeholder="Ej. Sobre principal" {...register("name")} />
          {errors.name && <p className={errCls}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="pf-shape" className="mb-1 block text-xs text-charcoal">Forma</label>
          <select id="pf-shape" className={inputCls} {...register("shape")}>
            {SHAPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="pf-unit" className="mb-1 block text-xs text-charcoal">Unidad</label>
          <select id="pf-unit" className={inputCls} {...register("unit")}>
            <option value="cm">Centímetros</option>
            <option value="mm">Milímetros</option>
            <option value="m">Metros</option>
          </select>
        </div>
        <div>
          <label htmlFor="pf-length" className="mb-1 block text-xs text-charcoal">Largo</label>
          <input id="pf-length" type="number" step="any" inputMode="decimal" className={inputCls} {...register("length")} />
          {errors.length && <p className={errCls}>{errors.length.message}</p>}
        </div>
        <div>
          <label htmlFor="pf-width" className="mb-1 block text-xs text-charcoal">Ancho</label>
          <input id="pf-width" type="number" step="any" inputMode="decimal" className={inputCls} {...register("width")} />
          {errors.width && <p className={errCls}>{errors.width.message}</p>}
        </div>
        <div>
          <label htmlFor="pf-qty" className="mb-1 block text-xs text-charcoal">Cantidad</label>
          <input id="pf-qty" type="number" min={1} inputMode="numeric" className={inputCls} {...register("quantity")} />
          {errors.quantity && <p className={errCls}>{errors.quantity.message}</p>}
        </div>
        <div>
          <label htmlFor="pf-thick" className="mb-1 block text-xs text-charcoal">Grosor (mm)</label>
          <select id="pf-thick" className={inputCls} {...register("thickness")}>
            {THICKNESS_OPTIONS.map((t) => <option key={t} value={t}>{t} mm</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="pf-notes" className="mb-1 block text-xs text-charcoal">Notas (opcional)</label>
          <input id="pf-notes" className={inputCls} placeholder="Detalles de la pieza" {...register("notes")} />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal"
      >
        <Plus aria-hidden="true" className="h-4 w-4" /> Agregar pieza
      </button>
    </form>
  );
}
