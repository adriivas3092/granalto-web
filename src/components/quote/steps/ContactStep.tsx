"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload } from "lucide-react";
import { customerSchema } from "@/lib/validations/quote-schemas";
import { useQuote } from "@/store/quoteStore";
import { submitQuoteRemote } from "@/lib/api/quote-service";
import { trackEvent } from "@/lib/analytics";
import { PROVINCES } from "@/data/quote-config";

const formSchema = customerSchema.extend({
  privacyAccepted: z.literal(true, { message: "Debés aceptar la política de privacidad." }),
  contactConsent: z.literal(true, { message: "Debés autorizar el contacto." }),
});
type FormValues = z.infer<typeof formSchema>;

const inputCls = "w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";
const errCls = "mt-1 text-xs text-[#a03826]";
const MAX_FILE = 8 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

/** Paso 9: captura de datos del cliente y envío. */
export function ContactStep() {
  const router = useRouter();
  const store = useQuote();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { preferredContact: "whatsapp", province: store.project?.province ?? "" },
  });

  useEffect(() => {
    trackEvent({ name: "quote_contact_started" });
  }, []);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFileError(null);
    if (!f) return setFile(null);
    if (!ALLOWED.includes(f.type)) {
      setFile(null);
      return setFileError("Formato no permitido (JPG, PNG, WebP o PDF).");
    }
    if (f.size > MAX_FILE) {
      setFile(null);
      return setFileError("El archivo supera 8 MB.");
    }
    setFile(f);
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);
    setSubmitting(true);
    const { privacyAccepted, contactConsent, ...customer } = values;
    try {
      const res = await submitQuoteRemote({
        productIds: store.selectedProducts.map((p) => p.id),
        pieces: store.pieces,
        configuration: store.configuration,
        project: store.project,
        selectedOptionId: store.selectedEstimateId,
        customer,
        consent: { privacyAccepted, contactConsent },
      });
      if (!res.success || !res.quoteId) throw new Error(res.message);

      store.setCustomer(customer);
      store.setQuoteId(res.quoteId);
      if (res.estimates) store.setEstimates(res.estimates);

      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        await fetch(`/api/quotes/${res.quoteId}/files`, { method: "POST", body: fd }).catch(() => {});
      }

      trackEvent({ name: "quote_submitted", params: { total: res.estimates?.[0]?.total, options: res.estimates?.length } });
      router.push("/cotizar/exito");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "No se pudo enviar la solicitud.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-2xl md:text-3xl">Tus datos</h2>
      <p className="mt-2 text-sm text-charcoal/80">Completá tus datos y te enviamos la cotización estimada.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="c-fn" className="mb-1 block text-sm text-charcoal">Nombre *</label>
            <input id="c-fn" autoComplete="given-name" className={inputCls} {...register("firstName")} />
            {errors.firstName && <p className={errCls}>{errors.firstName.message}</p>}
          </div>
          <div>
            <label htmlFor="c-ln" className="mb-1 block text-sm text-charcoal">Apellidos *</label>
            <input id="c-ln" autoComplete="family-name" className={inputCls} {...register("lastName")} />
            {errors.lastName && <p className={errCls}>{errors.lastName.message}</p>}
          </div>
          <div>
            <label htmlFor="c-em" className="mb-1 block text-sm text-charcoal">Correo *</label>
            <input id="c-em" type="email" autoComplete="email" className={inputCls} {...register("email")} />
            {errors.email && <p className={errCls}>{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="c-ph" className="mb-1 block text-sm text-charcoal">Teléfono *</label>
            <input id="c-ph" autoComplete="tel" className={inputCls} {...register("phone")} />
            {errors.phone && <p className={errCls}>{errors.phone.message}</p>}
          </div>
        </div>

        <fieldset>
          <legend className="mb-1 text-sm text-charcoal">Medio de contacto preferido</legend>
          <div className="flex flex-wrap gap-4 text-sm">
            {(["whatsapp", "llamada", "correo"] as const).map((m) => (
              <label key={m} className="inline-flex items-center gap-2 capitalize">
                <input type="radio" value={m} {...register("preferredContact")} /> {m}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="c-prov" className="mb-1 block text-sm text-charcoal">Provincia</label>
            <select id="c-prov" className={inputCls} {...register("province")}>
              <option value="">Seleccionar…</option>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="c-cant" className="mb-1 block text-sm text-charcoal">Cantón</label>
            <input id="c-cant" className={inputCls} {...register("canton")} />
          </div>
          <div>
            <label htmlFor="c-dist" className="mb-1 block text-sm text-charcoal">Distrito</label>
            <input id="c-dist" className={inputCls} {...register("district")} />
          </div>
        </div>

        <div>
          <label htmlFor="c-addr" className="mb-1 block text-sm text-charcoal">Dirección aproximada</label>
          <input id="c-addr" className={inputCls} {...register("address")} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="c-date" className="mb-1 block text-sm text-charcoal">Fecha estimada del proyecto</label>
            <input id="c-date" type="date" className={inputCls} {...register("estimatedDate")} />
          </div>
          <div>
            <label htmlFor="c-budget" className="mb-1 block text-sm text-charcoal">Presupuesto aproximado</label>
            <input id="c-budget" className={inputCls} placeholder="Opcional" {...register("budget")} />
          </div>
        </div>

        <div>
          <label htmlFor="c-comments" className="mb-1 block text-sm text-charcoal">Comentarios</label>
          <textarea id="c-comments" rows={3} className={inputCls} {...register("comments")} />
        </div>

        <div>
          <label htmlFor="c-file" className="mb-1 block text-sm text-charcoal">Plano o fotografía (opcional)</label>
          <label htmlFor="c-file" className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-stone-beige bg-white px-4 py-2.5 text-sm text-charcoal hover:border-ink">
            <Upload className="h-4 w-4" /> {file ? file.name : "Subir archivo"}
          </label>
          <input id="c-file" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" className="sr-only" onChange={onFile} />
          {fileError && <p className={errCls}>{fileError}</p>}
        </div>

        <div className="space-y-2 rounded-sm border border-stone-beige bg-white p-4">
          <label className="flex items-start gap-2 text-sm text-charcoal">
            <input type="checkbox" className="mt-0.5 h-4 w-4" {...register("privacyAccepted")} />
            <span>Acepto la política de privacidad y el tratamiento de mis datos.</span>
          </label>
          {errors.privacyAccepted && <p className={errCls}>{errors.privacyAccepted.message as string}</p>}
          <label className="flex items-start gap-2 text-sm text-charcoal">
            <input type="checkbox" className="mt-0.5 h-4 w-4" {...register("contactConsent")} />
            <span>Autorizo a Granalto a contactarme sobre esta cotización.</span>
          </label>
          {errors.contactConsent && <p className={errCls}>{errors.contactConsent.message as string}</p>}
        </div>

        {serverError && <p role="alert" className="text-sm text-[#a03826]">{serverError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Solicitar cotización
        </button>
        <p className="text-center text-xs text-mineral">
          El precio mostrado es una estimación y está sujeto a validación técnica.
        </p>
      </form>
    </div>
  );
}
