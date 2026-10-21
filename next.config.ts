import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Los placeholders temporales son SVG locales; al reemplazarlos por
    // fotografías (JPG/WebP/AVIF) esta excepción puede eliminarse.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
    // Imágenes de productos alojadas en Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  async headers() {
    // Content-Security-Policy: permite lo que la app realmente usa (Supabase,
    // Google Analytics/Tag Manager, Vercel) y bloquea orígenes externos no
    // autorizados. 'unsafe-inline'/'unsafe-eval' son necesarios para Next y el
    // visor 3D; aun así se restringe de qué dominios se cargan scripts.
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com https://*.vercel-insights.com https://*.kommo.com https://*.amocrm.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.kommo.com https://*.amocrm.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com https://*.kommo.com https://*.amocrm.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://*.vercel-insights.com https://vitals.vercel-insights.com https://*.kommo.com wss://*.kommo.com https://*.amocrm.com wss://*.amocrm.com",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.google.com https://*.kommo.com https://*.amocrm.com",
      "upgrade-insecure-requests",
    ].join("; ");

    const securityHeaders = [
      { key: "Content-Security-Policy", value: csp },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
    ];

    return [
      // Seguridad: aplica a todo el sitio.
      { source: "/:path*", headers: securityHeaders },
      // El cotizador no se cachea en el navegador para que siempre cargue la
      // última versión (evita ver una versión vieja por caché del navegador).
      {
        source: "/cotizar/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
      {
        source: "/cotizar",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
  async redirects() {
    // Redirecciones desde URLs del sitio anterior (granaltocr.net).
    // PENDIENTE_VALIDAR: completar con el inventario final de URLs antiguas.
    return [
      { source: "/configurador", destination: "/materiales", permanent: true },
      { source: "/visualizador", destination: "/materiales", permanent: true },
      { source: "/granito", destination: "/materiales/granito", permanent: true },
      { source: "/onix", destination: "/materiales", permanent: true },
      { source: "/travertinos", destination: "/materiales/travertino", permanent: true },
      { source: "/cambria", destination: "/materiales/cambria", permanent: true },
    ];
  },
};

export default nextConfig;
