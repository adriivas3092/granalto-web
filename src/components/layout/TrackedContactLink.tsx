"use client";

import type { ReactNode } from "react";
import type { AnalyticsEvent } from "@/types";
import { trackEvent } from "@/lib/analytics";

type Props = {
  href: string;
  event: AnalyticsEvent;
  children: ReactNode;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
};

/** Enlace de contacto (tel/mailto/WhatsApp) que registra un evento analítico. */
export function TrackedContactLink({
  href,
  event,
  children,
  className,
  external = false,
  ariaLabel,
}: Props) {
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={() => trackEvent(event)}
    >
      {children}
    </a>
  );
}
