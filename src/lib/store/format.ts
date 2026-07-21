/** Formatea un precio en la moneda indicada. Seguro para cliente y servidor. */
export function formatPrice(amount: number, currency = "CRC"): string {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
