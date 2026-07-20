"use client";

import { useEffect, useRef, useState } from "react";
import { getStudioProducts } from "@/data/studioProducts";

/**
 * Carga la imagen base (y una versión en gris para conservar sombras) y
 * precarga las texturas del catálogo. Devuelve un contador `version` que
 * cambia al terminar de cargar, para forzar el redibujo del lienzo.
 */
export function useSceneImages(baseSrc: string | null) {
  const [baseImg, setBaseImg] = useState<HTMLImageElement | null>(null);
  const [grayBase, setGrayBase] = useState<HTMLCanvasElement | null>(null);
  const [version, setVersion] = useState(0);
  const textures = useRef(new Map<string, HTMLImageElement>());

  // Precarga de texturas (una sola vez).
  useEffect(() => {
    getStudioProducts().forEach((p) => {
      if (!textures.current.has(p.texture)) {
        const im = new window.Image();
        im.onload = () => setVersion((v) => v + 1);
        im.src = p.texture;
        textures.current.set(p.texture, im);
      }
    });
  }, []);

  // Imagen base + versión en gris.
  useEffect(() => {
    if (!baseSrc) {
      setBaseImg(null);
      setGrayBase(null);
      return;
    }
    const im = new window.Image();
    im.crossOrigin = "anonymous";
    im.onload = () => {
      setBaseImg(im);
      const c = document.createElement("canvas");
      c.width = im.naturalWidth;
      c.height = im.naturalHeight;
      const g = c.getContext("2d");
      if (g) {
        g.filter = "grayscale(1) contrast(1.05) brightness(1.08)";
        g.drawImage(im, 0, 0);
      }
      setGrayBase(c);
      setVersion((v) => v + 1);
    };
    im.src = baseSrc;
  }, [baseSrc]);

  return { baseImg, grayBase, textures: textures.current, version };
}
