import type { AnalyticsEvent } from "@/types";

/**
 * Capa de eventos analíticos.
 * Preparada para GA4 (gtag), Google Tag Manager (dataLayer) y Meta Pixel (fbq).
 * Los IDs se configuran mediante variables de entorno (ver .env.example);
 * si no hay IDs configurados, los eventos solo se registran en dataLayer
 * cuando existe, sin generar errores.
 */

type DataLayerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  const params = "params" in event ? event.params : undefined;

  // Google Tag Manager / dataLayer
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event: event.name, ...params });

  // Google Analytics 4 (gtag directo)
  if (typeof w.gtag === "function") {
    w.gtag("event", event.name, params ?? {});
  }

  // Meta Pixel
  if (typeof w.fbq === "function") {
    w.fbq("trackCustom", event.name, params ?? {});
  }
}
