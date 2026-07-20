"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StudioProject } from "@/lib/studio/types";
import { useStudioStore } from "@/store/studioStore";
import {
  DRAFT_ID,
  getAllProjects,
  getProject,
  putProject,
  removeProject,
} from "@/lib/studio/db";

/**
 * Persistencia local del configurador en IndexedDB:
 * - autoguardado del borrador con debounce,
 * - recuperación del último borrador al abrir,
 * - guardado con nombre, listado y borrado.
 */
export function useStudioPersistence() {
  const [projects, setProjects] = useState<StudioProject[]>([]);
  const [recoverable, setRecoverable] = useState<StudioProject | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async () => {
    setProjects(await getAllProjects());
  }, []);

  // Carga inicial + detección de borrador recuperable.
  useEffect(() => {
    void refresh();
    void getProject(DRAFT_ID).then((draft) => {
      if (draft && draft.image && draft.surfaces.length > 0) setRecoverable(draft);
    });
  }, [refresh]);

  // Autoguardado del borrador (debounce) ante cambios persistentes.
  useEffect(() => {
    const unsub = useStudioStore.subscribe((state, prev) => {
      if (
        state.baseSrc === prev.baseSrc &&
        state.surfaces === prev.surfaces &&
        state.name === prev.name
      ) {
        return;
      }
      if (!state.baseSrc || state.screen !== "editor") return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        const now = new Date().toISOString();
        void putProject({
          id: DRAFT_ID,
          name: state.name,
          roomId: state.roomId,
          image: state.baseSrc as string,
          surfaces: state.surfaces,
          createdAt: now,
          updatedAt: now,
        });
      }, 800);
    });
    return () => {
      unsub();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const saveNamed = useCallback(async () => {
    const project = useStudioStore.getState().toProject();
    if (!project) return;
    await putProject({ ...project, id: `proj-${Date.now()}` });
    await refresh();
  }, [refresh]);

  const remove = useCallback(
    async (id: string) => {
      await removeProject(id);
      await refresh();
    },
    [refresh],
  );

  const clearDraft = useCallback(async () => {
    await removeProject(DRAFT_ID);
    setRecoverable(null);
  }, []);

  return { projects, recoverable, setRecoverable, refresh, saveNamed, remove, clearDraft };
}
