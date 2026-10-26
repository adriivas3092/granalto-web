/**
 * Adaptador de la pasarela GreenPay — Checkout V2.
 *
 * Arquitectura (según el ejemplo oficial de GreenPay, checkout-v2-nodejs):
 *   1. SERVIDOR (aquí): POST {base}/createOrder con el `secret` → { session, token }.
 *   2. NAVEGADOR: con @greenpay_prod/3ds-react arma el pago (cardData {ed, session},
 *      sessionToken=token, terminalId) y corre el 3D Secure (vía Evervault).
 *
 * SEGURIDAD: el número de tarjeta se captura y envía desde el NAVEGADOR
 * directamente a GreenPay; nunca pasa por nuestro servidor. Aquí solo se crea
 * la orden con el `secret`, que vive únicamente en variables de entorno.
 *
 * Variables de entorno (en Vercel, nunca en el código):
 *   GREENPAY_ENV            → "sbx" (pruebas) | "prod" (producción)
 *   GREENPAY_SECRET         → secret del comercio (base64)   [solo servidor]
 *   GREENPAY_MERCHANT_ID    → id del comercio
 *   GREENPAY_TERMINAL_CRC   → terminal para cobros en colones
 *   GREENPAY_TERMINAL_USD   → terminal para cobros en dólares
 */

export type GreenpayEnv = "sbx" | "prod";

const BASE_URL: Record<GreenpayEnv, string> = {
  sbx: "https://checkoutv2.greenpaysbx.me",
  prod: "https://checkoutv2.greenpay.me",
};

export function greenpayEnv(): GreenpayEnv {
  return process.env.GREENPAY_ENV === "prod" ? "prod" : "sbx";
}

export function greenpayConfigurado(): boolean {
  return Boolean(
    process.env.GREENPAY_SECRET &&
      process.env.GREENPAY_MERCHANT_ID &&
      (process.env.GREENPAY_TERMINAL_CRC || process.env.GREENPAY_TERMINAL_USD),
  );
}

/** Terminal según la moneda del pedido (CRC por defecto). */
export function terminalParaMoneda(currency: string): string | null {
  const c = (currency || "CRC").toUpperCase();
  if (c === "USD") return process.env.GREENPAY_TERMINAL_USD ?? process.env.GREENPAY_TERMINAL_CRC ?? null;
  return process.env.GREENPAY_TERMINAL_CRC ?? process.env.GREENPAY_TERMINAL_USD ?? null;
}

export type OrdenProducto = {
  description: string;
  skuId?: string;
  quantity: number;
  price: number;
  type?: string;
};

export type CrearOrdenParams = {
  amount: number;
  currency: string;
  description: string;
  orderReference: string;
  customer?: {
    name?: string;
    email?: string;
    identification?: string;
  };
  products?: OrdenProducto[];
};

/** Datos que el navegador necesita para procesar el pago con el SDK de GreenPay. */
export type OrdenGreenpay = {
  session: string;
  token: string;
  terminalId: string;
  env: GreenpayEnv;
};

/**
 * Crea la orden en GreenPay y devuelve { session, token } más el terminal y el
 * ambiente, que el navegador usará con @greenpay_prod/3ds-react.
 */
export async function crearOrdenGreenpay(params: CrearOrdenParams): Promise<OrdenGreenpay> {
  if (!greenpayConfigurado()) {
    throw new Error("GreenPay no está configurado (faltan variables de entorno).");
  }
  const terminalId = terminalParaMoneda(params.currency);
  if (!terminalId) throw new Error("No hay terminal configurado para la moneda del pedido.");

  const env = greenpayEnv();
  const body = {
    secret: process.env.GREENPAY_SECRET,
    merchantId: process.env.GREENPAY_MERCHANT_ID,
    terminal: terminalId,
    amount: params.amount.toFixed(2),
    currency: (params.currency || "CRC").toUpperCase(),
    description: params.description,
    orderReference: params.orderReference,
    additional: {
      ...(params.customer ? { customer: params.customer } : {}),
      ...(params.products ? { products: params.products } : {}),
    },
  };

  const url = `${BASE_URL[env]}/createOrder`;
  let res: Response;
  let bodyText = "";
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    bodyText = await res.text();
  } catch (e) {
    console.error("[greenpay] createOrder fetch error", url, env, e instanceof Error ? e.message : e);
    throw new Error("No se pudo contactar a GreenPay. Intentá de nuevo.");
  }

  let json: { session?: string; token?: string } | null = null;
  try {
    json = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    json = null;
  }

  if (!res.ok || !json?.session || !json?.token) {
    // Diagnóstico (sin exponer el secret) — visible en los logs de Vercel.
    console.error(
      "[greenpay] createOrder fallo",
      JSON.stringify({
        url,
        env,
        status: res.status,
        currency: body.currency,
        terminal: terminalId,
        amount: body.amount,
        merchantId: process.env.GREENPAY_MERCHANT_ID,
        response: bodyText.slice(0, 1000),
      }),
    );
    throw new Error("GreenPay no pudo crear la orden. Intentá de nuevo o contactanos.");
  }
  return { session: json.session, token: json.token, terminalId, env };
}
