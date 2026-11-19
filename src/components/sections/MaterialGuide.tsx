import type { MaterialGuide as Guide } from "@/data/materialGuides";

/** Secciones explicativas + preguntas frecuentes de un material. */
export function MaterialGuide({ guide, materialName }: { guide: Guide; materialName: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl space-y-12">
        {guide.sections.map((section) => (
          <div key={section.heading}>
            <h2 className="font-serif text-2xl text-ink md:text-3xl">{section.heading}</h2>
            {section.paragraphs.map((p, i) => (
              <p key={i} className="mt-4 text-base leading-relaxed text-charcoal/85 md:text-lg">
                {p}
              </p>
            ))}
          </div>
        ))}

        {guide.faqs.length > 0 && (
          <div>
            <h2 className="font-serif text-2xl text-ink md:text-3xl">
              Preguntas frecuentes sobre {materialName.toLowerCase()}
            </h2>
            <div className="mt-6 divide-y divide-stone-beige border-y border-stone-beige">
              {guide.faqs.map((faq) => (
                <details key={faq.question} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-ink md:text-lg">
                    <h3 className="font-sans text-base font-medium md:text-lg">{faq.question}</h3>
                    <span aria-hidden="true" className="text-mineral transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-base leading-relaxed text-charcoal/85">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
