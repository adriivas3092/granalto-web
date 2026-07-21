import type { MeasureUnit, ProjectPiece } from "@/types/quote";
import { DEFAULT_WASTE_PERCENTAGE, MINIMUM_BILLABLE_AREA } from "@/data/quote-config";
import type { AreaResult } from "./types";

/** Convierte una longitud a metros según su unidad. */
export function toMeters(value: number, unit: MeasureUnit): number {
  switch (unit) {
    case "mm":
      return value / 1000;
    case "cm":
      return value / 100;
    case "m":
    default:
      return value;
  }
}

/** Área neta (m²) de una pieza: largo × ancho × cantidad. */
export function pieceArea(piece: ProjectPiece): number {
  const l = toMeters(piece.length, piece.unit);
  const w = toMeters(piece.width, piece.unit);
  const area = l * w * piece.quantity;
  return Number.isFinite(area) && area > 0 ? area : 0;
}

/**
 * Área acumulada y facturable a partir de las piezas.
 * billable = neta × (1 + desperdicio%) con un mínimo facturable.
 */
export function calculateArea(pieces: ProjectPiece[], wastePercentage = DEFAULT_WASTE_PERCENTAGE): AreaResult {
  const netArea = pieces.reduce((sum, p) => sum + pieceArea(p), 0);
  const withWaste = netArea * (1 + wastePercentage / 100);
  const billableArea = netArea > 0 ? Math.max(withWaste, MINIMUM_BILLABLE_AREA) : 0;
  return { netArea: round2(netArea), billableArea: round2(billableArea) };
}

/** Perímetro total aproximado (m) — útil para estimar metros lineales de canto. */
export function estimatePerimeter(pieces: ProjectPiece[]): number {
  return round2(
    pieces.reduce((sum, p) => {
      const l = toMeters(p.length, p.unit);
      const w = toMeters(p.width, p.unit);
      return sum + 2 * (l + w) * p.quantity;
    }, 0),
  );
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
