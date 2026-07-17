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
    coverImage: placeholder("Cuarcita", "material-cuarcita"),
    gallery: [placeholder("Ambiente con cuarcita", "material-cuarcita-1")],
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
    coverImage: placeholder("Granito", "material-granito"),
    gallery: [placeholder("Ambiente con granito", "material-granito-1")],
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
    coverImage: placeholder("Mármol", "material-marmol"),
    gallery: [placeholder("Ambiente con mármol", "material-marmol-1")],
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
    coverImage: placeholder("Cuarzo", "material-cuarzo"),
    gallery: [placeholder("Ambiente con cuarzo", "material-cuarzo-1")],
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
    coverImage: placeholder("Porcelánico", "material-porcelanico"),
    gallery: [placeholder("Ambiente con porcelánico", "material-porcelanico-1")],
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
    coverImage: placeholder("Superficie sólida", "material-superficie-solida"),
    gallery: [placeholder("Ambiente con superficie sólida", "material-superficie-solida-1")],
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
    category: "tecnico",
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
    coverImage: placeholder("HPL", "material-hpl"),
    gallery: [placeholder("Ambiente con HPL", "material-hpl-1")],
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
    coverImage: placeholder("Travertino", "material-travertino"),
    gallery: [placeholder("Ambiente con travertino", "material-travertino-1")],
    catalogIds: [],
    featured: false,
    seo: {
      title: "Travertino en Costa Rica | Pisos y revestimientos",
      description:
        "Travertino natural para pisos, paredes, baños y exteriores. Calidez y textura atemporal para proyectos en Costa Rica.",
    },
  },
  {
    id: "mat-onix",
    slug: "onix",
    name: "Ónix",
    category: "natural",
    shortDescription:
      "Piedra translúcida de lujo que cobra vida con iluminación integrada.",
    description:
      "El ónix es una piedra natural de lujo, translúcida, que al integrarse con técnicas de iluminación revela la profundidad de sus tonalidades. Es el material por excelencia para barras retroiluminadas, muros protagonistas y piezas escultóricas.",
    features: [
      "Translucidez natural: permite retroiluminación",
      "Tonalidades y vetas dramáticas",
      "Cada pieza es única",
    ],
    applications: [
      "Barras y muros retroiluminados",
      "Recepciones y piezas protagonistas",
      "Detalles decorativos de lujo",
    ],
    considerations: [
      "Es una piedra delicada: se recomienda para superficies de uso decorativo o moderado",
      "Requiere diseño de iluminación y soporte especializados",
    ],
    finishes: ["Pulido"],
    colors: ["Blancos", "Miel", "Verdes", "Multicolor"],
    brands: [],
    coverImage: placeholder("Ónix", "material-onix"),
    gallery: [placeholder("Ambiente con ónix retroiluminado", "material-onix-1")],
    catalogIds: [],
    featured: false,
    seo: {
      title: "Ónix en Costa Rica | Piedra translúcida de lujo",
      description:
        "Ónix natural translúcido para barras retroiluminadas, muros y piezas de lujo. Selección e instalación especializada en Costa Rica.",
    },
  },
  {
    id: "mat-terrazzo",
    slug: "terrazzo",
    name: "Terrazzo",
    category: "decorativo",
    shortDescription:
      "Composición de mármol y agregados con carácter gráfico y contemporáneo.",
    description:
      "El terrazzo combina fragmentos de mármol y otros agregados en una matriz de cemento o resina, creando superficies de carácter gráfico que hoy viven un renacimiento en el diseño contemporáneo. Funciona en pisos, sobres y revestimientos con personalidad.",
    features: [
      "Estética gráfica y contemporánea",
      "Gran variedad de combinaciones de color y agregado",
      "Superficie continua en pisos",
    ],
    applications: [
      "Pisos",
      "Sobres y mesas",
      "Revestimientos y detalles decorativos",
    ],
    considerations: [
      "El desempeño depende de la matriz (cementicia o resina): consultar según aplicación",
    ],
    finishes: ["Pulido", "Honed (mate)"],
    colors: ["Claros", "Grises", "Combinaciones a la medida"],
    brands: ["Santa Margherita"],
    coverImage: placeholder("Terrazzo", "material-terrazzo"),
    gallery: [placeholder("Ambiente con terrazzo", "material-terrazzo-1")],
    catalogIds: [],
    featured: false,
    seo: {
      title: "Terrazzo en Costa Rica | Superficies decorativas",
      description:
        "Terrazzo para pisos, sobres y revestimientos con carácter gráfico y contemporáneo. Asesoría y fabricación en Costa Rica.",
    },
  },
];

export function getMaterials(): Material[] {
  return materials;
}

export function getMaterialBySlug(slug: string): Material | undefined {
  return materials.find((m) => m.slug === slug);
}

export function getFeaturedMaterials(): Material[] {
  return materials.filter((m) => m.featured);
}

/** Nota legal/técnica configurable que se muestra en páginas de material. */
export const materialVariabilityNote =
  "La apariencia, tonalidad y veta de los materiales puede variar según el lote y, en el caso de las piedras naturales, cada pieza es única.";
