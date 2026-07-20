"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import type {
  StudioSurface,
  StudioProduct,
  StudioProject,
  SurfaceTransform,
  Point,
} from "@/lib/studio/types";
import { defaultTransform } from "@/lib/studio/types";
import { getStudioRooms } from "@/data/studioRooms";
import { getStudioProducts, getStudioProductById } from "@/data/studioProducts";
import { renderScene } from "@/lib/studio/render";
import { loadProjects, saveProject } from "@/lib/studio/storage";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { CanvasStage } from "@/components/studio/CanvasStage";
import { ProductCatalog } from "@/components/studio/ProductCatalog";
import { SurfacePanel } from "@/components/studio/SurfacePanel";

const MAX_DIM = 2000;
const rooms = getStudioRooms();
const products = getStudioProducts();
const productById = (id: string) => getStudioProductById(id);

type CompareMode = "off" | "split" | "original";

export function Studio() {
  const [screen, setScreen] = useState<"start" | "editor">("start");
  const [baseSrc, setBaseSrc] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | undefined>();
  const [projectName, setProjectName] = useState("Mi proyecto");
  const [savedProjects, setSavedProjects] = useState<StudioProject[]>([]);

  const [baseImg, setBaseImg] = useState<HTMLImageElement | null>(null);
  const [grayBase, setGrayBase] = useState<HTMLCanvasElement | null>(null);
  const [version, setVersion] = useState(0);
  const textures = useRef(new Map<string, HTMLImageElement>());

  const [surfaces, setSurfaces] = useState<StudioSurface[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [tool, setTool] = useState<"draw" | "select">("select");
  const [draft, setDraft] = useState<Point[]>([]);
  const [compare, setCompare] = useState<{ mode: CompareMode; x: number }>({
    mode: "off",
    x: 0.5,
  });

  const history = useRef<{ stack: StudioSurface[][]; index: number }>({
    stack: [[]],
    index: 0,
  });

  useEffect(() => setSavedProjects(loadProjects()), []);

  // Precarga de texturas.
  useEffect(() => {
    products.forEach((p) => {
      if (!textures.current.has(p.texture)) {
        const im = new window.Image();
        im.onload = () => setVersion((v) => v + 1);
        im.src = p.texture;
        textures.current.set(p.texture, im);
      }
    });
  }, []);

  // Carga de la imagen base + versión en gris para conservar sombras.
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

  /* ---- Historial ---- */
  const commit = useCallback((next: StudioSurface[]) => {
    setSurfaces(next);
    const h = history.current;
    const stack = h.stack.slice(0, h.index + 1);
    stack.push(next);
    history.current = { stack, index: stack.length - 1 };
  }, []);

  const undo = () => {
    const h = history.current;
    if (h.index > 0) {
      h.index -= 1;
      setSurfaces(h.stack[h.index]);
    }
  };
  const redo = () => {
    const h = history.current;
    if (h.index < h.stack.length - 1) {
      h.index += 1;
      setSurfaces(h.stack[h.index]);
    }
  };

  /* ---- Entrada ---- */
  const openRoom = (image: string, id?: string, name?: string) => {
    setBaseSrc(image);
    setRoomId(id);
    if (name) setProjectName(name);
    setSurfaces([]);
    history.current = { stack: [[]], index: 0 };
    setSelectedId(undefined);
    setDraft([]);
    setTool("select");
    setScreen("editor");
  };

  const handleFile = (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Formato no válido. Use JPG, PNG o WebP.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      alert("La imagen supera 12 MB. Use una más liviana.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const im = new window.Image();
      im.onload = () => {
        // Redimensionar y re-exportar: acota tamaño y elimina metadatos EXIF.
        const scale = Math.min(1, MAX_DIM / Math.max(im.naturalWidth, im.naturalHeight));
        const c = document.createElement("canvas");
        c.width = Math.round(im.naturalWidth * scale);
        c.height = Math.round(im.naturalHeight * scale);
        c.getContext("2d")?.drawImage(im, 0, 0, c.width, c.height);
        openRoom(c.toDataURL("image/jpeg", 0.9), undefined, "Mi espacio");
        trackEvent({ name: "material_view", params: { materialSlug: "foto-propia" } });
      };
      im.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  /* ---- Superficies ---- */
  const newSurface = () => {
    setTool("draw");
    setDraft([]);
  };
  const addPoint = (p: Point) => setDraft((d) => [...d, p]);
  const cancelDraft = () => {
    setDraft([]);
    setTool("select");
  };
  const closeDraft = () => {
    if (draft.length < 3) return;
    const surface: StudioSurface = {
      id: `surf-${Date.now()}`,
      name: `Superficie ${surfaces.length + 1}`,
      kind: "otro",
      points: draft,
      transform: { ...defaultTransform },
    };
    commit([...surfaces, surface]);
    setSelectedId(surface.id);
    setDraft([]);
    setTool("select");
  };
  const deleteSurface = (id: string) => {
    commit(surfaces.filter((s) => s.id !== id));
    if (selectedId === id) setSelectedId(undefined);
  };
  const renameSurface = (id: string, name: string) =>
    setSurfaces((ss) => ss.map((s) => (s.id === id ? { ...s, name } : s)));
  const toggleHidden = (id: string) =>
    commit(surfaces.map((s) => (s.id === id ? { ...s, hidden: !s.hidden } : s)));
  const vertexDrag = (surfaceId: string, index: number, p: Point) =>
    setSurfaces((ss) =>
      ss.map((s) =>
        s.id === surfaceId
          ? { ...s, points: s.points.map((pt, i) => (i === index ? p : pt)) }
          : s,
      ),
    );
  const changeTransform = (patch: Partial<SurfaceTransform>) =>
    setSurfaces((ss) =>
      ss.map((s) =>
        s.id === selectedId ? { ...s, transform: { ...s.transform, ...patch } } : s,
      ),
    );
  const applyProduct = (product: StudioProduct) => {
    if (!selectedId) return;
    commit(
      surfaces.map((s) =>
        s.id === selectedId ? { ...s, productId: product.id } : s,
      ),
    );
    trackEvent({ name: "material_view", params: { materialSlug: product.sku } });
  };

  /* ---- Exportar / guardar ---- */
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
      textures: textures.current,
      showOverlay: false,
    });
    const a = document.createElement("a");
    a.href = c.toDataURL("image/jpeg", 0.92);
    a.download = `${projectName || "diseno"}.jpg`;
    a.click();
    trackEvent({ name: "catalog_download", params: { catalogId: "studio-export" } });
  };

  const persist = () => {
    if (!baseSrc) return;
    const now = new Date().toISOString();
    const project: StudioProject = {
      id: `proj-${Date.now()}`,
      name: projectName || "Mi proyecto",
      roomId,
      image: baseSrc,
      surfaces,
      createdAt: now,
      updatedAt: now,
    };
    setSavedProjects(saveProject(project));
    alert("Proyecto guardado en este navegador.");
  };

  const loadProject = (p: StudioProject) => {
    setProjectName(p.name);
    setRoomId(p.roomId);
    setBaseSrc(p.image);
    setSurfaces(p.surfaces);
    history.current = { stack: [p.surfaces], index: 0 };
    setSelectedId(undefined);
    setTool("select");
    setScreen("editor");
  };

  const productNameFor = (s: StudioSurface) =>
    s.productId ? productById(s.productId)?.name : undefined;
  const activeProductId = surfaces.find((s) => s.id === selectedId)?.productId;
  const revealFrom =
    compare.mode === "split" ? compare.x : compare.mode === "original" ? 1 : undefined;

  /* ---------- Pantalla de inicio ---------- */
  if (screen === "start") {
    return (
      <div className="space-y-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-sm border border-stone-beige bg-white p-6">
            <ImageIcon aria-hidden="true" className="h-7 w-7 text-mineral" />
            <h3 className="mt-3 font-sans text-xl font-bold text-ink">
              Explorar un ambiente
            </h3>
            <p className="mt-1 text-sm text-charcoal/80">
              Elija un espacio prediseñado y aplíquele materiales.
            </p>
          </div>
          <UploadCard onFile={handleFile} />
        </div>

        <div>
          <h3 className="mb-4 font-sans text-xl font-bold text-ink">Ambientes</h3>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => openRoom(r.image, r.id, r.name)}
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
                  <span className="mt-2 block text-sm font-medium text-ink">
                    {r.name}
                  </span>
                  <span className="block text-xs text-mineral">
                    {r.style} · {r.surfacesCount} superficies
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {savedProjects.length > 0 && (
          <div>
            <h3 className="mb-4 font-sans text-xl font-bold text-ink">
              Mis proyectos guardados
            </h3>
            <ul className="flex flex-wrap gap-3">
              {savedProjects.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => loadProject(p)}
                    className="rounded-sm border border-stone-beige bg-white px-4 py-2.5 text-sm text-ink hover:border-mineral"
                  >
                    {p.name}
                    <span className="ml-2 text-xs text-mineral">
                      {p.surfaces.length} sup.
                    </span>
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
      {/* Barra superior */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-beige p-3">
        <button
          type="button"
          onClick={() => setScreen("start")}
          className="rounded-sm border border-stone-beige px-3 py-1.5 text-sm text-charcoal hover:border-mineral"
        >
          ← Ambientes
        </button>
        <input
          aria-label="Nombre del proyecto"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="min-w-0 flex-1 rounded-sm border border-transparent px-2 py-1.5 text-sm font-medium text-ink hover:border-stone-beige focus:border-ink focus:outline-none"
        />
        <div className="flex items-center gap-1">
          <IconBtn label="Deshacer" onClick={undo} disabled={history.current.index === 0}>
            <Undo2 aria-hidden="true" className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            label="Rehacer"
            onClick={redo}
            disabled={history.current.index >= history.current.stack.length - 1}
          >
            <Redo2 aria-hidden="true" className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            label="Ver original"
            active={compare.mode === "original"}
            onClick={() =>
              setCompare((c) => ({ ...c, mode: c.mode === "original" ? "off" : "original" }))
            }
          >
            <Eye aria-hidden="true" className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            label="Antes y después"
            active={compare.mode === "split"}
            onClick={() =>
              setCompare((c) => ({ ...c, mode: c.mode === "split" ? "off" : "split" }))
            }
          >
            <SplitSquareHorizontal aria-hidden="true" className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Guardar" onClick={persist}>
            <Save aria-hidden="true" className="h-4 w-4" />
          </IconBtn>
          <IconBtn label="Descargar imagen" onClick={download}>
            <Download aria-hidden="true" className="h-4 w-4" />
          </IconBtn>
        </div>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr_300px]">
        {/* Panel superficies */}
        <div className="order-2 border-t border-stone-beige p-4 lg:order-1 lg:border-r lg:border-t-0">
          <SurfacePanel
            surfaces={surfaces}
            selectedId={selectedId}
            tool={tool}
            draftLength={draft.length}
            productNameFor={productNameFor}
            onNewSurface={newSurface}
            onCloseDraft={closeDraft}
            onCancelDraft={cancelDraft}
            onSelect={setSelectedId}
            onDelete={deleteSurface}
            onRename={renameSurface}
            onToggleHidden={toggleHidden}
            onChangeTransform={changeTransform}
          />
        </div>

        {/* Lienzo */}
        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/3] w-full bg-ink/5">
            {baseImg ? (
              <CanvasStage
                baseImg={baseImg}
                grayBase={grayBase}
                textures={textures.current}
                version={version}
                surfaces={surfaces}
                productById={productById}
                selectedId={selectedId}
                tool={tool}
                draft={draft}
                compareX={revealFrom ?? null}
                onAddPoint={addPoint}
                onVertexDrag={vertexDrag}
                onSelectSurface={setSelectedId}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-mineral">
                Cargando imagen…
              </div>
            )}
          </div>
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
                  onChange={(e) =>
                    setCompare((c) => ({ ...c, x: parseFloat(e.target.value) }))
                  }
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
              : "Seleccione una superficie (o cree una) y aplique un material del catálogo. Arrastre los puntos para ajustar."}
          </p>
        </div>

        {/* Catálogo */}
        <div className="order-3 border-t border-stone-beige lg:border-l lg:border-t-0">
          <ProductCatalog
            products={products}
            activeProductId={activeProductId}
            disabled={!selectedId}
            onApply={applyProduct}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-stone-beige p-3">
        <button
          type="button"
          onClick={() => {
            setSurfaces([]);
            history.current = { stack: [[]], index: 0 };
            setSelectedId(undefined);
          }}
          className="inline-flex items-center gap-1.5 text-xs text-charcoal/70 hover:text-ink"
        >
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
          Reiniciar superficies
        </button>
        <span className="text-xs text-mineral">
          Vista referencial · los materiales aplicados son una simulación
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

function UploadCard({ onFile }: { onFile: (file: File) => void }) {
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
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
      <h3 className="mt-3 font-sans text-xl font-bold text-ink">
        Cargar mi fotografía
      </h3>
      <p className="mt-1 text-sm text-charcoal/80">
        Arrastre una imagen aquí o selecciónela. JPG, PNG o WebP, hasta 12 MB.
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 inline-flex min-h-[44px] items-center rounded-sm bg-ink px-5 py-2.5 text-sm font-medium text-ivory hover:bg-charcoal"
      >
        Seleccionar imagen
      </button>
      <input
        ref={inputRef}
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
