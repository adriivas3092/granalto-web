import type { VisualizerConfig } from "@/store/visualizerStore";

/** Codifica la configuración a un token compacto y seguro para URL. */
export function encodeConfig(cfg: VisualizerConfig): string {
  try {
    const json = JSON.stringify(cfg);
    const b64 = typeof window === "undefined" ? Buffer.from(json).toString("base64") : window.btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return "";
  }
}

/** Decodifica el token de la URL. Devuelve null si es inválido. */
export function decodeConfig(token: string): VisualizerConfig | null {
  try {
    const b64 = token.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof window === "undefined"
        ? Buffer.from(b64, "base64").toString("utf8")
        : decodeURIComponent(escape(window.atob(b64)));
    const parsed = JSON.parse(json);
    if (parsed && typeof parsed.e === "string") return parsed as VisualizerConfig;
    return null;
  } catch {
    return null;
  }
}

/** Construye la URL absoluta compartible del proyecto. */
export function buildShareUrl(cfg: VisualizerConfig): string {
  const base = typeof window !== "undefined" ? `${window.location.origin}/visualizador` : "/visualizador";
  return `${base}?c=${encodeConfig(cfg)}`;
}
