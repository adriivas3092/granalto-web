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

/**
 * URL base del Checkout. Por defecto según el ambiente, pero se puede forzar
 * con GREENPAY_CHECKOUT_BASE (p. ej. el host QA: https://checkoutv2.greenpayqa.me)
 * cuando las credenciales pertenecen a un entorno distinto al estándar.
 */
export function checkoutBase(env: GreenpayEnv): string {
  const override = process.env.GREENPAY_CHECKOUT_BASE?.trim();
  if (override) return override.replace(/\/+$/, "");
  return BASE_URL[env];
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
  /** Host del Checkout (por si se usa un override de entorno, p. ej. QA). */
  apiUrl: string;
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

  // Dirección por defecto (Costa Rica). El cobro no depende de estos datos,
  // pero GreenPay valida que la estructura del cliente esté completa.
  const direccion = {
    country: "CR",
    province: "San José",
    city: "San José",
    street1: "-",
    street2: "-",
    zip: "10101",
  };

  const customer = {
    name: params.customer?.name || "Cliente Granalto",
    email: params.customer?.email || "ventas@granalto.net",
    identification: params.customer?.identification || "000000000",
    billingAddress: direccion,
    shippingAddress: direccion,
  };

  const products =
    params.products && params.products.length > 0
      ? params.products
      : [
          {
            description: params.description,
            skuId: params.orderReference.slice(0, 20),
            quantity: 1,
            price: Number(params.amount.toFixed(2)),
            type: "TD",
          },
        ];

  // `additional` es opcional. Lo incluimos solo si GREENPAY_SEND_ADDITIONAL
  // está activo; así podemos aislar si el rechazo de validación viene de ahí.
  const incluirAdicional = process.env.GREENPAY_SEND_ADDITIONAL === "true";
  // GreenPay valida el largo de orderReference; un UUID completo (36) lo
  // rechaza. Usamos una referencia corta derivada del id (hex sin guiones).
  const orderRef = params.orderReference.replace(/-/g, "").slice(0, 15);
  const body = {
    secret: process.env.GREENPAY_SECRET,
    merchantId: process.env.GREENPAY_MERCHANT_ID,
    terminal: terminalId,
    amount: params.amount.toFixed(2),
    currency: (params.currency || "CRC").toUpperCase(),
    description: params.description,
    orderReference: orderRef,
    ...(incluirAdicional ? { additional: { customer, products } } : {}),
  };

  const url = `${checkoutBase(env)}/createOrder`;
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
        secretLen: process.env.GREENPAY_SECRET?.length ?? 0,
        bodySent: { ...body, secret: "<redactado>" },
        response: bodyText.slice(0, 1500),
      }),
    );
    throw new Error("GreenPay no pudo crear la orden. Intentá de nuevo o contactanos.");
  }
  return { session: json.session, token: json.token, terminalId, env, apiUrl: checkoutBase(env) };
}
