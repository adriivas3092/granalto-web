import { CTASection } from "@/components/sections/CTASection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { getFaqs } from "@/data/faqs";
import { faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Preguntas frecuentes",
  description:
    "Respuestas a las dudas más comunes sobre materiales, cotizaciones, instalación y mantenimiento de superficies con Granalto Costa Rica.",
  path: "/preguntas-frecuentes",
});

export default function FaqPage() {
  const faqs = getFaqs();

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-36">
        <Breadcrumbs
          items={[{ name: "Preguntas frecuentes", path: "/preguntas-frecuentes" }]}
        />
        <h1 className="mt-8 text-4xl leading-tight md:text-5xl">
          Preguntas frecuentes
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-charcoal/80">
          Respuestas a las dudas más comunes sobre materiales, cotizaciones,
          instalación y mantenimiento.
        </p>

        <JsonLd data={faqSchema(faqs)} />
        <dl className="mt-12 divide-y divide-stone-beige border-y border-stone-beige">
          {faqs.map((faq) => (
            <div key={faq.id} className="py-7">
              <dt className="font-serif text-xl text-ink">{faq.question}</dt>
              <dd className="mt-3 text-base leading-relaxed text-charcoal/80">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <CTASection
        source="faq"
        title="¿Tiene otra pregunta?"
        description="Escríbanos por WhatsApp o complete el formulario de contacto: le respondemos con gusto."
      />
    </>
  );
}
