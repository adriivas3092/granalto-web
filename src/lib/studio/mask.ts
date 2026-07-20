import type { Point } from "@/lib/studio/types";

/**
 * Convierte una máscara binaria (de la segmentación) en un polígono editable
 * y normalizado (0..1): traza el contorno (Moore-neighbor) del área y lo
 * simplifica (Ramer–Douglas–Peucker) a pocos puntos manejables.
 */
export function maskToPolygon(
  mask: Uint8Array,
  w: number,
  h: number,
): Point[] {
  const at = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < w && y < h && mask[y * w + x] > 0;

  // Punto de inicio: primer píxel del área (arriba-izquierda).
  let sx = -1;
  let sy = -1;
  for (let y = 0; y < h && sy < 0; y++) {
    for (let x = 0; x < w; x++) {
      if (at(x, y)) {
        sx = x;
        sy = y;
        break;
      }
    }
  }
  if (sx < 0) return [];

  const dirs = [
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
  ];
  const contour: Point[] = [];
  let cx = sx;
  let cy = sy;
  let b = 6;
  const maxSteps = w * h;
  let steps = 0;
  do {
    let found = false;
    for (let i = 0; i < 8; i++) {
      const dir = (b + i) % 8;
      const nx = cx + dirs[dir][0];
      const ny = cy + dirs[dir][1];
      if (at(nx, ny)) {
        contour.push({ x: cx, y: cy });
        b = (dir + 5) % 8;
        cx = nx;
        cy = ny;
        found = true;
        break;
      }
    }
    if (!found) break;
    steps++;
  } while ((cx !== sx || cy !== sy) && steps < maxSteps);

  if (contour.length < 3) return [];

  const tolerance = Math.max(1.5, Math.min(w, h) * 0.006);
  let simplified = rdp(contour, tolerance);
  // Limita a un número manejable de vértices.
  if (simplified.length > 60) {
    const step = Math.ceil(simplified.length / 60);
    simplified = simplified.filter((_, i) => i % step === 0);
  }
  if (simplified.length < 3) return [];

  return simplified.map((p) => ({ x: p.x / w, y: p.y / h }));
}

function rdp(points: Point[], epsilon: number): Point[] {
  if (points.length < 3) return points;
  let dmax = 0;
  let index = 0;
  const end = points.length - 1;
  for (let i = 1; i < end; i++) {
    const d = perpendicularDistance(points[i], points[0], points[end]);
    if (d > dmax) {
      dmax = d;
      index = i;
    }
  }
  if (dmax > epsilon) {
    const left = rdp(points.slice(0, index + 1), epsilon);
    const right = rdp(points.slice(index), epsilon);
    return [...left.slice(0, -1), ...right];
  }
  return [points[0], points[end]];
}

function perpendicularDistance(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  return Math.abs((p.x - a.x) * dy - (p.y - a.y) * dx) / len;
}
