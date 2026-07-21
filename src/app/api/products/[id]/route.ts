import { NextResponse } from "next/server";
import { getProductById } from "@/lib/api/product-service";

/** GET /api/products/:id */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return NextResponse.json({ success: false, message: "Producto no encontrado." }, { status: 404 });
  return NextResponse.json({ success: true, product });
}
