"use client";

import { useCallback, useEffect, useRef } from "react";
import type { StudioSurface, StudioProduct, Point } from "@/lib/studio/types";
import { renderScene } from "@/lib/studio/render";
import {
  containRect,
  toNormalized,
  nearestVertex,
  pointInPolygon,
} from "@/lib/studio/geometry";

type Props = {
  baseImg: HTMLImageElement | null;
  grayBase: HTMLCanvasElement | null;
  textures: Map<string, HTMLImageElement>;
  /** Cambia cuando cargan imágenes/texturas para forzar redibujo. */
  version: number;
  surfaces: StudioSurface[];
  productById: (id: string) => StudioProduct | undefined;
  selectedId?: string;
  tool: "draw" | "select";
  draft: Point[];
  compareX: number | null;
  onAddPoint: (p: Point) => void;
  onVertexDrag: (surfaceId: string, index: number, p: Point) => void;
  onSelectSurface: (id: string) => void;
};

export function CanvasStage(props: Props) {
  const {
    baseImg,
    grayBase,
    textures,
    version,
    surfaces,
    productById,
    selectedId,
    tool,
    draft,
    compareX,
    onAddPoint,
    onVertexDrag,
    onSelectSurface,
  } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ surfaceId: string; index: number } | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap || !baseImg) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = wrap.clientWidth;
    const cssH = wrap.clientHeight;
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderScene(ctx, cssW, cssH, {
      base: baseImg,
      baseW: baseImg.naturalWidth,
      baseH: baseImg.naturalHeight,
      grayBase: grayBase ?? undefined,
      surfaces,
      productById,
      textures,
      revealFrom: compareX ?? undefined,
      showOverlay: true,
      selectedId,
      draft,
    });
  }, [
    baseImg,
    grayBase,
    surfaces,
    productById,
    textures,
    compareX,
    selectedId,
    draft,
  ]);

  // `version` cambia al cargar imágenes/texturas: fuerza un redibujo.
  useEffect(() => {
    draw();
  }, [draw, version]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [draw]);

  const rectNow = () => {
    const wrap = wrapRef.current!;
    return containRect(
      wrap.clientWidth,
      wrap.clientHeight,
      baseImg!.naturalWidth,
      baseImg!.naturalHeight,
    );
  };

  const localXY = (e: React.PointerEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!baseImg) return;
    const { x, y } = localXY(e);
    const rect = rectNow();

    if (tool === "draw") {
      onAddPoint(toNormalized(x, y, rect));
      return;
    }
    // select: primero intentar arrastrar un vértice de la superficie activa
    const active = surfaces.find((s) => s.id === selectedId);
    if (active) {
      const vi = nearestVertex(x, y, active.points, rect);
      if (vi >= 0) {
        dragRef.current = { surfaceId: active.id, index: vi };
        canvasRef.current?.setPointerCapture(e.pointerId);
        return;
      }
    }
    // si no, seleccionar la superficie bajo el cursor (de arriba hacia abajo)
    const np = toNormalized(x, y, rect);
    for (let i = surfaces.length - 1; i >= 0; i--) {
      if (surfaces[i].points.length >= 3 && pointInPolygon(np, surfaces[i].points)) {
        onSelectSurface(surfaces[i].id);
        return;
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || !baseImg) return;
    const { x, y } = localXY(e);
    onVertexDrag(drag.surfaceId, drag.index, toNormalized(x, y, rectNow()));
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  return (
    <div
      ref={wrapRef}
      className="relative h-full w-full"
      style={{ touchAction: "none" }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={tool === "draw" ? "cursor-crosshair" : "cursor-pointer"}
        aria-label="Lienzo del configurador"
      />
    </div>
  );
}
