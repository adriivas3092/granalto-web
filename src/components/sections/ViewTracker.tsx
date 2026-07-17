"use client";

import { useEffect } from "react";
import type { AnalyticsEvent } from "@/types";
import { trackEvent } from "@/lib/analytics";

/** Registra un evento analítico de visualización al montar la página. */
export function ViewTracker({ event }: { event: AnalyticsEvent }) {
  useEffect(() => {
    trackEvent(event);
    // El evento es estable por página: solo se registra una vez al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
