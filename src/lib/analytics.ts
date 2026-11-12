import type { AnalyticsEvent } from "@/types";
import { ADS_ID, ADS_CONVERSIONS, GTM_EVENT_ALIASES } from "@/config/tracking";

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

/** Último evento enviado, para no contar dos veces el mismo clic. */
let ultimo = { name: "", at: 0 };

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  const params = "params" in event ? event.params : undefined;

  // Un mismo clic puede reportarse desde el enlace y desde el rastreador
  // global de contactos: se ignora el duplicado inmediato.
  const ahora = Date.now();
  if (ultimo.name === event.name && ahora - ultimo.at < 800) return;
  ultimo = { name: event.name, at: ahora };

  // Google Tag Manager / dataLayer
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event: event.name, ...params });
  const alias = GTM_EVENT_ALIASES[event.name];
  if (alias) w.dataLayer.push({ event: alias, ...params });

  // Google Analytics 4 (gtag directo)
  if (typeof w.gtag === "function") {
    w.gtag("event", event.name, params ?? {});
  }

  // Conversión de Google Ads (si el evento tiene etiqueta configurada)
  const etiqueta = ADS_CONVERSIONS[event.name];
  if (ADS_ID && etiqueta && typeof w.gtag === "function") {
    w.gtag("event", "conversion", { send_to: `${ADS_ID}/${etiqueta}` });
  }

  // Meta Pixel
  if (typeof w.fbq === "function") {
    w.fbq("trackCustom", event.name, params ?? {});
  }
}
