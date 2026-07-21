import type { SurfaceProduct } from "@/types/quote";
import { mockProducts } from "@/data/mock-products";

/**
 * Acceso al catálogo. Hoy devuelve datos mock.
 * 🔌 PENDIENTE_GRANALTO: reemplazar por el catálogo real (CMS / base de datos /
 * ERP). Mantené la misma firma para no tocar el resto del código.
 */
export async function getProducts(): Promise<SurfaceProduct[]> {
  return mockProducts.filter((p) => p.isActive);
}

export async function getProductById(id: string): Promise<SurfaceProduct | null> {
  return mockProducts.find((p) => p.id === id) ?? null;
}

export async function getProductsByIds(ids: string[]): Promise<SurfaceProduct[]> {
  const set = new Set(ids);
  return mockProducts.filter((p) => set.has(p.id));
}
