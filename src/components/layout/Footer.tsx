import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { footerNavigation, legalNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getLocations } from "@/data/locations";
import { TrackedContactLink } from "@/components/layout/TrackedContactLink";

const socialLabels: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  pinterest: "Pinterest",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};

/** Footer principal: navegación, colecciones, contacto y ubicaciones. */
export function Footer() {
  const locations = getLocations();
  const socials = Object.entries(siteConfig.social).filter(([, url]) => Boolean(url));

  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo size="md" />
            <p className="mt-4 text-sm leading-relaxed text-stone-beige">
              Superficies, materiales y soluciones para crear espacios con
              identidad, calidad y diseño.
            </p>
          </div>

          <nav aria-label="Navegación del pie de página">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-mineral">
              Navegación
            </p>
            <ul className="mt-4 space-y-2.5">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone-beige transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Colecciones en el pie de página">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-mineral">
              Colecciones
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/colecciones/cocina" className="text-sm text-stone-beige transition-colors hover:text-white">
                  Cocina
                </Link>
              </li>
              <li>
                <Link href="/colecciones/bano" className="text-sm text-stone-beige transition-colors hover:text-white">
                  Baño
                </Link>
              </li>
              <li>
                <Link href="/colecciones/hogar" className="text-sm text-stone-beige transition-colors hover:text-white">
                  Hogar
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-mineral">
              Contacto
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-stone-beige">
              <li>
                <TrackedContactLink
                  href={siteConfig.contact.phoneHref}
                  event={{ name: "phone_click", params: { phone: siteConfig.contact.phone } }}
                  className="transition-colors hover:text-white"
                >
                  {siteConfig.contact.phone}
                </TrackedContactLink>
              </li>
              <li>
                <TrackedContactLink
                  href={`https://wa.me/${siteConfig.contact.whatsappNumber}`}
                  event={{ name: "whatsapp_click", params: { source: "footer" } }}
                  className="transition-colors hover:text-white"
                  external
                >
                  {siteConfig.contact.whatsapp} (WhatsApp)
                </TrackedContactLink>
              </li>
              <li>
                <TrackedContactLink
                  href={siteConfig.contact.emailHref}
                  event={{ name: "email_click", params: { email: siteConfig.contact.email } }}
                  className="transition-colors hover:text-white"
                >
                  {siteConfig.contact.email}
                </TrackedContactLink>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-mineral">
              Ubicaciones
            </p>
            <ul className="mt-4 space-y-2.5">
              {locations.map((location) => (
                <li key={location.id}>
                  <Link
                    href={`/ubicaciones/${location.slug}`}
                    className="text-sm text-stone-beige transition-colors hover:text-white"
                  >
                    {location.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-charcoal pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-mineral">
            © {new Date().getFullYear()} {siteConfig.legalName}. Todos los derechos
            reservados.
          </p>
          <nav aria-label="Enlaces legales">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-mineral transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {socials.length > 0 && (
            <ul className="flex gap-4" aria-label="Redes sociales">
              {socials.map(([key, url]) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-wide text-mineral transition-colors hover:text-white"
                  >
                    {socialLabels[key] ?? key}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
