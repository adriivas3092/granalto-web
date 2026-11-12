"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Registra como evento cualquier clic en un enlace de contacto del sitio
 * (WhatsApp, teléfono, correo, mapa), sin depender de que cada enlace lo
 * reporte por su cuenta. Así todas las conversiones quedan cubiertas.
 */
export function ContactClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)\//i.test(href)) {
        trackEvent({ name: "whatsapp_click", params: { source: "link" } });
      } else if (href.startsWith("tel:")) {
        trackEvent({ name: "phone_click", params: { phone: href.slice(4) } });
      } else if (href.startsWith("mailto:")) {
        trackEvent({ name: "email_click", params: { email: href.slice(7) } });
      } else if (/^https?:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps|(www\.)?google\.[a-z.]+\/maps|maps\.google\.|(www\.)?waze\.com)/i.test(href)) {
        trackEvent({ name: "directions_click", params: { locationId: "link" } });
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
