/**
 * "Varita mágica": detección de una superficie por similitud de color
 * (flood fill) desde un punto. Corre en el navegador al instante, sin modelos
 * ni red. Ideal para pisos y paredes de color relativamente uniforme.
 */

const WORK_MAX = 1000;

/** Rellena desde (sx,sy) los píxeles contiguos de color similar. */
function floodFillMask(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  sx: number,
  sy: number,
  tolerancePct: number,
): Uint8Array {
  const mask = new Uint8Array(w * h);
  const seed = (sy * w + sx) * 4;
  const sr = data[seed];
  const sg = data[seed + 1];
  const sb = data[seed + 2];
  // Umbral de distancia de color (0..~120 útil).
  const thr = (tolerancePct / 100) * 120;
  const thr2 = thr * thr;

  const stack: number[] = [sx, sy];
  while (stack.length) {
    const y = stack.pop() as number;
    const x = stack.pop() as number;
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const idx = y * w + x;
    if (mask[idx]) continue;
    const p = idx * 4;
    const dr = data[p] - sr;
    const dg = data[p + 1] - sg;
    const db = data[p + 2] - sb;
    if (dr * dr + dg * dg + db * db > thr2) continue;
    mask[idx] = 1;
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }
  return mask;
}

/**
 * Detecta la superficie bajo el punto normalizado (0..1) usando la varita.
 * Devuelve la máscara y el tamaño de trabajo (para convertir a polígono).
 */
export function detectByColor(
  img: HTMLImageElement,
  nx: number,
  ny: number,
  tolerancePct: number,
): { mask: Uint8Array; width: number; height: number } | null {
  const scale = Math.min(1, WORK_MAX / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  const sx = Math.min(w - 1, Math.max(0, Math.round(nx * w)));
  const sy = Math.min(h - 1, Math.max(0, Math.round(ny * h)));
  const mask = floodFillMask(data, w, h, sx, sy, tolerancePct);
  return { mask, width: w, height: h };
}
