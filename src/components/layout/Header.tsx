"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle, User } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { CartButton } from "@/components/store/CartButton";
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

        {/* Cluster derecho unificado: acciones visibles + menú hamburguesa en todas las pantallas. */}
        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href={getWhatsAppUrl(siteConfig.whatsappMessages.default)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent({ name: "whatsapp_click", params: { source: "header" } })}
            aria-label="Escribir a Granalto por WhatsApp"
            className={cn(
              "hidden h-11 w-11 items-center justify-center rounded-sm transition-colors sm:flex",
              isTransparent ? "text-ivory hover:bg-white/10" : "text-charcoal hover:bg-stone-beige/60",
            )}
          >
            <MessageCircle aria-hidden="true" className="h-5 w-5" />
          </a>

          <CartButton isTransparent={isTransparent} />

          <Link
            href="/cuenta"
            aria-label="Mi cuenta"
            className={cn(
              "hidden h-11 w-11 items-center justify-center rounded-sm transition-colors sm:flex",
              isTransparent ? "text-ivory hover:bg-white/10" : "text-charcoal hover:bg-stone-beige/60",
            )}
          >
            <User aria-hidden="true" className="h-5 w-5" />
          </Link>

          <Link
            href="/contacto"
            onClick={() => trackEvent({ name: "cta_advisory_click", params: { source: "header" } })}
            className={cn(
              "hidden rounded-sm px-5 py-2.5 text-sm font-medium tracking-wide transition-colors md:inline-flex",
              isTransparent ? "bg-ivory text-ink hover:bg-stone-beige" : "bg-ink text-ivory hover:bg-charcoal",
            )}
          >
            Solicitar asesoría
          </Link>

          <MobileNavigation isTransparent={isTransparent} />
        </div>
      </div>
    </header>
  );
}
