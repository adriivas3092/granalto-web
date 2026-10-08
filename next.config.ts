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
    // El cotizador no se cachea en el navegador para que siempre cargue la
    // última versión (evita ver una versión vieja por caché del navegador).
    return [
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
