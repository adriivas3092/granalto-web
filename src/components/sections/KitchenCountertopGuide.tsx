import Link from "next/link";

const comparison = [
  {
    name: "Cuarcita",
    href: "/materiales/cuarcita",
    origin: "Natural",
    scratch: "Muy alta",
    heat: "Alta",
    sealing: "Sí, periódico",
    look: "Vetas tipo mármol, única en cada lámina",
  },
  {
    name: "Granito",
    href: "/materiales/granito",
    origin: "Natural",
    scratch: "Alta",
    heat: "Alta",
    sealing: "Sí, según el tipo",
    look: "Granos y motas, gran variedad de colores",
  },
  {
    name: "Cuarzo",
    href: "/materiales/cuarzo",
    origin: "Ingeniería",
    scratch: "Alta",
    heat: "Media (usar protector)",
    sealing: "No",
    look: "Color uniforme, también con veta",
  },
  {
    name: "Mármol",
    href: "/materiales/marmol",
    origin: "Natural",
    scratch: "Baja",
    heat: "Media",
    sealing: "Sí, y sensible a ácidos",
    look: "Elegancia clásica, desarrolla pátina",
  },
  {
    name: "Porcelánico",
    href: "/materiales/porcelanico",
    origin: "Cerámico",
    scratch: "Alta",
    heat: "Alta",
    sealing: "No",
    look: "Gran formato, imitaciones de piedra",
  },
];

const steps = [
  {
    title: "Elija su material",
    text: "Visite un showroom o explore los materiales en línea. Un asesor le ayuda a comparar opciones según el uso, la estética y el mantenimiento que prefiera.",
  },
  {
    title: "Medición con plantilla",
    text: "Coordinamos una visita para tomar las medidas exactas del espacio (plantillado) y confirmar detalles como fregadero, cantos y salpicadero antes de fabricar.",
  },
  {
    title: "Fabricación a la medida",
    text: "Cortamos y pulimos su sobre con precisión, incluyendo cantos, cortes de fregadero y perforaciones para grifería.",
  },
  {
    title: "Instalación",
    text: "Instalamos el sobre con acabado profesional y dejamos su cocina lista para usar.",
  },
];

/** Contenido de la colección Cocina: comparativa, proceso y cómo elegir. */
export function KitchenCountertopGuide() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h2 className="font-serif text-2xl text-ink md:text-3xl">
          ¿Qué material elegir para su sobre de cocina?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-charcoal/85 md:text-lg">
          El sobre es la superficie que más trabaja en la cocina: recibe calor, cortes, humedad y
          derrames todos los días. Por eso, además del color, conviene comparar la resistencia al
          rayado y al calor, y el mantenimiento que pide cada material.
        </p>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <caption className="sr-only">Comparativa de materiales para sobres de cocina</caption>
          <thead>
            <tr className="border-b border-ink text-xs uppercase tracking-wide text-mineral">
              <th scope="col" className="py-3 pr-4">Material</th>
              <th scope="col" className="py-3 pr-4">Origen</th>
              <th scope="col" className="py-3 pr-4">Resistencia al rayado</th>
              <th scope="col" className="py-3 pr-4">Resistencia al calor</th>
              <th scope="col" className="py-3 pr-4">Sellado</th>
              <th scope="col" className="py-3">Estética</th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((m) => (
              <tr key={m.name} className="border-b border-stone-beige align-top text-charcoal/85">
                <th scope="row" className="py-3 pr-4 font-medium text-ink">
                  <Link href={m.href} className="underline-offset-4 hover:underline">
                    {m.name}
                  </Link>
                </th>
                <td className="py-3 pr-4">{m.origin}</td>
                <td className="py-3 pr-4">{m.scratch}</td>
                <td className="py-3 pr-4">{m.heat}</td>
                <td className="py-3 pr-4">{m.sealing}</td>
                <td className="py-3">{m.look}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-mineral">
        Valores orientativos: cada piedra natural varía según su origen y la lámina específica.
      </p>

      <div className="mt-14 max-w-3xl">
        <h2 className="font-serif text-2xl text-ink md:text-3xl">Cómo trabajamos su sobre de cocina</h2>
        <ol className="mt-6 space-y-5">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-ivory">
                {i + 1}
              </span>
              <div>
                <h3 className="font-sans text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-base leading-relaxed text-charcoal/85">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-14 max-w-3xl">
        <h2 className="font-serif text-2xl text-ink md:text-3xl">Consejos para acertar con su elección</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-relaxed text-charcoal/85 md:text-lg">
          <li>
            Si cocina mucho y quiere la menor preocupación posible, el{" "}
            <Link href="/materiales/cuarzo" className="underline underline-offset-4">cuarzo</Link> no
            necesita sellado y resiste las manchas.
          </li>
          <li>
            Si busca una pieza única con veta y alta resistencia, la{" "}
            <Link href="/materiales/cuarcita" className="underline underline-offset-4">cuarcita</Link>{" "}
            combina estética de lujo con dureza.
          </li>
          <li>
            Si quiere un clásico durable y tolerante al calor, el{" "}
            <Link href="/materiales/granito" className="underline underline-offset-4">granito</Link>{" "}
            sigue siendo una apuesta segura.
          </li>
          <li>
            En piedras naturales, elija la lámina en persona: el color y la veta cambian de una a otra.
          </li>
        </ul>
        <p className="mt-6 text-base leading-relaxed text-charcoal/85 md:text-lg">
          ¿Tiene dudas? Lea la guía{" "}
          <Link href="/blog/como-elegir-el-material-ideal" className="underline underline-offset-4">
            ¿Cómo elegir el material ideal?
          </Link>{" "}
          o{" "}
          <Link href="/contacto" className="underline underline-offset-4">
            solicite asesoría
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
