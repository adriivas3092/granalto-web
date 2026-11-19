/**
 * Guías de contenido por material (SEO): secciones explicativas y preguntas
 * frecuentes. Solo información técnica general del material; sin precios ni
 * datos de la empresa que no estén confirmados.
 */

export type GuideSection = { heading: string; paragraphs: string[] };
export type GuideFaq = { question: string; answer: string };
export type MaterialGuide = { sections: GuideSection[]; faqs: GuideFaq[] };

export const materialGuides: Record<string, MaterialGuide> = {
  granito: {
    sections: [
      {
        heading: "¿Por qué elegir granito para el sobre de cocina?",
        paragraphs: [
          "El granito es una roca ígnea formada por el enfriamiento lento del magma. Está compuesto principalmente de cuarzo, feldespato y mica, lo que le da una dureza alta (alrededor de 6 a 7 en la escala de Mohs) y una gran resistencia al uso diario.",
          "En la cocina, eso se traduce en una superficie que tolera bien el calor de ollas y sartenes, resiste el rayado de los utensilios y mantiene su aspecto por décadas con un mantenimiento sencillo. Por eso sigue siendo uno de los materiales más usados para sobres de cocina en Costa Rica.",
        ],
      },
      {
        heading: "Colores y acabados",
        paragraphs: [
          "Cada lámina de granito es única: el patrón de granos, motas y vetas cambia incluso dentro de un mismo tipo de piedra. Hay granitos negros, grises, blancos, beige y tonos tierra, y se pueden trabajar en acabado pulido (brillante), honed (mate) o leather (texturizado).",
          "Como el diseño varía entre láminas, lo ideal es ver y elegir la lámina en persona antes de fabricar, sobre todo en islas o sobres grandes donde la veta es protagonista.",
        ],
      },
      {
        heading: "Cuidado y mantenimiento",
        paragraphs: [
          "Para la limpieza diaria basta con agua tibia y jabón neutro con un paño suave. Conviene evitar limpiadores abrasivos, cloro concentrado y productos ácidos fuertes, que con el tiempo pueden opacar el acabado.",
          "El granito es una piedra natural con cierta porosidad, por lo que se recomienda un sellado periódico. La frecuencia depende del tipo de granito y del uso: un granito oscuro y denso puede necesitarlo muy poco, mientras que uno claro y más poroso agradece un sellado más frecuente.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿El granito se mancha?",
        answer:
          "Bien sellado, el granito resiste muy bien las manchas. Los derrames de aceite, vino o café se deben limpiar pronto, especialmente en granitos claros, que son más porosos que los oscuros.",
      },
      {
        question: "¿Se puede poner una olla caliente sobre el granito?",
        answer:
          "El granito tolera bien el calor, pero se recomienda usar un protector bajo ollas muy calientes para evitar cambios bruscos de temperatura en un mismo punto.",
      },
      {
        question: "¿Granito o cuarzo para la cocina?",
        answer:
          "El granito es natural, aguanta mejor el calor y cada lámina es única. El cuarzo es un material de ingeniería no poroso, que no necesita sellado y tiene un color más uniforme. La elección depende de la estética buscada y del mantenimiento que prefiera.",
      },
    ],
  },

  cuarzo: {
    sections: [
      {
        heading: "¿Qué es el cuarzo para sobres?",
        paragraphs: [
          "El cuarzo para sobres es una superficie de ingeniería: se fabrica con cuarzo natural triturado (en general alrededor del 90 % de la mezcla) unido con resinas y pigmentos. El resultado es una lámina muy resistente, no porosa y con un color uniforme y controlado.",
          "Al no ser poroso, el cuarzo no necesita sellado y resiste muy bien las manchas de café, vino o aceite, lo que lo hace una opción práctica para cocinas de uso intenso y para baños.",
        ],
      },
      {
        heading: "Ventajas y límites del cuarzo",
        paragraphs: [
          "Entre sus ventajas están el bajo mantenimiento, la consistencia de color entre láminas (útil en proyectos grandes) y la variedad de diseños, desde blancos lisos hasta imitaciones de mármol con veta.",
          "Su punto débil es el calor directo: las resinas pueden marcarse o decolorarse con ollas muy calientes, por lo que se recomienda usar siempre protectores. Además, la mayoría de los fabricantes no lo recomiendan para exteriores con sol directo, porque la radiación UV puede alterar el color con el tiempo.",
        ],
      },
      {
        heading: "Cuidado y mantenimiento",
        paragraphs: [
          "La limpieza diaria se hace con agua y jabón neutro. Conviene evitar productos muy alcalinos o solventes fuertes, y no usar esponjas abrasivas. No requiere sellado en ningún momento de su vida útil.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿El cuarzo necesita sellado?",
        answer: "No. Al ser una superficie no porosa, el cuarzo no se sella ni al instalarlo ni después.",
      },
      {
        question: "¿Se puede usar cuarzo en exteriores?",
        answer:
          "En general no se recomienda en exteriores con sol directo, porque la radiación UV puede alterar el color de las resinas. Para exteriores suelen ser mejores el granito, la cuarcita o el porcelánico.",
      },
      {
        question: "¿Cuál es la diferencia entre cuarzo y cuarcita?",
        answer:
          "La cuarcita es una piedra natural extraída de cantera; el cuarzo para sobres es un material fabricado con cuarzo triturado y resinas. La cuarcita es única en cada lámina y tolera mejor el calor; el cuarzo no es poroso y no necesita sellado.",
      },
    ],
  },

  cuarcita: {
    sections: [
      {
        heading: "Qué hace especial a la cuarcita",
        paragraphs: [
          "La cuarcita es una roca metamórfica que se forma cuando la arenisca rica en cuarzo se somete a altas presiones y temperaturas. El resultado es una piedra muy dura (alrededor de 7 en la escala de Mohs) con vetas y colores que recuerdan al mármol.",
          "Por esa combinación de estética y resistencia, es una de las superficies preferidas para islas y sobres de cocina protagonistas: ofrece el look de una piedra de lujo con un desempeño superior en el uso diario.",
        ],
      },
      {
        heading: "Cuarcita verdadera y \"falsas cuarcitas\"",
        paragraphs: [
          "En el mercado internacional a veces se venden como cuarcita algunos mármoles dolomíticos, que son más blandos y sensibles a los ácidos. Una cuarcita verdadera raya el vidrio y no reacciona con el limón o el vinagre.",
          "Por eso conviene elegir la lámina con asesoría y, si hay duda, pedir que se verifique el material antes de fabricar.",
        ],
      },
      {
        heading: "Cuidado y mantenimiento",
        paragraphs: [
          "La cuarcita se limpia con agua y jabón neutro. Como piedra natural, se recomienda un sellado periódico para protegerla de manchas, con una frecuencia que depende de la porosidad de cada piedra y del uso.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿La cuarcita es más dura que el granito?",
        answer:
          "En general sí: la cuarcita suele estar alrededor de 7 en la escala de Mohs, en el rango alto del granito, lo que la hace muy resistente al rayado.",
      },
      {
        question: "¿La cuarcita se mancha con limón o vino?",
        answer:
          "Una cuarcita verdadera no se graba con ácidos como el limón, a diferencia del mármol. Aun así, al ser natural tiene cierta porosidad, así que se recomienda mantenerla sellada y limpiar los derrames pronto.",
      },
      {
        question: "¿Cuarcita o mármol para la cocina?",
        answer:
          "Si busca la estética del mármol pero con más resistencia al rayado y a los ácidos, la cuarcita suele ser la mejor opción para cocina. El mármol se reserva mejor para baños, paredes o cocinas donde se acepte la pátina natural.",
      },
    ],
  },

  marmol: {
    sections: [
      {
        heading: "El mármol: belleza clásica",
        paragraphs: [
          "El mármol es una roca metamórfica formada a partir de la caliza. Está compuesto principalmente de calcita, lo que le da su translucidez y sus vetas características, pero también lo hace más blando (alrededor de 3 en la escala de Mohs) que el granito o la cuarcita.",
          "Es una de las piedras más valoradas en diseño de interiores por su elegancia atemporal, y destaca en baños, revestimientos de pared, chimeneas, escaleras y piezas a la medida.",
        ],
      },
      {
        heading: "¿Mármol en la cocina?",
        paragraphs: [
          "El mármol reacciona con los ácidos: el limón, el vinagre, el vino o algunos limpiadores pueden dejar marcas opacas (grabado) en la superficie, y se raya con más facilidad que otras piedras.",
          "Por eso, en cocina se elige cuando se acepta que la piedra desarrolle una pátina con el uso. Un acabado honed (mate) disimula mejor las marcas que el pulido. Si se busca el aspecto del mármol con menos mantenimiento, conviene considerar la cuarcita o un cuarzo con veta.",
        ],
      },
      {
        heading: "Cuidado y mantenimiento",
        paragraphs: [
          "Se limpia con agua y jabón de pH neutro, evitando productos ácidos o abrasivos. Requiere sellado periódico para reducir la absorción de manchas, aunque el sellador no evita el grabado por ácidos.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿El mármol se raya fácilmente?",
        answer:
          "Es más blando que el granito o la cuarcita, por lo que puede rayarse con objetos duros. En baños y paredes este desgaste es mínimo.",
      },
      {
        question: "¿Qué hacer si el mármol se mancha con limón?",
        answer:
          "Las marcas por ácidos (grabado) no se quitan con limpieza normal: requieren pulido o restauración profesional. Lo mejor es limpiar los derrames ácidos de inmediato.",
      },
      {
        question: "¿Dónde conviene usar mármol?",
        answer:
          "Brilla en baños, lavamanos, revestimientos, chimeneas, escaleras y mobiliario. En cocina funciona si se acepta su pátina natural con el tiempo.",
      },
    ],
  },

  porcelanico: {
    sections: [
      {
        heading: "¿Qué es el porcelánico de gran formato?",
        paragraphs: [
          "El porcelánico es un material cerámico que se fabrica con arcillas, feldespatos y minerales prensados y cocidos a muy alta temperatura. El resultado es una lámina muy densa, con una absorción de agua mínima, que se produce en grandes formatos y espesores reducidos.",
          "En Granalto trabajamos porcelánico de la marca italiana ABK, con diseños que reproducen mármoles, piedras, cementos y maderas con gran realismo.",
        ],
      },
      {
        heading: "Ventajas en cocina, baño y exteriores",
        paragraphs: [
          "Al ser prácticamente no poroso, el porcelánico resiste manchas, humedad y productos de limpieza, y no necesita sellado. También tolera muy bien el calor y, a diferencia de los materiales con resinas, no se decolora con el sol, por lo que funciona en terrazas, fachadas y cocinas exteriores.",
          "El gran formato permite revestir pisos, paredes y sobres con muy pocas juntas, logrando superficies continuas y fáciles de limpiar.",
        ],
      },
      {
        heading: "Qué tener en cuenta",
        paragraphs: [
          "Las láminas de gran formato requieren cortes e instalación con equipo y mano de obra especializados. En algunos diseños el color y la veta están solo en la superficie, por lo que el tipo de canto se define junto con el asesor para lograr el mejor acabado.",
          "Para la limpieza diaria basta agua y jabón neutro.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿El porcelánico sirve para sobres de cocina?",
        answer:
          "Sí. Resiste calor, manchas y rayado, y no necesita sellado. Su fabricación e instalación como sobre requieren mano de obra especializada en gran formato.",
      },
      {
        question: "¿Se puede usar porcelánico en exteriores?",
        answer:
          "Sí. Es resistente a los rayos UV y a la humedad, por lo que se usa en fachadas, terrazas, áreas de piscina y cocinas exteriores.",
      },
      {
        question: "¿Porcelánico o cuarzo?",
        answer:
          "Ambos son no porosos. El porcelánico tolera mejor el calor y el sol, y llega en formatos más grandes; el cuarzo tiene más cuerpo y es más sencillo de trabajar en cantos gruesos.",
      },
    ],
  },

  "superficie-solida": {
    sections: [
      {
        heading: "¿Qué es la superficie sólida?",
        paragraphs: [
          "La superficie sólida (solid surface) es un material compuesto de resinas acrílicas o de poliéster y cargas minerales. Su composición es igual en todo el espesor, lo que permite unir piezas con juntas casi invisibles y dar forma a curvas mediante calor (termoformado).",
          "En Granalto trabajamos superficie sólida de Wilsonart, en blancos, colores sólidos y diseños con aspecto de piedra.",
        ],
      },
      {
        heading: "Dónde funciona mejor",
        paragraphs: [
          "Su gran ventaja es la continuidad: permite sobres con lavamanos integrados en una sola pieza, mostradores curvos, recepciones y mobiliario sin juntas visibles. Al no ser porosa, es higiénica y fácil de limpiar, por lo que se usa mucho en clínicas, laboratorios, comercios y baños.",
          "Otra ventaja es que se puede reparar: las rayas superficiales o pequeños daños se pueden lijar y pulir para devolverle su aspecto original.",
        ],
      },
      {
        heading: "Cuidado y límites",
        paragraphs: [
          "Es más sensible al calor y al rayado que la piedra, por lo que conviene usar protectores bajo ollas calientes y tablas para cortar. Se limpia con agua, jabón neutro o limpiadores no abrasivos.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿La superficie sólida se puede reparar?",
        answer:
          "Sí. Como el material es igual en todo su espesor, las rayas superficiales y pequeños daños se pueden lijar y pulir.",
      },
      {
        question: "¿Se puede poner una olla caliente sobre superficie sólida?",
        answer:
          "No se recomienda. El calor directo puede marcarla; siempre conviene usar un protector.",
      },
      {
        question: "¿Para qué proyectos se recomienda?",
        answer:
          "Para lavamanos integrados, mobiliario clínico y comercial, recepciones, mostradores y piezas con curvas donde la continuidad y la higiene son prioridad.",
      },
    ],
  },

  travertino: {
    sections: [
      {
        heading: "El travertino, una piedra con historia",
        paragraphs: [
          "El travertino es una piedra caliza sedimentaria que se forma por la precipitación de minerales en aguas termales y manantiales. Esa formación le da sus poros y cavidades característicos y sus tonos cálidos: beige, crema, nuez y plata.",
          "Se ha usado en arquitectura desde la antigüedad y hoy vuelve con fuerza en diseño de interiores por su textura natural y su calidez.",
        ],
      },
      {
        heading: "Poro abierto o resinado",
        paragraphs: [
          "El travertino puede dejarse con poro abierto, que resalta su textura natural, o con los poros rellenos de resina, que dan una superficie más lisa y fácil de limpiar. También se trabaja en acabado honed (mate) o cepillado, este último con un tacto más rústico y antideslizante.",
          "Para pisos de exteriores y áreas de piscina suelen preferirse acabados con textura, que reducen el riesgo de resbalones.",
        ],
      },
      {
        heading: "Cuidado y mantenimiento",
        paragraphs: [
          "Al ser una caliza, el travertino es sensible a los ácidos y tiene porosidad natural, por lo que requiere sellado y limpieza con productos de pH neutro. Es una excelente opción para pisos, paredes y baños; en sobres de cocina conviene considerar su mayor sensibilidad a manchas y ácidos.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿El travertino sirve para exteriores?",
        answer:
          "Sí, se usa en terrazas y áreas de piscina. Para pisos exteriores se recomiendan acabados con textura y un sellado adecuado.",
      },
      {
        question: "¿Qué diferencia hay entre travertino con poro abierto y resinado?",
        answer:
          "El de poro abierto conserva las cavidades naturales y una apariencia más rústica; el resinado rellena los poros para una superficie más lisa y fácil de limpiar.",
      },
      {
        question: "¿El travertino se mancha?",
        answer:
          "Es poroso y sensible a los ácidos, por lo que debe mantenerse sellado y limpiarse con productos neutros, limpiando los derrames pronto.",
      },
    ],
  },

  hpl: {
    sections: [
      {
        heading: "¿Qué es el HPL?",
        paragraphs: [
          "El HPL (High Pressure Laminate o laminado de alta presión) se fabrica prensando capas de papel impregnadas con resinas bajo alta presión y temperatura, con una capa decorativa superior protegida con melamina. El resultado es una lámina delgada, resistente y muy versátil.",
          "En Granalto distribuimos HPL de Wilsonart, con una amplia variedad de diseños en madera, colores sólidos, piedra y metálicos.",
        ],
      },
      {
        heading: "Usos más comunes",
        paragraphs: [
          "El HPL se adhiere sobre tableros para revestir mobiliario de cocina, closets, puertas, paneles de pared y mobiliario comercial y de oficina. Es liviano, fácil de trabajar y ofrece una excelente relación entre costo y desempeño.",
          "Su superficie resiste bien el desgaste diario, los impactos leves y las manchas comunes, por lo que es ideal para muebles de uso intenso.",
        ],
      },
      {
        heading: "Cuidado y límites",
        paragraphs: [
          "Se limpia con un paño húmedo y jabón neutro. No se recomienda para superficies expuestas a calor intenso ni a humedad permanente sin el soporte y sellado de cantos adecuados.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Qué diferencia hay entre HPL y melamina?",
        answer:
          "Ambos son laminados decorativos, pero el HPL se fabrica a alta presión con varias capas de papel y resina, por lo que es más resistente al impacto y al desgaste que la melamina de baja presión.",
      },
      {
        question: "¿El HPL sirve para sobres de cocina?",
        answer:
          "Se usa principalmente en mobiliario y superficies verticales. Para sobres de cocina con calor y humedad constantes suelen recomendarse cuarzo, granito o porcelánico.",
      },
      {
        question: "¿Qué diseños hay disponibles?",
        answer:
          "Hay maderas, colores sólidos, aspectos de piedra y acabados metálicos, en texturas mate, texturizadas y de alto brillo.",
      },
    ],
  },

  cambria: {
    sections: [
      {
        heading: "¿Qué es Cambria?",
        paragraphs: [
          "Cambria es una marca estadounidense de superficies de cuarzo de alta gama, fabricada en Estados Unidos. Como todo cuarzo para sobres, combina cuarzo natural con resinas, lo que da una superficie no porosa, resistente y de bajo mantenimiento.",
          "Se distingue por sus diseños exclusivos, muchos de ellos inspirados en mármoles y piedras naturales, con una gran consistencia de color y patrón entre láminas.",
        ],
      },
      {
        heading: "Ventajas para cocinas y baños",
        paragraphs: [
          "Al no ser poroso, Cambria no necesita sellado y resiste las manchas de café, vino y aceite. Es una opción ideal para quien busca la estética del mármol en la cocina sin su sensibilidad a los ácidos.",
          "Su uniformidad lo hace práctico en proyectos grandes o con varias piezas, donde se busca que todas las superficies coincidan.",
        ],
      },
      {
        heading: "Cuidado y límites",
        paragraphs: [
          "Se limpia con agua y jabón neutro. Como todo cuarzo, es sensible al calor directo, por lo que conviene usar protectores bajo ollas calientes, y no se recomienda para exteriores con sol directo.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Cambria es cuarzo?",
        answer:
          "Sí. Cambria es una marca de superficies de cuarzo de alta gama, no porosas y sin necesidad de sellado.",
      },
      {
        question: "¿Cambria o mármol?",
        answer:
          "Cambria ofrece diseños con aspecto de mármol pero sin su sensibilidad a ácidos y manchas. El mármol natural, en cambio, tolera mejor el calor y cada lámina es única.",
      },
      {
        question: "¿Cambria se puede usar en exteriores?",
        answer:
          "No se recomienda en exteriores con sol directo, porque la radiación UV puede alterar el color de las resinas.",
      },
    ],
  },
};

export function getMaterialGuide(slug: string): MaterialGuide | undefined {
  return materialGuides[slug];
}
