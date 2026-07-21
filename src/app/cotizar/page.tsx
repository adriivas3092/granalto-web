import { QuoteWizard } from "@/components/quote/QuoteWizard";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Cotizador de superficies",
  description:
    "Calculá el precio estimado de tu encimera o superficie Granalto. Elegí materiales, agregá medidas y compará opciones.",
  path: "/cotizar",
});

export default function CotizarPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-32">
      <QuoteWizard />
    </section>
  );
}
