import { getWhatsAppUrl } from "@/config/site";

export type QuotePayload = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  location: string;
  message: string;
  consent: boolean;
  environmentName: string;
  lighting: string;
  materials: { surface: string; material: string; collection?: string; finish?: string }[];
  shareUrl: string;
  imageDataUrl?: string;
};

export type QuoteResult = { ok: true; ref: string } | { ok: false; error: string };

/**
 * Servicio de cotización desacoplado. Si se define NEXT_PUBLIC_QUOTE_ENDPOINT
 * se hace POST allí; de lo contrario se simula un envío exitoso (para poder
 * probar el flujo sin backend). Sustituya por la integración real (CRM/API).
 */
export async function submitQuote(payload: QuotePayload): Promise<QuoteResult> {
  const endpoint = process.env.NEXT_PUBLIC_QUOTE_ENDPOINT;
  try {
    if (endpoint) {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return { ok: false, error: `El servidor respondió ${res.status}` };
    } else {
      // Simulación: latencia breve y éxito.
      await new Promise((r) => setTimeout(r, 700));
    }
    return { ok: true, ref: `GA-${Date.now().toString(36).toUpperCase()}` };
  } catch {
    return { ok: false, error: "No se pudo enviar la solicitud. Intente de nuevo." };
  }
}

/** Mensaje de WhatsApp con el resumen de la configuración (respaldo). */
export function quoteWhatsAppUrl(payload: QuotePayload): string {
  const lines = [
    `Hola, quiero una cotización desde el Visualizador de Ambientes.`,
    `Ambiente: ${payload.environmentName}`,
    `Iluminación: ${payload.lighting}`,
    ...payload.materials.map((m) => `• ${m.surface}: ${m.material}`),
    `Proyecto: ${payload.shareUrl}`,
  ];
  return getWhatsAppUrl(lines.join("\n"));
}
