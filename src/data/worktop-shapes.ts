import type { PieceShape } from "@/types/quote";

/**
 * Formas/plantillas de superficie para el paso de medidas.
 * Al elegir una forma se generan automáticamente sus "partes" (piezas),
 * cada una con Largo y Fondo. El fondo estándar de un sobre es 600 mm.
 */
export type WorktopPart = { label: string };

export type WorktopShape = {
  id: string;
  name: string;
  parts: WorktopPart[];
  pieceShape: PieceShape;
  /** Fondo por defecto en mm. */
  defaultDepth: number;
  /** Diagrama SVG (viewBox 0 0 220 150). */
  diagram: string;
};

const badge = (x: number, y: number, n: number) =>
  `<circle cx="${x}" cy="${y}" r="12" fill="#1a1a1a"/><text x="${x}" y="${y + 4}" text-anchor="middle" font-size="13" fill="#fff" font-weight="700">${n}</text>`;
const bar = (x: number, y: number, w: number, h: number) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#efe6d6" stroke="#8a8378" stroke-width="1.5"/>`;

export const WORKTOP_SHAPES: WorktopShape[] = [
  {
    id: "pared",
    name: "En pared",
    parts: [{ label: "Tramo recto" }],
    pieceShape: "recto",
    defaultDepth: 600,
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 150">${bar(30, 55, 160, 40)}${badge(110, 75, 1)}</svg>`,
  },
  {
    id: "l",
    name: "En L",
    parts: [{ label: "Tramo 1" }, { label: "Tramo 2" }],
    pieceShape: "l",
    defaultDepth: 600,
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 150">${bar(45, 40, 130, 38)}${bar(45, 78, 40, 55)}${badge(110, 59, 1)}${badge(65, 105, 2)}</svg>`,
  },
  {
    id: "u",
    name: "En U",
    parts: [{ label: "Tramo izquierdo" }, { label: "Tramo central" }, { label: "Tramo derecho" }],
    pieceShape: "u",
    defaultDepth: 600,
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 150">${bar(45, 40, 130, 34)}${bar(45, 74, 38, 60)}${bar(137, 74, 38, 60)}${badge(110, 57, 2)}${badge(64, 104, 1)}${badge(156, 104, 3)}</svg>`,
  },
  {
    id: "paralela",
    name: "Paralela",
    parts: [{ label: "Tramo 1" }, { label: "Tramo 2" }],
    pieceShape: "barra",
    defaultDepth: 600,
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 150">${bar(40, 42, 150, 30)}${bar(40, 92, 150, 30)}${badge(115, 57, 1)}${badge(115, 107, 2)}</svg>`,
  },
  {
    id: "isla",
    name: "Isla",
    parts: [{ label: "Isla" }],
    pieceShape: "isla",
    defaultDepth: 900,
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 150">${bar(60, 50, 100, 50)}${badge(110, 75, 1)}</svg>`,
  },
  {
    id: "personalizada",
    name: "Personalizada",
    parts: [{ label: "Pieza 1" }],
    pieceShape: "personalizado",
    defaultDepth: 600,
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 150"><rect x="45" y="45" width="130" height="60" rx="3" fill="#efe6d6" stroke="#8a8378" stroke-width="1.5" stroke-dasharray="6 5"/><text x="110" y="80" text-anchor="middle" font-size="12" fill="#8a8378">A tu medida</text></svg>`,
  },
];

export function getWorktopShape(id: string | undefined): WorktopShape | undefined {
  return id ? WORKTOP_SHAPES.find((s) => s.id === id) : undefined;
}
