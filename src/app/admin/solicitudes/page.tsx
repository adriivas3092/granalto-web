import Link from "next/link";
import { FileText } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getGeometria, getMaterial } from "@/data/configurador";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Pedidos de sobres", robots: { index: false } };

type Cliente = {
  nombre?: string;
  correo?: string;
  telefono?: string;
  provincia?: string;
  canton?: string;
  retiro?: boolean;
};
type Payload = {
  geometriaId?: string | null;
  materialId?: string | null;
  colorId?: string | null;
  area?: number;
  derivar?: boolean;
  personalizado?: boolean;
  cliente?: Cliente;
};
type Row = {
  id: string;
  folio: string;
  payload: Payload;
  estado: string;
  created_at: string;
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("es-CR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminSolicitudesPage() {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("configuraciones")
    .select("id, folio, payload, estado, created_at")
    .order("created_at", { ascending: false })
    .limit(300);

  const rows = (data ?? []) as Row[];

  return (
    <AdminShell>
      <div>
        <h1 className="font-sans text-2xl font-bold text-ink">Pedidos de sobres</h1>
        <p className="text-sm text-charcoal/70">
          Solicitudes recibidas desde el cotizador · {rows.length} en total
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-sm border border-[#b8863b]/50 bg-[#b8863b]/10 p-4 text-sm text-ink">
          No se pudo leer la tabla <code>configuraciones</code>. Si es la primera vez, ejecutá el
          script <code>supabase/configuraciones.sql</code> en Supabase → SQL Editor.
          <span className="mt-1 block text-xs text-mineral">Detalle: {error.message}</span>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-sm border border-stone-beige bg-white">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-stone-beige text-left text-xs uppercase tracking-wide text-mineral">
              <th className="px-4 py-3 font-medium">Folio</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Proyecto</th>
              <th className="px-4 py-3 font-medium">Material</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Entrega</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const p = r.payload ?? {};
              const geo = getGeometria(p.geometriaId ?? null);
              const material = getMaterial(p.materialId ?? null);
              const color = material?.colores.find((c) => c.id === p.colorId);
              const esPers = p.personalizado || p.derivar || geo?.autoPrecio === false;
              const cli = p.cliente ?? {};
              return (
                <tr key={r.id} className="border-b border-stone-beige/60 last:border-0 hover:bg-ivory/60 align-top">
                  <td className="px-4 py-3">
                    <Link href={`/admin/solicitudes/${r.id}`} className="font-mono text-ink hover:underline">
                      {r.folio}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-charcoal">{fmtDate(r.created_at)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        esPers
                          ? "rounded-sm bg-stone-beige px-2 py-0.5 text-xs text-charcoal"
                          : "rounded-sm bg-[#e2ede2] px-2 py-0.5 text-xs text-[#3f6b41]"
                      }
                    >
                      {esPers ? "Personalizada" : "Pedido"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-charcoal">{geo?.nombre ?? "—"}</td>
                  <td className="px-4 py-3 text-charcoal">
                    {material ? material.nombre : "—"}
                    {color && <span className="block text-xs text-mineral">{color.nombre}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-ink">{cli.nombre || "—"}</span>
                    <span className="block text-xs text-mineral">{cli.correo}</span>
                    <span className="block text-xs text-mineral">{cli.telefono}</span>
                  </td>
                  <td className="px-4 py-3 text-charcoal">
                    {cli.retiro ? "Retiro en tienda" : "Domicilio"}
                    <span className="block text-xs text-mineral">
                      {[cli.provincia, cli.canton].filter(Boolean).join(" / ")}
                    </span>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && !error && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-mineral">
                  <FileText aria-hidden="true" className="mx-auto mb-2 h-7 w-7" />
                  Aún no hay solicitudes del cotizador.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
