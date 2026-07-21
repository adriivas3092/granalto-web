import { NextResponse } from "next/server";
import { quoteConfig } from "@/data/quote-config";

/** GET /api/quote-config — tarifas y catálogos de opciones (configurable). */
export function GET() {
  return NextResponse.json({ success: true, config: quoteConfig });
}
