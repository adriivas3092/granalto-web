import { Configurador } from "@/components/configurador/Configurador";
import { buildMetadata } from "@/lib/metadata";
import { getDisponibilidad } from "@/lib/configurador/disponibilidad";
import { COTIZADOR_EN_CONSTRUCCION } from "@/lib/configurador/estado";
import { ContactForm } from "@/components/forms/ContactForm";
import { TrackedContactLink } from "@/components/layout/TrackedContactLink";
import { getWhatsAppUrl, siteConfig } from "@/config/site";
import { MessageCircle, Phone } from "lucide-react";

export const metadata = COTIZADOR_EN_CONSTRUCCION
  ? buildMetadata({
      title: "Cotice su sobre de cocina o baño",
      description:
        "Solicite una cotización de su sobre de cocina o baño en cuarzo, granito, cuarcita o mármol. Escríbanos por WhatsApp o déjenos sus datos y un asesor le responde.",
      path: "/cotizar",
      noIndex: true,
    })
  : buildMetadata({
      title: "Cotizador de sobres",
      description:
        "Configurá tu sobre de cocina o baño paso a paso: forma, material y color, medidas, moldura y salpicadero. Obtené un estimado y el plazo de producción.",
      path: "/cotizar",
    });

// Dinámica: la disponibilidad de materiales puede cambiar desde el admin.
export const dynamic = "force-dynamic";

export default async function CotizarPage() {
  if (COTIZADOR_EN_CONSTRUCCION) {
    return (
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <header className="mb-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-mineral">Cotización</p>
          <h1 className="mt-2 font-serif text-3xl text-ink md:text-4xl">
            Cotice su sobre de cocina o baño
          </h1>
          <p className="mt-3 text-charcoal/80">
            Cuéntenos qué necesita: tipo de espacio, material que le interesa y medidas aproximadas.
            Un asesor le responde con una cotización y el plazo de producción.
          </p>
        </header>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <ul className="space-y-4">
            <li>
              <TrackedContactLink
                href={getWhatsAppUrl(siteConfig.whatsappMessages.advisory)}
                event={{ name: "whatsapp_click", params: { source: "cotizar" } }}
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
          </ul>
          <ContactForm />
        </div>
      </section>
    );
  }

  const disponibilidad = await getDisponibilidad();
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6 lg:px-8 lg:pt-32">
      <header className="mb-10 max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-mineral">Cotizador</p>
        <h1 className="mt-2 font-serif text-3xl text-ink md:text-4xl">
          Configurá tu sobre en pocos pasos
        </h1>
        <p className="mt-3 text-charcoal/80">
          Te guiamos con opciones claras. Al final ves tu estimado y el plazo, y un asesor confirma los detalles.
        </p>
      </header>
      <Configurador disponibilidad={disponibilidad} />
    </section>
  );
}
