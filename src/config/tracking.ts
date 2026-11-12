/**
 * Etiquetas de medición de Google (IDs públicos).
 *
 * - GTM_ID: contenedor de Google Tag Manager (formato GTM-XXXXXXX).
 * - ADS_ID: cuenta de Google Ads (formato AW-XXXXXXXXXX).
 * - ADS_CONVERSIONS: etiqueta de conversión de Google Ads por evento del sitio.
 *   La etiqueta es la parte que va después de la barra en "AW-123/AbCdEf".
 *
 * Con un valor vacío la etiqueta correspondiente no se carga.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-P6CPG97";
export const ADS_ID = process.env.NEXT_PUBLIC_GADS_ID || "AW-978695125";

/** Eventos del sitio que cuentan como conversión → etiqueta de Google Ads. */
export const ADS_CONVERSIONS: Record<string, string> = {
  whatsapp_click: "YMrqCOzX_u0YENXn1tlD",
  contact_form_submit: "",
  phone_click: "",
  directions_click: "",
  email_click: "",
};
