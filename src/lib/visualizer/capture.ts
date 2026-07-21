/**
 * Rasteriza la escena SVG del visualizador a PNG.
 * Un SVG cargado como <img> no puede resolver recursos externos, así que las
 * texturas (archivos SVG en /public) se incrustan como data URI justo antes de
 * rasterizar. No hay base64 en el código fuente: la conversión es en runtime.
 */

const cache = new Map<string, string>();

async function inlineHrefs(svg: SVGSVGElement): Promise<SVGSVGElement> {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const nodes = Array.from(clone.querySelectorAll("image"));
  await Promise.all(
    nodes.map(async (node) => {
      const href = node.getAttribute("href") || node.getAttribute("xlink:href");
      if (!href || href.startsWith("data:")) return;
      try {
        let dataUri = cache.get(href);
        if (!dataUri) {
          const res = await fetch(href);
          const text = await res.text();
          dataUri = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(text)))}`;
          cache.set(href, dataUri);
        }
        node.setAttribute("href", dataUri);
        node.removeAttribute("xlink:href");
      } catch {
        /* deja el href original; puede fallar silenciosamente */
      }
    }),
  );
  return clone;
}

export type CaptureOptions = { width?: number; filter?: string; background?: string };

export async function captureSceneToBlob(
  svg: SVGSVGElement,
  { width = 1600, filter, background = "#ffffff" }: CaptureOptions = {},
): Promise<Blob> {
  const vb = svg.viewBox.baseVal;
  const ratio = vb && vb.width ? vb.height / vb.width : 800 / 1200;
  const w = width;
  const h = Math.round(width * ratio);

  const clone = await inlineHrefs(svg);
  clone.setAttribute("width", String(w));
  clone.setAttribute("height", String(h));

  const serialized = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas no disponible");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);
    if (filter) ctx.filter = filter;
    ctx.drawImage(img, 0, 0, w, h);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se pudo generar la imagen"))), "image/png", 0.92),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo cargar la escena"));
    img.src = src;
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
