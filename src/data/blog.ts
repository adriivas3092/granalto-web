import type { BlogPost } from "@/types";

/**
 * Artículos del blog (contenido real de Granalto).
 */
export const blogCategories = [
  "Materiales",
  "Diseño",
  "Mantenimiento",
  "Tendencias",
  "Inspiración",
  "Guías",
  "Novedades",
] as const;

export const blogPosts: BlogPost[] = [
  {
    id: "post-sobres-de-cocina-granalto",
    slug: "la-solucion-de-granalto-en-sobres-de-cocina",
    title: "La solución de Granalto en sobres de cocina",
    excerpt:
      "Variedad de materiales para cada proyecto: fabricación e instalación de sobres de cocina en granito, mármol, cuarzo, cuarcita y porcelánico, con asesoría de principio a fin.",
    content: `## Variedad de materiales para cada proyecto

En Granalto, transformamos la piedra natural en piezas funcionales y elegantes que dan vida a los espacios más importantes de tu hogar o proyecto: la cocina.

Con más de 15 años de experiencia en el sector, nos especializamos en la fabricación e instalación de sobres de cocina en granito, mármol, cuarzo, cuarcita y porcelánicos, materiales seleccionados por su resistencia, estética y adaptabilidad al clima y estilo de vida costarricense.

Ya sea que estés construyendo la casa de tus sueños, remodelando tu apartamento o desarrollando un proyecto inmobiliario, en Granalto trabajamos uno a uno contigo para ofrecer soluciones a la medida. También colaboramos con estudios de arquitectura, constructoras y diseñadores que buscan calidad y cumplimiento en cada etapa del proyecto.

## ¿Qué nos diferencia?

- Asesoría personalizada desde el primer contacto
- Selección cuidadosa de materiales premium
- Corte y acabado de alta precisión
- Instalación profesional con atención al detalle

Convertí tu cocina en un espacio donde la funcionalidad y la belleza conviven todos los días. Con Granalto, cada sobre es una pieza única que refleja tu estilo.

Solicitá tu cotización o agenda una visita personalizada.`,
    category: "Materiales",
    author: "Equipo Granalto",
    publishedAt: "2026-08-05",
    readingTime: 4,
    coverImage: {
      src: "/images/blog/sobres-de-cocina-granalto.jpg",
      alt: "Bodega de Granalto con láminas de mármol, cuarcita, cuarzo y porcelánico en exhibición",
    },
    featured: false,
    seo: {
      title: "La solución de Granalto en sobres de cocina",
      description:
        "Fabricación e instalación de sobres de cocina en granito, mármol, cuarzo, cuarcita y porcelánico. Más de 15 años de experiencia, asesoría personalizada e instalación profesional en Costa Rica.",
    },
  },
  {
    id: "post-como-elegir-material-ideal",
    slug: "como-elegir-el-material-ideal",
    title: "¿Cómo elegir el material ideal?",
    excerpt:
      "Una guía práctica para encontrar el material perfecto según el uso del espacio, la estética, el mantenimiento y el presupuesto de tu proyecto.",
    content: `En Granalto, sabemos que la decisión no es sencilla, por eso te compartimos una guía práctica para que encuentres el material perfecto según tus necesidades y estilo.

## 1. Define el uso del espacio

El primer paso es considerar el propósito de la superficie:

- **Cocinas:** prioriza materiales resistentes a las manchas y al calor, como la piedra sinterizada.
- **Exteriores:** asegúrate de elegir un material duradero frente a las inclemencias climáticas, como la piedra natural.

## 2. Evalúa la estética

El diseño de tu espacio define mucho del impacto visual.

- **Tendencias modernas:** materiales como el Calacatta Gold o el Ivory imitan acabados naturales con un toque de sofisticación.
- **Estilos únicos:** mármoles como Gucci Red o Green Jade son perfectos para crear un ambiente exclusivo.

## 3. Mantenimiento

La facilidad de limpieza y el cuidado son factores clave.

- Para un bajo mantenimiento, las piedras sinterizadas o porcelánicos son ideales.
- Si prefieres algo más natural, los selladores pueden proteger el granito o el mármol.

## 4. Presupuesto

Define cuánto estás dispuesto a invertir. Materiales como el granito o el cuarzo ofrecen una excelente relación calidad-precio, mientras que opciones más exclusivas como la cuarcita tienen un costo mayor, pero añaden lujo y valor a tu espacio.

## ¿Por qué elegir Granalto?

En Granalto contamos con una amplia variedad de materiales como cuarzos, granitos, cuarcitas, mármoles y piedras sinterizadas. Te ayudamos a elegir el material ideal para que cada proyecto sea una obra de arte funcional.

¿Listo para transformar tu espacio? Contáctanos y hagamos realidad tu visión.`,
    category: "Guías",
    author: "Equipo Granalto",
    publishedAt: "2026-08-05",
    readingTime: 4,
    coverImage: {
      src: "/images/blog/como-elegir-material-ideal.jpg",
      alt: "Lavamanos esculpido en mármol con vetas doradas y grifería en acabado dorado",
    },
    featured: true,
    seo: {
      title: "¿Cómo elegir el material ideal? | Guía de Granalto",
      description:
        "Guía práctica para elegir el material perfecto según el uso del espacio, la estética, el mantenimiento y el presupuesto. Cuarzos, granitos, cuarcitas, mármoles y piedras sinterizadas en Granalto Costa Rica.",
    },
  },
];

export function getBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRecentPosts(count = 3): BlogPost[] {
  return getBlogPosts().slice(0, count);
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const current = getBlogPostBySlug(slug);
  return getBlogPosts()
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      const aScore = a.category === current?.category ? 1 : 0;
      const bScore = b.category === current?.category ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, count);
}
