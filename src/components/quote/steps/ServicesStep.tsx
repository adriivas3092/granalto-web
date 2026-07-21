"use client";

import { useQuote } from "@/store/quoteStore";
import { SERVICE_OPTIONS, PROVINCES } from "@/data/quote-config";
import { formatPrice } from "@/lib/store/format";
import { cn } from "@/lib/utils";

const inputCls = "w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none";

/** Paso 7: instalación, servicios y ubicación. */
export function ServicesStep() {
  const configuration = useQuote((s) => s.configuration);
  const updateConfiguration = useQuote((s) => s.updateConfiguration);

  const isOn = (id: string) => configuration.services.some((s) => s.serviceId === id);
  const toggle = (id: string) => {
    const on = isOn(id);
    updateConfiguration({
      services: on
        ? configuration.services.filter((s) => s.serviceId !== id)
        : [...configuration.services, { serviceId: id }],
    });
  };

  const location = configuration.location;
  const setLocation = (patch: Partial<NonNullable<typeof location>>) =>
    updateConfiguration({ location: { province: location?.province ?? "", ...location, ...patch } });

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl md:text-3xl">Instalación y servicios</h2>
      <p className="mt-2 text-sm text-charcoal/80">Elegí los servicios que necesitás. El transporte se calcula por provincia.</p>

      <fieldset className="mt-6">
        <legend className="sr-only">Servicios</legend>
        <ul className="grid gap-2 sm:grid-cols-2">
          {SERVICE_OPTIONS.map((s) => (
            <li key={s.id}>
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-sm border p-3 transition-colors",
                  isOn(s.id) ? "border-ink bg-stone-beige/40" : "border-stone-beige bg-white hover:border-mineral",
                )}
              >
                <input type="checkbox" checked={isOn(s.id)} onChange={() => toggle(s.id)} className="mt-0.5 h-4 w-4" />
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-ink">{s.name}</span>
                  <span className="block text-xs text-mineral">
                    {s.id === "transporte" ? "Según provincia" : s.price === 0 ? "Incluido / a confirmar" : s.kind === "perM2" ? `${formatPrice(s.price)}/m²` : formatPrice(s.price)}
                    {s.help ? ` · ${s.help}` : ""}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <div>
          <label htmlFor="loc-prov" className="mb-1 block text-sm text-charcoal">Provincia</label>
          <select id="loc-prov" className={inputCls} value={location?.province ?? ""} onChange={(e) => setLocation({ province: e.target.value })}>
            <option value="">Seleccionar…</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="loc-canton" className="mb-1 block text-sm text-charcoal">Cantón</label>
          <input id="loc-canton" className={inputCls} value={location?.canton ?? ""} onChange={(e) => setLocation({ canton: e.target.value })} />
        </div>
        <div>
          <label htmlFor="loc-dist" className="mb-1 block text-sm text-charcoal">Distrito</label>
          <input id="loc-dist" className={inputCls} value={location?.district ?? ""} onChange={(e) => setLocation({ district: e.target.value })} />
        </div>
        <div>
          <label htmlFor="loc-cp" className="mb-1 block text-sm text-charcoal">Código postal</label>
          <input id="loc-cp" inputMode="numeric" className={inputCls} value={location?.postalCode ?? ""} onChange={(e) => setLocation({ postalCode: e.target.value })} />
        </div>
      </div>
    </div>
  );
}
