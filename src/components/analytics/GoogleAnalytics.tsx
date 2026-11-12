"use client";

import Script from "next/script";
import { useEffect } from "react";
import { ADS_ID, GTM_ID } from "@/config/tracking";

/**
 * Etiquetas de Google (GA4, Google Ads y Tag Manager) con MODO DE
 * CONSENTIMIENTO v2:
 *  - Las etiquetas cargan siempre, pero con el consentimiento DENEGADO por
 *    defecto: no escriben cookies ni identificadores hasta que el visitante
 *    acepta, y Google estima (modela) las conversiones no observadas.
 *  - Al aceptar en el banner de cookies se actualiza a "granted"; al rechazar
 *    queda denegado. Reacciona al cambio sin recargar la página.
 */
const CONSENT_KEY = "granalto-cookie-consent";

// GA4 se carga desde el contenedor de GTM (ya tiene sus etiquetas de Google).
// Solo se carga directo si se define NEXT_PUBLIC_GA_ID.
const GA_DEFAULT_ID = "";

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

function aplicarConsentimiento() {
  let aceptado = false;
  try {
    aceptado = localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    aceptado = false;
  }
  const estado = aceptado ? "granted" : "denied";
  (window as GtagWindow).gtag?.("consent", "update", {
    ad_storage: estado,
    ad_user_data: estado,
    ad_personalization: estado,
    analytics_storage: estado,
  });
}

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || GA_DEFAULT_ID;

  useEffect(() => {
    aplicarConsentimiento();
    window.addEventListener("cookie-consent-change", aplicarConsentimiento);
    window.addEventListener("storage", aplicarConsentimiento);
    return () => {
      window.removeEventListener("cookie-consent-change", aplicarConsentimiento);
      window.removeEventListener("storage", aplicarConsentimiento);
    };
  }, []);

  if (!gaId && !ADS_ID && !GTM_ID) return null;
  const principal = gaId || ADS_ID;

  return (
    <>
      {/* Consentimiento por defecto: debe definirse ANTES de cargar las etiquetas. */}
      <Script id="google-consent-default" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          var aceptado = false;
          try { aceptado = localStorage.getItem('${CONSENT_KEY}') === 'accepted'; } catch (e) {}
          var estado = aceptado ? 'granted' : 'denied';
          gtag('consent', 'default', {
            ad_storage: estado,
            ad_user_data: estado,
            ad_personalization: estado,
            analytics_storage: estado
          });
          gtag('js', new Date());
          ${gaId ? `gtag('config', '${gaId}', { anonymize_ip: true });` : ""}
          ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ""}
        `}
      </Script>
      {principal && (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${principal}`}
          strategy="afterInteractive"
        />
      )}
      {GTM_ID && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}
    </>
  );
}
