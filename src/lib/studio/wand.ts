/**
 * "Varita mágica": detección de una superficie de un solo clic, offline.
 *
 * Estrategia para funcionar en fotos reales:
 *  1) se suaviza la imagen (reduce vetas/texturas que cortarían la selección),
 *  2) el color de referencia se promedia alrededor del clic (no un píxel suelto),
 *  3) se crece por similitud de material atenuando la luminancia (tolera sombras),
 *  4) se rellenan huecos internos (vetas/juntas) y se suaviza el borde.
 */

const WORK_MAX = 1100;
const LUM_WEIGHT = 0.35;

function clamp(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}

/** Desenfoque de caja separable; devuelve RGB en Float32 (w*h*3). */
function boxBlur(data: Uint8ClampedArray, w: number, h: number, r: number): Float32Array {
  const n = w * h;
  const rgb = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    rgb[i * 3] = data[i * 4];
    rgb[i * 3 + 1] = data[i * 4 + 1];
    rgb[i * 3 + 2] = data[i * 4 + 2];
  }
  const tmp = new Float32Array(n * 3);
  const out = new Float32Array(n * 3);
  const win = 2 * r + 1;
  // Horizontal
  for (let y = 0; y < h; y++) {
    for (let c = 0; c < 3; c++) {
      let sum = 0;
      for (let x = -r; x <= r; x++) sum += rgb[(y * w + clamp(x, 0, w - 1)) * 3 + c];
      for (let x = 0; x < w; x++) {
        tmp[(y * w + x) * 3 + c] = sum / win;
        const xIn = clamp(x + r + 1, 0, w - 1);
        const xOut = clamp(x - r, 0, w - 1);
        sum += rgb[(y * w + xIn) * 3 + c] - rgb[(y * w + xOut) * 3 + c];
      }
    }
  }
  // Vertical
  for (let x = 0; x < w; x++) {
    for (let c = 0; c < 3; c++) {
      let sum = 0;
      for (let y = -r; y <= r; y++) sum += tmp[(clamp(y, 0, h - 1) * w + x) * 3 + c];
      for (let y = 0; y < h; y++) {
        out[(y * w + x) * 3 + c] = sum / win;
        const yIn = clamp(y + r + 1, 0, h - 1);
        const yOut = clamp(y - r, 0, h - 1);
        sum += tmp[(yIn * w + x) * 3 + c] - tmp[(yOut * w + x) * 3 + c];
      }
    }
  }
  return out;
}

function colorDist2(
  r: number,
  g: number,
  b: number,
  sr: number,
  sg: number,
  sb: number,
): number {
  const dr = r - sr;
  const dg = g - sg;
  const db = b - sb;
  const lum = dr * 0.299 + dg * 0.587 + db * 0.114;
  const cr = dr - lum;
  const cg = dg - lum;
  const cb = db - lum;
  return cr * cr + cg * cg + cb * cb + LUM_WEIGHT * LUM_WEIGHT * lum * lum;
}

/** Rellena los huecos internos de la máscara (fondo no conectado al borde). */
function fillHoles(mask: Uint8Array, w: number, h: number) {
  const bg = new Uint8Array(w * h);
  const stack: number[] = [];
  const pushBg = (x: number, y: number) => {
    const i = y * w + x;
    if (!mask[i] && !bg[i]) {
      bg[i] = 1;
      stack.push(x, y);
    }
  };
  for (let x = 0; x < w; x++) {
    pushBg(x, 0);
    pushBg(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    pushBg(0, y);
    pushBg(w - 1, y);
  }
  while (stack.length) {
    const y = stack.pop() as number;
    const x = stack.pop() as number;
    if (x > 0) pushBg(x - 1, y);
    if (x < w - 1) pushBg(x + 1, y);
    if (y > 0) pushBg(x, y - 1);
    if (y < h - 1) pushBg(x, y + 1);
  }
  for (let i = 0; i < mask.length; i++) if (!mask[i] && !bg[i]) mask[i] = 1;
}

/** Cierre morfológico ligero (dilatar + erosionar) para suavizar el borde. */
function close(mask: Uint8Array, w: number, h: number) {
  const dil = new Uint8Array(w * h);
  const at = (m: Uint8Array, x: number, y: number) =>
    x >= 0 && y >= 0 && x < w && y < h && m[y * w + x];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      dil[y * w + x] =
        mask[y * w + x] || at(mask, x - 1, y) || at(mask, x + 1, y) || at(mask, x, y - 1) || at(mask, x, y + 1)
          ? 1
          : 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      mask[y * w + x] =
        dil[y * w + x] && at(dil, x - 1, y) && at(dil, x + 1, y) && at(dil, x, y - 1) && at(dil, x, y + 1)
          ? 1
          : 0;
}

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

  const rgb = boxBlur(data, w, h, 2);
  const sx = clamp(Math.round(nx * w), 0, w - 1);
  const sy = clamp(Math.round(ny * h), 0, h - 1);

  // Color de referencia: promedio de una ventana alrededor del clic.
  let sr = 0;
  let sg = 0;
  let sb = 0;
  let cnt = 0;
  const rad = 3;
  for (let dy = -rad; dy <= rad; dy++) {
    for (let dx = -rad; dx <= rad; dx++) {
      const x = clamp(sx + dx, 0, w - 1);
      const y = clamp(sy + dy, 0, h - 1);
      const i = (y * w + x) * 3;
      sr += rgb[i];
      sg += rgb[i + 1];
      sb += rgb[i + 2];
      cnt++;
    }
  }
  sr /= cnt;
  sg /= cnt;
  sb /= cnt;

  const thr = (tolerancePct / 100) * 150 + 10;
  const thr2 = thr * thr;

  const mask = new Uint8Array(w * h);
  const visited = new Uint8Array(w * h);
  const stack: number[] = [sx, sy];
  while (stack.length) {
    const y = stack.pop() as number;
    const x = stack.pop() as number;
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const idx = y * w + x;
    if (visited[idx]) continue;
    visited[idx] = 1;
    const i = idx * 3;
    if (colorDist2(rgb[i], rgb[i + 1], rgb[i + 2], sr, sg, sb) > thr2) continue;
    mask[idx] = 1;
    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }

  fillHoles(mask, w, h);
  close(mask, w, h);

  let count = 0;
  for (let i = 0; i < mask.length; i++) count += mask[i];
  return { mask, width: w, height: h, coverage: count / (w * h) };
}
