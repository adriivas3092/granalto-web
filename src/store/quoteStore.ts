"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  SurfaceProduct,
  ProjectPiece,
  ProjectInformation,
  QuoteConfiguration,
  ProductQuoteResult,
  CustomerInformation,
} from "@/types/quote";

export const MAX_PRODUCTS = 4;

/** Pasos del asistente (el índice 0 es la introducción). */
export const QUOTE_STEPS = [
  { key: "intro", label: "Inicio" },
  { key: "productos", label: "Colores" },
  { key: "proyecto", label: "Proyecto" },
  { key: "medidas", label: "Medidas" },
  { key: "acabado", label: "Acabado y canto" },
  { key: "extras", label: "Cortes y extras" },
  { key: "servicios", label: "Servicios" },
  { key: "comparacion", label: "Comparación" },
  { key: "contacto", label: "Contacto" },
] as const;

export const TOTAL_STEPS = QUOTE_STEPS.length;

const defaultConfiguration: QuoteConfiguration = {
  selectedThickness: 20,
  finish: undefined,
  edges: [],
  cutouts: [],
  additionalElements: [],
  services: [],
  location: undefined,
  wastePercentage: undefined,
};

type QuoteState = {
  currentStep: number;
  selectedProducts: SurfaceProduct[];
  project: ProjectInformation | null;
  pieces: ProjectPiece[];
  configuration: QuoteConfiguration;
  estimates: ProductQuoteResult[];
  selectedEstimateId?: string;
  customer?: CustomerInformation;
  quoteId?: string;

  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  addProduct: (product: SurfaceProduct) => { ok: boolean; reason?: string };
  removeProduct: (productId: string) => void;
  isSelected: (productId: string) => boolean;

  setProject: (project: ProjectInformation) => void;

  addPiece: (piece: ProjectPiece) => void;
  updatePiece: (id: string, data: Partial<ProjectPiece>) => void;
  removePiece: (id: string) => void;
  duplicatePiece: (id: string) => void;

  updateConfiguration: (data: Partial<QuoteConfiguration>) => void;
  setEstimates: (estimates: ProductQuoteResult[]) => void;
  setSelectedEstimate: (id: string) => void;
  setCustomer: (customer: CustomerInformation) => void;
  setQuoteId: (id: string) => void;

  hasData: () => boolean;
  resetQuote: () => void;
};

const uid = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}-${Math.random().toString(36).slice(2)}`);

export const useQuote = create<QuoteState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      selectedProducts: [],
      project: null,
      pieces: [],
      configuration: defaultConfiguration,
      estimates: [],

      setCurrentStep: (step) => set({ currentStep: Math.max(0, Math.min(step, TOTAL_STEPS - 1)) }),
      nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, TOTAL_STEPS - 1) })),
      previousStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

      addProduct: (product) => {
        const cur = get().selectedProducts;
        if (cur.some((p) => p.id === product.id)) return { ok: false, reason: "Ese material ya está seleccionado." };
        if (cur.length >= MAX_PRODUCTS) return { ok: false, reason: "Podés comparar un máximo de cuatro materiales." };
        set({ selectedProducts: [...cur, product] });
        return { ok: true };
      },
      removeProduct: (id) => set((s) => ({ selectedProducts: s.selectedProducts.filter((p) => p.id !== id) })),
      isSelected: (id) => get().selectedProducts.some((p) => p.id === id),

      setProject: (project) => set({ project }),

      addPiece: (piece) => set((s) => ({ pieces: [...s.pieces, { ...piece, id: piece.id || uid() }] })),
      updatePiece: (id, data) => set((s) => ({ pieces: s.pieces.map((p) => (p.id === id ? { ...p, ...data } : p)) })),
      removePiece: (id) => set((s) => ({ pieces: s.pieces.filter((p) => p.id !== id) })),
      duplicatePiece: (id) =>
        set((s) => {
          const p = s.pieces.find((x) => x.id === id);
          if (!p) return {};
          return { pieces: [...s.pieces, { ...p, id: uid(), name: `${p.name} (copia)` }] };
        }),

      updateConfiguration: (data) => set((s) => ({ configuration: { ...s.configuration, ...data } })),
      setEstimates: (estimates) => set({ estimates }),
      setSelectedEstimate: (id) => set({ selectedEstimateId: id }),
      setCustomer: (customer) => set({ customer }),
      setQuoteId: (id) => set({ quoteId: id }),

      hasData: () => {
        const s = get();
        return s.selectedProducts.length > 0 || s.pieces.length > 0 || s.project !== null;
      },
      resetQuote: () =>
        set({
          currentStep: 0,
          selectedProducts: [],
          project: null,
          pieces: [],
          configuration: defaultConfiguration,
          estimates: [],
          selectedEstimateId: undefined,
          customer: undefined,
          quoteId: undefined,
        }),
    }),
    {
      name: "granalto-quote",
      // No persistir PII (customer) ni resultados; sí el progreso de configuración.
      partialize: (s) => ({
        currentStep: s.currentStep,
        selectedProducts: s.selectedProducts,
        project: s.project,
        pieces: s.pieces,
        configuration: s.configuration,
      }),
    },
  ),
);
