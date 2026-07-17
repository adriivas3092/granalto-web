import type { BlogPost } from "@/types";

/**
 * Artículos del blog.
 * CONTENIDO DE DEMOSTRACIÓN: estos artículos son provisionales y están
 * basados en temas reales del blog actual de granaltocr.net; requieren
 * revisión editorial de Granalto antes de producción (ver CONTENT_TODO.md).
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
    id: "post-granito-cocina",
    slug: "granito-elegancia-natural-para-tu-cocina",
    title: "Granito: elegancia natural y resistencia para su cocina",
    excerpt:
      "Por qué el granito sigue siendo una de las opciones más confiables para sobres de cocina: durabilidad, belleza natural y mantenimiento sencillo.",
    content: `El granito ha sido valorado durante décadas como material para sobres de cocina, y cada vez más hogares en Costa Rica lo eligen por su durabilidad, su belleza natural y su facilidad de mantenimiento.

## Un material que trabaja tanto como usted

El granito es una roca ígnea de gran dureza. Resiste el uso diario de una cocina activa: cortes accidentales, ollas calientes y limpieza constante. A diferencia de otros materiales, envejece con dignidad.

## Cada lámina es única

Al ser piedra natural, no existen dos láminas de granito iguales. Recomendamos visitar nuestro showroom para seleccionar personalmente la lámina de su proyecto y apreciar su tonalidad y granulometría reales.

## Mantenimiento sencillo

Con un sellado periódico y limpieza con productos neutros, un sobre de granito conserva su apariencia por décadas. Nuestro equipo le indica el plan de cuidado adecuado según el granito elegido.

## Asesoría de principio a fin

En Granalto acompañamos cada proyecto desde la selección de la lámina hasta la plantilla, el corte de precisión y la instalación final.`,
    category: "Materiales",
    author: "Equipo Granalto",
    publishedAt: "2026-05-12",
    readingTime: 4,
    coverImage: {
      src: "/images/placeholders/blog-granito.svg",
      alt: "Sobre de cocina en granito — imagen pendiente de reemplazo",
    },
    featured: true,
    seo: {
      title: "Granito: elegancia natural y resistencia para su cocina",
      description:
        "Ventajas del granito para sobres de cocina: durabilidad, belleza natural y mantenimiento sencillo. Guía de Granalto Costa Rica.",
    },
  },
  {
    id: "post-piedra-sinterizada",
    slug: "piedra-sinterizada-diseno-de-alta-gama",
    title: "Piedra sinterizada: diseño de alta gama y resistencia extrema",
    excerpt:
      "Qué es la piedra sinterizada, cómo se fabrica y por qué se ha convertido en una de las superficies técnicas más avanzadas para cocinas.",
    content: `La piedra sinterizada es un material ultracompacto fabricado mediante un proceso tecnológico que somete minerales naturales a presiones y temperaturas extremadamente altas, replicando en horas lo que la naturaleza tarda milenios en formar.

## Resistencia extrema

El resultado es una superficie prácticamente no porosa, resistente al rayado, al calor directo, a los rayos UV y a las manchas. Es apta tanto para interiores como para exteriores.

## Diseño sin límites

La tecnología de impresión permite reproducir mármoles, piedras y cementos con gran fidelidad, en formatos grandes y espesores variados, incluyendo aplicaciones como encimeras con zonas de cocción integradas.

## ¿Para quién es ideal?

Para quienes buscan la estética de la piedra natural con el máximo desempeño técnico: cocinas de uso intensivo, exteriores, fachadas y proyectos comerciales.

Consulte con nuestro equipo la disponibilidad de formatos y acabados para su proyecto.`,
    category: "Materiales",
    author: "Equipo Granalto",
    publishedAt: "2026-04-20",
    readingTime: 5,
    coverImage: {
      src: "/images/placeholders/blog-sinterizada.svg",
      alt: "Cocina con superficie de piedra sinterizada — imagen pendiente de reemplazo",
    },
    featured: false,
    seo: {
      title: "Piedra sinterizada: diseño de alta gama y resistencia extrema",
      description:
        "Qué es la piedra sinterizada, sus ventajas y aplicaciones en cocinas y exteriores. Guía de Granalto Costa Rica.",
    },
  },
  {
    id: "post-cuidado-piedra-natural",
    slug: "como-cuidar-superficies-de-piedra-natural",
    title: "Cómo cuidar sus superficies de piedra natural",
    excerpt:
      "Recomendaciones prácticas de limpieza, sellado y uso diario para que sus sobres y revestimientos de piedra natural luzcan como el primer día.",
    content: `La piedra natural es una inversión que puede durar generaciones. Estos cuidados básicos ayudan a conservar su belleza.

## Limpieza diaria

Utilice agua, jabón neutro y un paño suave. Evite limpiadores ácidos (vinagre, limón, desincrustantes) y abrasivos, especialmente en mármol y travertino.

## Sellado periódico

Las piedras naturales son porosas en distintos grados. Un sellador de calidad, aplicado con la frecuencia adecuada al material y al uso, protege contra manchas y humedad. Productos especializados como los de la línea Tenax están diseñados para este fin.

## Uso diario inteligente

Aunque muchas piedras resisten el calor, recomendamos usar salvamanteles y tablas de cortar. Limpie los derrames de vino, café o cítricos cuanto antes.

## ¿Dudas sobre su material?

Cada piedra tiene necesidades distintas. Escríbanos y le indicamos el plan de cuidado específico para su superficie.`,
    category: "Mantenimiento",
    author: "Equipo Granalto",
    publishedAt: "2026-03-15",
    readingTime: 4,
    coverImage: {
      src: "/images/placeholders/blog-mantenimiento.svg",
      alt: "Limpieza de una superficie de piedra natural — imagen pendiente de reemplazo",
    },
    featured: false,
    seo: {
      title: "Cómo cuidar sus superficies de piedra natural",
      description:
        "Guía práctica de limpieza, sellado y uso diario de sobres y revestimientos de piedra natural. Recomendaciones de Granalto Costa Rica.",
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
