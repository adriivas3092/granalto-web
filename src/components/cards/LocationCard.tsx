"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import type { Location } from "@/types";
import { getWhatsAppUrl, siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";

/**
 * Tarjeta de showroom. Los CTAs solo se muestran cuando el dato existe
 * (p. ej. "Cómo llegar" requiere mapUrl validado).
 */
export function LocationCard({ location }: { location: Location }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-sm border border-stone-beige bg-white">
      {location.image && (
        <div className="relative aspect-[16/9] bg-stone-beige">
          <Image
            src={location.image.src}
            alt={location.image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-2xl text-ink">{location.name}</h3>
        <ul className="mt-4 space-y-2.5 text-sm text-charcoal/85">
          <li className="flex gap-2.5">
            <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-mineral" />
            <span>{location.address}</span>
          </li>
          {location.schedule.length > 0 && (
            <li className="flex gap-2.5">
              <Clock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-mineral" />
              <span>{location.schedule.join(" · ")}</span>
            </li>
          )}
          {location.phone && (
            <li className="flex gap-2.5">
              <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-mineral" />
              <a
                href={`tel:${location.phone.replace(/[\s-]/g, "")}`}
                className="hover:underline"
                onClick={() => trackEvent({ name: "phone_click", params: { phone: location.phone } })}
              >
                {location.phone}
              </a>
            </li>
          )}
          {location.email && (
            <li className="flex gap-2.5">
              <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-mineral" />
              <a
                href={`mailto:${location.email}`}
                className="hover:underline"
                onClick={() => trackEvent({ name: "email_click", params: { email: location.email } })}
              >
                {location.email}
              </a>
            </li>
          )}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2 pt-2">
          {location.mapUrl && (
            <a
              href={location.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent({ name: "directions_click", params: { locationId: location.id } })}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-ink px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-ivory"
            >
              <Navigation aria-hidden="true" className="h-4 w-4" />
              Cómo llegar
            </a>
          )}
          <a
            href={getWhatsAppUrl(
              `${siteConfig.whatsappMessages.advisory} (Showroom ${location.name})`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent({ name: "whatsapp_click", params: { source: `location-${location.slug}` } })}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-sm bg-ink px-4 py-2 text-sm font-medium text-ivory transition-colors hover:bg-charcoal"
          >
            Contactar
          </a>
          <Link
            href={`/ubicaciones/${location.slug}`}
            className="inline-flex min-h-[44px] items-center px-2 py-2 text-sm text-charcoal underline-offset-4 hover:underline"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}
