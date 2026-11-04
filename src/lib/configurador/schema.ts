import { z } from "zod";

/** Esquema de una medida (largo y profundidad en mm). */
const medidaSchema = z.object({
  largo: z.coerce.number().nonnegative(),
  prof: z.coerce.number().nonnegative(),
});

/**
 * Esquema de una solicitud del cotizador de sobres. Compartido entre el
 * endpoint público (/api/configurador) y la acción de pago (crearPedidoSobre).
 */
export const configuradorSchema = z.object({
  geometriaId: z.string().min(1),
  materialId: z.string().nullable().optional(),
  colorId: z.string().nullable().optional(),
  medidas: z.record(z.string(), medidaSchema).optional(),
  acabado: z.enum(["brillo", "mate"]).nullable().optional(),
  moldura: z.boolean().nullable().optional(),
  molduraGrosorCm: z.coerce.number().nonnegative().nullable().optional(),
  molduraPerfil: z.coerce.number().int().min(1).max(12).nullable().optional(),
  salpicaderoTipo: z.enum(["no", "10", "custom"]).optional(),
  salpicaderoAlturaCm: z.coerce.number().nonnegative().optional(),
  lUnion: z.enum(["izquierda", "derecha"]).nullable().optional(),
  notas: z.string().max(600).optional(),
  unidad: z.enum(["mm", "cm", "m"]).optional(),
  derivar: z.boolean().optional(),
  personalizado: z.boolean().optional(),
  area: z.coerce.number().nonnegative().optional(),
  cliente: z.object({
    nombre: z.string().min(2),
    telefono: z.string().min(6),
    correo: z.string().email(),
    provincia: z.string().min(2),
    canton: z.string().min(2),
    direccion: z.string().optional().default(""),
    retiro: z.boolean().optional().default(false),
    acepta: z.literal(true, { message: "Debe aceptar los términos." }),
  }),
});

export type ConfiguradorInput = z.infer<typeof configuradorSchema>;

/** Genera un folio legible: GRA-YYYYMMDD-XXXX. */
export function generarFolio(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GRA-${ymd}-${rand}`;
}
