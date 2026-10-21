"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Google Analytics 4. Carga el script SOLO si:
 *  - hay un ID de medición configurado (NEXT_PUBLIC_GA_ID, formato G-XXXXXXXXXX), y
 *  - el visitante aceptó las cookies (banner de consentimiento).
 *
 * Reacciona al cambio de consentimiento sin recargar (evento del banner).
 */
const CONSENT_KEY = "granalto-cookie-consent";

// ID de medición GA4 (público). Se puede sobrescribir con NEXT_PUBLIC_GA_ID.
const GA_DEFAULT_ID = "G-4669154452";

export function GoogleAnalytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID || GA_DEFAULT_ID;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        setEnabled(localStorage.getItem(CONSENT_KEY) === "accepted");
      } catch {
        setEnabled(false);
      }
    };
    check();
    window.addEventListener("cookie-consent-change", check);
    window.addEventListener("storage", check);
    return () => {
      window.removeEventListener("cookie-consent-change", check);
      window.removeEventListener("storage", check);
    };
  }, []);

  if (!gaId || !enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
