import type { LightingPreset } from "./types";

/** Presets de iluminación. No alteran los materiales seleccionados. */
export const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: "natural",
    name: "Luz natural",
    filter: "brightness(1) contrast(1) saturate(1)",
    overlay: "#ffffff",
    overlayOpacity: 0,
    blend: "soft-light",
  },
  {
    id: "warm",
    name: "Luz cálida",
    filter: "brightness(1.03) contrast(0.98) saturate(1.08)",
    overlay: "#ffb257",
    overlayOpacity: 0.16,
    blend: "soft-light",
  },
  {
    id: "cool",
    name: "Luz fría",
    filter: "brightness(1.01) contrast(1.03) saturate(0.95)",
    overlay: "#6ea3d8",
    overlayOpacity: 0.14,
    blend: "soft-light",
  },
  {
    id: "night",
    name: "Noche",
    filter: "brightness(0.72) contrast(1.08) saturate(0.9)",
    overlay: "#12233f",
    overlayOpacity: 0.42,
    blend: "multiply",
  },
];

export const DEFAULT_LIGHTING_ID = "natural";

export function getLighting(id: string): LightingPreset {
  return LIGHTING_PRESETS.find((l) => l.id === id) ?? LIGHTING_PRESETS[0];
}
