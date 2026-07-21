import { NextResponse } from "next/server";
import { getProducts } from "@/lib/api/product-service";

/** GET /api/products — catálogo de materiales del cotizador. */
export async function GET() {
  const products = await getProducts();
  return NextResponse.json({ success: true, products });
}
