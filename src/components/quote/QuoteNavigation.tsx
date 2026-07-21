"use client";

import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

type Props = {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  hideBack?: boolean;
  hideNext?: boolean;
  loading?: boolean;
};

/** Barra de navegación inferior consistente (Atrás / Continuar). */
export function QuoteNavigation({
  onBack,
  onNext,
  nextLabel = "Continuar",
  nextDisabled,
  hideBack,
  hideNext,
  loading,
}: Props) {
  return (
    <div className="sticky bottom-0 z-30 -mx-4 mt-8 flex items-center justify-between gap-3 border-t border-stone-beige bg-ivory/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-sm sm:border sm:px-4">
      {!hideBack ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-stone-beige bg-white px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Atrás
        </button>
      ) : (
        <span />
      )}

      {!hideNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled || loading}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-6 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
          {nextLabel}
          {!loading && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
