/**
 * Adaptador de la pasarela GreenPay — Checkout V2.
 *
 * Flujo (según el ejemplo oficial de GreenPay, checkout-v2-nodejs):
 *   1. SERVIDOR (aquí): POST {base}/createOrder con el `secret` → { session, token }.
 *   2. NAVEGADOR: con @greenpay_prod/3ds-react arma el pago (cardData {ed, session},
 *      sessionToken=token, terminalId) y corre el 3D Secure (vía Evervault).
 *   3. SERVIDOR (aquí): POST {base}/ (autorización) con { session, ed } y header
 *      session-token → se cobra la tarjeta.
 *
 * SEGURIDAD: el `secret` del comercio vive únicamente en variables de entorno y
 * solo se usa en el servidor.
 *
 * Autenticación: este comercio usa el flujo directo (el `secret` va en el cuerpo
 * de createOrder, sin JWT). Si en producción se habilitan api_key/api_secret de
 * la consola, el adaptador pide el JWT a {auth}/auth/token y lo manda como
 * Bearer automáticamente.
 *
 * Variables de entorno (en Vercel, nunca en el código):
 *   GREENPAY_ENV            → "sbx" (pruebas) | "prod" (producción)
 *   GREENPAY_SECRET         → secret del comercio (va en el cuerpo de createOrder)
 *   GREENPAY_MERCHANT_ID    → id del comercio
 *   GREENPAY_TERMINAL_CRC   → terminal para cobros en colones
 *   GREENPAY_TERMINAL_USD   → terminal para cobros en dólares
 *   GREENPAY_API_KEY        → (opcional) API key de la consola, activa el JWT
 *   GREENPAY_API_SECRET     → (opcional) API secret de la consola  [solo servidor]
 */

export type GreenpayEnv = "sbx" | "prod";

const BASE_URL: Record<GreenpayEnv, string> = {
  sbx: "https://checkoutv2.greenpaysbx.me",
  prod: "https://checkoutv2.greenpay.me",
};

const AUTH_URL: Record<GreenpayEnv, string> = {
  sbx: "https://auth.greenpaysbx.me",
  prod: "https://auth.greenpay.me",
};

/**
 * Obtiene un access token (JWT) de GreenPay 2.0 usando api_key/api_secret.
 * El token es válido 1 hora; aquí pedimos uno fresco por cada orden.
 */
async function obtenerAccessToken(env: GreenpayEnv): Promise<string> {
  const api_key = process.env.GREENPAY_API_KEY;
  const api_secret = process.env.GREENPAY_API_SECRET;
  if (!api_key || !api_secret) {
    throw new Error("Faltan GREENPAY_API_KEY / GREENPAY_API_SECRET.");
  }
  const url = `${AUTH_URL[env]}/auth/token`;
  let res: Response;
  let text = "";
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ api_key, api_secret }),
      cache: "no-store",
    });
    text = await res.text();
  } catch (e) {
    console.error("[greenpay] auth/token fetch error", url, e instanceof Error ? e.message : e);
    throw new Error("No se pudo autenticar con GreenPay.");
  }
  let json: { access_token?: string; code?: string; message?: string } | null = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (!res.ok || !json?.access_token) {
    console.error(
      "[greenpay] auth/token fallo",
      JSON.stringify({ url, status: res.status, response: text.slice(0, 500) }),
    );
    throw new Error("GreenPay rechazó las credenciales de API (api_key/api_secret).");
  }
  return json.access_token;
}

export function greenpayEnv(): GreenpayEnv {
  return process.env.GREENPAY_ENV === "prod" ? "prod" : "sbx";
}

/** URL base del Checkout según el ambiente. */
export function checkoutBase(env: GreenpayEnv): string {
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
  const moneda = (params.currency || "CRC").toUpperCase();
  const terminalId = terminalParaMoneda(moneda);
  if (!terminalId) throw new Error("No hay terminal configurado para la moneda del pedido.");

  const env = greenpayEnv();

  // Dirección por defecto (Costa Rica). El cobro no depende de estos datos,
  // pero si se envía `additional`, GreenPay valida longitudes (cada campo de
  // dirección: mín. 2 caracteres).
  const direccion = {
    country: "CR",
    province: "San José",
    city: "San José",
    street1: "Sin detalle",
    street2: "Sin detalle",
    zip: "10101",
  };

  const nombre = params.customer?.name && params.customer.name.length >= 5
    ? params.customer.name
    : "Cliente Granalto";
  const customer = {
    name: nombre,
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

  // orderReference admite 4..100 chars; usamos el id del pedido (UUID).
  const orderRef = params.orderReference.slice(0, 100);
  const body = {
    secret: process.env.GREENPAY_SECRET,
    merchantId: process.env.GREENPAY_MERCHANT_ID,
    terminal: terminalId,
    // IMPORTANTE: el esquema de GreenPay exige amount como NÚMERO (no string),
    // con dos decimales (p. ej. 10.26). Enviarlo como texto rompe la validación.
    amount: Number(params.amount.toFixed(2)),
    currency: moneda,
    description: params.description,
    orderReference: orderRef,
    additional: { customer, products },
  };

  // Autenticación opcional: si hay api_key/api_secret, pedimos el JWT y lo
  // mandamos como Bearer. Si no, se llama a createOrder directo con el secret
  // en el cuerpo (flujo que indicó GreenPay para este comercio).
  const usarAuth = Boolean(process.env.GREENPAY_API_KEY && process.env.GREENPAY_API_SECRET);
  const accessToken = usarAuth ? await obtenerAccessToken(env) : null;

  const url = `${checkoutBase(env)}/createOrder`;
  let res: Response;
  let bodyText = "";
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
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
    // Error conciso (sin datos sensibles) para los logs de Vercel.
    console.error(
      "[greenpay] createOrder fallo",
      JSON.stringify({ env, status: res.status, response: bodyText.slice(0, 500) }),
    );
    throw new Error("GreenPay no pudo crear la orden. Intentá de nuevo o contactanos.");
  }
  return { session: json.session, token: json.token, terminalId, env, apiUrl: checkoutBase(env) };
}

export type TarjetaAutorizacion = {
  cardHolder: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
};

export type ResultadoAutorizacion = {
  aprobado: boolean;
  authorization?: string | null;
  transactionId?: string;
  last4?: string;
  brand?: string;
  mensaje?: string;
};

/**
 * Autoriza (cobra) el pago de una orden ya creada (y, si aplica, autenticada
 * con 3DS). Se corre en el SERVIDOR (recomendación de GreenPay). El cuerpo es
 * solo { session, ed } + header session-token; GreenPay adjunta el resultado
 * 3DS almacenado por su cuenta — no se envían campos 3DS.
 */
export async function autorizarGreenpay(params: {
  token: string;
  session: string;
  card: TarjetaAutorizacion;
}): Promise<ResultadoAutorizacion> {
  const env = greenpayEnv();
  // `ed` ESTÁNDAR para autorización (distinto al del 3DS): lleva cardHolder,
  // cardNumber, cvc y channelData.
  const edPayload = {
    card: {
      cardHolder: params.card.cardHolder,
      expirationDate: { month: params.card.expMonth, year: params.card.expYear },
      cardNumber: params.card.cardNumber,
      cvc: params.card.cvc,
    },
    additional: { channelData: { channel: "01", source: "API_CARD" } },
  };
  const ed = Buffer.from(JSON.stringify(edPayload)).toString("base64");

  const url = `${checkoutBase(env)}/`;
  let res: Response;
  let text = "";
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "session-token": params.token,
      },
      body: JSON.stringify({ session: params.session, ed }),
      cache: "no-store",
    });
    text = await res.text();
  } catch (e) {
    console.error("[greenpay] authorize fetch error", e instanceof Error ? e.message : e);
    return { aprobado: false, mensaje: "No se pudo contactar a GreenPay." };
  }

  let json:
    | { status?: number; authorization?: string | null; transactionId?: string; last4?: string; brand?: string; errors?: unknown[]; gp_error?: { message?: string } }
    | null = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  const aprobado =
    res.ok &&
    json?.status === 200 &&
    (json?.errors?.length ?? 0) === 0 &&
    Boolean(json?.authorization);

  if (!aprobado) {
    console.error(
      "[greenpay] authorize fallo",
      JSON.stringify({ httpStatus: res.status, response: text.slice(0, 800) }),
    );
  }

  return {
    aprobado: Boolean(aprobado),
    authorization: json?.authorization ?? null,
    transactionId: json?.transactionId,
    last4: json?.last4,
    brand: json?.brand,
    mensaje: json?.gp_error?.message,
  };
}

export type WebhookGreenpay = {
  /** orderReference que enviamos en createOrder (= id del pedido). */
  orderId: string;
  aprobado: boolean;
  /** Referencia legible (Aut/Tx) para anotar en el pedido. */
  referencia?: string;
};

/**
 * Interpreta el cuerpo del webhook de GreenPay (confirmación servidor-a-servidor).
 *
 * El parseo es defensivo: GreenPay puede anidar los datos bajo `data`/`result`/
 * `order`/`transaction`, así que se buscan las claves en todas esas fuentes. La
 * ruta registra el payload crudo la primera vez que GreenPay llama, para poder
 * afinar el mapeo con la forma real si hiciera falta.
 *
 * Devuelve null si no se reconoce el pedido en el payload.
 */
export function parsearWebhookGreenpay(payload: unknown): WebhookGreenpay | null {
  if (!payload || typeof payload !== "object") return null;
  const raiz = payload as Record<string, unknown>;

  // Fuentes donde buscar las claves (raíz + objetos anidados comunes).
  const fuentes: Record<string, unknown>[] = [raiz];
  for (const k of ["data", "result", "order", "transaction"]) {
    const v = raiz[k];
    if (v && typeof v === "object") fuentes.push(v as Record<string, unknown>);
  }
  const leer = (...claves: string[]): unknown => {
    for (const f of fuentes)
      for (const k of claves) if (f[k] !== undefined && f[k] !== null) return f[k];
    return undefined;
  };

  const ref = leer("orderReference", "reference", "orderId", "id");
  if (typeof ref !== "string" || ref.length < 4) return null;

  const status = leer("status", "statusCode");
  const estado = String(leer("state", "status") ?? "").toLowerCase();
  const authorization = leer("authorization", "authorizationCode");
  const transactionId = leer("transactionId", "transaction_id", "txId");
  const aprobado =
    status === 200 ||
    status === "200" ||
    ["approved", "paid", "success", "completed", "aprobado", "pagado"].includes(estado) ||
    (Boolean(authorization) && status !== 400);

  const referencia = [
    authorization && `Aut: ${authorization}`,
    transactionId && `Tx: ${transactionId}`,
  ]
    .filter(Boolean)
    .join(" · ")
    .slice(0, 200);

  return { orderId: ref, aprobado, referencia: referencia || undefined };
}
