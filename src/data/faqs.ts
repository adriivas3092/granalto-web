import type { FAQ } from "@/types";

/**
 * Preguntas frecuentes.
 * PENDIENTE_VALIDAR: revisar respuestas con Granalto antes de producción.
 */
export const faqs: FAQ[] = [
  {
    id: "faq-servicios",
    question: "¿Qué servicios ofrece Granalto?",
    answer:
      "Granalto se especializa en la importación, comercialización y transformación de superficies premium: piedra natural, cuarzo, porcelánico, superficies sólidas y laminados. Acompañamos cada proyecto desde la selección del material hasta la fabricación e instalación.",
    category: "Servicios",
  },
  {
    id: "faq-cotizacion",
    question: "¿Cómo solicito una cotización?",
    answer:
      "Puede completar el formulario de contacto, escribirnos por WhatsApp al +506 6090-3269 o visitar cualquiera de nuestros showrooms. Con las medidas aproximadas y el tipo de material que le interesa, nuestro equipo prepara una propuesta a la medida.",
    category: "Servicios",
  },
  {
    id: "faq-showroom",
    question: "¿Dónde puedo ver los materiales en persona?",
    answer:
      "Contamos con showrooms en Lagunilla de Heredia, Guachipelín de Escazú y Liberia, Guanacaste. Recomendamos visitar el showroom para apreciar las láminas reales, ya que en piedra natural cada pieza es única.",
    category: "Showrooms",
  },
  {
    id: "faq-material",
    question: "¿Qué material es mejor para mi cocina?",
    answer:
      "Depende del uso, el estilo y el presupuesto. La cuarcita y el granito ofrecen máxima durabilidad natural; el cuarzo es práctico y uniforme; el porcelánico destaca en resistencia y formatos grandes. Nuestro equipo le asesora sin costo para elegir la mejor opción.",
    category: "Materiales",
  },
  {
    id: "faq-instalacion",
    question: "¿Granalto instala los materiales?",
    answer:
      "Sí. Contamos con equipo propio para la plantilla, el corte de precisión y la instalación profesional de las superficies que comercializamos.",
    category: "Servicios",
  },
  {
    id: "faq-mantenimiento",
    question: "¿Cómo se mantiene la piedra natural?",
    answer:
      "Con limpieza de productos neutros y sellado periódico según el material y el uso. Comercializamos la línea Tenax de productos especializados para el cuidado de la piedra y le indicamos el plan adecuado para su superficie.",
    category: "Mantenimiento",
  },
];

export function getFaqs(): FAQ[] {
  return faqs;
}
