import { create } from "zustand";
import type {
  StudioSurface,
  SurfaceTransform,
  StudioProject,
  EditorTool,
  EditorHistory,
  Point,
} from "@/lib/studio/types";
import { defaultTransform } from "@/lib/studio/types";

type Screen = "start" | "editor";
type CompareMode = "off" | "split" | "original";

type PersistentSlice = {
  projectId: string;
  name: string;
  roomId?: string;
  baseSrc: string | null;
  surfaces: StudioSurface[];
};

type UiSlice = {
  screen: Screen;
  tool: EditorTool;
  selectedId?: string;
  draft: Point[];
  compare: { mode: CompareMode; x: number };
};

type StudioState = PersistentSlice &
  UiSlice & {
    history: EditorHistory;
    // navegación / carga
    setScreen: (s: Screen) => void;
    setName: (name: string) => void;
    openRoom: (image: string, roomId?: string, name?: string) => void;
    openProject: (project: StudioProject) => void;
    hydrate: (project: StudioProject) => void;
    // superficies
    newSurface: () => void;
    addPoint: (p: Point) => void;
    closeDraft: () => void;
    cancelDraft: () => void;
    selectSurface: (id?: string) => void;
    deleteSurface: (id: string) => void;
    renameSurface: (id: string, name: string) => void;
    toggleHidden: (id: string) => void;
    toggleLocked: (id: string) => void;
    vertexDrag: (id: string, index: number, p: Point) => void;
    setTransform: (patch: Partial<SurfaceTransform>) => void;
    applyProduct: (productId: string) => void;
    resetSurfaces: () => void;
    // comparación
    setCompareMode: (mode: CompareMode) => void;
    setCompareX: (x: number) => void;
    // historial
    undo: () => void;
    redo: () => void;
    // serialización
    toProject: () => StudioProject | null;
  };

const emptyHistory: EditorHistory = { past: [], future: [] };

export const useStudioStore = create<StudioState>((set, get) => {
  /** Aplica un cambio estructural registrándolo en el historial. */
  const commit = (next: StudioSurface[]) =>
    set((state) => ({
      surfaces: next,
      history: { past: [...state.history.past, state.surfaces], future: [] },
    }));

  return {
    projectId: `proj-${Date.now()}`,
    name: "Mi proyecto",
    roomId: undefined,
    baseSrc: null,
    surfaces: [],

    screen: "start",
    tool: "select",
    selectedId: undefined,
    draft: [],
    compare: { mode: "off", x: 0.5 },
    history: emptyHistory,

    setScreen: (screen) => set({ screen }),
    setName: (name) => set({ name }),

    openRoom: (image, roomId, name) =>
      set({
        projectId: `proj-${Date.now()}`,
        baseSrc: image,
        roomId,
        name: name ?? "Mi proyecto",
        surfaces: [],
        history: emptyHistory,
        selectedId: undefined,
        draft: [],
        tool: "select",
        screen: "editor",
      }),

    openProject: (p) => {
      get().hydrate(p);
      set({ screen: "editor" });
    },

    hydrate: (p) =>
      set({
        projectId: p.id,
        name: p.name,
        roomId: p.roomId,
        baseSrc: p.image,
        surfaces: p.surfaces,
        history: emptyHistory,
        selectedId: undefined,
        draft: [],
        tool: "select",
      }),

    newSurface: () => set({ tool: "draw", draft: [] }),
    addPoint: (p) => set((s) => ({ draft: [...s.draft, p] })),
    cancelDraft: () => set({ draft: [], tool: "select" }),
    closeDraft: () => {
      const { draft, surfaces } = get();
      if (draft.length < 3) return;
      const surface: StudioSurface = {
        id: `surf-${Date.now()}`,
        name: `Superficie ${surfaces.length + 1}`,
        kind: "otro",
        points: draft,
        transform: { ...defaultTransform },
      };
      commit([...surfaces, surface]);
      set({ selectedId: surface.id, draft: [], tool: "select" });
    },

    selectSurface: (selectedId) => set({ selectedId }),
    deleteSurface: (id) => {
      commit(get().surfaces.filter((s) => s.id !== id));
      if (get().selectedId === id) set({ selectedId: undefined });
    },
    renameSurface: (id, name) =>
      set((s) => ({
        surfaces: s.surfaces.map((x) => (x.id === id ? { ...x, name } : x)),
      })),
    toggleHidden: (id) =>
      commit(get().surfaces.map((s) => (s.id === id ? { ...s, hidden: !s.hidden } : s))),
    toggleLocked: (id) =>
      commit(get().surfaces.map((s) => (s.id === id ? { ...s, locked: !s.locked } : s))),
    vertexDrag: (id, index, p) =>
      set((state) => ({
        surfaces: state.surfaces.map((s) =>
          s.id === id && !s.locked
            ? { ...s, points: s.points.map((pt, i) => (i === index ? p : pt)) }
            : s,
        ),
      })),
    setTransform: (patch) =>
      set((state) => ({
        surfaces: state.surfaces.map((s) =>
          s.id === state.selectedId ? { ...s, transform: { ...s.transform, ...patch } } : s,
        ),
      })),
    applyProduct: (productId) => {
      const { selectedId, surfaces } = get();
      if (!selectedId) return;
      const target = surfaces.find((s) => s.id === selectedId);
      if (!target || target.locked) return;
      commit(surfaces.map((s) => (s.id === selectedId ? { ...s, productId } : s)));
    },
    resetSurfaces: () => {
      commit([]);
      set({ selectedId: undefined, draft: [] });
    },

    setCompareMode: (mode) => set((s) => ({ compare: { ...s.compare, mode } })),
    setCompareX: (x) => set((s) => ({ compare: { ...s.compare, x } })),

    undo: () =>
      set((state) => {
        const past = state.history.past;
        if (past.length === 0) return state;
        const previous = past[past.length - 1];
        return {
          surfaces: previous,
          history: {
            past: past.slice(0, -1),
            future: [state.surfaces, ...state.history.future],
          },
        };
      }),
    redo: () =>
      set((state) => {
        const future = state.history.future;
        if (future.length === 0) return state;
        const next = future[0];
        return {
          surfaces: next,
          history: {
            past: [...state.history.past, state.surfaces],
            future: future.slice(1),
          },
        };
      }),

    toProject: () => {
      const { projectId, name, roomId, baseSrc, surfaces } = get();
      if (!baseSrc) return null;
      const now = new Date().toISOString();
      return {
        id: projectId,
        name,
        roomId,
        image: baseSrc,
        surfaces,
        createdAt: now,
        updatedAt: now,
      };
    },
  };
});
