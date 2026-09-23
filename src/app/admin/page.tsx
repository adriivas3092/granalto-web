import Link from "next/link";
import {
  Package,
  ShoppingBag,
  FileText,
  Users,
  Eye,
  EyeOff,
  ArrowRight,
  Plus,
  Store,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAllProducts, getAllOrders, getCustomers, getSalesStats } from "@/lib/store/admin";
import { formatPrice } from "@/lib/store/format";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/types/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin | Inicio", robots: { index: false } };

export default async function AdminInicioPage() {
  await requireAdmin();

  const [products, orders, customers, sales] = await Promise.all([
    getAllProducts(),
    getAllOrders(),
    getCustomers(),
    getSalesStats(),
  ]);

  const visibles = products.filter((p) => p.available).length;
  const ocultos = products.length - visibles;
  const pedidosPendientes = orders.filter((o) => o.status === "pendiente").length;

  // Solicitudes del cotizador (puede no existir la tabla todavía).
  let solicitudes = 0;
  try {
    const supabase = await createSupabaseServerClient();
    const { count } = await supabase
      .from("configuraciones")
      .select("id", { count: "exact", head: true });
    solicitudes = count ?? 0;
  } catch {
    solicitudes = 0;
  }

  const stats = [
    { label: "Productos", value: products.length, hint: `${visibles} visibles · ${ocultos} ocultos`, icon: Package },
    { label: "Pedidos", value: orders.length, hint: `${pedidosPendientes} pendientes`, icon: ShoppingBag },
    { label: "Pedidos de sobres", value: solicitudes, hint: "desde el cotizador", icon: FileText },
    { label: "Clientes", value: customers.length, hint: "con pedidos", icon: Users },
  ];

  const secciones = [
    { href: "/admin/productos", title: "Productos", desc: "Catálogo de la tienda: precios, stock y visibilidad.", icon: Package },
    { href: "/admin/pedidos", title: "Pedidos", desc: "Pedidos de la tienda en línea y su estado.", icon: ShoppingBag },
    { href: "/admin/solicitudes", title: "Pedidos de sobres", desc: "Solicitudes que llegan desde el cotizador.", icon: FileText },
    { href: "/admin/clientes", title: "Clientes", desc: "Clientes que han comprado y su historial.", icon: Users },
  ];

  return (
    <AdminShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink">Panel de administración</h1>
          <p className="mt-1 text-sm text-charcoal/70">Resumen general y accesos rápidos.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex min-h-[40px] items-center gap-2 rounded-sm bg-ink px-4 py-2 text-sm font-medium text-ivory hover:bg-charcoal"
          >
            <Plus className="h-4 w-4" /> Nuevo producto
          </Link>
          <Link
            href="/tienda"
            className="inline-flex min-h-[40px] items-center gap-2 rounded-sm border border-stone-beige bg-white px-4 py-2 text-sm text-charcoal hover:border-ink"
          >
            <Store className="h-4 w-4" /> Ver tienda
          </Link>
        </div>
      </div>

      {/* Tarjetas de resumen */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-sm border border-stone-beige bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-charcoal/70">{s.label}</span>
              <s.icon aria-hidden="true" className="h-5 w-5 text-mineral" />
            </div>
            <p className="mt-2 font-serif text-3xl text-ink">{s.value}</p>
            <p className="mt-1 text-xs text-mineral">{s.hint}</p>
          </div>
        ))}
      </div>

      {/* Estadísticas de ventas */}
      <h2 className="mt-10 mb-4 text-xs uppercase tracking-[0.16em] text-mineral">Estadísticas de ventas</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-sm border border-stone-beige bg-white p-5">
          <span className="text-sm text-charcoal/70">Ingresos totales</span>
          <p className="mt-2 font-serif text-2xl text-ink">{formatPrice(sales.revenue, sales.currency)}</p>
          <p className="mt-1 text-xs text-mineral">Sin contar cancelados</p>
        </div>
        <div className="rounded-sm border border-stone-beige bg-white p-5">
          <span className="text-sm text-charcoal/70">Ticket promedio</span>
          <p className="mt-2 font-serif text-2xl text-ink">{formatPrice(sales.avgTicket, sales.currency)}</p>
          <p className="mt-1 text-xs text-mineral">Por pedido</p>
        </div>
        <div className="rounded-sm border border-stone-beige bg-white p-5">
          <span className="text-sm text-charcoal/70">Últimos 30 días</span>
          <p className="mt-2 font-serif text-2xl text-ink">{formatPrice(sales.last30Revenue, sales.currency)}</p>
          <p className="mt-1 text-xs text-mineral">{sales.last30Orders} pedido(s)</p>
        </div>
        <div className="rounded-sm border border-stone-beige bg-white p-5">
          <span className="text-sm text-charcoal/70">Unidades vendidas</span>
          <p className="mt-2 font-serif text-2xl text-ink">{sales.unitsSold}</p>
          <p className="mt-1 text-xs text-mineral">En todos los pedidos</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Pedidos por estado */}
        <div className="rounded-sm border border-stone-beige bg-white p-5">
          <h3 className="mb-3 text-sm font-medium text-ink">Pedidos por estado</h3>
          {orders.length === 0 ? (
            <p className="text-sm text-mineral">Aún no hay pedidos.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((st) => (
                <li key={st} className="rounded-sm border border-stone-beige px-3 py-1.5 text-sm text-charcoal">
                  {ORDER_STATUS_LABELS[st]}
                  <span className="ml-2 font-semibold text-ink">{sales.byStatus[st] ?? 0}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Productos más vendidos */}
        <div className="rounded-sm border border-stone-beige bg-white p-5">
          <h3 className="mb-3 text-sm font-medium text-ink">Productos más vendidos</h3>
          {sales.topProducts.length === 0 ? (
            <p className="text-sm text-mineral">Todavía no hay compras registradas.</p>
          ) : (
            <ul className="space-y-2">
              {sales.topProducts.map((p) => (
                <li key={p.name} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-charcoal">{p.name}</span>
                  <span className="shrink-0 text-mineral">
                    <span className="font-semibold text-ink">{p.qty}</span> uds · {formatPrice(p.total, sales.currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Accesos por sección */}
      <h2 className="mt-10 mb-4 text-xs uppercase tracking-[0.16em] text-mineral">Secciones</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {secciones.map((sec) => (
          <Link
            key={sec.href}
            href={sec.href}
            className="group flex items-start gap-4 rounded-sm border border-stone-beige bg-white p-5 transition-colors hover:border-ink"
          >
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-ivory text-ink">
              <sec.icon aria-hidden="true" className="h-5 w-5" />
            </span>
            <span className="flex-1">
              <span className="flex items-center gap-1 font-medium text-ink">
                {sec.title}
                <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </span>
              <span className="mt-1 block text-sm text-charcoal/70">{sec.desc}</span>
            </span>
          </Link>
        ))}
      </div>

      {/* Atajo de visibilidad */}
      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-sm border border-stone-beige bg-ivory/60 p-4">
        <span className="text-sm text-charcoal">
          {visibles} productos visibles y {ocultos} ocultos en la tienda.
        </span>
        <Link
          href="/admin/productos"
          className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:underline"
        >
          {ocultos > 0 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          Gestionar visibilidad
        </Link>
      </div>
    </AdminShell>
  );
}
