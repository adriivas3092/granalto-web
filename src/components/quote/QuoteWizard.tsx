"use client";

import { useEffect, useState } from "react";
import { useQuote, TOTAL_STEPS, QUOTE_STEPS } from "@/store/quoteStore";
import { trackEvent } from "@/lib/analytics";
import { LoadingState } from "@/components/ui/LoadingState";
import { QuoteHeader } from "./QuoteHeader";
import { QuoteProgress } from "./QuoteProgress";
import { QuoteNavigation } from "./QuoteNavigation";
import { QuoteSummary } from "./QuoteSummary";
import { ExitQuoteDialog } from "./ExitQuoteDialog";
import { IntroStep } from "./steps/IntroStep";
import { ProductSelectionStep } from "./steps/ProductSelectionStep";
import { ProjectTypeStep } from "./steps/ProjectTypeStep";
import { MeasurementsStep } from "./steps/MeasurementsStep";
import { FinishStep } from "./steps/FinishStep";
import { ExtrasStep } from "./steps/ExtrasStep";
import { ServicesStep } from "./steps/ServicesStep";
import { ComparisonStep } from "./steps/ComparisonStep";
import { ContactStep } from "./steps/ContactStep";

export function QuoteWizard() {
  const [mounted, setMounted] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);

  const currentStep = useQuote((s) => s.currentStep);
  const setCurrentStep = useQuote((s) => s.setCurrentStep);
  const nextStep = useQuote((s) => s.nextStep);
  const previousStep = useQuote((s) => s.previousStep);
  const selectedProducts = useQuote((s) => s.selectedProducts);
  const project = useQuote((s) => s.project);
  const pieces = useQuote((s) => s.pieces);
  const estimates = useQuote((s) => s.estimates);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    trackEvent({ name: "quote_step_viewed", params: { step: currentStep + 1, stepName: QUOTE_STEPS[currentStep]?.key } });
  }, [currentStep, mounted]);

  if (!mounted) return <LoadingState label="Cargando cotizador…" />;

  const canProceed = (() => {
    switch (currentStep) {
      case 1:
        return selectedProducts.length >= 1;
      case 2:
        return Boolean(project?.kind && project?.stage);
      case 3:
        return pieces.length >= 1;
      case 7:
        return estimates.length > 0;
      default:
        return true;
    }
  })();

  const isIntro = currentStep === 0;
  const isContact = currentStep === TOTAL_STEPS - 1;
  const showSidebar = currentStep >= 1 && currentStep <= 7;

  const goNext = () => {
    if (isIntro) trackEvent({ name: "quote_started" });
    nextStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => {
    previousStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <QuoteHeader onExit={() => setExitOpen(true)} />
      <div className="mt-4">
        <QuoteProgress currentStep={currentStep} />
      </div>

      <div className={showSidebar ? "mt-8 grid gap-8 lg:grid-cols-[1fr_18rem]" : "mt-8"}>
        <div className="min-w-0">
          {currentStep === 0 && <IntroStep onStart={goNext} />}
          {currentStep === 1 && <ProductSelectionStep />}
          {currentStep === 2 && <ProjectTypeStep />}
          {currentStep === 3 && <MeasurementsStep />}
          {currentStep === 4 && <FinishStep />}
          {currentStep === 5 && <ExtrasStep />}
          {currentStep === 6 && <ServicesStep />}
          {currentStep === 7 && <ComparisonStep />}
          {currentStep === 8 && <ContactStep />}

          {!isIntro && (
            <QuoteNavigation
              onBack={goBack}
              onNext={goNext}
              nextDisabled={!canProceed}
              hideNext={isContact}
              nextLabel={currentStep === 7 ? "Continuar a contacto" : "Continuar"}
            />
          )}
        </div>

        {showSidebar && (
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-mineral underline-offset-2 hover:text-ink hover:underline"
              >
                Editar materiales
              </button>
              <QuoteSummary />
            </div>
          </aside>
        )}
      </div>

      <ExitQuoteDialog open={exitOpen} onClose={() => setExitOpen(false)} />
    </div>
  );
}
