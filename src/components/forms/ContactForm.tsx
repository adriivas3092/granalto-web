"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import {
  clientTypes,
  projectTypes,
  provinces,
  validateContactForm,
  type ContactFormData,
  type ContactFormErrors,
} from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const initialData: ContactFormData = {
  fullName: "",
  email: "",
  phone: "",
  clientType: "",
  projectType: "",
  province: "",
  message: "",
  consent: false,
  website: "",
};

type Status = "idle" | "submitting" | "success" | "error";

const inputClasses =
  "w-full rounded-sm border bg-white px-4 py-3 text-sm text-ink placeholder:text-mineral focus:outline-none focus:border-ink transition-colors";

/**
 * Formulario de asesoría con validación en frontend, honeypot anti-spam,
 * estados de carga/éxito/error accesibles y envío a /api/contact.
 * Preparado para conectarse luego a Kommo CRM, correo o webhooks.
 */
export function ContactForm() {
  const id = useId();
  const [data, setData] = useState<ContactFormData>(initialData);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const field = (name: keyof ContactFormData) => `${id}-${name}`;

  const set = <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validation = validateContactForm(data);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      document.getElementById(field(Object.keys(validation)[0] as keyof ContactFormData))?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      trackEvent({
        name: "contact_form_submit",
        params: { projectType: data.projectType },
      });
      setStatus("success");
      setData(initialData);
      // Carga completa de la página de gracias: su URL es la que usa Google
      // Tag Manager para registrar la conversión de formulario.
      window.location.assign("/gracias-por-su-mensaje/enviado");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-4 rounded-sm border border-stone-beige bg-white px-6 py-16 text-center"
      >
        <CheckCircle2 aria-hidden="true" className="h-10 w-10 text-ink" />
        <p className="font-serif text-2xl text-ink">Gracias por contactarnos</p>
        <p className="max-w-md text-sm leading-relaxed text-charcoal/80">
          Nuestro equipo revisará su solicitud y se comunicará con usted.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="link-editorial mt-2 text-sm text-ink"
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  const errorText = (key: keyof ContactFormData) =>
    errors[key] ? (
      <p id={`${field(key)}-error`} role="alert" className="mt-1.5 text-sm text-[#a03826]">
        {errors[key]}
      </p>
    ) : null;

  const fieldProps = (key: keyof ContactFormData) => ({
    id: field(key),
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? `${field(key)}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Honeypot: oculto para personas, los bots suelen completarlo. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor={field("website")}>No complete este campo</label>
        <input
          id={field("website")}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={data.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={field("fullName")} className="mb-1.5 block text-sm font-medium text-ink">
            Nombre completo
          </label>
          <input
            {...fieldProps("fullName")}
            type="text"
            autoComplete="name"
            value={data.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            className={cn(inputClasses, errors.fullName ? "border-[#a03826]" : "border-stone-beige")}
          />
          {errorText("fullName")}
        </div>
        <div>
          <label htmlFor={field("email")} className="mb-1.5 block text-sm font-medium text-ink">
            Correo electrónico
          </label>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            className={cn(inputClasses, errors.email ? "border-[#a03826]" : "border-stone-beige")}
          />
          {errorText("email")}
        </div>
        <div>
          <label htmlFor={field("phone")} className="mb-1.5 block text-sm font-medium text-ink">
            Teléfono
          </label>
          <input
            {...fieldProps("phone")}
            type="tel"
            autoComplete="tel"
            value={data.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={cn(inputClasses, errors.phone ? "border-[#a03826]" : "border-stone-beige")}
          />
          {errorText("phone")}
        </div>
        <div>
          <label htmlFor={field("clientType")} className="mb-1.5 block text-sm font-medium text-ink">
            Tipo de cliente
          </label>
          <select
            {...fieldProps("clientType")}
            value={data.clientType}
            onChange={(e) => set("clientType", e.target.value)}
            className={cn(inputClasses, errors.clientType ? "border-[#a03826]" : "border-stone-beige")}
          >
            <option value="">Seleccione una opción</option>
            {clientTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errorText("clientType")}
        </div>
        <div>
          <label htmlFor={field("projectType")} className="mb-1.5 block text-sm font-medium text-ink">
            Tipo de proyecto
          </label>
          <select
            {...fieldProps("projectType")}
            value={data.projectType}
            onChange={(e) => set("projectType", e.target.value)}
            className={cn(inputClasses, errors.projectType ? "border-[#a03826]" : "border-stone-beige")}
          >
            <option value="">Seleccione una opción</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errorText("projectType")}
        </div>
        <div>
          <label htmlFor={field("province")} className="mb-1.5 block text-sm font-medium text-ink">
            Ubicación o provincia
          </label>
          <select
            {...fieldProps("province")}
            value={data.province}
            onChange={(e) => set("province", e.target.value)}
            className={cn(inputClasses, errors.province ? "border-[#a03826]" : "border-stone-beige")}
          >
            <option value="">Seleccione una opción</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
          {errorText("province")}
        </div>
      </div>

      <div>
        <label htmlFor={field("message")} className="mb-1.5 block text-sm font-medium text-ink">
          Mensaje
        </label>
        <textarea
          {...fieldProps("message")}
          rows={5}
          value={data.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="Cuéntenos sobre su proyecto: espacio, medidas aproximadas, materiales de interés…"
          className={cn(inputClasses, "resize-y", errors.message ? "border-[#a03826]" : "border-stone-beige")}
        />
        {errorText("message")}
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            {...fieldProps("consent")}
            type="checkbox"
            checked={data.consent}
            onChange={(e) => set("consent", e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-ink"
          />
          <label htmlFor={field("consent")} className="text-sm leading-relaxed text-charcoal/85">
            He leído y acepto la{" "}
            <Link href="/politica-de-privacidad" className="link-editorial">
              política de privacidad
            </Link>{" "}
            y autorizo a Granalto a contactarme sobre mi consulta.
          </label>
        </div>
        {errorText("consent")}
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-sm border border-[#a03826]/30 bg-[#a03826]/5 px-4 py-3 text-sm text-[#a03826]">
          No pudimos enviar su solicitud. Intente de nuevo o escríbanos por WhatsApp.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-sm bg-ink px-8 py-3.5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" && (
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        )}
        {status === "submitting" ? "Enviando…" : "Solicitar asesoría"}
      </button>
    </form>
  );
}
