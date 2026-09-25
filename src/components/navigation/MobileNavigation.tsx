"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { mainNavigation } from "@/config/navigation";
import { getWhatsAppUrl, siteConfig } from "@/config/site";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Menú móvil accesible: se cierra al navegar y con Escape. */
export function MobileNavigation({ isTransparent }: { isTransparent: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  // Cerrar al cambiar de ruta.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Cerrar con Escape y bloquear scroll del body mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label="Abrir menú de navegación"
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-sm transition-colors",
          isTransparent ? "text-ivory hover:bg-white/10" : "text-ink hover:bg-stone-beige/60",
        )}
      >
        <Menu aria-hidden="true" className="h-6 w-6" />
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="fixed inset-0 z-[100] flex flex-col bg-ivory"
          >
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <Logo variant="dark" size="md" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar menú"
              className="flex h-11 w-11 items-center justify-center rounded-sm text-ink hover:bg-stone-beige/60"
            >
              <X aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          <nav aria-label="Navegación móvil" className="flex-1 overflow-y-auto px-5 py-3 sm:px-6">
            <ul className="divide-y divide-stone-beige/70">
              <li>
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-[15px] font-medium text-ink hover:text-mineral"
                >
                  Inicio
                </Link>
              </li>
              {mainNavigation.map((item) => (
                <li key={item.href} className="py-0.5">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-[15px] font-medium text-ink hover:text-mineral"
                    aria-current={pathname === item.href ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="mb-1.5 ml-3 flex flex-wrap gap-x-4 gap-y-1 border-l border-stone-beige pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block py-1 text-sm text-charcoal hover:text-ink"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li>
                <Link
                  href="/ubicaciones"
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-[15px] font-medium text-ink hover:text-mineral"
                >
                  Ubicaciones
                </Link>
              </li>
              <li>
                <Link
                  href="/cuenta"
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-[15px] font-medium text-ink hover:text-mineral"
                >
                  Mi cuenta
                </Link>
              </li>
            </ul>
          </nav>

          <div className="space-y-2.5 border-t border-stone-beige px-5 py-4 sm:px-6">
            <Link
              href="/contacto"
              onClick={() => {
                trackEvent({ name: "cta_advisory_click", params: { source: "mobile-menu" } });
                setOpen(false);
              }}
              className="block rounded-sm bg-ink px-6 py-3 text-center text-sm font-medium tracking-wide text-ivory"
            >
              Solicitar asesoría
            </Link>
            <a
              href={getWhatsAppUrl(siteConfig.whatsappMessages.default)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent({ name: "whatsapp_click", params: { source: "mobile-menu" } })}
              className="flex items-center justify-center gap-2 rounded-sm border border-ink px-6 py-3 text-sm font-medium tracking-wide text-ink"
            >
              <MessageCircle aria-hidden="true" className="h-4 w-4" />
              Escribir por WhatsApp
            </a>
          </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
