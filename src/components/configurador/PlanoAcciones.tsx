"use client";

import { useRef } from "react";
import { Printer, Download, FileImage } from "lucide-react";

/**
 * Muestra el Plano de Taller (SVG) con acciones: imprimir / guardar PDF,
 * descargar SVG y descargar PNG. Recibe el SVG ya generado en el servidor.
 */
export function PlanoAcciones({ svg, folio }: { svg: string; folio?: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const nombre = `plano-${folio || "taller"}`;

  const imprimir = () => {
    const win = window.open("", "_blank", "width=1200,height=850");
    if (!win) return;
    win.document.write(
      `<!doctype html><html><head><title>${nombre}</title>
       <style>@page{size:landscape;margin:8mm;} html,body{margin:0;padding:0;}
       svg{width:100%;height:auto;display:block;}</style></head>
       <body>${svg}</body></html>`,
    );
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 350);
  };

  const descargarSVG = () => {
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nombre}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const descargarPNG = () => {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = 1120 * scale;
      canvas.height = 770 * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => {
        if (!b) return;
        const u = URL.createObjectURL(b);
        const a = document.createElement("a");
        a.href = u;
        a.download = `${nombre}.png`;
        a.click();
        URL.revokeObjectURL(u);
      }, "image/png");
    };
    img.src = url;
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={imprimir}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-sm bg-ink px-4 py-2 text-sm font-medium text-ivory hover:bg-charcoal"
        >
          <Printer className="h-4 w-4" /> Imprimir / Guardar PDF
        </button>
        <button
          type="button"
          onClick={descargarPNG}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-sm border border-stone-beige bg-white px-4 py-2 text-sm text-charcoal hover:border-ink"
        >
          <FileImage className="h-4 w-4" /> Descargar PNG
        </button>
        <button
          type="button"
          onClick={descargarSVG}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-sm border border-stone-beige bg-white px-4 py-2 text-sm text-charcoal hover:border-ink"
        >
          <Download className="h-4 w-4" /> Descargar SVG
        </button>
      </div>
      <div
        ref={boxRef}
        className="overflow-hidden rounded-sm border border-stone-beige bg-white [&_svg]:h-auto [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
