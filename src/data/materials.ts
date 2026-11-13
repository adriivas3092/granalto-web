import type { Material } from "@/types";

/**
 * Materiales que Granalto trabaja o comercializa.
 * Las especificaciones se describen de forma general y verificable;
 * los datos técnicos específicos por producto quedan pendientes de
 * validación (ver CONTENT_TODO.md). Imágenes: placeholders locales.
 */

const placeholder = (name: string, file: string) => ({
  src: `/images/placeholders/${file}.svg`,
  alt: `${name} — imagen pendiente de reemplazo`,
});

/**
 * Foto real de material (slab/textura), guardada en public/images/materiales.
 * El sufijo -v2 es a propósito: al reemplazar una foto hay que cambiar el nombre
 * del archivo, porque el optimizador de imágenes guarda en caché por nombre y
 * seguiría sirviendo la versión anterior (pixelada).
 */
const real = (name: string, slug: string, alt?: string) => ({
  src: `/images/materiales/${slug}-v2.jpg`,
  alt: alt ?? `${name} — textura real del material`,
});

export const materials: Material[] = [
  {
    id: "mat-cuarcita",
    slug: "cuarcita",
    name: "Cuarcita",
    category: "natural",
    shortDescription:
      "Piedra natural de gran dureza con vetas dramáticas, ideal para cocinas exigentes.",
    description:
      "La cuarcita es una piedra natural metamórfica reconocida por combinar la estética del mármol con una dureza superior. Sus vetas y tonalidades, únicas en cada lámina, la convierten en una de las superficies más solicitadas para sobres de cocina, islas y piezas protagonistas.",
    features: [
      "Alta dureza y resistencia al rayado",
      "Vetas y tonalidades únicas en cada lámina",
      "Buena resistencia al calor",
      "Apariencia similar al mármol con mayor desempeño",
    ],
    applications: [
      "Sobres de cocina e islas",
      "Sobres de baño",
      "Barras y mesas",
      "Revestimientos de pared",
    ],
    considerations: [
      "Al ser piedra natural, requiere sellado periódico según el uso",
      "Cada lámina es única: se recomienda seleccionar el material en showroom",
    ],
    finishes: ["Pulido", "Honed (mate)", "Leather"],
    colors: ["Blancos", "Grises", "Tonos tierra", "Verdes", "Azules"],
    brands: [],
    coverImage: real("Cuarcita", "cuarcita"),
    gallery: [real("Cuarcita — detalle de veta", "cuarcita", "Cuarcita blanca con vetas doradas — detalle")],
    catalogIds: [],
    featured: true,
    seo: {
      title: "Cuarcita en Costa Rica | Sobres y superficies",
      description:
        "Cuarcita natural para sobres de cocina, islas y proyectos arquitectónicos. Selección de láminas, corte e instalación en Costa Rica.",
    },
  },
  {
    id: "mat-granito",
    slug: "granito",
    name: "Granito",
    category: "natural",
    shortDescription:
      "Piedra natural durable y de fácil mantenimiento, un clásico para cocinas.",
    description:
      "El granito es una roca ígnea valorada durante décadas por su durabilidad, belleza natural y facilidad de mantenimiento. Es una opción confiable para sobres de cocina de uso intenso, tanto en proyectos residenciales como comerciales.",
    features: [
      "Excelente durabilidad para uso diario",
      "Resistencia al calor y al rayado",
      "Amplia variedad de colores y granulometrías",
      "Mantenimiento sencillo",
    ],
    applications: [
      "Sobres de cocina",
      "Áreas de trabajo exigentes",
      "Barras y mesas",
      "Exteriores y áreas de asado",
    ],
    considerations: [
      "Requiere sellado periódico según el tipo de granito y el uso",
      "La tonalidad puede variar entre lotes",
    ],
    finishes: ["Pulido", "Flameado", "Leather"],
    colors: ["Negros", "Grises", "Blancos", "Tonos tierra"],
    brands: [],
    coverImage: real("Granito", "granito"),
    gallery: [real("Granito — detalle de superficie", "granito", "Granito blanco y gris jaspeado — detalle")],
    catalogIds: [],
    featured: true,
    seo: {
      title: "Granito en Costa Rica | Sobres de cocina",
      description:
        "Granito natural para sobres de cocina, barras y exteriores. Importación, corte e instalación con acabados a la medida en Costa Rica.",
    },
  },
  {
    id: "mat-marmol",
    slug: "marmol",
    name: "Mármol",
    category: "natural",
    shortDescription:
      "Elegancia atemporal en piedra natural para baños, paredes y piezas escultóricas.",
    description:
      "El mármol es sinónimo de elegancia atemporal. Sus vetas suaves y su luminosidad lo hacen ideal para baños, revestimientos de pared, chimeneas y piezas donde la estética es protagonista.",
    features: [
      "Vetas y luminosidad características",
      "Sensación fría y noble al tacto",
      "Amplia tradición en arquitectura y diseño",
    ],
    applications: [
      "Sobres y muebles de baño",
      "Revestimientos de pared",
      "Chimeneas",
      "Mesas y piezas decorativas",
    ],
    considerations: [
      "Es más poroso y sensible a ácidos que otras piedras: se recomienda para zonas de uso moderado",
      "Requiere sellado y cuidados específicos",
    ],
    finishes: ["Pulido", "Honed (mate)"],
    colors: ["Blancos", "Grises", "Negros", "Tonos crema"],
    brands: [],
    coverImage: real("Mármol", "marmol"),
    gallery: [real("Mármol — detalle de veta", "marmol", "Mármol rosado con vetas — detalle")],
    catalogIds: [],
    featured: true,
    seo: {
      title: "Mármol en Costa Rica | Superficies y revestimientos",
      description:
        "Mármol natural para baños, revestimientos, chimeneas y piezas a la medida. Asesoría y fabricación en Costa Rica.",
    },
  },
  {
    id: "mat-cuarzo",
    slug: "cuarzo",
    name: "Cuarzo",
    category: "tecnico",
    shortDescription:
      "Superficie técnica no porosa, uniforme y de muy bajo mantenimiento.",
    description:
      "Las superficies de cuarzo combinan minerales naturales con resinas de alto desempeño, logrando un material no poroso, uniforme y de muy bajo mantenimiento. Es una de las opciones más prácticas para cocinas y baños de uso intenso.",
    features: [
      "Superficie no porosa: no requiere sellado",
      "Alta resistencia a manchas",
      "Color y patrón uniformes y predecibles",
      "Amplia gama de diseños, incluidos aspecto mármol",
    ],
    applications: [
      "Sobres de cocina",
      "Sobres de baño",
      "Mobiliario y comercios",
    ],
    considerations: [
      "Sensible al calor directo: usar siempre protección bajo ollas calientes",
      "No recomendado para exteriores con exposición solar directa",
    ],
    finishes: ["Pulido", "Mate"],
    colors: ["Blancos", "Grises", "Negros", "Aspecto mármol"],
    brands: ["Cambria"],
    coverImage: real("Cuarzo", "cuarzo"),
    gallery: [real("Cuarzo — detalle de superficie", "cuarzo", "Cuarzo gris de grano uniforme — detalle")],
    catalogIds: [],
    featured: true,
    seo: {
      title: "Cuarzo en Costa Rica | Superficies técnicas",
      description:
        "Superficies de cuarzo no porosas y de bajo mantenimiento para cocinas y baños. Marcas seleccionadas e instalación profesional en Costa Rica.",
    },
  },
  {
    id: "mat-porcelanico",
    slug: "porcelanico",
    name: "Porcelánico",
    category: "tecnico",
    shortDescription:
      "Gran formato, mínimo espesor y altísima resistencia para pisos, paredes y sobres.",
    description:
      "El porcelánico de gran formato es un material cerámico técnico de altísima resistencia, disponible en láminas de gran tamaño y espesores reducidos. Permite revestir pisos, paredes, fachadas y sobres con juntas mínimas y diseños que reproducen piedras naturales, cementos y metales.",
    features: [
      "Gran formato con juntas mínimas",
      "Resistencia a rayado, calor y rayos UV",
      "Superficie no porosa e higiénica",
      "Apto para interior y exterior",
    ],
    applications: [
      "Pisos y paredes",
      "Sobres de cocina y baño",
      "Fachadas y exteriores",
      "Revestimiento de mobiliario",
    ],
    considerations: [
      "Su instalación requiere mano de obra especializada en gran formato",
    ],
    finishes: ["Natural", "Pulido", "Texturizado"],
    colors: ["Aspecto piedra", "Aspecto cemento", "Aspecto madera", "Colores sólidos"],
    brands: ["ABK"],
    coverImage: real("Porcelánico", "porcelanico"),
    gallery: [real("Porcelánico — detalle de veta", "porcelanico", "Porcelánico negro con veta dorada — detalle")],
    catalogIds: [],
    featured: true,
    seo: {
      title: "Porcelánico de gran formato en Costa Rica",
      description:
        "Porcelánico de gran formato para pisos, paredes, fachadas y sobres. Alta resistencia y diseño para interior y exterior en Costa Rica.",
    },
  },
  {
    id: "mat-superficie-solida",
    slug: "superficie-solida",
    name: "Superficie sólida",
    category: "tecnico",
    shortDescription:
      "Material termoformable con uniones invisibles y lavamanos integrados.",
    description:
      "Las superficies sólidas (solid surface) son materiales compuestos que permiten uniones imperceptibles, curvas termoformadas y lavamanos integrados en una sola pieza. Son ideales para proyectos donde la continuidad y la higiene son prioritarias.",
    features: [
      "Uniones prácticamente invisibles",
      "Termoformable: permite curvas y piezas especiales",
      "Superficie no porosa e higiénica",
      "Reparable y renovable",
    ],
    applications: [
      "Sobres y lavamanos integrados",
      "Mobiliario clínico y comercial",
      "Recepciones y mostradores",
      "Piezas personalizadas",
    ],
    considerations: [
      "Menor resistencia al calor y al rayado que la piedra: usar tablas y protectores",
    ],
    finishes: ["Mate", "Semibrillo"],
    colors: ["Blancos", "Colores sólidos", "Aspecto piedra"],
    brands: ["Wilsonart"],
    coverImage: real("Superficie sólida", "superficie-solida"),
    gallery: [real("Superficie sólida — detalle", "superficie-solida", "Superficie sólida de color liso — detalle")],
    catalogIds: [],
    featured: false,
    seo: {
      title: "Superficie sólida en Costa Rica | Solid Surface",
      description:
        "Superficies sólidas termoformables con uniones invisibles y lavamanos integrados, para proyectos residenciales, comerciales y clínicos en Costa Rica.",
    },
  },
  {
    id: "mat-hpl",
    slug: "hpl",
    name: "HPL",
    category: "decorativo",
    shortDescription:
      "Laminado de alta presión: versátil, liviano y eficiente para mobiliario.",
    description:
      "El laminado de alta presión (HPL) es un material versátil y eficiente para revestir mobiliario, puertas, paneles y superficies verticales. Ofrece una enorme variedad de diseños, texturas y acabados con un excelente balance entre desempeño y costo.",
    features: [
      "Gran variedad de diseños y texturas",
      "Liviano y fácil de trabajar",
      "Superficie resistente al desgaste diario",
      "Excelente relación costo-desempeño",
    ],
    applications: [
      "Mobiliario de cocina y closets",
      "Paneles y puertas",
      "Mobiliario comercial y de oficina",
      "Superficies verticales",
    ],
    considerations: [
      "No se recomienda para superficies con exposición directa a calor intenso o humedad permanente sin el soporte adecuado",
    ],
    finishes: ["Mate", "Texturizado", "Alto brillo"],
    colors: ["Aspecto madera", "Colores sólidos", "Aspecto piedra", "Metálicos"],
    brands: ["Wilsonart"],
    coverImage: real("HPL", "hpl"),
    gallery: [real("HPL — detalle de textura", "hpl", "HPL con aspecto de madera nogal — detalle")],
    catalogIds: [],
    featured: false,
    seo: {
      title: "HPL en Costa Rica | Laminado de alta presión",
      description:
        "Láminas HPL para mobiliario, paneles y superficies verticales. Variedad de diseños y texturas con distribución en Costa Rica.",
    },
  },
  {
    id: "mat-travertino",
    slug: "travertino",
    name: "Travertino",
    category: "natural",
    shortDescription:
      "Piedra sedimentaria cálida y textural para pisos, paredes y exteriores.",
    description:
      "El travertino es una piedra sedimentaria de tonos cálidos y textura característica, utilizada desde la antigüedad en arquitectura. Es muy apreciada para pisos, revestimientos de pared, baños y áreas exteriores donde se busca calidez natural.",
    features: [
      "Tonos cálidos, naturales y atemporales",
      "Textura porosa característica",
      "Buen comportamiento térmico en exteriores",
    ],
    applications: [
      "Pisos interiores y exteriores",
      "Revestimientos de pared",
      "Sobres de baño",
      "Áreas de piscina",
    ],
    considerations: [
      "Su porosidad natural requiere sellado y limpieza con productos neutros",
      "Puede presentarse con poro abierto o resinado",
    ],
    finishes: ["Honed (mate)", "Cepillado", "Poro abierto", "Resinado"],
    colors: ["Beige", "Crema", "Nuez", "Plata"],
    brands: [],
    coverImage: real("Travertino", "travertino"),
    gallery: [real("Travertino — detalle de veta", "travertino", "Travertino beige con vetas horizontales — detalle")],
    catalogIds: [],
    featured: false,
    seo: {
      title: "Travertino en Costa Rica | Pisos y revestimientos",
      description:
        "Travertino natural para pisos, paredes, baños y exteriores. Calidez y textura atemporal para proyectos en Costa Rica.",
    },
  },
  {
    id: "mat-cambria",
    slug: "cambria",
    name: "Cambria",
    category: "tecnico",
    shortDescription:
      "Cuarzo natural de alta gama, no poroso y de diseños exclusivos.",
    description:
      "Cambria es una superficie de cuarzo natural de alta gama, fabricada con estándares exigentes. Al ser no porosa, resiste manchas y no requiere sellado, y ofrece una amplia gama de diseños exclusivos —incluidos aspectos que evocan mármoles y piedras naturales— con gran uniformidad y desempeño para cocinas y baños.",
    features: [
      "Cuarzo natural no poroso: no requiere sellado",
      "Alta resistencia a manchas y al uso diario",
      "Diseños exclusivos, muchos de aspecto mármol",
      "Color y patrón uniformes y predecibles",
    ],
    applications: [
      "Sobres de cocina e islas",
      "Sobres de baño",
      "Mobiliario y comercios",
      "Revestimientos interiores",
    ],
    considerations: [
      "Sensible al calor directo: usar protección bajo ollas calientes",
      "No recomendado para exteriores con exposición solar directa",
    ],
    finishes: ["Pulido", "Mate"],
    colors: ["Blancos", "Grises", "Negros", "Aspecto mármol"],
    brands: ["Cambria"],
    coverImage: real("Cambria", "cambria"),
    gallery: [real("Cambria — detalle de veta", "cambria", "Cuarzo Cambria blanco con vetas — detalle")],
    catalogIds: [],
    featured: true,
    seo: {
      title: "Cambria en Costa Rica | Cuarzo de alta gama",
      description:
        "Superficies de cuarzo Cambria: no porosas, de bajo mantenimiento y diseños exclusivos para cocinas y baños en Costa Rica.",
    },
  },
];

/** Orden de presentación de los materiales (catálogo de Granalto). */
const materialOrder = [
  "cuarzo",
  "cuarcita",
  "marmol",
  "granito",
  "cambria",
  "superficie-solida",
  "porcelanico",
  "travertino",
  "hpl",
];

function orderMaterials(list: Material[]): Material[] {
  return [...list].sort(
    (a, b) => materialOrder.indexOf(a.slug) - materialOrder.indexOf(b.slug),
  );
}

export function getMaterials(): Material[] {
  return orderMaterials(materials);
}

export function getMaterialBySlug(slug: string): Material | undefined {
  return materials.find((m) => m.slug === slug);
}

export function getFeaturedMaterials(): Material[] {
  return orderMaterials(materials.filter((m) => m.featured));
}

/** Nota legal/técnica configurable que se muestra en páginas de material. */
export const materialVariabilityNote =
  "La apariencia, tonalidad y veta de los materiales puede variar según el lote y, en el caso de las piedras naturales, cada pieza es única.";
