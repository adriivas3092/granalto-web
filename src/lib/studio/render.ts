import type { StudioSurface, StudioProduct, Point } from "@/lib/studio/types";
import {
  containRect,
  toCanvas,
  centroid,
  type FitRect,
} from "@/lib/studio/geometry";

export type RenderOptions = {
  base: CanvasImageSource;
  baseW: number;
  baseH: number;
  /** Versión en escala de grises de la base, para reintroducir sombras. */
  grayBase?: CanvasImageSource;
  surfaces: StudioSurface[];
  productById: (id: string) => StudioProduct | undefined;
  textures: Map<string, HTMLImageElement>;
  /** Fracción 0..1 a partir de la cual (eje X) se muestran las texturas. */
  revealFrom?: number;
  /** Dibuja contornos y vértices (modo edición). */
  showOverlay?: boolean;
  selectedId?: string;
  /** Polígono en construcción (puntos normalizados). */
  draft?: Point[];
};

/** Dibuja la escena completa en el contexto dado (pantalla o exportación). */
export function renderScene(
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  opts: RenderOptions,
) {
  const rect = containRect(cw, ch, opts.baseW, opts.baseH);

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(opts.base, rect.x, rect.y, rect.w, rect.h);

  const revealX =
    opts.revealFrom != null ? rect.x + opts.revealFrom * rect.w : null;

  for (const s of opts.surfaces) {
    if (s.hidden || !s.productId || s.points.length < 3) continue;
    const product = opts.productById(s.productId);
    if (!product) continue;
    const tex = opts.textures.get(product.texture);
    if (!tex || !tex.complete || tex.naturalWidth === 0) continue;
    drawSurfaceTexture(ctx, rect, s, tex, revealX, opts.grayBase);
  }

  if (opts.showOverlay) drawOverlay(ctx, rect, opts);
}

function pathPolygon(
  ctx: CanvasRenderingContext2D,
  rect: FitRect,
  points: Point[],
) {
  ctx.beginPath();
  points.forEach((p, i) => {
    const c = toCanvas(p, rect);
    if (i === 0) ctx.moveTo(c.x, c.y);
    else ctx.lineTo(c.x, c.y);
  });
  ctx.closePath();
}

/** Rellena una zona con junta + piezas (patrón recto o desplazado). */
function drawTileGrid(
  ctx: CanvasRenderingContext2D,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  tilePx: number,
  groutPx: number,
  groutColor: string,
  offsetRows: boolean,
  tex: HTMLImageElement,
) {
  if (groutPx > 0) {
    ctx.fillStyle = groutColor;
    ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
  }
  const inset = groutPx / 2;
  const size = tilePx - groutPx;
  if (size <= 0) return;
  let row = 0;
  for (let y = Math.floor(minY / tilePx) * tilePx; y < maxY; y += tilePx, row++) {
    const off = offsetRows && row % 2 ? tilePx / 2 : 0;
    for (let x = Math.floor(minX / tilePx) * tilePx - tilePx; x < maxX + tilePx; x += tilePx) {
      ctx.drawImage(tex, x + off + inset, y + inset, size, size);
    }
  }
}

/** Buffer plano con el mosaico (para deformar en perspectiva). */
function buildTileBuffer(
  tex: HTMLImageElement,
  tilesAcross: number,
  groutRatio: number,
  groutColor: string,
  offsetRows: boolean,
): HTMLCanvasElement {
  const TILE = 96;
  const size = Math.max(2, Math.round(tilesAcross)) * TILE;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) {
    drawTileGrid(ctx, 0, 0, size, size, TILE, groutRatio * TILE, groutColor, offsetRows, tex);
  }
  return c;
}

function bilerp(q: Point[], u: number, v: number): Point {
  const topx = q[0].x + (q[1].x - q[0].x) * u;
  const topy = q[0].y + (q[1].y - q[0].y) * u;
  const botx = q[3].x + (q[2].x - q[3].x) * u;
  const boty = q[3].y + (q[2].y - q[3].y) * u;
  return { x: topx + (botx - topx) * v, y: topy + (boty - topy) * v };
}

/** Dibuja un triángulo del buffer mapeado (afín) al triángulo destino. */
function drawTriangle(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  s: Point[],
  d: Point[],
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(d[0].x, d[0].y);
  ctx.lineTo(d[1].x, d[1].y);
  ctx.lineTo(d[2].x, d[2].y);
  ctx.closePath();
  ctx.clip();
  const denom = (s[1].x - s[0].x) * (s[2].y - s[0].y) - (s[2].x - s[0].x) * (s[1].y - s[0].y);
  if (Math.abs(denom) < 1e-6) {
    ctx.restore();
    return;
  }
  const a = ((d[1].x - d[0].x) * (s[2].y - s[0].y) - (d[2].x - d[0].x) * (s[1].y - s[0].y)) / denom;
  const c = ((d[2].x - d[0].x) * (s[1].x - s[0].x) - (d[1].x - d[0].x) * (s[2].x - s[0].x)) / denom;
  const b = ((d[1].y - d[0].y) * (s[2].y - s[0].y) - (d[2].y - d[0].y) * (s[1].y - s[0].y)) / denom;
  const e = ((d[2].y - d[0].y) * (s[1].x - s[0].x) - (d[1].y - d[0].y) * (s[2].x - s[0].x)) / denom;
  const tx = d[0].x - a * s[0].x - c * s[0].y;
  const ty = d[0].y - b * s[0].x - e * s[0].y;
  // Multiplica sobre la transformación actual (conserva el dpr del canvas).
  ctx.transform(a, b, c, e, tx, ty);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}

function drawSurfaceTexture(
  ctx: CanvasRenderingContext2D,
  rect: FitRect,
  s: StudioSurface,
  tex: HTMLImageElement,
  revealX: number | null,
  grayBase?: CanvasImageSource,
) {
  const t = s.transform;
  const base = Math.max(rect.w, rect.h);
  const usePerspective = t.perspective && s.points.length === 4;

  ctx.save(); // nivel A: recorte
  pathPolygon(ctx, rect, s.points);
  ctx.clip();
  if (revealX != null) {
    ctx.beginPath();
    ctx.rect(revealX, 0, rect.w + rect.x - revealX + 10, 100000);
    ctx.clip();
  }

  ctx.globalAlpha = t.opacity;
  ctx.filter = `brightness(${t.brightness})`;

  if (usePerspective) {
    const quad = s.points.map((p) => toCanvas(p, rect));
    const tilesAcross = Math.min(20, Math.max(3, Math.round(7 / t.scale)));
    const buffer = buildTileBuffer(
      tex,
      tilesAcross,
      t.groutWidth > 0 ? Math.min(0.25, t.groutWidth / 60) : 0,
      t.groutColor,
      t.pattern === "desplazado",
    );
    const sub = 14;
    const bw = buffer.width;
    const bh = buffer.height;
    for (let i = 0; i < sub; i++) {
      for (let j = 0; j < sub; j++) {
        const u0 = i / sub, u1 = (i + 1) / sub, v0 = j / sub, v1 = (j + 1) / sub;
        const d00 = bilerp(quad, u0, v0);
        const d10 = bilerp(quad, u1, v0);
        const d11 = bilerp(quad, u1, v1);
        const d01 = bilerp(quad, u0, v1);
        const s00 = { x: u0 * bw, y: v0 * bh };
        const s10 = { x: u1 * bw, y: v0 * bh };
        const s11 = { x: u1 * bw, y: v1 * bh };
        const s01 = { x: u0 * bw, y: v1 * bh };
        drawTriangle(ctx, buffer, [s00, s10, s11], [d00, d10, d11]);
        drawTriangle(ctx, buffer, [s00, s11, s01], [d00, d11, d01]);
      }
    }
  } else {
    const c = toCanvas(centroid(s.points), rect);
    const mosaico = t.pattern === "mosaico";
    const tilePx = ((base / 6) * t.scale) / (mosaico ? 3 : 1);
    const groutPx = t.groutWidth > 0 ? Math.max(0.5, (t.groutWidth * tilePx) / 60) : 0;
    const extraRot = t.pattern === "diagonal" ? Math.PI / 4 : 0;
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate((t.rotation * Math.PI) / 180 + extraRot);
    const half = base * 1.7;
    drawTileGrid(
      ctx,
      -half,
      -half,
      half,
      half,
      tilePx,
      groutPx,
      t.groutColor,
      t.pattern === "desplazado",
      tex,
    );
    ctx.restore();
  }

  // Restaura alfa/filtro y reintroduce la iluminación real de la foto.
  ctx.filter = "none";
  ctx.globalAlpha = 0.9;
  if (grayBase) {
    ctx.globalCompositeOperation = "soft-light";
    ctx.drawImage(grayBase, rect.x, rect.y, rect.w, rect.h);
    ctx.globalCompositeOperation = "source-over";
  }
  ctx.globalAlpha = 1;

  ctx.restore(); // fin nivel A
}

function drawOverlay(
  ctx: CanvasRenderingContext2D,
  rect: FitRect,
  opts: RenderOptions,
) {
  for (const s of opts.surfaces) {
    if (s.points.length < 2) continue;
    const selected = s.id === opts.selectedId;
    pathPolygon(ctx, rect, s.points);
    ctx.lineWidth = selected ? 2.5 : 1.5;
    ctx.strokeStyle = selected ? "#111111" : "rgba(17,17,17,0.5)";
    ctx.setLineDash(s.hidden ? [6, 5] : []);
    ctx.stroke();
    ctx.setLineDash([]);
    if (selected && !s.locked) {
      s.points.forEach((p) => {
        const c = toCanvas(p, rect);
        ctx.beginPath();
        ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#111111";
        ctx.stroke();
      });
    }
  }

  if (opts.draft && opts.draft.length > 0) {
    ctx.beginPath();
    opts.draft.forEach((p, i) => {
      const c = toCanvas(p, rect);
      if (i === 0) ctx.moveTo(c.x, c.y);
      else ctx.lineTo(c.x, c.y);
    });
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 2;
    ctx.stroke();
    opts.draft.forEach((p) => {
      const c = toCanvas(p, rect);
      ctx.beginPath();
      ctx.arc(c.x, c.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#111111";
      ctx.fill();
    });
  }
}
