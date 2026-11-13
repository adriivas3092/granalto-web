"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Trash2, Loader2 } from "lucide-react";
import { bulkDeleteOrders } from "@/app/admin/actions";
import { formatPrice } from "@/lib/store/format";
import { OrderStatusBadge } from "@/components/store/OrderStatusBadge";
import type { Order, OrderStatus } from "@/types/store";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CR", { day: "2-digit", month: "short", year: "numeric" });
}

/** Tabla de pedidos del admin con selección por casillas y borrado en bloque. */
export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [seleccion, setSeleccion] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  const todos = orders.length > 0 && seleccion.size === orders.length;

  const alternar = (id: string) =>
    setSeleccion((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const alternarTodos = () =>
    setSeleccion(todos ? new Set() : new Set(orders.map((o) => o.id)));

  const eliminar = () => {
    const ids = Array.from(seleccion);
    if (ids.length === 0) return;
    const texto =
      ids.length === orders.length
        ? `¿Eliminar TODOS los ${ids.length} pedidos de esta lista? Esta acción no se puede deshacer.`
        : `¿Eliminar ${ids.length} pedido(s) seleccionado(s)? Esta acción no se puede deshacer.`;
    if (!confirm(texto)) return;
    setMensaje(null);
    startTransition(async () => {
      try {
        const { borrados } = await bulkDeleteOrders(ids);
        if (borrados === 0) {
          setMensaje({
            tipo: "error",
            texto:
              "No se eliminó ningún pedido. Falta habilitar el permiso de borrado en la base de datos (correr supabase/admin-pedidos.sql en Supabase).",
          });
          return;
        }
        setSeleccion(new Set());
        setMensaje({ tipo: "ok", texto: `Se eliminaron ${borrados} pedido(s).` });
        router.refresh();
      } catch (e) {
        setMensaje({
          tipo: "error",
          texto: e instanceof Error ? e.message : "No se pudieron eliminar los pedidos.",
        });
      }
    });
  };

  return (
    <div className="mt-6">
      <div className="mb-3 flex min-h-[40px] flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-charcoal/80">
          {seleccion.size > 0
            ? `${seleccion.size} seleccionado(s)`
            : "Marcá las casillas para eliminar pedidos."}
        </p>
        <button
          type="button"
          onClick={eliminar}
          disabled={pending || seleccion.size === 0}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-sm border border-[#a03826] px-4 py-2 text-sm font-medium text-[#a03826] transition-colors hover:bg-[#a03826] hover:text-white disabled:cursor-not-allowed disabled:border-stone-beige disabled:text-mineral disabled:hover:bg-transparent"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Eliminar seleccionados
        </button>
      </div>

      {mensaje && (
        <p
          role="status"
          className={
            mensaje.tipo === "ok"
              ? "mb-3 rounded-sm border border-ink/20 bg-ivory px-3 py-2 text-sm text-ink"
              : "mb-3 rounded-sm border border-[#a03826]/40 bg-[#a03826]/10 px-3 py-2 text-sm text-[#a03826]"
          }
        >
          {mensaje.texto}
        </p>
      )}

      <div className="overflow-x-auto rounded-sm border border-stone-beige bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-stone-beige text-left text-xs uppercase tracking-wide text-mineral">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Seleccionar todos los pedidos"
                  checked={todos}
                  onChange={alternarTodos}
                  disabled={orders.length === 0}
                  className="h-4 w-4 accent-ink"
                />
              </th>
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className={
                  seleccion.has(o.id)
                    ? "border-b border-stone-beige/60 bg-ivory last:border-0"
                    : "border-b border-stone-beige/60 last:border-0 hover:bg-ivory/60"
                }
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`Seleccionar pedido ${o.id.slice(0, 8).toUpperCase()}`}
                    checked={seleccion.has(o.id)}
                    onChange={() => alternar(o.id)}
                    className="h-4 w-4 accent-ink"
                  />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/pedidos/${o.id}`} className="font-mono text-ink hover:underline">
                    #{o.id.slice(0, 8).toUpperCase()}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="text-ink">{o.customer_name || "—"}</span>
                  <span className="block text-xs text-mineral">{o.customer_email}</span>
                </td>
                <td className="px-4 py-3 text-charcoal">{fmtDate(o.created_at)}</td>
                <td className="px-4 py-3 font-medium text-ink">{formatPrice(o.total, o.currency)}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={o.status as OrderStatus} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-mineral">
                  <Package aria-hidden="true" className="mx-auto mb-2 h-7 w-7" />
                  Aún no hay pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
