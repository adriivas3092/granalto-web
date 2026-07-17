"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl, siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

type Props = {
  title?: string;
  description?: string;
  source?: string;
};

/** Sección de cierre con CTA a asesoría y WhatsApp. */
export function CTASection({
  title = "Conversemos sobre su próximo proyecto",
  description = "Visite nuestros showrooms o comuníquese con nuestro equipo para recibir asesoría personalizada.",
  source = "cta-section",
}: Props) {
  return (
    <section className="bg-ink py-20 text-ivory md:py-28">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-2xl text-3xl leading-tight md:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone-beige md:text-lg">
          {description}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/contacto"
            onClick={() => trackEvent({ name: "cta_advisory_click", params: { source } })}
            className="inline-flex min-h-[48px] items-center rounded-sm bg-ivory px-7 py-3 text-sm font-medium tracking-wide text-ink transition-colors hover:bg-stone-beige"
          >
            Solicitar asesoría
          </Link>
          <a
            href={getWhatsAppUrl(siteConfig.whatsappMessages.advisory)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent({ name: "whatsapp_click", params: { source } })}
            className="inline-flex min-h-[48px] items-center gap-2 rounded-sm border border-ivory px-7 py-3 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-ivory hover:text-ink"
          >
            <MessageCircle aria-hidden="true" className="h-4 w-4" />
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
