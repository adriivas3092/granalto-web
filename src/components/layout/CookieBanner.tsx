"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "granalto-cookie-consent";

/**
 * Aviso de cookies simple. La preferencia se guarda en localStorage.
 * Cuando se integre analítica con consentimiento granular, este componente
 * puede evolucionar a un gestor de consentimiento completo.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage no disponible: no mostrar el banner.
    }
  }, []);

  // Mientras el banner está abierto, el botón de WhatsApp se ubica encima.
  useEffect(() => {
    const root = document.documentElement;
    if (visible) root.dataset.cookieBanner = "open";
    else delete root.dataset.cookieBanner;
    return () => {
      delete root.dataset.cookieBanner;
    };
  }, [visible]);

  const decide = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignorar errores de almacenamiento.
    }
    // Avisar a la analítica (GA) para que se active/desactive sin recargar.
    try {
      window.dispatchEvent(new Event("cookie-consent-change"));
    } catch {
      // Entorno sin window: ignorar.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-beige bg-white px-4 py-3 shadow-[0_-2px_12px_rgba(17,17,17,0.06)] md:p-5"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 md:gap-6">
        <p className="text-xs leading-snug text-charcoal md:max-w-2xl md:text-sm">
          <span className="md:hidden">Usamos cookies. </span>
          <span className="hidden md:inline">
            Utilizamos cookies para mejorar su experiencia y analizar el uso del sitio. Puede conocer más en nuestra{" "}
          </span>
          <Link href="/politica-de-privacidad" className="link-editorial">
            <span className="md:hidden">Ver política</span>
            <span className="hidden md:inline">política de privacidad</span>
          </Link>
          <span className="hidden md:inline">.</span>
        </p>
        <div className="flex shrink-0 gap-2 md:gap-3">
          <Button variant="outline" onClick={() => decide("rejected")} className="min-h-[40px]! px-3! py-1.5! text-xs! md:px-4! md:py-2! md:text-sm!">
            Rechazar
          </Button>
          <Button onClick={() => decide("accepted")} className="min-h-[40px]! px-3! py-1.5! text-xs! md:px-4! md:py-2! md:text-sm!">
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}
