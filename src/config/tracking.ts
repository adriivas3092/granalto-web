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
// Google Ads (AW-978695125) y sus conversiones ya se disparan DESDE el
// contenedor de GTM. Se deja vacío para no cargarlo ni contarlo dos veces.
export const ADS_ID = process.env.NEXT_PUBLIC_GADS_ID || "";

/** Eventos del sitio que cuentan como conversión → etiqueta de Google Ads. */
export const ADS_CONVERSIONS: Record<string, string> = {
  whatsapp_click: "",
  contact_form_submit: "",
  phone_click: "",
  directions_click: "",
  email_click: "",
};

/**
 * Nombres de evento que esperan los activadores del contenedor de GTM (se
 * heredaron de la web anterior). Cada evento del sitio se reenvía además con
 * ese nombre exacto (GTM distingue mayúsculas) para disparar su conversión.
 *
 * "Click to Chat" → activador "Click WhatsApp" → etiqueta "WhatsApp".
 * No se envía "click to chat" (minúsculas): su etiqueta comparte el código de
 * conversión del formulario y contaría cada clic en dos acciones.
 */
export const GTM_EVENT_ALIASES: Record<string, string> = {
  whatsapp_click: "Click to Chat",
};
