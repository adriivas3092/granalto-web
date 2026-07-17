"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl, siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

/**
 * Botón flotante de WhatsApp: tamaño táctil correcto, tooltip en escritorio
 * y registro de evento analítico al hacer clic.
 */
export function WhatsAppButton() {
  return (
    <div className="group fixed bottom-5 right-5 z-40 md:bottom-8 md:right-8">
      <span
        role="tooltip"
        id="whatsapp-tooltip"
        className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-sm bg-ink px-3 py-2 text-xs text-ivory opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 md:block"
      >
        Escríbanos por WhatsApp
      </span>
      <a
        href={getWhatsAppUrl(siteConfig.whatsappMessages.default)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir a Granalto por WhatsApp"
        aria-describedby="whatsapp-tooltip"
        onClick={() => trackEvent({ name: "whatsapp_click", params: { source: "floating-button" } })}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <MessageCircle aria-hidden="true" className="h-7 w-7" />
      </a>
    </div>
  );
}
