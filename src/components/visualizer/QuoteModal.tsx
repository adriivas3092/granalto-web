"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { X, Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import { getMaterial } from "@/data/visualizer/materials";
import { getLighting } from "@/data/visualizer/lighting";
import type { Environment } from "@/data/visualizer/types";
import { useVisualizer } from "@/store/visualizerStore";
import { submitQuote, quoteWhatsAppUrl, type QuotePayload } from "@/lib/visualizer/quote";
import { buildShareUrl } from "@/lib/visualizer/serialize";
import { captureSceneToBlob } from "@/lib/visualizer/capture";

const PROVINCES = ["San José", "Alajuela", "Cartago", "Heredia", "Guanacaste", "Puntarenas", "Limón"];

export function QuoteModal({
  environment,
  svgProvider,
  onClose,
}: {
  environment: Environment;
  svgProvider: () => SVGSVGElement | null;
  onClose: () => void;
}) {
  const materialIdFor = useVisualizer((s) => s.materialIdFor);
  const lightingId = useVisualizer((s) => s.lightingId);
  const exportConfig = useVisualizer((s) => s.exportConfig);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    firstFieldRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function buildPayload(fd: FormData, imageDataUrl?: string): QuotePayload {
    const materials = environment.surfaces.map((s) => {
      const m = getMaterial(materialIdFor(environment, s.id));
      return { surface: s.name, material: m?.name ?? "—", collection: m?.collection, finish: m?.finish };
    });
    return {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      projectType: environment.name,
      location: String(fd.get("location") ?? ""),
      message: String(fd.get("message") ?? "").trim(),
      consent: fd.get("consent") === "on",
      environmentName: environment.name,
      lighting: getLighting(lightingId).name,
      materials,
      shareUrl: buildShareUrl(exportConfig()),
      imageDataUrl,
    };
  }

  function validate(fd: FormData): Record<string, string> {
    const e: Record<string, string> = {};
    if (!String(fd.get("name") ?? "").trim()) e.name = "Ingrese su nombre.";
    const email = String(fd.get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Correo no válido.";
    if (!String(fd.get("phone") ?? "").trim()) e.phone = "Ingrese su teléfono.";
    if (fd.get("consent") !== "on") e.consent = "Debe autorizar el contacto.";
    return e;
  }

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const form = ev.currentTarget;
    const fd = new FormData(form);
    const v = validate(fd);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    let imageDataUrl: string | undefined;
    try {
      const svg = svgProvider();
      if (svg) {
        const blob = await captureSceneToBlob(svg, { width: 1000 });
        imageDataUrl = await blobToDataUrl(blob);
      }
    } catch {
      /* imagen opcional */
    }
    const res = await submitQuote(buildPayload(fd, imageDataUrl));
    setSubmitting(false);
    if (res.ok) {
      setResult({ ok: true, text: `¡Solicitud enviada! Referencia ${res.ref}. Le contactaremos pronto.` });
    } else {
      setResult({ ok: false, text: res.error });
    }
  }

  const waUrl = quoteWhatsAppUrl(buildPayload(new FormData()));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Solicitar cotización"
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[92svh] w-full max-w-lg overflow-y-auto rounded-t-xl bg-white p-6 sm:rounded-sm">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="font-sans text-xl font-bold text-ink">Solicitar cotización</h2>
            <p className="text-sm text-mineral">{environment.name} · adjuntamos tu configuración.</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="rounded-sm p-1 text-charcoal hover:bg-stone-beige">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        {result?.ok ? (
          <div className="py-6 text-center">
            <CheckCircle2 aria-hidden="true" className="mx-auto h-12 w-12 text-ink" />
            <p className="mt-4 text-charcoal">{result.text}</p>
            <button onClick={onClose} className="mt-6 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal">
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="space-y-3">
            <Field id="name" label="Nombre *" error={errors.name}>
              <input ref={firstFieldRef} id="name" name="name" autoComplete="name" className={inputCls} />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field id="email" label="Correo *" error={errors.email}>
                <input id="email" name="email" type="email" autoComplete="email" className={inputCls} />
              </Field>
              <Field id="phone" label="Teléfono *" error={errors.phone}>
                <input id="phone" name="phone" autoComplete="tel" className={inputCls} />
              </Field>
            </div>
            <Field id="location" label="Provincia">
              <select id="location" name="location" className={inputCls} defaultValue="San José">
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field id="message" label="Mensaje">
              <textarea id="message" name="message" rows={3} className={inputCls} placeholder="Cuéntenos sobre su proyecto…" />
            </Field>

            <label className="flex items-start gap-2 text-sm text-charcoal">
              <input type="checkbox" name="consent" className="mt-0.5 h-4 w-4" />
              <span>Autorizo a Granalto a contactarme sobre esta solicitud.</span>
            </label>
            {errors.consent && <p className="text-sm text-[#a03826]">{errors.consent}</p>}

            {result && !result.ok && <p role="alert" className="text-sm text-[#a03826]">{result.text}</p>}

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal disabled:opacity-60"
              >
                {submitting && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
                Enviar solicitud
              </button>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-stone-beige px-4 py-3 text-sm font-medium text-charcoal hover:border-ink"
              >
                <MessageCircle aria-hidden="true" className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm text-charcoal">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-[#a03826]">{error}</p>}
    </div>
  );
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(new Error("read error"));
    fr.readAsDataURL(blob);
  });
}
