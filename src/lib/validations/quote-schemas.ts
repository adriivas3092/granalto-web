import { z } from "zod";

/** Mensajes en español; se reutilizan en el cliente y en el servidor. */

export const pieceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Ingresá un nombre para la pieza."),
  shape: z.enum(["recto", "l", "u", "isla", "barra", "splashback", "personalizado"]),
  length: z.coerce.number().positive("El largo debe ser mayor a 0."),
  width: z.coerce.number().positive("El ancho debe ser mayor a 0."),
  quantity: z.coerce.number().int().positive("La cantidad debe ser al menos 1."),
  unit: z.enum(["mm", "cm", "m"]),
  thickness: z.coerce.number().positive("Seleccioná un grosor."),
  notes: z.string().max(300).optional(),
});

export const projectSchema = z.object({
  kind: z.enum(["cocina", "bano", "isla", "barra", "mueble", "comercial", "otro"]),
  stage: z.enum(["nuevo", "remodelacion", "sustitucion"]),
  name: z.string().max(120).optional(),
  province: z.string().optional(),
  estimatedDate: z.string().optional(),
});

export const additionalElementSchema = z.object({
  id: z.string(),
  typeId: z.string().min(1),
  length: z.coerce.number().positive(),
  height: z.coerce.number().positive(),
  quantity: z.coerce.number().int().positive(),
  finish: z.string().optional(),
});

export const configurationSchema = z.object({
  selectedThickness: z.coerce.number().positive(),
  finish: z.string().optional(),
  edges: z.array(z.object({ edgeId: z.string(), linearMeters: z.coerce.number().min(0) })),
  cutouts: z.array(z.object({ cutoutId: z.string(), quantity: z.coerce.number().int().min(1), notes: z.string().optional() })),
  additionalElements: z.array(additionalElementSchema),
  services: z.array(z.object({ serviceId: z.string() })),
  location: z
    .object({
      province: z.string(),
      canton: z.string().optional(),
      district: z.string().optional(),
      postalCode: z.string().optional(),
      zone: z.string().optional(),
    })
    .optional(),
  wastePercentage: z.coerce.number().min(0).max(60).optional(),
});

export const customerSchema = z.object({
  firstName: z.string().min(2, "Ingresá tu nombre."),
  lastName: z.string().min(2, "Ingresá tus apellidos."),
  email: z.string().email("Correo no válido."),
  phone: z.string().min(8, "Teléfono no válido."),
  preferredContact: z.enum(["whatsapp", "llamada", "correo"]),
  province: z.string().optional(),
  canton: z.string().optional(),
  district: z.string().optional(),
  address: z.string().max(300).optional(),
  estimatedDate: z.string().optional(),
  budget: z.string().optional(),
  comments: z.string().max(1000).optional(),
});

export const consentSchema = z.object({
  privacyAccepted: z.literal(true, { message: "Debés aceptar la política de privacidad." }),
  contactConsent: z.literal(true, { message: "Debés autorizar el contacto." }),
});

/** Producto mínimo aceptado por el servidor (el precio se revalida en el backend). */
export const submissionProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: z.string(),
  collection: z.string().optional(),
  brand: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string(),
  gallery: z.array(z.string()).optional(),
  pricePerSquareMeter: z.coerce.number(),
  availableThicknesses: z.array(z.number()),
  finishes: z.array(z.string()),
  colors: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean(),
});

export const calculateRequestSchema = z.object({
  productIds: z.array(z.string()).min(1, "Seleccioná al menos un material.").max(4, "Máximo cuatro materiales."),
  pieces: z.array(pieceSchema).min(1, "Agregá al menos una pieza."),
  configuration: configurationSchema,
});

export const submissionSchema = z.object({
  source: z.literal("granalto-online-quote"),
  project: projectSchema.nullable(),
  productIds: z.array(z.string()).min(1).max(4),
  pieces: z.array(pieceSchema).min(1),
  configuration: configurationSchema,
  selectedOptionId: z.string().optional(),
  customer: customerSchema,
  consent: consentSchema,
});

export type CalculateRequest = z.infer<typeof calculateRequestSchema>;
export type SubmissionRequest = z.infer<typeof submissionSchema>;
export type CustomerForm = z.infer<typeof customerSchema>;
export type PieceForm = z.infer<typeof pieceSchema>;
