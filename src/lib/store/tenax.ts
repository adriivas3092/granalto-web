/**
 * Subcategorías Tenax (lista fija). Son un segundo nivel de clasificación,
 * independiente de la categoría general del producto (`category_id`): sólo se
 * usan para los productos de la línea Tenax. El valor guardado es el `value`
 * (estable); en pantalla se muestra el `label`.
 */
export const TENAX_CATEGORIAS = [
  { value: "adhesivos", label: "Adhesivos" },
  { value: "complementos", label: "Complementos" },
  { value: "selladores", label: "Selladores" },
  { value: "tratamientos", label: "Tratamientos" },
  { value: "limpieza-profesional", label: "Limpieza profesional" },
] as const;

export type TenaxCategoria = (typeof TENAX_CATEGORIAS)[number]["value"];

/** Devuelve la etiqueta visible de una subcategoría Tenax, o null si no aplica. */
export function tenaxLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  return TENAX_CATEGORIAS.find((c) => c.value === value)?.label ?? null;
}
