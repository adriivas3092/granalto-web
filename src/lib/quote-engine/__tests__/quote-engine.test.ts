import { describe, it, expect } from "vitest";
import { toMeters, pieceArea, calculateArea } from "../calculate-area";
import { calculateEdgeCost } from "../calculate-edges";
import { calculateCutoutCost, calculateExtrasCost } from "../calculate-cutouts";
import { calculateTaxes } from "../calculate-taxes";
import { calculateQuote } from "../calculate-quote";
import type { ProjectPiece, QuoteConfiguration, SurfaceProduct } from "@/types/quote";
import { TAX_RATE } from "@/data/quote-config";

const product: SurfaceProduct = {
  id: "p1", slug: "p1", name: "Test", category: "Cuarzo", imageUrl: "/x.jpg",
  pricePerSquareMeter: 100000, availableThicknesses: [20], finishes: ["Pulido"], isActive: true,
};

const piece = (over: Partial<ProjectPiece> = {}): ProjectPiece => ({
  id: "a", name: "P", shape: "recto", length: 200, width: 60, quantity: 1, unit: "cm", thickness: 20, ...over,
});

const baseConfig: QuoteConfiguration = {
  selectedThickness: 20, edges: [], cutouts: [], additionalElements: [], services: [],
};

describe("conversión de unidades", () => {
  it("convierte a metros", () => {
    expect(toMeters(1000, "mm")).toBe(1);
    expect(toMeters(100, "cm")).toBe(1);
    expect(toMeters(2, "m")).toBe(2);
  });
});

describe("cálculo de área", () => {
  it("área de pieza = largo × ancho × cantidad", () => {
    expect(pieceArea(piece({ length: 200, width: 100, quantity: 2, unit: "cm" }))).toBeCloseTo(4);
  });
  it("aplica desperdicio", () => {
    const { netArea, billableArea } = calculateArea([piece({ length: 100, width: 100, unit: "cm" })], 10);
    expect(netArea).toBeCloseTo(1);
    expect(billableArea).toBeCloseTo(1.1);
  });
  it("respeta el mínimo facturable", () => {
    const { billableArea } = calculateArea([piece({ length: 10, width: 10, unit: "cm" })], 0);
    expect(billableArea).toBeGreaterThanOrEqual(0.5);
  });
});

describe("costos de extras", () => {
  it("cantos por metro lineal", () => {
    expect(calculateEdgeCost([{ edgeId: "biselado", linearMeters: 2 }])).toBe(12000);
  });
  it("cortes por unidad", () => {
    expect(calculateCutoutCost([{ cutoutId: "griferia", quantity: 3 }])).toBe(18000);
  });
  it("elementos adicionales por m²", () => {
    expect(calculateExtrasCost([{ id: "e", typeId: "splashback", length: 2, height: 0.5, quantity: 1 }])).toBe(60000);
  });
});

describe("impuestos", () => {
  it("aplica la tasa configurada", () => {
    expect(calculateTaxes(100000)).toBe(Math.round(100000 * TAX_RATE));
  });
});

describe("cotización completa", () => {
  it("calcula un resultado por producto y total = subtotal + impuestos", () => {
    const results = calculateQuote({ products: [product], pieces: [piece()], configuration: baseConfig });
    expect(results).toHaveLength(1);
    const r = results[0];
    expect(r.total).toBe(r.subtotal + r.taxes);
    expect(r.materialCost).toBeGreaterThan(0);
  });

  it("aplica la misma configuración a varios productos", () => {
    const p2 = { ...product, id: "p2", pricePerSquareMeter: 200000 };
    const results = calculateQuote({ products: [product, p2], configuration: baseConfig, pieces: [piece()] });
    expect(results).toHaveLength(2);
    expect(results[1].materialCost).toBeGreaterThan(results[0].materialCost);
    expect(results[0].billableArea).toBe(results[1].billableArea);
  });
});
