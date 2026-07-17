import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { CTASection } from "@/components/sections/CTASection";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { TrackedContactLink } from "@/components/layout/TrackedContactLink";
import { getLocations, getLocationBySlug } from "@/data/locations";
import { localBusinessSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/metadata";
import { getWhatsAppUrl, siteConfig } from "@/config/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getLocations().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) return {};
  return buildMetadata({
    title: `Showroom ${location.name}`,
    description: `Visite el showroom de Granalto en ${location.name}: ${location.address}. Asesoría personalizada y selección de materiales.`,
    path: `/ubicaciones/${location.slug}`,
  });
}

export default async function LocationPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);
  if (!location) notFound();

  return (
    <>
      <JsonLd data={localBusinessSchema(location)} />

      <div className="mx-auto max-w-7xl px-4 pb-2 pt-24 sm:px-6 lg:px-8 lg:pt-32">
        <Breadcrumbs
          items={[
            { name: "Ubicaciones", path: "/ubicaciones" },
            { name: location.name, path: `/ubicaciones/${location.slug}` },
          ]}
        />
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-mineral">
              Showroom
            </p>
            <h1 className="mt-3 text-4xl leading-tight md:text-5xl">
              {location.name}
            </h1>

            <ul className="mt-8 space-y-4 text-base text-charcoal/85">
              <li className="flex gap-3">
                <MapPin aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-mineral" />
                <span>{location.address}</span>
              </li>
              {location.schedule.length > 0 ? (
                <li className="flex gap-3">
                  <Clock aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-mineral" />
                  <span>{location.schedule.join(" · ")}</span>
                </li>
              ) : (
                <li className="flex gap-3 text-charcoal/60">
                  <Clock aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-mineral" />
                  <span>Horario por confirmar — coordine su visita por WhatsApp.</span>
                </li>
              )}
              {location.phone && (
                <li className="flex gap-3">
                  <Phone aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-mineral" />
                  <TrackedContactLink
                    href={`tel:${location.phone.replace(/[\s-]/g, "")}`}
                    event={{ name: "phone_click", params: { phone: location.phone } }}
                    className="hover:underline"
                  >
                    {location.phone}
                  </TrackedContactLink>
                </li>
              )}
              {location.email && (
                <li className="flex gap-3">
                  <Mail aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-mineral" />
                  <TrackedContactLink
                    href={`mailto:${location.email}`}
                    event={{ name: "email_click", params: { email: location.email } }}
                    className="hover:underline"
                  >
                    {location.email}
                  </TrackedContactLink>
                </li>
              )}
            </ul>

            {location.services.length > 0 && (
              <div className="mt-8">
                <h2 className="font-serif text-xl text-ink">Servicios disponibles</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {location.services.map((service) => (
                    <li
                      key={service}
                      className="rounded-sm border border-stone-beige bg-white px-4 py-2 text-sm text-charcoal"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              {location.mapUrl && (
                <TrackedContactLink
                  href={location.mapUrl}
                  event={{ name: "directions_click", params: { locationId: location.id } }}
                  external
                  className="inline-flex min-h-[48px] items-center rounded-sm border border-ink px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-ivory"
                >
                  Cómo llegar
                </TrackedContactLink>
              )}
              <TrackedContactLink
                href={getWhatsAppUrl(
                  `${siteConfig.whatsappMessages.advisory} (Showroom ${location.name})`,
                )}
                event={{ name: "whatsapp_click", params: { source: `location-${location.slug}` } }}
                external
                className="inline-flex min-h-[48px] items-center rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory transition-colors hover:bg-charcoal"
              >
                Contactar por WhatsApp
              </TrackedContactLink>
            </div>
          </div>

          {location.image && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-stone-beige">
              <Image
                src={location.image.src}
                alt={location.image.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <CTASection source={`ubicacion-${location.slug}`} />
    </>
  );
}
