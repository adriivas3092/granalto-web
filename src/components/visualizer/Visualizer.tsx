"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, GitCompareArrows, FileText } from "lucide-react";
import { getEnvironment } from "@/data/visualizer/scenes";
import type { Environment, Surface } from "@/data/visualizer/types";
import { useVisualizer } from "@/store/visualizerStore";
import { decodeConfig } from "@/lib/visualizer/serialize";
import { LoadingState } from "@/components/ui/LoadingState";
import { EnvironmentCanvas } from "./EnvironmentCanvas";
import { EnvironmentSelector } from "./EnvironmentSelector";
import { SurfaceSelector } from "./SurfaceSelector";
import { MaterialGrid } from "./MaterialGrid";
import { LightingSelector } from "./LightingSelector";
import { BeforeAfterCompare } from "./BeforeAfterCompare";
import { FavoritesPanel } from "./FavoritesPanel";
import { SelectionSummary } from "./SelectionSummary";
import { ShareDownloadBar } from "./ShareDownloadBar";
import { MobileControls } from "./MobileControls";
import { QuoteModal } from "./QuoteModal";
import { cn } from "@/lib/utils";

type PanelTab = "materiales" | "favoritos" | "resumen";

export function Visualizer() {
  const [mounted, setMounted] = useState(false);
  const [compare, setCompare] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const svgProvider = () => svgRef.current;

  const environmentId = useVisualizer((s) => s.environmentId);
  const overrides = useVisualizer((s) => s.overrides);
  const lightingId = useVisualizer((s) => s.lightingId);
  const activeSurfaceId = useVisualizer((s) => s.activeSurfaceId);
  const setActiveSurface = useVisualizer((s) => s.setActiveSurface);
  const materialIdFor = useVisualizer((s) => s.materialIdFor);
  const importConfig = useVisualizer((s) => s.importConfig);

  // Restaura desde ?c= y asegura una superficie activa. Solo en cliente.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("c");
    if (token) {
      const cfg = decodeConfig(token);
      if (cfg) importConfig(cfg);
    }
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const env = getEnvironment(environmentId);
    if (env && !env.surfaces.some((s) => s.id === activeSurfaceId)) {
      setActiveSurface(env.surfaces.find((s) => s.defaultMaterialId)?.id ?? env.surfaces[0]?.id ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [environmentId, mounted]);

  const environment = getEnvironment(environmentId) ?? getEnvironment("kitchen-moderna")!;
  // `overrides` en dependencias fuerza el re-render de la escena al cambiar material.
  const resolve = useMemo(
    () => (surfaceId: string) => materialIdFor(environment, surfaceId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [environment, overrides],
  );

  const activeSurface = environment.surfaces.find((s) => s.id === activeSurfaceId) ?? environment.surfaces[0];
  const [tab, setTab] = useState<PanelTab>("materiales");

  if (!mounted) {
    return <LoadingState label="Cargando visualizador…" />;
  }

  const controls = (
    <ControlsPanel
      environment={environment}
      activeSurface={activeSurface}
      tab={tab}
      setTab={setTab}
      onQuote={() => {
        setSheetOpen(false);
        setQuoteOpen(true);
      }}
    />
  );

  return (
    <div>
      <EnvironmentSelector />

      <div className="mt-5 grid gap-5 lg:grid-cols-12">
        {/* Escena principal */}
        <div className="lg:col-span-8">
          <div className="relative">
            <div className={cn("overflow-hidden rounded-sm bg-stone-beige shadow-sm", compare && "hidden")}>
              <EnvironmentCanvas
                ref={svgRef}
                environment={environment}
                resolve={resolve}
                lightingId={lightingId}
                idPrefix="main"
                activeSurfaceId={activeSurfaceId}
                onPickSurface={setActiveSurface}
                className="block h-auto w-full"
              />
            </div>
            {compare && (
              <BeforeAfterCompare environment={environment} resolveCustom={resolve} lightingId={lightingId} />
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => setCompare((c) => !c)}
              aria-pressed={compare}
              className={cn(
                "inline-flex min-h-[40px] items-center gap-1.5 rounded-sm border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-2",
                compare ? "border-ink bg-ink text-ivory" : "border-stone-beige bg-white text-charcoal hover:border-ink",
              )}
            >
              <GitCompareArrows className="h-4 w-4" /> {compare ? "Salir de comparar" : "Comparar antes/después"}
            </button>
            <ShareDownloadBar environment={environment} svgProvider={svgProvider} />
          </div>

          <p className="mt-2 text-xs text-mineral">
            Toque una superficie en la imagen para seleccionarla, luego elija un material.
          </p>
        </div>

        {/* Panel de controles (escritorio) */}
        <aside className="hidden lg:col-span-4 lg:block">
          <div className="sticky top-24 max-h-[calc(100svh-7rem)] overflow-y-auto rounded-sm border border-stone-beige bg-ivory/60 p-4">
            {controls}
          </div>
        </aside>
      </div>

      {/* Botón flotante móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-stone-beige bg-white/95 p-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setSheetOpen(true)}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-sm bg-ink px-4 py-2.5 text-sm font-medium text-ivory"
        >
          <SlidersHorizontal className="h-4 w-4" /> Personalizar
        </button>
        <button
          onClick={() => setQuoteOpen(true)}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm border border-ink px-4 py-2.5 text-sm font-medium text-ink"
        >
          <FileText className="h-4 w-4" /> Cotizar
        </button>
      </div>

      <MobileControls open={sheetOpen} onClose={() => setSheetOpen(false)}>
        {controls}
      </MobileControls>

      {quoteOpen && (
        <QuoteModal environment={environment} svgProvider={svgProvider} onClose={() => setQuoteOpen(false)} />
      )}
    </div>
  );
}

function ControlsPanel({
  environment,
  activeSurface,
  tab,
  setTab,
  onQuote,
}: {
  environment: Environment;
  activeSurface: Surface | undefined;
  tab: PanelTab;
  setTab: (t: PanelTab) => void;
  onQuote: () => void;
}) {
  return (
    <div className="space-y-5">
      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-mineral">Superficie</h2>
        <SurfaceSelector environment={environment} />
      </section>

      <section>
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-mineral">Iluminación</h2>
        <LightingSelector />
      </section>

      <section>
        <div className="mb-2 flex gap-1 border-b border-stone-beige" role="tablist" aria-label="Panel">
          {(["materiales", "favoritos", "resumen"] as PanelTab[]).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-sm capitalize transition-colors focus-visible:outline-2",
                tab === t ? "border-ink font-medium text-ink" : "border-transparent text-mineral hover:text-charcoal",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "materiales" && activeSurface && (
          <>
            <p className="mb-2 text-sm text-charcoal">
              Materiales para <span className="font-medium text-ink">{activeSurface.name}</span>
            </p>
            <MaterialGrid environment={environment} surface={activeSurface} />
          </>
        )}
        {tab === "favoritos" && <FavoritesPanel environment={environment} />}
        {tab === "resumen" && <SelectionSummary environment={environment} />}
      </section>

      <button
        onClick={onQuote}
        className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal"
      >
        <FileText className="h-4 w-4" /> Solicitar cotización
      </button>
    </div>
  );
}
