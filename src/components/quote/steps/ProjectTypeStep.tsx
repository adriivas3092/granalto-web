"use client";

import { useQuote } from "@/store/quoteStore";
import { PROVINCES } from "@/data/quote-config";
import type { ProjectKind, ProjectStage } from "@/types/quote";
import { cn } from "@/lib/utils";

const KINDS: { value: ProjectKind; label: string }[] = [
  { value: "cocina", label: "Cocina" },
  { value: "bano", label: "Baño" },
  { value: "isla", label: "Isla" },
  { value: "barra", label: "Barra" },
  { value: "mueble", label: "Mueble" },
  { value: "comercial", label: "Comercial" },
  { value: "otro", label: "Otro" },
];

const STAGES: { value: ProjectStage; label: string }[] = [
  { value: "nuevo", label: "Proyecto nuevo" },
  { value: "remodelacion", label: "Remodelación" },
  { value: "sustitucion", label: "Sustitución de superficie" },
];

const inputCls = "w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";

/** Paso 3: tipo de proyecto. */
export function ProjectTypeStep() {
  const project = useQuote((s) => s.project);
  const setProject = useQuote((s) => s.setProject);
  const update = (patch: Partial<NonNullable<typeof project>>) =>
    setProject({ kind: project?.kind ?? "cocina", stage: project?.stage ?? "nuevo", ...project, ...patch });

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl md:text-3xl">Sobre tu proyecto</h2>
      <p className="mt-2 text-sm text-charcoal/80">Contanos qué vas a hacer para ajustar la estimación.</p>

      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-medium text-ink">Tipo de proyecto</legend>
        <div className="flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <button
              key={k.value}
              type="button"
              aria-pressed={project?.kind === k.value}
              onClick={() => update({ kind: k.value })}
              className={cn(
                "min-h-[44px] rounded-sm border px-4 py-2 text-sm transition-colors focus-visible:outline-2",
                project?.kind === k.value ? "border-ink bg-ink text-ivory" : "border-stone-beige bg-white text-charcoal hover:border-mineral",
              )}
            >
              {k.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-medium text-ink">Etapa</legend>
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <button
              key={s.value}
              type="button"
              aria-pressed={project?.stage === s.value}
              onClick={() => update({ stage: s.value })}
              className={cn(
                "min-h-[44px] rounded-sm border px-4 py-2 text-sm transition-colors focus-visible:outline-2",
                project?.stage === s.value ? "border-ink bg-ink text-ivory" : "border-stone-beige bg-white text-charcoal hover:border-mineral",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="pj-name" className="mb-1 block text-sm text-charcoal">Nombre del proyecto (opcional)</label>
          <input id="pj-name" className={inputCls} value={project?.name ?? ""} onChange={(e) => update({ name: e.target.value })} />
        </div>
        <div>
          <label htmlFor="pj-prov" className="mb-1 block text-sm text-charcoal">Provincia (opcional)</label>
          <select id="pj-prov" className={inputCls} value={project?.province ?? ""} onChange={(e) => update({ province: e.target.value })}>
            <option value="">Seleccionar…</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="pj-date" className="mb-1 block text-sm text-charcoal">Fecha estimada (opcional)</label>
          <input id="pj-date" type="date" className={inputCls} value={project?.estimatedDate ?? ""} onChange={(e) => update({ estimatedDate: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
