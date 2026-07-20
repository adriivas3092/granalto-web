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
  async redirects() {
    // Redirecciones desde URLs del sitio anterior (granaltocr.net).
    // PENDIENTE_VALIDAR: completar con el inventario final de URLs antiguas.
    return [
      { source: "/granito", destination: "/materiales/granito", permanent: true },
      { source: "/onix", destination: "/materiales", permanent: true },
      { source: "/travertinos", destination: "/materiales/travertino", permanent: true },
      { source: "/cambria", destination: "/materiales/cambria", permanent: true },
    ];
  },
};

export default nextConfig;
