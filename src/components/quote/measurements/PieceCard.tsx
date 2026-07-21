"use client";

import { Copy, Trash2 } from "lucide-react";
import type { ProjectPiece } from "@/types/quote";
import { pieceArea } from "@/lib/quote-engine/calculate-area";
import { useQuote } from "@/store/quoteStore";

const SHAPE_LABEL: Record<string, string> = {
  recto: "Tramo recto", l: "Forma en L", u: "Forma en U", isla: "Isla", barra: "Barra",
  splashback: "Splashback", personalizado: "Personalizada",
};

export function PieceCard({ piece }: { piece: ProjectPiece }) {
  const removePiece = useQuote((s) => s.removePiece);
  const duplicatePiece = useQuote((s) => s.duplicatePiece);
  const area = pieceArea(piece);

  return (
    <div className="flex items-center justify-between gap-3 rounded-sm border border-stone-beige bg-white p-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">{piece.name}</p>
        <p className="text-xs text-mineral">
          {SHAPE_LABEL[piece.shape]} · {piece.length}×{piece.width} {piece.unit} · x{piece.quantity} · {piece.thickness} mm
        </p>
        <p className="text-xs text-charcoal">{area.toFixed(2)} m²</p>
      </div>
      <div className="flex shrink-0 gap-1.5">
        <button
          type="button"
          onClick={() => duplicatePiece(piece.id)}
          aria-label={`Duplicar ${piece.name}`}
          className="flex h-8 w-8 items-center justify-center rounded-sm border border-stone-beige text-charcoal hover:border-ink"
        >
          <Copy aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => removePiece(piece.id)}
          aria-label={`Eliminar ${piece.name}`}
          className="flex h-8 w-8 items-center justify-center rounded-sm border border-stone-beige text-[#a03826] hover:border-[#a03826]"
        >
          <Trash2 aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
