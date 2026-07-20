/** Preparación de imágenes cargadas por el usuario (validación + saneado). */

const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 12 * 1024 * 1024;
const MAX_DIM = 2000;

export type PrepareResult =
  | { ok: true; dataUrl: string }
  | { ok: false; message: string };

/**
 * Valida formato y tamaño, reescala a un máximo razonable y re-exporta a JPEG.
 * El re-render en canvas elimina metadatos EXIF sensibles (ubicación, etc.).
 */
export function prepareImageFile(file: File): Promise<PrepareResult> {
  return new Promise((resolve) => {
    if (!ACCEPTED.includes(file.type)) {
      resolve({ ok: false, message: "Formato no válido. Use JPG, PNG o WebP." });
      return;
    }
    if (file.size > MAX_BYTES) {
      resolve({ ok: false, message: "La imagen supera 12 MB. Use una más liviana." });
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => resolve({ ok: false, message: "No se pudo leer el archivo." });
    reader.onload = () => {
      const img = new window.Image();
      img.onerror = () => resolve({ ok: false, message: "La imagen no es válida." });
      img.onload = () => {
        const scale = Math.min(1, MAX_DIM / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ ok: false, message: "No se pudo procesar la imagen." });
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({ ok: true, dataUrl: canvas.toDataURL("image/jpeg", 0.9) });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
