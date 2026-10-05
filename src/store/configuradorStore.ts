"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Medida, SalpicaderoTipo } from "@/lib/configurador/pricing";
import { MM_POR_UNIDAD, type Unidad } from "@/data/configurador";

export { MM_POR_UNIDAD };
export type { Unidad };

/** Pasos del cotizador (Documento 4, sección 2). */
export const PASOS = [
  { key: "tipo", label: "Tipo de proyecto" },
  { key: "material", label: "Material y color" },
  { key: "medidas", label: "Medidas" },
  { key: "moldura", label: "Moldura" },
  { key: "salpicadero", label: "Salpicadero" },
  { key: "resumen", label: "Resumen y precio" },
  { key: "datos", label: "Datos y confirmación" },
] as const;

export const TOTAL_PASOS = PASOS.length;

export type Cliente = {
  nombre: string;
  telefono: string;
  correo: string;
  provincia: string;
  canton: string;
  direccion: string;
  retiro: boolean; // true = retira en tienda; false = entrega a domicilio
  acepta: boolean;
};

const clienteVacio: Cliente = {
  nombre: "",
  telefono: "",
  correo: "",
  provincia: "",
  canton: "",
  direccion: "",
  retiro: false,
  acepta: false,
};

type State = {
  paso: number;
  geometriaId: string | null;
  materialId: string | null;
  colorId: string | null;
  medidas: Record<string, Medida>;
  unidad: Unidad;
  moldura: boolean | null;
  salpicaderoTipo: SalpicaderoTipo;
  salpicaderoAlturaCm: number;
  /** true cuando el proyecto se deriva a cotización personalizada (p. ej. medidas fuera de rango). */
  derivar: boolean;
  cliente: Cliente;
  folio: string | null;

  setPaso: (n: number) => void;
  next: () => void;
  prev: () => void;
  setGeometria: (id: string) => void;
  setMaterial: (id: string) => void;
  setColor: (id: string) => void;
  setMedida: (tramo: string, campo: keyof Medida, valor: number) => void;
  setUnidad: (u: Unidad) => void;
  setMoldura: (v: boolean) => void;
  setSalpicadero: (tipo: SalpicaderoTipo, alturaCm?: number) => void;
  setDerivar: (v: boolean) => void;
  setCliente: (patch: Partial<Cliente>) => void;
  setFolio: (f: string) => void;
  reset: () => void;
};

const initial = {
  paso: 0,
  geometriaId: null,
  materialId: null,
  colorId: null,
  medidas: {} as Record<string, Medida>,
  unidad: "m" as Unidad,
  moldura: null,
  salpicaderoTipo: "no" as SalpicaderoTipo,
  salpicaderoAlturaCm: 0,
  derivar: false,
  cliente: clienteVacio,
  folio: null,
};

export const useConfigurador = create<State>()(
  persist(
    (set) => ({
      ...initial,

      setPaso: (n) => set({ paso: Math.max(0, Math.min(TOTAL_PASOS - 1, n)) }),
      next: () => set((s) => ({ paso: Math.min(TOTAL_PASOS - 1, s.paso + 1) })),
      prev: () => set((s) => ({ paso: Math.max(0, s.paso - 1) })),

      setGeometria: (id) =>
        set((s) => (s.geometriaId === id ? s : { geometriaId: id, medidas: {}, derivar: false })),
      setMaterial: (id) =>
        set((s) => (s.materialId === id ? s : { materialId: id, colorId: null })),
      setColor: (id) => set({ colorId: id }),

      setMedida: (tramo, campo, valor) =>
        set((s) => ({
          medidas: {
            ...s.medidas,
            [tramo]: {
              largo: campo === "largo" ? valor : s.medidas[tramo]?.largo ?? 0,
              prof: campo === "prof" ? valor : s.medidas[tramo]?.prof ?? 0,
            },
          },
        })),

      setUnidad: (u) => set({ unidad: u }),
      setMoldura: (v) => set({ moldura: v }),
      setDerivar: (v) => set({ derivar: v }),
      setSalpicadero: (tipo, alturaCm) =>
        set({
          salpicaderoTipo: tipo,
          salpicaderoAlturaCm:
            tipo === "custom" ? alturaCm ?? 0 : tipo === "10" ? 10 : 0,
        }),

      setCliente: (patch) => set((s) => ({ cliente: { ...s.cliente, ...patch } })),
      setFolio: (f) => set({ folio: f }),
      reset: () => set({ ...initial, cliente: clienteVacio }),
    }),
    {
      name: "granalto-configurador",
      // No persistir PII (cliente) ni el folio; sí el avance de configuración.
      partialize: (s) => ({
        paso: s.paso,
        geometriaId: s.geometriaId,
        materialId: s.materialId,
        colorId: s.colorId,
        medidas: s.medidas,
        unidad: s.unidad,
        moldura: s.moldura,
        salpicaderoTipo: s.salpicaderoTipo,
        salpicaderoAlturaCm: s.salpicaderoAlturaCm,
        derivar: s.derivar,
      }),
    },
  ),
);
