import type { EdgeSelection } from "@/types/quote";
import { EDGE_OPTIONS } from "@/data/quote-config";

/** Costo de cantos: Σ (precio por metro lineal × metros lineales). */
export function calculateEdgeCost(edges: EdgeSelection[]): number {
  return Math.round(
    edges.reduce((sum, e) => {
      const opt = EDGE_OPTIONS.find((o) => o.id === e.edgeId);
      if (!opt) return sum;
      return sum + opt.pricePerLinearMeter * Math.max(0, e.linearMeters);
    }, 0),
  );
}
