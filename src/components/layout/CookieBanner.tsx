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

  const decide = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignorar errores de almacenamiento.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-stone-beige bg-white p-4 shadow-[0_-2px_12px_rgba(17,17,17,0.06)] md:p-5"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-2xl text-sm text-charcoal">
          Utilizamos cookies para mejorar su experiencia y analizar el uso del
          sitio. Puede conocer más en nuestra{" "}
          <Link href="/politica-de-privacidad" className="link-editorial">
            política de privacidad
          </Link>
          .
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => decide("rejected")} className="px-4 py-2">
            Rechazar
          </Button>
          <Button onClick={() => decide("accepted")} className="px-4 py-2">
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}
