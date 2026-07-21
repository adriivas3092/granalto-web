import type { ProjectLocation, ServiceSelection } from "@/types/quote";
import { SERVICE_OPTIONS, TRANSPORT_ZONES, DEFAULT_TRANSPORT_COST } from "@/data/quote-config";
import type { ServicesResult } from "./types";

/** Costo de transporte según la provincia de entrega. */
export function calculateTransportCost(location?: ProjectLocation): number {
  if (!location?.province) return DEFAULT_TRANSPORT_COST;
  return TRANSPORT_ZONES[location.province]?.cost ?? DEFAULT_TRANSPORT_COST;
}

/**
 * Servicios seleccionados. Separa instalación y transporte porque el resultado
 * los reporta por aparte; el resto se agrupa en `otherServicesCost`.
 */
export function calculateServices(
  services: ServiceSelection[],
  billableArea: number,
  location?: ProjectLocation,
): ServicesResult {
  let installationCost = 0;
  let transportCost = 0;
  let otherServicesCost = 0;

  for (const sel of services) {
    const opt = SERVICE_OPTIONS.find((o) => o.id === sel.serviceId);
    if (!opt) continue;
    if (opt.id === "transporte") {
      transportCost += calculateTransportCost(location);
      continue;
    }
    const cost = opt.kind === "perM2" ? opt.price * billableArea : opt.price;
    if (opt.id === "instalacion") installationCost += cost;
    else otherServicesCost += cost;
  }

  return {
    installationCost: Math.round(installationCost),
    transportCost: Math.round(transportCost),
    otherServicesCost: Math.round(otherServicesCost),
  };
}
