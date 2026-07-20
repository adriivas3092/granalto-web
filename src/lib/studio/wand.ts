/**
 * "Varita mágica": detección de una superficie de un solo clic por similitud
 * de material. Corre en el navegador al instante, sin modelos ni red.
 *
 * Clave para que funcione en fotos reales: la comparación de color
 * **atenúa la luminancia** y prioriza el tono (crominancia), de modo que las
 * sombras y luces sobre el mismo piso/pared no cortan la selección.
 */

const WORK_MAX = 1100;
const LUM_WEIGHT = 0.35; // peso de la diferencia de brillo (bajo = tolera sombras)

/** Rellena desde (sx,sy) los píxeles contiguos del mismo material. */
function floodFillMask(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  sx: number,
  sy: number,
  tolerancePct: number,
): Uint8Array {
  const mask = new Uint8Array(w * h);
  const visited = new Uint8Array(w * h);
  const seed = (sy * w + sx) * 4;
  const sr = data[seed];
  const sg = data[seed + 1];
  const sb = data[seed + 2];

  // Umbral: tolerancia 5..80 → distancia perceptual.
  const thr = (tolerancePct / 100) * 150 + 8;
  const thr2 = thr * thr;

  const stack: number[] = [sx, sy];
  while (stack.length) {
    const y = stack.pop() as number;
    const x = stack.pop() as number;
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const idx = y * w + x;
    if (visited[idx]) continue;
    visited[idx] = 1;

    const p = idx * 4;
    const dr = data[p] - sr;
    const dg = data[p + 1] - sg;
    const db = data[p + 2] - sb;
    // Diferencia de luminancia (se atenúa) y crominancia (residual).
    const lum = dr * 0.299 + dg * 0.587 + db * 0.114;
    const cr = dr - lum;
    const cg = dg - lum;
    const cb = db - lum;
    const dist2 = cr * cr + cg * cg + cb * cb + LUM_WEIGHT * LUM_WEIGHT * lum * lum;
    if (dist2 > thr2) continue;

    mask[idx] = 1;
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }
  return mask;
}

/**
 * Detecta la superficie bajo el punto normalizado (0..1).
 * Devuelve la máscara, el tamaño de trabajo y la fracción del área cubierta.
 */
export function detectByColor(
  img: HTMLImageElement,
  nx: number,
  ny: number,
  tolerancePct: number,
): { mask: Uint8Array; width: number; height: number; coverage: number } | null {
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

  let count = 0;
  for (let i = 0; i < mask.length; i++) count += mask[i];
  return { mask, width: w, height: h, coverage: count / (w * h) };
}
