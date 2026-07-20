import type { StudioSurface, StudioProduct } from "@/lib/studio/types";
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
  draft?: { x: number; y: number }[];
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
  points: { x: number; y: number }[],
) {
  ctx.beginPath();
  points.forEach((p, i) => {
    const c = toCanvas(p, rect);
    if (i === 0) ctx.moveTo(c.x, c.y);
    else ctx.lineTo(c.x, c.y);
  });
  ctx.closePath();
}

function drawSurfaceTexture(
  ctx: CanvasRenderingContext2D,
  rect: FitRect,
  s: StudioSurface,
  tex: HTMLImageElement,
  revealX: number | null,
  grayBase?: CanvasImageSource,
) {
  ctx.save(); // nivel A: mantiene el recorte

  // Recorte al polígono (y a la mitad "después" si hay comparación).
  pathPolygon(ctx, rect, s.points);
  ctx.clip();
  if (revealX != null) {
    ctx.beginPath();
    ctx.rect(revealX, 0, rect.w + rect.x - revealX + 10, 100000);
    ctx.clip();
  }

  const c = toCanvas(centroid(s.points), rect);
  const base = Math.max(rect.w, rect.h);
  const tile = (base / 6) * s.transform.scale; // "formato" del mosaico
  const pattern = ctx.createPattern(tex, "repeat");
  const drawScale = tile / tex.naturalWidth;

  // Capa de textura con rotación/escala alrededor del centro del polígono.
  ctx.save(); // nivel B: transformación local
  ctx.globalAlpha = s.transform.opacity;
  ctx.filter = `brightness(${s.transform.brightness})`;
  ctx.translate(c.x, c.y);
  ctx.rotate((s.transform.rotation * Math.PI) / 180);
  ctx.scale(drawScale, drawScale);
  if (pattern) {
    ctx.fillStyle = pattern;
    const big = (base * 3) / drawScale;
    ctx.fillRect(-big / 2, -big / 2, big, big);
  }
  ctx.restore(); // vuelve al nivel A (recorte intacto)

  // Conservar iluminación/sombras reales de la foto sobre la textura.
  if (grayBase) {
    ctx.globalCompositeOperation = "soft-light";
    ctx.globalAlpha = 0.9;
    ctx.drawImage(grayBase, rect.x, rect.y, rect.w, rect.h);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }

  ctx.restore(); // fin nivel A: elimina el recorte
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
    if (selected) {
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
