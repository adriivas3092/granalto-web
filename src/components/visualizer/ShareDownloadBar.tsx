"use client";

import { useState } from "react";
import { Download, Share2, Link2, RotateCcw, Check, Loader2 } from "lucide-react";
import { getLighting } from "@/data/visualizer/lighting";
import type { Environment } from "@/data/visualizer/types";
import { useVisualizer } from "@/store/visualizerStore";
import { captureSceneToBlob, downloadBlob } from "@/lib/visualizer/capture";
import { buildShareUrl } from "@/lib/visualizer/serialize";
import { cn } from "@/lib/utils";

export function ShareDownloadBar({
  environment,
  svgProvider,
}: {
  environment: Environment;
  svgProvider: () => SVGSVGElement | null;
}) {
  const lightingId = useVisualizer((s) => s.lightingId);
  const exportConfig = useVisualizer((s) => s.exportConfig);
  const resetEnvironment = useVisualizer((s) => s.resetEnvironment);

  const [busy, setBusy] = useState<null | "download" | "share">(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filter = getLighting(lightingId).filter;

  async function handleDownload() {
    setError(null);
    setBusy("download");
    try {
      const svg = svgProvider();
      if (!svg) throw new Error("Escena no disponible");
      const blob = await captureSceneToBlob(svg, { filter });
      downloadBlob(blob, `granalto-${environment.id}.png`);
    } catch {
      setError("No se pudo generar la imagen.");
    } finally {
      setBusy(null);
    }
  }

  async function handleCopy() {
    setError(null);
    try {
      await navigator.clipboard.writeText(buildShareUrl(exportConfig()));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("No se pudo copiar el enlace.");
    }
  }

  async function handleShare() {
    setError(null);
    const url = buildShareUrl(exportConfig());
    setBusy("share");
    try {
      const svg = svgProvider();
      const blob = svg ? await captureSceneToBlob(svg, { filter }).catch(() => null) : null;
      const file = blob ? new File([blob], `granalto-${environment.id}.png`, { type: "image/png" }) : null;
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.share && file && nav.canShare?.({ files: [file] })) {
        await nav.share({ title: "Granalto — Mi ambiente", text: environment.name, url, files: [file] });
      } else if (nav.share) {
        await nav.share({ title: "Granalto — Mi ambiente", text: environment.name, url });
      } else {
        await handleCopy();
      }
    } catch {
      /* usuario canceló o no soportado: sin error visible */
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button onClick={handleDownload} disabled={busy === "download"} className={btn}>
        {busy === "download" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Descargar
      </button>
      <button onClick={handleCopy} className={btn}>
        {copied ? <Check className="h-4 w-4 text-green-700" /> : <Link2 className="h-4 w-4" />}
        {copied ? "Copiado" : "Copiar enlace"}
      </button>
      <button onClick={handleShare} disabled={busy === "share"} className={btn}>
        {busy === "share" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
        Compartir
      </button>
      <button
        onClick={resetEnvironment}
        className={cn(btn, "text-mineral")}
        aria-label="Restablecer al estado original"
      >
        <RotateCcw className="h-4 w-4" /> Restablecer
      </button>
      {error && <span role="alert" className="w-full text-xs text-[#a03826]">{error}</span>}
    </div>
  );
}

const btn =
  "inline-flex min-h-[40px] items-center gap-1.5 rounded-sm border border-stone-beige bg-white px-3 py-2 text-xs font-medium text-charcoal transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60";
