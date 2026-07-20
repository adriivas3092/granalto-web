import type { Point } from "@/lib/studio/types";

/** Rectángulo donde se dibuja la imagen (fit "contain") dentro del canvas. */
export type FitRect = { x: number; y: number; w: number; h: number };

export function containRect(
  cw: number,
  ch: number,
  iw: number,
  ih: number,
): FitRect {
  const scale = Math.min(cw / iw, ch / ih);
  const w = iw * scale;
  const h = ih * scale;
  return { x: (cw - w) / 2, y: (ch - h) / 2, w, h };
}

/** Convierte un punto normalizado (0..1) a coordenadas del canvas. */
export function toCanvas(p: Point, rect: FitRect): Point {
  return { x: rect.x + p.x * rect.w, y: rect.y + p.y * rect.h };
}

/** Convierte coordenadas del canvas a punto normalizado (0..1), recortado. */
export function toNormalized(x: number, y: number, rect: FitRect): Point {
  return {
    x: Math.min(1, Math.max(0, (x - rect.x) / rect.w)),
    y: Math.min(1, Math.max(0, (y - rect.y) / rect.h)),
  };
}

export function centroid(points: Point[]): Point {
  const n = points.length || 1;
  return {
    x: points.reduce((s, p) => s + p.x, 0) / n,
    y: points.reduce((s, p) => s + p.y, 0) / n,
  };
}

export function pointInPolygon(p: Point, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x,
      yi = poly[i].y,
      xj = poly[j].x,
      yj = poly[j].y;
    const intersect =
      yi > p.y !== yj > p.y &&
      p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Índice del vértice más cercano dentro de un radio (en px de canvas). */
export function nearestVertex(
  x: number,
  y: number,
  poly: Point[],
  rect: FitRect,
  radius = 12,
): number {
  let best = -1;
  let bestD = radius * radius;
  poly.forEach((p, i) => {
    const c = toCanvas(p, rect);
    const d = (c.x - x) ** 2 + (c.y - y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  });
  return best;
}
