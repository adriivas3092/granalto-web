/** Ilustración simple que explica qué medidas ingresar. */
export function MeasurementGuide() {
  return (
    <figure className="rounded-sm border border-stone-beige bg-white p-4">
      <svg viewBox="0 0 320 180" className="h-auto w-full" role="img" aria-label="Diagrama de largo y ancho de una pieza">
        <rect x="40" y="45" width="240" height="90" rx="4" fill="#e9e4da" stroke="#8a8378" />
        {/* Largo */}
        <line x1="40" y1="30" x2="280" y2="30" stroke="#1a1a1a" strokeWidth="1.5" markerStart="url(#a)" markerEnd="url(#a)" />
        <text x="160" y="24" textAnchor="middle" fontSize="12" fill="#1a1a1a">Largo</text>
        {/* Ancho */}
        <line x1="25" y1="45" x2="25" y2="135" stroke="#1a1a1a" strokeWidth="1.5" markerStart="url(#a)" markerEnd="url(#a)" />
        <text x="16" y="95" textAnchor="middle" fontSize="12" fill="#1a1a1a" transform="rotate(-90 16 95)">Ancho</text>
        <defs>
          <marker id="a" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0 4 L8 1 L8 7 Z" fill="#1a1a1a" />
          </marker>
        </defs>
      </svg>
      <figcaption className="mt-2 text-xs text-mineral">
        Medí el <strong className="text-charcoal">largo</strong> y el <strong className="text-charcoal">ancho</strong> de cada pieza.
        Si la forma es en L o U, dividila en tramos rectos y agregá cada uno.
      </figcaption>
    </figure>
  );
}
