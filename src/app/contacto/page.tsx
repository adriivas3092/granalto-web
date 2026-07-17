import Link from "next/link";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { CTASection } from "@/components/sections/CTASection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ContactForm } from "@/components/forms/ContactForm";
import { LocationCard } from "@/components/cards/LocationCard";
import { TrackedContactLink } from "@/components/layout/TrackedContactLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { getLocations } from "@/data/locations";
import { getFaqs } from "@/data/faqs";
import { getWhatsAppUrl, siteConfig } from "@/config/site";
import { faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Contacto | Solicite asesoría",
  description:
    "Contacte a Granalto Costa Rica: formulario de asesoría, WhatsApp +506 6090-3269, teléfono +506 4101-4800 y showrooms en Heredia, Escazú y Liberia.",
  path: "/contacto",
});

export default function ContactPage() {
  const locations = getLocations();
  const faqs = getFaqs().slice(0, 4);

  return (
    <>
      <section className="bg-ink pb-16 pt-28 text-ivory md:pb-20 md:pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-stone-beige">
            Contacto
          </p>
          <h1 className="max-w-3xl text-4xl leading-[1.08] md:text-6xl">
            Conversemos sobre su proyecto
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ivory/85 md:text-lg">
            Escríbanos, llámenos o visítenos. Nuestro equipo le acompaña desde
            la selección del material hasta la instalación.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ name: "Contacto", path: "/contacto" }]} />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-2">
            <SectionHeading
              title="Solicite asesoría"
              description="Complete el formulario y nuestro equipo se comunicará con usted. También puede escribirnos directamente:"
            />
            <ul className="space-y-4">
              <li>
                <TrackedContactLink
                  href={getWhatsAppUrl(siteConfig.whatsappMessages.advisory)}
                  event={{ name: "whatsapp_click", params: { source: "contacto" } }}
                  external
                  className="flex items-center gap-3 text-ink hover:underline"
                >
                  <MessageCircle aria-hidden="true" className="h-5 w-5 text-mineral" />
                  WhatsApp: {siteConfig.contact.whatsapp}
                </TrackedContactLink>
              </li>
              <li>
                <TrackedContactLink
                  href={siteConfig.contact.phoneHref}
                  event={{ name: "phone_click", params: { phone: siteConfig.contact.phone } }}
                  className="flex items-center gap-3 text-ink hover:underline"
                >
                  <Phone aria-hidden="true" className="h-5 w-5 text-mineral" />
                  Teléfono: {siteConfig.contact.phone}
                </TrackedContactLink>
              </li>
              <li>
                <TrackedContactLink
                  href={siteConfig.contact.emailHref}
                  event={{ name: "email_click", params: { email: siteConfig.contact.email } }}
                  className="flex items-center gap-3 text-ink hover:underline"
                >
                  <Mail aria-hidden="true" className="h-5 w-5 text-mineral" />
                  {siteConfig.contact.email}
                </TrackedContactLink>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Showrooms"
            title="Nuestras ubicaciones"
            description="Visítenos para conocer los materiales en persona."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {locations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <JsonLd data={faqSchema(faqs)} />
        <SectionHeading eyebrow="Preguntas frecuentes" title="Dudas comunes" />
        <dl className="divide-y divide-stone-beige border-y border-stone-beige">
          {faqs.map((faq) => (
            <div key={faq.id} className="py-6">
              <dt className="font-serif text-lg text-ink">{faq.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-charcoal/80">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm text-charcoal/70">
          Encuentre más respuestas en{" "}
          <Link href="/preguntas-frecuentes" className="link-editorial">
            preguntas frecuentes
          </Link>
          .
        </p>
      </section>

      <CTASection source="contacto" />
    </>
  );
}
