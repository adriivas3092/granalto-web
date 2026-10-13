import Image from "next/image";
import { Layers } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { DisponibilidadToggle } from "@/components/admin/DisponibilidadToggle";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MATERIALES, claveDisponibilidad } from "@/data/configurador";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Materiales", robots: { index: false } };

export default async function AdminMaterialesPage() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();

  // Disponibilidad guardada (override del catálogo).
  const overrides: Record<string, boolean> = {};
  try {
    const { data } = await supabase.from("material_disponibilidad").select("material_id, color_id, agotado");
    for (const r of (data ?? []) as { material_id: string; color_id: string; agotado: boolean }[]) {
      overrides[claveDisponibilidad(r.material_id, r.color_id)] = !!r.agotado;
    }
  } catch {
    // Tabla ausente: se muestran los valores del catálogo.
  }

  const efectivo = (materialId: string, colorId: string, base: boolean) => {
    const key = claveDisponibilidad(materialId, colorId);
    return Object.prototype.hasOwnProperty.call(overrides, key) ? overrides[key] : base;
  };

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink">Materiales del cotizador</h1>
          <p className="mt-1 text-sm text-charcoal/70">
            Activá o desactivá la disponibilidad de cada color. Los colores en <strong>Agotado</strong> muestran un aviso
            en el cotizador y no calculan precio.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {MATERIALES.map((m) => (
          <section key={m.id} className="rounded-sm border border-stone-beige bg-white">
            <header className="flex items-center gap-2 border-b border-stone-beige px-5 py-3">
              <Layers aria-hidden="true" className="h-4 w-4 text-mineral" />
              <h2 className="font-medium text-ink">{m.nombre}</h2>
              <span className="text-xs text-mineral">· espesor {m.espesorMm} mm</span>
            </header>
            <ul className="divide-y divide-stone-beige/70">
              {m.colores.map((c) => {
                const agotado = efectivo(m.id, c.id, !!c.agotado);
                return (
                  <li key={c.id} className="flex items-center justify-between gap-4 px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm border border-stone-beige">
                        {c.imagen ? (
                          <Image src={c.imagen} alt={c.nombre} fill sizes="40px" className="object-cover" />
                        ) : (
                          <span className="block h-full w-full" style={{ background: c.swatch }} />
                        )}
                      </span>
                      <span className="text-sm text-ink">{c.nombre}</span>
                    </div>
                    <DisponibilidadToggle materialId={m.id} colorId={c.id} agotado={agotado} />
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-6 text-xs text-mineral">
        Los cambios se aplican al instante en el cotizador. Si el botón no guarda, verificá que la tabla{" "}
        <code className="rounded bg-stone-beige/60 px-1">material_disponibilidad</code> exista en Supabase.
      </p>
    </AdminShell>
  );
}
