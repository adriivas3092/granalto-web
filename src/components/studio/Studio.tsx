"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Upload,
  ImageIcon,
  Undo2,
  Redo2,
  Download,
  Save,
  RotateCcw,
  SplitSquareHorizontal,
  Eye,
  Trash2,
  History,
  Sparkles,
  Loader2,
  Wand2,
} from "lucide-react";
import type { Point } from "@/lib/studio/types";
import { getStudioRooms } from "@/data/studioRooms";
import { getStudioProducts, getStudioProductById } from "@/data/studioProducts";
import { renderScene } from "@/lib/studio/render";
import { prepareImageFile } from "@/lib/studio/upload";
import { maskToPolygon } from "@/lib/studio/mask";
import { prepareImage, segmentAtPoint } from "@/lib/studio/segmentation";
import { detectByColor } from "@/lib/studio/wand";
import { useStudioStore } from "@/store/studioStore";
import { useStudioPersistence } from "@/hooks/useStudioPersistence";
import { useSceneImages } from "@/hooks/useSceneImages";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { CanvasStage } from "@/components/studio/CanvasStage";
import { ProductCatalog } from "@/components/studio/ProductCatalog";
import { SurfacePanel } from "@/components/studio/SurfacePanel";

const rooms = getStudioRooms();
const products = getStudioProducts();
const productById = (id: string) => getStudioProductById(id);

export function Studio() {
  // Estado global (Zustand)
  const screen = useStudioStore((s) => s.screen);
  const baseSrc = useStudioStore((s) => s.baseSrc);
  const name = useStudioStore((s) => s.name);
  const surfaces = useStudioStore((s) => s.surfaces);
  const selectedId = useStudioStore((s) => s.selectedId);
  const tool = useStudioStore((s) => s.tool);
  const draft = useStudioStore((s) => s.draft);
  const compare = useStudioStore((s) => s.compare);
  const canUndo = useStudioStore((s) => s.history.past.length > 0);
  const canRedo = useStudioStore((s) => s.history.future.length > 0);
  const a = useStudioStore(); // acciones (referencias estables)

  const { baseImg, grayBase, textures, version } = useSceneImages(baseSrc);
  const { projects, recoverable, setRecoverable, saveNamed, remove, clearDraft } =
    useStudioPersistence();

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ai, setAi] = useState<{
    phase: "idle" | "loading" | "ready" | "working" | "error";
    message?: string;
  }>({ phase: "idle" });
  const [wandTol, setWandTol] = useState(30);
  const [detectMsg, setDetectMsg] = useState<string | null>(null);

  const enableWand = () => {
    a.setTool("wand");
    setDetectMsg(
      "Toque una superficie (piso, pared). Ajuste la tolerancia si toma de más o de menos.",
    );
  };

  const onWandPoint = (p: Point) => {
    if (!baseImg) return;
    const res = detectByColor(baseImg, p.x, p.y, wandTol);
    if (!res) return;
    const poly = maskToPolygon(res.mask, res.width, res.height);
    if (poly.length < 3) {
      setDetectMsg("No se detectó una superficie. Suba la tolerancia o toque otra zona.");
      return;
    }
    a.addSurfaceFromPoints(poly, "Superficie");
    setDetectMsg("Superficie detectada. Elija un material del catálogo.");
  };

  const enableAi = async () => {
    a.setTool("ai");
    if (!baseSrc) return;
    if (ai.phase === "ready") return;
    setAi({ phase: "loading", message: "Cargando IA (primera vez, puede tardar)…" });
    try {
      await prepareImage(baseSrc, () => {});
      setAi({ phase: "ready", message: "Toque una superficie (piso, pared…) para detectarla." });
    } catch {
      setAi({
        phase: "error",
        message: "No se pudo cargar el modelo de IA en este dispositivo. Use el modo manual.",
      });
    }
  };

  const onAiPoint = async (p: Point) => {
    if (!baseSrc || ai.phase === "working" || ai.phase === "loading") return;
    setAi({ phase: "working", message: "Detectando superficie…" });
    try {
      await prepareImage(baseSrc, () => {});
      const { mask, width, height } = await segmentAtPoint(p.x, p.y);
      const poly = maskToPolygon(mask, width, height);
      if (poly.length < 3) {
        setAi({ phase: "ready", message: "No se detectó una superficie clara. Pruebe otro punto." });
        return;
      }
      a.addSurfaceFromPoints(poly, "Superficie IA");
      setAi({ phase: "ready", message: "Superficie detectada. Elija un material del catálogo." });
    } catch {
      setAi({ phase: "error", message: "Falló la detección. Intente de nuevo o use el modo manual." });
    }
  };

  const onFile = async (file: File) => {
    setBusy(true);
    setUploadError(null);
    const res = await prepareImageFile(file);
    setBusy(false);
    if (!res.ok) {
      setUploadError(res.message);
      return;
    }
    a.openRoom(res.dataUrl, undefined, "Mi espacio");
    trackEvent({ name: "material_view", params: { materialSlug: "foto-propia" } });
  };

  const download = () => {
    if (!baseImg) return;
    const c = document.createElement("canvas");
    c.width = baseImg.naturalWidth;
    c.height = baseImg.naturalHeight;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    renderScene(ctx, c.width, c.height, {
      base: baseImg,
      baseW: baseImg.naturalWidth,
      baseH: baseImg.naturalHeight,
      grayBase: grayBase ?? undefined,
      surfaces,
      productById,
      textures,
      showOverlay: false,
    });
    const link = document.createElement("a");
    link.href = c.toDataURL("image/jpeg", 0.92);
    link.download = `${name || "diseno"}.jpg`;
    link.click();
    trackEvent({ name: "catalog_download", params: { catalogId: "studio-export" } });
  };

  const revealFrom =
    compare.mode === "split" ? compare.x : compare.mode === "original" ? 1 : undefined;
  const productNameFor = (id?: string) => (id ? productById(id)?.name : undefined);
  const activeProductId = surfaces.find((s) => s.id === selectedId)?.productId;

  /* ---------- Pantalla de inicio ---------- */
  if (screen === "start") {
    return (
      <div className="space-y-12">
        {recoverable && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-ink/30 bg-ink/5 p-4">
            <p className="flex items-center gap-2 text-sm text-charcoal">
              <History aria-hidden="true" className="h-4 w-4" />
              Tiene un proyecto sin terminar (“{recoverable.name}”). ¿Desea continuarlo?
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  a.openProject(recoverable);
                  setRecoverable(null);
                }}
                className="rounded-sm bg-ink px-4 py-2 text-sm font-medium text-ivory"
              >
                Continuar
              </button>
              <button
                type="button"
                onClick={() => void clearDraft()}
                className="rounded-sm border border-stone-beige px-4 py-2 text-sm text-charcoal"
              >
                Descartar
              </button>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-sm border border-stone-beige bg-white p-6">
            <ImageIcon aria-hidden="true" className="h-7 w-7 text-mineral" />
            <h3 className="mt-3 font-sans text-xl font-bold text-ink">
              Explorar un ambiente
            </h3>
            <p className="mt-1 text-sm text-charcoal/80">
              Elija un espacio de demostración y aplíquele materiales.
            </p>
          </div>
          <UploadCard onFile={onFile} busy={busy} error={uploadError} />
        </div>

        <div>
          <h3 className="mb-4 font-sans text-xl font-bold text-ink">Ambientes</h3>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => a.openRoom(r.image, r.id, r.name)}
                  className="group block w-full text-left"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-sm bg-stone-beige">
                    <Image
                      src={r.image}
                      alt={r.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span className="mt-2 block text-sm font-medium text-ink">{r.name}</span>
                  <span className="block text-xs text-mineral">
                    {r.style} · {r.surfacesCount} superficies
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {projects.length > 0 && (
          <div>
            <h3 className="mb-4 font-sans text-xl font-bold text-ink">Mis proyectos</h3>
            <ul className="flex flex-wrap gap-3">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-2 rounded-sm border border-stone-beige bg-white px-3 py-2"
                >
                  <button
                    type="button"
                    onClick={() => a.openProject(p)}
                    className="text-sm text-ink"
                  >
                    {p.name}
                    <span className="ml-2 text-xs text-mineral">{p.surfaces.length} sup.</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(p.id)}
                    aria-label={`Borrar ${p.name}`}
                    className="text-mineral hover:text-[#a03826]"
                  >
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  /* ---------- Editor ---------- */
  return (
    <div className="rounded-sm border border-stone-beige bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-beige p-3">
        <button
          type="button"
          onClick={() => a.setScreen("start")}
          className="rounded-sm border border-stone-beige px-3 py-1.5 text-sm text-charcoal hover:border-mineral"
        >
          ← Ambientes
        </button>
        <button
          type="button"
          onClick={enableWand}
          aria-pressed={tool === "wand"}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-sm border px-3 py-1.5 text-sm font-medium transition-colors",
            tool === "wand"
              ? "border-ink bg-ink text-ivory"
              : "border-ink text-ink hover:bg-ink hover:text-ivory",
          )}
        >
          <Wand2 aria-hidden="true" className="h-4 w-4" />
          Detectar superficie
        </button>
        <button
          type="button"
          onClick={enableAi}
          aria-pressed={tool === "ai"}
          title="Detección con IA (experimental; requiere descargar un modelo)"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-sm transition-colors",
            tool === "ai"
              ? "border-ink bg-ink text-ivory"
              : "border-stone-beige text-charcoal hover:border-ink",
          )}
        >
          {ai.phase === "loading" || ai.phase === "working" ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles aria-hidden="true" className="h-4 w-4" />
          )}
          IA (beta)
        </button>
        <input
          aria-label="Nombre del proyecto"
          value={name}
          onChange={(e) => a.setName(e.target.value)}
          className="min-w-0 flex-1 rounded-sm border border-transparent px-2 py-1.5 text-sm font-medium text-ink hover:border-stone-beige focus:border-ink focus:outline-none"
        />
        <div className="flex items-center gap-1">
          <IconBtn label="Deshacer" onClick={a.undo} disabled={!canUndo}>
            <Undo2 aria-hidden="true" className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Rehacer" onClick={a.redo} disabled={!canRedo}>
            <Redo2 aria-hidden="true" className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            label="Ver original"
            active={compare.mode === "original"}
            onClick={() => a.setCompareMode(compare.mode === "original" ? "off" : "original")}
          >
            <Eye aria-hidden="true" className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            label="Antes y después"
            active={compare.mode === "split"}
            onClick={() => a.setCompareMode(compare.mode === "split" ? "off" : "split")}
          >
            <SplitSquareHorizontal aria-hidden="true" className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Guardar proyecto" onClick={() => void saveNamed()}>
            <Save aria-hidden="true" className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Descargar imagen" onClick={download}>
            <Download aria-hidden="true" className="h-4 w-4" />
          </IconBtn>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr_300px]">
        <div className="order-2 border-t border-stone-beige p-4 lg:order-1 lg:border-r lg:border-t-0">
          <SurfacePanel
            surfaces={surfaces}
            selectedId={selectedId}
            tool={tool}
            draftLength={draft.length}
            productNameFor={(s) => productNameFor(s.productId)}
            onNewSurface={a.newSurface}
            onCloseDraft={a.closeDraft}
            onCancelDraft={a.cancelDraft}
            onSelect={a.selectSurface}
            onDelete={a.deleteSurface}
            onRename={a.renameSurface}
            onToggleHidden={a.toggleHidden}
            onToggleLocked={a.toggleLocked}
            onChangeTransform={a.setTransform}
          />
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/3] w-full bg-ink/5">
            {baseImg ? (
              <CanvasStage
                baseImg={baseImg}
                grayBase={grayBase}
                textures={textures}
                version={version}
                surfaces={surfaces}
                productById={productById}
                selectedId={selectedId}
                tool={tool}
                draft={draft}
                compareX={revealFrom ?? null}
                onAddPoint={a.addPoint}
                onAiPoint={onAiPoint}
                onWandPoint={onWandPoint}
                onVertexDrag={a.vertexDrag}
                onSelectSurface={a.selectSurface}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-mineral">
                Cargando imagen…
              </div>
            )}
            {(() => {
              const msg =
                tool === "wand"
                  ? detectMsg
                  : tool === "ai" ||
                      ai.phase === "loading" ||
                      ai.phase === "working" ||
                      ai.phase === "error"
                    ? ai.message
                    : null;
              if (!msg) return null;
              return (
                <div
                  role="status"
                  className="pointer-events-none absolute inset-x-3 top-3 flex items-center gap-2 rounded-sm bg-ink/85 px-3 py-2 text-xs text-ivory"
                >
                  {(ai.phase === "loading" || ai.phase === "working") && (
                    <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
                  )}
                  {msg}
                </div>
              );
            })()}
          </div>
          {tool === "wand" && (
            <div className="border-t border-stone-beige p-3">
              <label className="flex items-center gap-3 text-xs text-charcoal">
                Tolerancia
                <input
                  type="range"
                  min={5}
                  max={80}
                  step={1}
                  value={wandTol}
                  onChange={(e) => setWandTol(parseInt(e.target.value, 10))}
                  className="flex-1 accent-ink"
                  aria-label="Tolerancia de la varita mágica"
                />
                <span className="w-8 text-right text-mineral">{wandTol}</span>
              </label>
            </div>
          )}
          {compare.mode === "split" && (
            <div className="border-t border-stone-beige p-3">
              <label className="flex items-center gap-3 text-xs text-charcoal">
                Antes
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={compare.x}
                  onChange={(e) => a.setCompareX(parseFloat(e.target.value))}
                  className="flex-1 accent-ink"
                  aria-label="Control antes y después"
                />
                Después
              </label>
            </div>
          )}
          <p className="border-t border-stone-beige px-3 py-2 text-xs text-mineral">
            {tool === "draw"
              ? "Marque el contorno tocando la imagen."
              : "Seleccione o cree una superficie y aplique un material. Arrastre los puntos para ajustar."}
          </p>
        </div>

        <div className="order-3 border-t border-stone-beige lg:border-l lg:border-t-0">
          <ProductCatalog
            products={products}
            activeProductId={activeProductId}
            disabled={!selectedId}
            onApply={(p) => a.applyProduct(p.id)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-beige p-3">
        <button
          type="button"
          onClick={a.resetSurfaces}
          className="inline-flex items-center gap-1.5 text-xs text-charcoal/70 hover:text-ink"
        >
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
          Reiniciar superficies
        </button>
        <span className="text-xs text-mineral">
          Autoguardado activo · vista referencial (simulación)
        </span>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-sm border transition-colors disabled:opacity-30",
        active
          ? "border-ink bg-ink text-ivory"
          : "border-stone-beige text-charcoal hover:border-ink",
      )}
    >
      {children}
    </button>
  );
}

function UploadCard({
  onFile,
  busy,
  error,
}: {
  onFile: (file: File) => void;
  busy: boolean;
  error: string | null;
}) {
  const [over, setOver] = useState(false);
  const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      className={cn(
        "flex flex-col items-start rounded-sm border-2 border-dashed p-6 transition-colors",
        over ? "border-ink bg-ink/5" : "border-stone-beige bg-white",
      )}
    >
      <Upload aria-hidden="true" className="h-7 w-7 text-mineral" />
      <h3 className="mt-3 font-sans text-xl font-bold text-ink">Cargar mi fotografía</h3>
      <p className="mt-1 text-sm text-charcoal/80">
        Arrastre una imagen aquí o selecciónela. JPG, PNG o WebP, hasta 12 MB.
      </p>
      <button
        type="button"
        onClick={() => inputEl?.click()}
        disabled={busy}
        className="mt-4 inline-flex min-h-[44px] items-center rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal disabled:opacity-50"
      >
        {busy ? "Procesando…" : "Seleccionar imagen"}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-[#a03826]">
          {error}
        </p>
      )}
      <input
        ref={setInputEl}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
