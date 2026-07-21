import type { ProductQuoteResult, ProjectPiece, QuoteConfiguration, CustomerInformation, ConsentInformation, ProjectInformation } from "@/types/quote";

/** Cliente HTTP del cotizador. El servidor es la fuente definitiva del cálculo. */

export type CalculatePayload = {
  productIds: string[];
  pieces: ProjectPiece[];
  configuration: QuoteConfiguration;
};

export async function calculateQuoteRemote(payload: CalculatePayload): Promise<ProductQuoteResult[]> {
  const res = await fetch("/api/quotes/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message ?? "No se pudo calcular la cotización.");
  return data.estimates as ProductQuoteResult[];
}

export type SubmitPayload = CalculatePayload & {
  project: ProjectInformation | null;
  selectedOptionId?: string;
  customer: CustomerInformation;
  consent: ConsentInformation;
};

export type SubmitResult = { success: boolean; quoteId?: string; estimates?: ProductQuoteResult[]; message: string };

export async function submitQuoteRemote(payload: SubmitPayload): Promise<SubmitResult> {
  const res = await fetch("/api/quotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "granalto-online-quote", ...payload }),
  });
  const data = (await res.json()) as SubmitResult;
  if (!res.ok) throw new Error(data.message ?? "No se pudo enviar la solicitud.");
  return data;
}
