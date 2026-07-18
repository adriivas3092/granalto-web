"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { mainNavigation } from "@/config/navigation";
import { getWhatsAppUrl, siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";

/**
 * Header sticky: transparente sobre el hero de la portada y sólido al
 * hacer scroll o en páginas internas. Cambia el color de logo y textos
 * según el fondo.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Solo la portada tiene hero oscuro a pantalla completa bajo el header.
  const transparentAllowed = pathname === "/";
  const isTransparent = transparentAllowed && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        isTransparent
          ? "bg-transparent text-ivory"
          : "border-b border-stone-beige/60 bg-ivory/95 text-ink backdrop-blur",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" aria-label="Granalto — inicio">
          <Logo variant={isTransparent ? "white" : "dark"} size="md" priority />
        </Link>

        <nav aria-label="Navegación principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {mainNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm tracking-wide transition-colors",
                    isTransparent
                      ? "text-ivory/90 hover:text-white"
                      : "text-charcoal hover:text-ink",
                    pathname.startsWith(item.href) && "font-semibold",
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={getWhatsAppUrl(siteConfig.whatsappMessages.default)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent({ name: "whatsapp_click", params: { source: "header" } })}
            aria-label="Escribir a Granalto por WhatsApp"
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-sm transition-colors",
              isTransparent
                ? "text-ivory hover:bg-white/10"
                : "text-charcoal hover:bg-stone-beige/60",
            )}
          >
            <MessageCircle aria-hidden="true" className="h-5 w-5" />
          </a>
          <Link
            href="/contacto"
            onClick={() => trackEvent({ name: "cta_advisory_click", params: { source: "header" } })}
            className={cn(
              "rounded-sm px-5 py-2.5 text-sm font-medium tracking-wide transition-colors",
              isTransparent
                ? "bg-ivory text-ink hover:bg-stone-beige"
                : "bg-ink text-ivory hover:bg-charcoal",
            )}
          >
            Solicitar asesoría
          </Link>
        </div>

        <MobileNavigation isTransparent={isTransparent} />
      </div>
    </header>
  );
}
