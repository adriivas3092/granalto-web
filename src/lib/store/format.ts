/** Formatea un precio en la moneda indicada. Seguro para cliente y servidor. */
export function formatPrice(amount: number, currency = "CRC"): string {
  // CRC sin decimales; otras monedas (p. ej. USD) con 2 decimales.
  const decimales = currency === "CRC" ? 0 : 2;
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency,
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(amount);
}
