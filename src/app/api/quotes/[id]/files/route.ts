import { NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/api/rate-limit";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

/**
 * POST /api/quotes/:id/files — adjuntar plano o fotografía a una cotización.
 * Valida tipo MIME y tamaño. 🔌 PENDIENTE_GRANALTO: subir a almacenamiento
 * (Supabase Storage / S3) y asociar al registro de la cotización.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!rateLimit(`files:${clientIp(req)}`, 12)) {
    return NextResponse.json({ success: false, message: "Demasiadas solicitudes." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ success: false, message: "Solicitud inválida." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, message: "No se recibió ningún archivo." }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ success: false, message: "Formato no permitido (JPG, PNG, WebP o PDF)." }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ success: false, message: "El archivo supera 8 MB." }, { status: 413 });
  }

  // 🔌 PENDIENTE_GRANALTO: almacenar el archivo y vincularlo a la cotización `id`.
  return NextResponse.json({ success: true, quoteId: id, fileName: file.name, size: file.size });
}
