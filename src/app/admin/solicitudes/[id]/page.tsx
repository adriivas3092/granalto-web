import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildFicha, type FichaCliente } from "@/lib/configurador/ficha";
import type { Medida, SalpicaderoTipo } from "@/lib/configurador/pricing";
import type { Unidad } from "@/data/configurador";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Pedido de sobre", robots: { index: false } };

type Payload = {
  geometriaId?: string | null;
  materialId?: string | null;
  colorId?: string | null;
  medidas?: Record<string, Medida>;
  moldura?: boolean | null;
  salpicaderoTipo?: SalpicaderoTipo;
  salpicaderoAlturaCm?: number;
  unidad?: Unidad;
  derivar?: boolean;
  cliente?: FichaCliente;
};

export default async function SolicitudDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("configuraciones")
    .select("id, folio, payload, notificacion, estado, created_at")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const p = (data.payload ?? {}) as Payload;
  const { secciones } = buildFicha({
    geometriaId: p.geometriaId ?? null,
    materialId: p.materialId ?? null,
    colorId: p.colorId ?? null,
    medidas: p.medidas ?? {},
    moldura: p.moldura ?? null,
    salpicaderoTipo: p.salpicaderoTipo ?? "no",
    salpicaderoAlturaCm: p.salpicaderoAlturaCm ?? 0,
    unidad: p.unidad ?? "mm",
    derivar: p.derivar,
    cliente: p.cliente,
    folio: data.folio,
    fecha: new Date(data.created_at).toLocaleString("es-CR"),
  });

  const notif = data.notificacion as { canal?: string } | null;

  return (
    <AdminShell>
      <Link href="/admin/solicitudes" className="inline-flex items-center gap-2 text-sm text-charcoal hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Volver a pedidos de sobres
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-sans text-2xl font-bold text-ink">Pedido {data.folio}</h1>
          <p className="text-sm text-charcoal/70">Estado: {data.estado}</p>
        </div>
        {notif?.canal && (
          <span className="rounded-sm bg-stone-beige px-3 py-1 text-xs text-charcoal">
            Notificación: {notif.canal === "resend" ? "correo enviado" : notif.canal === "webhook" ? "webhook" : "no enviada"}
          </span>
        )}
      </div>

      <div className="mt-6 max-w-2xl rounded-sm border border-stone-beige bg-white p-6">
        {secciones.map((sec) => (
          <div key={sec.titulo} className="border-b border-stone-beige/70 py-3 first:pt-0 last:border-0 last:pb-0">
            <h2 className="mb-2 text-xs uppercase tracking-[0.14em] text-mineral">{sec.titulo}</h2>
            <dl className="space-y-1.5">
              {sec.filas.map((f) => (
                <div key={f.label} className="flex flex-wrap items-start justify-between gap-3">
                  <dt className="text-sm text-charcoal/80">{f.label}</dt>
                  <dd className="text-right text-sm font-medium text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
