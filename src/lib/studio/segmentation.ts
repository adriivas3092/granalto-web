import type { Point } from "@/lib/studio/types";

/**
 * Segmentación de superficies en el navegador (SAM) con Transformers.js.
 * Todo se carga de forma diferida: el modelo (~pocas decenas de MB) se
 * descarga la primera vez que se usa la herramienta de IA. Si el dispositivo
 * no lo soporta, las funciones lanzan un error y el editor sigue con el modo
 * manual. No requiere backend ni claves.
 */

const MODEL_ID = "Xenova/slimsam-77-uniform";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Loaded = { tf: any; model: any; processor: any };

let loadedPromise: Promise<Loaded> | null = null;
let currentUrl: string | null = null;
let rawImage: any = null;
let embeddings: any = null;

async function load(onProgress?: (p: number) => void): Promise<Loaded> {
  if (!loadedPromise) {
    loadedPromise = (async () => {
      const tf = await import("@huggingface/transformers");
      tf.env.allowLocalModels = false;
      const progress_callback = (data: { status?: string; progress?: number }) => {
        if (onProgress && typeof data.progress === "number") onProgress(data.progress);
      };
      const [model, processor] = await Promise.all([
        tf.SamModel.from_pretrained(MODEL_ID, { dtype: "q8", progress_callback }),
        tf.AutoProcessor.from_pretrained(MODEL_ID),
      ]);
      return { tf, model, processor };
    })();
  }
  return loadedPromise;
}

/** Descarga el modelo y calcula los embeddings de la imagen (una vez). */
export async function prepareImage(
  url: string,
  onProgress?: (p: number) => void,
): Promise<void> {
  const { tf, model, processor } = await load(onProgress);
  if (currentUrl === url && embeddings) return;
  rawImage = await tf.RawImage.read(url);
  const inputs = await processor(rawImage);
  embeddings = await model.get_image_embeddings(inputs);
  currentUrl = url;
}

/** Segmenta la superficie que contiene el punto normalizado (0..1). */
export async function segmentAtPoint(
  nx: number,
  ny: number,
): Promise<{ mask: Uint8Array; width: number; height: number }> {
  const { model, processor } = await load();
  if (!rawImage || !embeddings) throw new Error("Imagen no preparada");
  const w: number = rawImage.width;
  const h: number = rawImage.height;

  const input_points = [[[nx * w, ny * h]]];
  const input_labels = [[1]];
  const inputs = await processor(rawImage, { input_points, input_labels });
  const outputs = await model({ ...inputs, image_embeddings: embeddings });
  const masks = await processor.post_process_masks(
    outputs.pred_masks,
    inputs.original_sizes,
    inputs.reshaped_input_sizes,
  );

  const maskTensor = masks[0]; // [1, nMasks, H, W]
  const scores: Float32Array = outputs.iou_scores.data;
  const dims = maskTensor.dims;
  const mh = dims[dims.length - 2];
  const mw = dims[dims.length - 1];
  const nMasks = scores.length;

  // Elige la máscara con mayor puntuación IoU.
  let best = 0;
  for (let i = 1; i < nMasks; i++) if (scores[i] > scores[best]) best = i;

  const data = maskTensor.data as Uint8Array | Float32Array | boolean[];
  const plane = mh * mw;
  const out = new Uint8Array(plane);
  const offset = best * plane;
  for (let i = 0; i < plane; i++) {
    const v = data[offset + i] as number | boolean;
    out[i] = v ? 1 : 0;
  }
  return { mask: out, width: mw, height: mh };
}

/** Reexporta el conversor a polígono para comodidad del cliente. */
export type { Point };
