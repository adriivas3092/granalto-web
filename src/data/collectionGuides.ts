/**
 * Contenido SEO de las colecciones Baño y Hogar (la de Cocina vive en
 * KitchenCountertopGuide). Solo información técnica general y datos ya
 * publicados en el sitio; sin precios.
 */

export type GuideLink = { text: string; href?: string };
export type CollectionGuideData = {
  intro: { heading: string; paragraphs: string[] };
  table: {
    caption: string;
    columns: string[];
    rows: { name: string; href?: string; cells: string[] }[];
    note?: string;
  };
  sections: { heading: string; paragraphs: string[] }[];
  tips: { heading: string; items: GuideLink[][] };
};

export const collectionGuides: Record<string, CollectionGuideData> = {
  bano: {
    intro: {
      heading: "¿Qué material elegir para el sobre del baño?",
      paragraphs: [
        "En el baño, la superficie convive con humedad constante, agua caliente, jabones, cosméticos y productos de limpieza. Por eso, además de la estética, conviene elegir un material que resista bien el agua y las manchas, y cuyo mantenimiento encaje con el uso del espacio.",
      ],
    },
    table: {
      caption: "Comparativa de materiales para baño",
      columns: ["Material", "Humedad", "Manchas y cosméticos", "Mantenimiento", "Ideal para"],
      rows: [
        { name: "Cuarzo", href: "/materiales/cuarzo", cells: ["Excelente", "Muy buena resistencia", "Bajo, sin sellado", "Sobres y lavamanos"] },
        { name: "Superficie sólida", href: "/materiales/superficie-solida", cells: ["Excelente", "Muy buena resistencia", "Bajo, reparable", "Lavamanos integrados y baños comerciales"] },
        { name: "Porcelánico", href: "/materiales/porcelanico", cells: ["Excelente", "Muy buena resistencia", "Muy bajo", "Duchas, paredes, pisos y sobres"] },
        { name: "Mármol", href: "/materiales/marmol", cells: ["Buena, con sellado", "Sensible a ácidos", "Medio", "Baños principales de estilo clásico"] },
        { name: "Travertino", href: "/materiales/travertino", cells: ["Buena, con sellado", "Sensible a ácidos", "Medio", "Pisos y paredes con calidez natural"] },
      ],
      note: "Valores orientativos: cada piedra natural varía según su origen y acabado.",
    },
    sections: [
      {
        heading: "Lavamanos integrado o sobre con ovalín",
        paragraphs: [
          "Un lavamanos integrado se fabrica en el mismo material del sobre, sin juntas, lo que da un aspecto continuo y facilita la limpieza. La superficie sólida es ideal para esta solución porque permite curvas y uniones casi invisibles; también se fabrican lavamanos esculpidos en piedra.",
          "La alternativa es un sobre con ovalín o lavamanos de sobreponer, que da más libertad para combinar materiales y estilos.",
        ],
      },
      {
        heading: "Paredes y duchas con menos juntas",
        paragraphs: [
          "En duchas y paredes, las láminas de porcelánico de gran formato reducen al mínimo las juntas, que es donde suele acumularse la humedad y el moho. El resultado es un baño más fácil de limpiar y con un aspecto continuo, con diseños que imitan mármoles y piedras.",
        ],
      },
      {
        heading: "Grifería y sanitarios",
        paragraphs: [
          "Para completar el baño, trabajamos grifería y sanitarios de marcas italianas como Newform y Flaminia, que se integran con el diseño de los sobres y revestimientos.",
        ],
      },
    ],
    tips: {
      heading: "Consejos para su baño",
      items: [
        [{ text: "Si busca cero mantenimiento, el " }, { text: "cuarzo", href: "/materiales/cuarzo" }, { text: " no necesita sellado y resiste los cosméticos." }],
        [{ text: "Para lavamanos sin juntas, la " }, { text: "superficie sólida", href: "/materiales/superficie-solida" }, { text: " permite piezas continuas y reparables." }],
        [{ text: "Si elige " }, { text: "mármol", href: "/materiales/marmol" }, { text: ", prefiera un acabado mate y limpie de inmediato perfumes, cremas y limpiadores ácidos." }],
        [{ text: "En pisos de ducha, elija acabados con textura para reducir el riesgo de resbalones." }],
      ],
    },
  },

  hogar: {
    intro: {
      heading: "Piedra y superficies para cada espacio del hogar",
      paragraphs: [
        "Más allá de la cocina y el baño, cada espacio pide un material distinto: una chimenea necesita tolerar el calor, una terraza resistir el sol y la lluvia, y una escalera ofrecer seguridad al pisar. Esta guía resume qué materiales funcionan mejor en cada caso.",
      ],
    },
    table: {
      caption: "Materiales recomendados por espacio del hogar",
      columns: ["Espacio", "Materiales recomendados", "A tener en cuenta"],
      rows: [
        { name: "Chimeneas", cells: ["Granito, cuarcita, porcelánico, mármol", "Elegir materiales que toleren el calor; el cuarzo no se recomienda cerca del fuego"] },
        { name: "Barras y mesas interiores", cells: ["Cuarzo, granito, cuarcita, mármol", "En mesas de uso diario, cuarzo y cuarcita resisten mejor manchas y rayado"] },
        { name: "Barras y cocinas exteriores", cells: ["Granito, cuarcita, porcelánico", "Evitar materiales con resinas expuestos al sol directo"] },
        { name: "Pisos y escaleras", cells: ["Porcelánico, travertino, mármol", "Usar acabados con textura en exteriores y zonas húmedas"] },
        { name: "Paredes y revestimientos", cells: ["Porcelánico de gran formato, mármol, travertino", "El gran formato reduce juntas y da continuidad visual"] },
        { name: "Mobiliario y paneles", cells: ["HPL, superficie sólida", "Livianos y versátiles para closets, puertas y muebles"] },
      ],
      note: "Recomendaciones generales: un asesor puede ajustar la elección según el diseño y el uso.",
    },
    sections: [
      {
        heading: "Chimeneas y áreas sociales",
        paragraphs: [
          "Revestir una chimenea en piedra convierte la sala en el centro del hogar. Granito, cuarcita y porcelánico toleran bien el calor; el mármol se usa mucho en marcos y revestimientos por su elegancia. En áreas sociales, barras y mesas fabricadas a la medida integran el material con el mobiliario.",
        ],
      },
      {
        heading: "Terrazas, piscinas y espacios exteriores",
        paragraphs: [
          "En exteriores, el material enfrenta sol, lluvia y cambios de temperatura. El porcelánico resiste los rayos UV sin decolorarse, y el granito y la cuarcita son muy durables a la intemperie. Para pisos alrededor de piscinas conviene elegir acabados con textura, como el travertino cepillado o porcelánicos antideslizantes.",
        ],
      },
      {
        heading: "Pisos, paredes y escaleras",
        paragraphs: [
          "Las láminas de gran formato permiten pisos y paredes con muy pocas juntas, y las escaleras en piedra aportan carácter y durabilidad. En zonas de mucho tránsito conviene priorizar materiales resistentes al rayado y acabados que no se pongan resbalosos con el agua.",
        ],
      },
    ],
    tips: {
      heading: "Consejos para elegir",
      items: [
        [{ text: "Para exteriores, el " }, { text: "porcelánico", href: "/materiales/porcelanico" }, { text: " y el " }, { text: "granito", href: "/materiales/granito" }, { text: " son de las opciones más resistentes al sol y la lluvia." }],
        [{ text: "Para una chimenea protagonista, la " }, { text: "cuarcita", href: "/materiales/cuarcita" }, { text: " combina veta dramática y tolerancia al calor." }],
        [{ text: "Para muebles y closets, el " }, { text: "HPL", href: "/materiales/hpl" }, { text: " ofrece variedad de diseños con gran relación costo-desempeño." }],
        [{ text: "Vea ideas en nuestros " }, { text: "proyectos", href: "/colecciones" }, { text: " o " }, { text: "solicite asesoría", href: "/contacto" }, { text: "." }],
      ],
    },
  },
};

export function getCollectionGuide(slug: string): CollectionGuideData | undefined {
  return collectionGuides[slug];
}
