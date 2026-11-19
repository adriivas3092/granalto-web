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
};

export function getMaterialGuide(slug: string): MaterialGuide | undefined {
  return materialGuides[slug];
}
