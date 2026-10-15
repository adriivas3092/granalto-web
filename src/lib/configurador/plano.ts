import {
  getGeometria,
  getMaterial,
  type Unidad,
} from "@/data/configurador";
import type { Medida, SalpicaderoTipo } from "@/lib/configurador/pricing";
import { GRANALTO_LOGO_DATA_URI } from "@/lib/configurador/plano-logo";

/**
 * Generador del Plano de Taller (SVG) a partir de la configuración del
 * cotizador. Isomórfico (sirve en servidor y navegador): devuelve una cadena
 * SVG que se puede mostrar en el panel, descargar o imprimir a PDF, y adjuntar
 * al correo de dibujo/corte.
 *
 * No incluye huecos (lavabo/cooktop): el contorno, cotas, salpicadero, moldura
 * y áreas; los huecos los agrega dibujo.
 */

export type PlanoInput = {
  geometriaId?: string | null;
  materialId?: string | null;
  colorId?: string | null;
  medidas?: Record<string, Medida>;
  moldura?: boolean | null;
  molduraGrosorCm?: number | null;
  salpicaderoTipo?: SalpicaderoTipo;
  salpicaderoAlturaCm?: number;
  acabado?: "brillo" | "mate" | null;
  lUnion?: "izquierda" | "derecha" | null;
  unidad?: Unidad;
  cliente?: { nombre?: string; telefono?: string; direccion?: string } | null;
  folio?: string;
  fecha?: string;
  vendedor?: string;
  version?: string;
};

type Sobre = { label: string; largoMm: number; profMm: number };

const fmtM = (mm: number) => (mm / 1000).toFixed(3).replace(".", ",");
const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] as string);

function salpicaderoCm(input: PlanoInput): number {
  if (input.salpicaderoTipo === "no" || !input.salpicaderoTipo) return 0;
  if (input.salpicaderoTipo === "10") return 10;
  return input.salpicaderoAlturaCm ?? 0;
}

function cotaH(x1: number, x2: number, y: number, label: string): string {
  const mid = (x1 + x2) / 2;
  return `
    <line x1="${x1}" y1="${y - 6}" x2="${x1}" y2="${y + 6}" class="cota"/>
    <line x1="${x2}" y1="${y - 6}" x2="${x2}" y2="${y + 6}" class="cota"/>
    <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" class="cota"/>
    <polygon points="${x1},${y} ${x1 + 8},${y - 3} ${x1 + 8},${y + 3}" class="arrow"/>
    <polygon points="${x2},${y} ${x2 - 8},${y - 3} ${x2 - 8},${y + 3}" class="arrow"/>
    <rect x="${mid - 36}" y="${y - 24}" width="72" height="18" fill="#fff"/>
    <text x="${mid}" y="${y - 10}" class="dim" text-anchor="middle">${label}</text>`;
}

function cotaV(y1: number, y2: number, x: number, label: string): string {
  const mid = (y1 + y2) / 2;
  return `
    <line x1="${x - 6}" y1="${y1}" x2="${x + 6}" y2="${y1}" class="cota"/>
    <line x1="${x - 6}" y1="${y2}" x2="${x + 6}" y2="${y2}" class="cota"/>
    <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" class="cota"/>
    <polygon points="${x},${y1} ${x - 3},${y1 + 8} ${x + 3},${y1 + 8}" class="arrow"/>
    <polygon points="${x},${y2} ${x - 3},${y2 - 8} ${x + 3},${y2 - 8}" class="arrow"/>
    <g transform="translate(${x - 10},${mid}) rotate(-90)">
      <rect x="-32" y="-9" width="64" height="18" fill="#fff"/>
      <text x="0" y="4" class="dim" text-anchor="middle">${label}</text>
    </g>`;
}

function detalleMoldura(x: number, y: number, grosorCm: number): string {
  return `
    <text x="${x}" y="${y}" class="small" text-anchor="middle">Detalle de Moldura</text>
    <rect x="${x - 70}" y="${y + 12}" width="110" height="16" class="slab"/>
    <text x="${x - 15}" y="${y + 24}" class="tiny" text-anchor="middle">SOBRE</text>
    <polygon points="${x + 40},${y + 12} ${x + 58},${y + 12} ${x + 58},${y + 46}" class="slab"/>
    <line x1="${x + 64}" y1="${y + 12}" x2="${x + 64}" y2="${y + 46}" class="cota"/>
    <text x="${x + 74}" y="${y + 32}" class="tiny">${grosorCm}cm</text>`;
}

/** Dibuja un sobre rectangular con salpicadero, cotas y etiquetas de borde. */
function dibujarRect(sobre: Sobre, salpCm: number, box: { x: number; y: number; w: number; h: number }, escala: number) {
  const w = sobre.largoMm * escala;
  const h = sobre.profMm * escala;
  const x = box.x + (box.w - w) / 2;
  const y = box.y + (box.h - h) / 2 + 10;
  const salpH = salpCm > 0 ? Math.max(14, salpCm * escala * 10) : 0;

  let s = "";
  if (salpH > 0) {
    s += `<rect x="${x - 6}" y="${y - salpH}" width="${w + 12}" height="${salpH}" class="salp"/>
      <text x="${x + w / 2}" y="${y - salpH / 2 + 6}" class="slabel" text-anchor="middle">S:${salpCm}cm</text>`;
  }
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="slab"/>`;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#speckle)"/>`;
  s += `<text x="${x + w + 16}" y="${y + h / 2 + 5}" class="edge">B</text>`;
  s += `<text x="${x + w / 2}" y="${y + h + 26}" class="edge" text-anchor="middle">B</text>`;
  s += `<text x="${x - 20}" y="${y + h / 2 + 5}" class="edge" text-anchor="end">B</text>`;
  s += cotaH(x, x + w, y - salpH - 24, fmtM(sobre.largoMm));
  s += cotaV(y, y + h, x - 40, fmtM(sobre.profMm));
  return { svg: s, x, y, w, h };
}

/** Dibuja un sobre en L (vista en planta) con su unión y cotas. */
function dibujarL(tramos: Sobre[], lUnion: "izquierda" | "derecha", box: { x: number; y: number; w: number; h: number }, escala: number) {
  const La = tramos[0].largoMm; // parte larga
  const Lb = tramos[1].largoMm; // parte corta
  const ancho = Math.max(tramos[0].profMm, tramos[1].profMm); // ancho común
  const aw = La * escala;
  const bw = ancho * escala;
  const totalH = (ancho + Lb) * escala; // alto total de la L

  const x0 = box.x + (box.w - aw) / 2;
  const y0 = box.y + (box.h - totalH) / 2 + 10;
  const w = ancho * escala;

  // Polígono L. Unión a la izquierda: esquina arriba-izquierda; el brazo corto
  // baja por la izquierda. A la derecha: espejo.
  let pts: string;
  if (lUnion === "derecha") {
    pts = `${x0},${y0} ${x0 + aw},${y0} ${x0 + aw},${y0 + totalH} ${x0 + aw - bw},${y0 + totalH} ${x0 + aw - bw},${y0 + w} ${x0},${y0 + w}`;
  } else {
    pts = `${x0},${y0} ${x0 + aw},${y0} ${x0 + aw},${y0 + w} ${x0 + bw},${y0 + w} ${x0 + bw},${y0 + totalH} ${x0},${y0 + totalH}`;
  }

  let s = `<polygon points="${pts}" class="slab"/>`;
  s += `<polygon points="${pts}" fill="url(#speckle)"/>`;
  // Cotas: largo arriba, ancho a la izquierda del brazo largo, largo del brazo corto.
  s += cotaH(x0, x0 + aw, y0 - 24, fmtM(La));
  s += cotaV(y0, y0 + w, x0 - 40, fmtM(ancho));
  if (lUnion === "derecha") {
    s += cotaV(y0, y0 + totalH, x0 + aw + 40, fmtM(Lb + ancho));
  } else {
    s += cotaV(y0, y0 + totalH, x0 - 40, fmtM(Lb + ancho));
  }
  // Marca de la unión.
  const ux = lUnion === "derecha" ? x0 + aw - bw / 2 : x0 + bw / 2;
  s += `<text x="${ux}" y="${y0 + w / 2 + 5}" class="edge" text-anchor="middle">Unión</text>`;
  return { svg: s, x: x0, y: y0, w: aw, h: totalH };
}

export function buildPlanoSVG(input: PlanoInput): string {
  const W = 1120, H = 770, m = 14;
  const geo = getGeometria(input.geometriaId ?? null);
  const material = getMaterial(input.materialId ?? null);
  const materialTxt = material ? `${material.nombre} ${material.espesorMm}mm` : "—";
  const salpCm = salpicaderoCm(input);
  const molCm = input.moldura ? input.molduraGrosorCm ?? 0 : 0;

  const tramos: Sobre[] = (geo?.tramos ?? []).map((t) => {
    const md = input.medidas?.[t.key];
    return { label: t.label, largoMm: md?.largo ?? 0, profMm: md?.prof ?? 0 };
  });
  const esL = geo?.id === "l" && tramos.length >= 2;

  // --- Cuadro de título ---
  const tb = { x: m, y: m, w: W - 2 * m, h: 140 };
  const col = tb.x + 300;
  const rows = [tb.y + 32, tb.y + 62, tb.y + 92];
  let header = `
    <rect x="${tb.x}" y="${tb.y}" width="${tb.w}" height="${tb.h}" class="box"/>
    <line x1="${col}" y1="${tb.y}" x2="${col}" y2="${tb.y + tb.h * 0.72}" class="box"/>
    <image href="${GRANALTO_LOGO_DATA_URI}" x="${tb.x + 20}" y="${tb.y + 26}" width="250" height="36" preserveAspectRatio="xMinYMid meet"/>
    <text x="${tb.x + 22}" y="${tb.y + 86}" class="logosub">PLANOS DE TALLER</text>`;

  header += `
    <text x="${col + 14}" y="${rows[0]}" class="f">Cliente: <tspan class="v">${esc(input.cliente?.nombre)}</tspan></text>
    <text x="${col + 350}" y="${rows[0]}" class="f">Vrs: <tspan class="v">${esc(input.version ?? "01")}</tspan></text>
    <text x="${col + 430}" y="${rows[0]}" class="f">Fecha: <tspan class="v">${esc(input.fecha ?? "")}</tspan></text>
    <text x="${col + 590}" y="${rows[0]}" class="f">Orden: <tspan class="v">${esc(input.folio ?? "")}</tspan></text>
    <text x="${col + 14}" y="${rows[1]}" class="f">Material: <tspan class="v">${esc(materialTxt)}</tspan></text>
    <text x="${col + 350}" y="${rows[1]}" class="f">Área: <tspan class="v">INDICADO</tspan></text>
    <text x="${col + 590}" y="${rows[1]}" class="f">Fecha Entrega: <tspan class="v"></tspan></text>
    <text x="${col + 14}" y="${rows[2]}" class="f">Vendedor: <tspan class="v">${esc(input.vendedor ?? "")}</tspan></text>
    <text x="${col + 260}" y="${rows[2]}" class="f">VB: <tspan class="v">Cliente</tspan></text>
    <text x="${col + 420}" y="${rows[2]}" class="f">Diseñador: <tspan class="v"></tspan></text>`;
  const yb = tb.y + tb.h * 0.72;
  header += `
    <line x1="${tb.x}" y1="${yb}" x2="${tb.x + tb.w}" y2="${yb}" class="box"/>
    <text x="${tb.x + 14}" y="${yb + 26}" class="f">Contacto: <tspan class="v">${esc(input.cliente?.nombre)}</tspan>  ·  Tel: <tspan class="v">${esc(input.cliente?.telefono)}</tspan></text>
    <text x="${col + 470}" y="${yb + 26}" class="f">Dirección: <tspan class="v">${esc(input.cliente?.direccion)}</tspan></text>`;

  // --- Área de dibujo ---
  const area = { x: m + 40, y: tb.y + tb.h + 40, w: W - 2 * m - 240, h: H - (tb.y + tb.h) - 120 };
  let body = "";
  let areaTotal = 0;

  if (tramos.length === 0) {
    body = `<text x="${W / 2}" y="${area.y + area.h / 2}" class="small" text-anchor="middle">Proyecto personalizado — plano a definir con el asesor.</text>`;
  } else if (esL) {
    const maxDim = Math.max(tramos[0].largoMm, tramos[1].largoMm + Math.max(tramos[0].profMm, tramos[1].profMm));
    const escala = Math.min((area.w - 160) / Math.max(1, tramos[0].largoMm), (area.h - 120) / Math.max(1, maxDim));
    const d = dibujarL(tramos, (input.lUnion ?? "izquierda") as "izquierda" | "derecha", area, escala);
    body += d.svg;
    const ancho = Math.max(tramos[0].profMm, tramos[1].profMm);
    const aSlab = (tramos[0].largoMm / 1000) * (ancho / 1000) + (tramos[1].largoMm / 1000) * (ancho / 1000) - (ancho / 1000) * (ancho / 1000);
    const aSalp = salpCm > 0 ? ((tramos[0].largoMm + tramos[1].largoMm) / 1000) * (salpCm / 100) : 0;
    areaTotal = aSlab + aSalp;
    body += `<text x="${d.x}" y="${d.y + d.h + 48}" class="sobrelbl">Sobre en L</text>
      <text x="${d.x + 230}" y="${d.y + d.h + 48}" class="sobrelbl">Área: ${areaTotal.toFixed(2)} m²</text>`;
    if (salpCm > 0) body += `<text x="${d.x}" y="${d.y + d.h + 74}" class="small">Salpicadero: S:${salpCm}cm en todo el frente</text>`;
    if (molCm > 0) body += detalleMoldura(area.x + area.w + 140, area.y + 30, molCm);
  } else {
    const maxL = Math.max(...tramos.map((s) => s.largoMm), 1);
    const n = tramos.length;
    const escala = Math.min((area.w - 120) / maxL, (area.h - 120) / Math.max(1, Math.max(...tramos.map((s) => s.profMm)) * n + 40));
    const subH = area.h / n;
    tramos.forEach((sobre, i) => {
      const subBox = { x: area.x, y: area.y + i * subH, w: area.w, h: subH - 10 };
      const d = dibujarRect(sobre, salpCm, subBox, escala);
      body += d.svg;
      const aSlab = (sobre.largoMm / 1000) * (sobre.profMm / 1000);
      const aSalp = salpCm > 0 ? (sobre.largoMm / 1000) * (salpCm / 100) : 0;
      areaTotal += aSlab + aSalp;
      const lbl = n > 1 ? `Sobre M${i + 1}` : "Sobre";
      body += `<text x="${d.x}" y="${d.y + d.h + 52}" class="sobrelbl">${lbl}</text>
        <text x="${d.x + 220}" y="${d.y + d.h + 52}" class="sobrelbl">Área: ${(aSlab + aSalp).toFixed(2)} m²</text>`;
      if (molCm > 0) body += detalleMoldura(area.x + area.w + 140, d.y + d.h / 2 - 10, molCm);
      else body += `<text x="${area.x + area.w + 90}" y="${d.y + d.h / 2}" class="small">Sin moldura</text>`;
    });
  }

  // --- Tabla de totales ---
  const tx = m, ty = H - m - 70;
  const tabla = `
    <rect x="${tx}" y="${ty}" width="320" height="56" class="box"/>
    <line x1="${tx + 120}" y1="${ty}" x2="${tx + 120}" y2="${ty + 28}" class="box"/>
    <line x1="${tx + 220}" y1="${ty}" x2="${tx + 220}" y2="${ty + 28}" class="box"/>
    <line x1="${tx}" y1="${ty + 28}" x2="${tx + 320}" y2="${ty + 28}" class="box"/>
    <text x="${tx + 12}" y="${ty + 19}" class="f">PIEZAS: <tspan class="v">${esL ? 1 : tramos.length}</tspan></text>
    <text x="${tx + 132}" y="${ty + 19}" class="f">M²: <tspan class="v">${areaTotal.toFixed(2)}</tspan></text>
    <text x="${tx + 232}" y="${ty + 19}" class="f">Acab: <tspan class="v">${input.acabado === "mate" ? "Mate" : "Brillo"}</tspan></text>
    <text x="${tx + 12}" y="${ty + 47}" class="f">Material: <tspan class="v">${esc(materialTxt)}</tspan></text>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="speckle" width="26" height="26" patternUnits="userSpaceOnUse">
      <path d="M6 6 l3 5 l-6 0 Z" fill="#00000010"/>
      <path d="M18 16 l3 5 l-6 0 Z" fill="#00000010"/>
    </pattern>
    <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke="#00000030" stroke-width="1.5"/>
    </pattern>
  </defs>
  <style>
    text { font-family: Arial, Helvetica, sans-serif; fill:#1e1e1e; }
    .box { fill:none; stroke:#1e1e1e; stroke-width:1.6; }
    .logosub { font-size:14px; letter-spacing:4px; fill:#6b6b6b; font-weight:600; }
    .f { font-size:15px; fill:#333; }
    .v { font-weight:700; fill:#111; }
    .slab { fill:#fafafa; stroke:#1e1e1e; stroke-width:1.8; }
    .salp { fill:url(#hatch); stroke:#1e1e1e; stroke-width:1.4; }
    .slabel { font-size:20px; font-weight:700; }
    .cota { stroke:#1e1e1e; stroke-width:1.1; }
    .arrow { fill:#1e1e1e; }
    .dim { font-size:17px; font-weight:700; }
    .edge { font-size:20px; font-weight:800; }
    .sobrelbl { font-size:24px; font-weight:800; }
    .small { font-size:14px; fill:#333; }
    .tiny { font-size:11px; fill:#333; }
  </style>
  <rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/>
  <rect x="4" y="4" width="${W - 8}" height="${H - 8}" class="box"/>
  ${header}
  ${body}
  ${tabla}
</svg>`;
}
