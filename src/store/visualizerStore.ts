"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ENVIRONMENTS, getEnvironment } from "@/data/visualizer/scenes";
import { DEFAULT_LIGHTING_ID } from "@/data/visualizer/lighting";
import type { Environment } from "@/data/visualizer/types";

export type VisualizerConfig = {
  e: string; // environment id
  l: string; // lighting id
  s: Record<string, string>; // surfaceId -> materialId (overrides for env e)
};

type VisualizerState = {
  environmentId: string;
  activeSurfaceId: string | null;
  lightingId: string;
  /** Overrides por ambiente: key `${envId}:${surfaceId}` -> materialId. */
  overrides: Record<string, string>;
  favorites: string[];

  setEnvironment: (id: string) => void;
  setActiveSurface: (id: string | null) => void;
  applyMaterial: (surfaceId: string, materialId: string) => void;
  resetEnvironment: () => void;
  setLighting: (id: string) => void;
  toggleFavorite: (materialId: string) => void;

  materialIdFor: (env: Environment, surfaceId: string) => string | undefined;
  exportConfig: () => VisualizerConfig;
  importConfig: (cfg: Partial<VisualizerConfig>) => void;
};

const firstEnv = ENVIRONMENTS[0].id;

export const useVisualizer = create<VisualizerState>()(
  persist(
    (set, get) => ({
      environmentId: firstEnv,
      activeSurfaceId: null,
      lightingId: DEFAULT_LIGHTING_ID,
      overrides: {},
      favorites: [],

      setEnvironment: (id) => {
        const env = getEnvironment(id);
        set({
          environmentId: id,
          activeSurfaceId: env?.surfaces.find((s) => s.defaultMaterialId)?.id ?? env?.surfaces[0]?.id ?? null,
        });
      },
      setActiveSurface: (id) => set({ activeSurfaceId: id }),
      applyMaterial: (surfaceId, materialId) =>
        set((st) => ({ overrides: { ...st.overrides, [`${st.environmentId}:${surfaceId}`]: materialId } })),
      resetEnvironment: () =>
        set((st) => {
          const prefix = `${st.environmentId}:`;
          const next: Record<string, string> = {};
          for (const [k, v] of Object.entries(st.overrides)) if (!k.startsWith(prefix)) next[k] = v;
          return { overrides: next };
        }),
      setLighting: (id) => set({ lightingId: id }),
      toggleFavorite: (materialId) =>
        set((st) => ({
          favorites: st.favorites.includes(materialId)
            ? st.favorites.filter((f) => f !== materialId)
            : [...st.favorites, materialId],
        })),

      materialIdFor: (env, surfaceId) => {
        const st = get();
        return (
          st.overrides[`${env.id}:${surfaceId}`] ??
          env.surfaces.find((s) => s.id === surfaceId)?.defaultMaterialId
        );
      },

      exportConfig: () => {
        const st = get();
        const prefix = `${st.environmentId}:`;
        const s: Record<string, string> = {};
        for (const [k, v] of Object.entries(st.overrides)) {
          if (k.startsWith(prefix)) s[k.slice(prefix.length)] = v;
        }
        return { e: st.environmentId, l: st.lightingId, s };
      },
      importConfig: (cfg) => {
        if (!cfg.e || !getEnvironment(cfg.e)) return;
        set((st) => {
          const prefix = `${cfg.e}:`;
          const next: Record<string, string> = {};
          for (const [k, v] of Object.entries(st.overrides)) if (!k.startsWith(prefix)) next[k] = v;
          for (const [sid, mid] of Object.entries(cfg.s ?? {})) next[`${cfg.e}:${sid}`] = mid;
          return {
            environmentId: cfg.e!,
            lightingId: cfg.l ?? st.lightingId,
            overrides: next,
            activeSurfaceId: getEnvironment(cfg.e!)?.surfaces[0]?.id ?? null,
          };
        });
      },
    }),
    {
      name: "granalto-visualizer",
      partialize: (st) => ({
        environmentId: st.environmentId,
        lightingId: st.lightingId,
        overrides: st.overrides,
        favorites: st.favorites,
      }),
    },
  ),
);
