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
  iniciado: boolean;
  paso: number;
  geometriaId: string | null;
  materialId: string | null;
  colorId: string | null;
  medidas: Record<string, Medida>;
  unidad: Unidad;
  /** Acabado de superficie: brillo o mate (null = sin elegir). */
  acabado: "brillo" | "mate" | null;
  moldura: boolean | null;
  /** Grosor de la moldura en cm (2 o 4) cuando lleva moldura. */
  molduraGrosorCm: number | null;
  salpicaderoTipo: SalpicaderoTipo;
  salpicaderoAlturaCm: number;
  /** Esquina de la unión del sobre en L. */
  lUnion: "izquierda" | "derecha" | null;
  /** true cuando el proyecto se deriva a cotización personalizada (p. ej. medidas fuera de rango). */
  derivar: boolean;
  cliente: Cliente;
  folio: string | null;

  setPaso: (n: number) => void;
  setIniciado: (v: boolean) => void;
  next: () => void;
  prev: () => void;
  setGeometria: (id: string) => void;
  setMaterial: (id: string) => void;
  setColor: (id: string) => void;
  setMedida: (tramo: string, campo: keyof Medida, valor: number) => void;
  setUnidad: (u: Unidad) => void;
  setAcabado: (a: "brillo" | "mate") => void;
  setMoldura: (v: boolean) => void;
  setMolduraGrosor: (cm: number) => void;
  setLUnion: (u: "izquierda" | "derecha") => void;
  setSalpicadero: (tipo: SalpicaderoTipo, alturaCm?: number) => void;
  setDerivar: (v: boolean) => void;
  setCliente: (patch: Partial<Cliente>) => void;
  setFolio: (f: string) => void;
  reset: () => void;
};

const initial = {
  iniciado: false,
  paso: 0,
  geometriaId: null,
  materialId: null,
  colorId: null,
  medidas: {} as Record<string, Medida>,
  unidad: "m" as Unidad,
  acabado: null as "brillo" | "mate" | null,
  moldura: null,
  molduraGrosorCm: null as number | null,
  salpicaderoTipo: "no" as SalpicaderoTipo,
  salpicaderoAlturaCm: 0,
  lUnion: null as "izquierda" | "derecha" | null,
  derivar: false,
  cliente: clienteVacio,
  folio: null,
};

export const useConfigurador = create<State>()(
  persist(
    (set) => ({
      ...initial,

      setPaso: (n) => set({ paso: Math.max(0, Math.min(TOTAL_PASOS - 1, n)) }),
      setIniciado: (v) => set({ iniciado: v }),
      next: () => set((s) => ({ paso: Math.min(TOTAL_PASOS - 1, s.paso + 1) })),
      prev: () => set((s) => ({ paso: Math.max(0, s.paso - 1) })),

      setGeometria: (id) =>
        set((s) => (s.geometriaId === id ? s : { geometriaId: id, medidas: {}, derivar: false, lUnion: null })),
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
      setAcabado: (a) => set({ acabado: a }),
      setMoldura: (v) => set((s) => ({ moldura: v, molduraGrosorCm: v ? s.molduraGrosorCm : null })),
      setMolduraGrosor: (cm) => set({ molduraGrosorCm: cm }),
      setLUnion: (u) => set({ lUnion: u }),
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
      // No persistir PII (cliente), el folio ni el flag de inicio (la intro se
      // muestra siempre al abrir el cotizador); sí el avance de configuración.
      partialize: (s) => ({
        paso: s.paso,
        geometriaId: s.geometriaId,
        materialId: s.materialId,
        colorId: s.colorId,
        medidas: s.medidas,
        unidad: s.unidad,
        acabado: s.acabado,
        moldura: s.moldura,
        molduraGrosorCm: s.molduraGrosorCm,
        salpicaderoTipo: s.salpicaderoTipo,
        salpicaderoAlturaCm: s.salpicaderoAlturaCm,
        lUnion: s.lUnion,
        derivar: s.derivar,
      }),
    },
  ),
);
