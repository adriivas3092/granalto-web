/**
 * Adaptador de la pasarela de pago del Banco Nacional (BN).
 *
 * SEGURIDAD: usamos el flujo de **página de pago alojada por el banco**
 * (redirección). El cliente ingresa la tarjeta en la página segura del BN;
 * los datos de la tarjeta **nunca pasan por nuestro servidor** (cumple PCI-DSS).
 *
 * Esta capa queda lista para enchufar los endpoints reales del BN cuando
 * tengamos la documentación técnica (plataforma/procesador, Merchant ID,
 * llaves de firma, URLs de creación de transacción y de callback/webhook).
 *
 * Variables de entorno (en Vercel, nunca en el código):
 *   BN_API_URL         → endpoint base de la pasarela del BN
 *   BN_MERCHANT_ID     → código de comercio
 *   BN_TERMINAL_ID     → terminal (si aplica)
 *   BN_SECRET          → llave/clave de firma
 *   BN_WEBHOOK_SECRET  → secreto para validar el callback del BN
 */

export type CrearTxParams = {
  orderId: string;
  amount: number; // monto total
  currency: string; // "CRC" | "USD"
  returnUrl: string; // a dónde vuelve el cliente tras pagar
  customerEmail?: string;
  customerName?: string;
};

export function bnConfigurado(): boolean {
  return Boolean(process.env.BN_API_URL && process.env.BN_MERCHANT_ID && process.env.BN_SECRET);
}

/**
 * Crea una transacción en el BN y devuelve la URL de la página de pago segura
 * a la que hay que redirigir al cliente. Devuelve null si el BN no está
 * configurado todavía (sin credenciales).
 */
export async function crearTransaccionBN(_params: CrearTxParams): Promise<{ redirectUrl: string } | null> {
  if (!bnConfigurado()) return null;

  // TODO (con la doc del BN): construir el request, firmarlo con BN_SECRET,
  // llamar a BN_API_URL para crear la transacción y devolver la URL de pago.
  // El formato exacto depende de la plataforma que use el BN (p. ej. Fiserv/
  // First Data, First Atlantic Commerce/Powertranz, Credomatic, etc.).
  throw new Error("Pasarela BN: pendiente de la documentación técnica del banco.");
}

/**
 * Valida y procesa el callback/webhook del BN (confirmación real del pago).
 * Devuelve el orderId y si el pago fue aprobado. Se completa con el formato
 * y la firma que indique la doc del BN.
 */
export async function verificarCallbackBN(
  _payload: unknown,
  _headers: Headers,
): Promise<{ orderId: string; aprobado: boolean } | null> {
  if (!bnConfigurado()) return null;
  // TODO (con la doc del BN): verificar la firma con BN_WEBHOOK_SECRET y leer
  // el estado/approval de la transacción.
  return null;
}
