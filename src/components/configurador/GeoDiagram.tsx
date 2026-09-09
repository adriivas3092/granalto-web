/** Esquemas simples de cada geometría (se ven en selección y medidas). */
export function GeoDiagram({
  id,
  className = "",
}: {
  id: string;
  className?: string;
}) {
  const stroke = "currentColor";
  const fill = "rgba(38,58,44,0.06)";
  const common = {
    fill,
    stroke,
    strokeWidth: 2,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg
      viewBox="0 0 120 90"
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {id === "recto" && <rect x="12" y="38" width="96" height="16" {...common} />}
      {id === "barra" && (
        <>
          <rect x="12" y="34" width="96" height="14" {...common} />
          <rect x="12" y="48" width="96" height="8" fill="rgba(38,58,44,0.14)" stroke={stroke} strokeWidth="1.5" />
        </>
      )}
      {id === "isla" && <rect x="26" y="28" width="68" height="34" rx="2" {...common} />}
      {id === "l" && (
        <path d="M18 24 h20 v34 h52 v16 h-72 Z" {...common} />
      )}
      {id === "paralela" && (
        <>
          <rect x="12" y="20" width="96" height="14" {...common} />
          <rect x="12" y="56" width="96" height="14" {...common} />
        </>
      )}
      {id === "personalizado" && (
        <>
          <rect x="16" y="26" width="88" height="38" rx="2" fill="none" stroke={stroke} strokeWidth="2" strokeDasharray="5 5" />
          <text x="60" y="50" textAnchor="middle" fontSize="20" fill={stroke}>?</text>
        </>
      )}
    </svg>
  );
}
