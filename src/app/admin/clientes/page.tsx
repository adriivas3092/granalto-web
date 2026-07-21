import { Users } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCustomers } from "@/lib/store/admin";
import { formatPrice } from "@/lib/store/format";
import { requireAdmin } from "@/lib/supabase/admin-guard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Clientes", robots: { index: false } };

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminCustomersPage() {
  await requireAdmin();
  const customers = await getCustomers();

  return (
    <AdminShell>
      <div>
        <h1 className="font-sans text-2xl font-bold text-ink">Clientes</h1>
        <p className="text-sm text-charcoal/70">{customers.length} cliente(s) con pedidos</p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-stone-beige bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-stone-beige text-left text-xs uppercase tracking-wide text-mineral">
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Contacto</th>
              <th className="px-4 py-3 font-medium">Pedidos</th>
              <th className="px-4 py-3 font-medium">Total comprado</th>
              <th className="px-4 py-3 font-medium">Último pedido</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.customer_id} className="border-b border-stone-beige/60 last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-4 py-3">
                  <span className="block text-charcoal">{c.email}</span>
                  {c.phone && <span className="block text-xs text-mineral">{c.phone}</span>}
                </td>
                <td className="px-4 py-3 text-charcoal">{c.orders}</td>
                <td className="px-4 py-3 font-medium text-ink">{formatPrice(c.total, c.currency)}</td>
                <td className="px-4 py-3 text-charcoal">{fmtDate(c.last_order)}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-mineral">
                  <Users aria-hidden="true" className="mx-auto mb-2 h-7 w-7" />
                  Aún no hay clientes con pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
