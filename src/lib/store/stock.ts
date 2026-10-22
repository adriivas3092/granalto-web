/**
 * Reglas de stock de la tienda.
 *
 * - Bloqueo automático: cuando a un producto le queda 1 unidad o menos, se
 *   marca como NO disponible (se oculta de la tienda) para no vender de más.
 * - Alerta de poco stock: cuando quedan pocas unidades, el admin lo ve resaltado.
 */

/** A este nivel (o menos) el producto se bloquea automáticamente. */
export const STOCK_BLOQUEO = 1;

/** A este nivel (o menos) se muestra alerta de poco stock en el admin. */
export const STOCK_ALERTA = 3;

/** true si el producto debe bloquearse (no disponible) por quedarse sin stock. */
export function debeBloquearPorStock(stock: number): boolean {
  return (stock ?? 0) <= STOCK_BLOQUEO;
}

/** true si el stock está bajo (para la alerta del admin). */
export function stockBajo(stock: number): boolean {
  return (stock ?? 0) <= STOCK_ALERTA;
}
