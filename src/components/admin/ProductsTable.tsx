"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Pencil, Eye, EyeOff, Trash2, AlertTriangle } from "lucide-react";
import { formatPrice } from "@/lib/store/format";
import { stockBajo, STOCK_BLOQUEO } from "@/lib/store/stock";
import {
  bulkDeleteProducts,
  bulkSetAvailabilityForIds,
  toggleAvailability,
  deleteProduct,
} from "@/app/admin/actions";
import { cn } from "@/lib/utils";
import type { Product, Category } from "@/types/store";

/** Tabla de productos con selección múltiple y acciones en bloque. */
export function ProductsTable({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const catName = (id: string | null) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  const allIds = useMemo(() => products.map((p) => p.id), [products]);
  const allSelected = selected.size > 0 && selected.size === products.length;

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === products.length ? new Set() : new Set(allIds),
    );

  const clear = () => setSelected(new Set());

  const runDisable = () => {
    const ids = [...selected];
    startTransition(async () => {
      await bulkSetAvailabilityForIds(ids, false);
      clear();
    });
  };

  const runEnable = () => {
    const ids = [...selected];
    startTransition(async () => {
      await bulkSetAvailabilityForIds(ids, true);
      clear();
    });
  };

  const runDelete = () => {
    const ids = [...selected];
    if (
      !confirm(
        `¿Eliminar ${ids.length} producto(s) seleccionado(s)? Esta acción no se puede deshacer.`,
      )
    )
      return;
    startTransition(async () => {
      await bulkDeleteProducts(ids);
      clear();
    });
  };

  const bloqueados = products.filter((p) => p.stock <= STOCK_BLOQUEO).length;
  const pocos = products.filter((p) => p.stock > STOCK_BLOQUEO && stockBajo(p.stock)).length;

  return (
    <div>
      {/* Alerta de stock */}
      {(bloqueados > 0 || pocos > 0) && (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-sm border border-[#b8863b]/40 bg-[#b8863b]/10 p-3 text-sm text-[#8a5f24]">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            {bloqueados > 0 && (
              <strong>{bloqueados} producto(s) bloqueado(s) por quedarse sin stock. </strong>
            )}
            {pocos > 0 && <>{pocos} con poco stock (≤ {3} unidades). Revisá y reponé.</>}
          </span>
        </div>
      )}

      {/* Barra de acciones en bloque */}
      <div
        className={cn(
          "mb-3 flex flex-wrap items-center gap-2 rounded-sm border p-3 transition-colors",
          selected.size > 0
            ? "border-ink bg-ivory/70"
            : "border-stone-beige bg-ivory/40",
        )}
      >
        <span className="text-sm text-charcoal">
          {selected.size > 0
            ? `${selected.size} seleccionado(s)`
            : "Seleccione productos para acciones en bloque"}
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={runEnable}
            disabled={selected.size === 0 || pending}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-sm border border-stone-beige bg-white px-3 py-1.5 text-sm text-charcoal hover:border-ink disabled:opacity-40"
          >
            <Eye className="h-4 w-4" /> Activar
          </button>
          <button
            type="button"
            onClick={runDisable}
            disabled={selected.size === 0 || pending}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-sm border border-stone-beige bg-white px-3 py-1.5 text-sm text-charcoal hover:border-ink disabled:opacity-40"
          >
            <EyeOff className="h-4 w-4" /> Desactivar
          </button>
          <button
            type="button"
            onClick={runDelete}
            disabled={selected.size === 0 || pending}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-sm bg-[#a03826] px-3 py-1.5 text-sm font-medium text-white hover:brightness-95 disabled:opacity-40"
          >
            <Trash2 className="h-4 w-4" /> Borrar seleccionados
          </button>
          {selected.size > 0 && (
            <button
              type="button"
              onClick={clear}
              disabled={pending}
              className="inline-flex min-h-[38px] items-center rounded-sm px-3 py-1.5 text-sm text-mineral hover:text-ink disabled:opacity-40"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-sm border border-stone-beige bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b border-stone-beige text-left text-xs uppercase tracking-wide text-mineral">
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Seleccionar todos"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="h-4 w-4 accent-ink"
                />
              </th>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Visibilidad</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isSel = selected.has(p.id);
              return (
                <tr
                  key={p.id}
                  className={cn(
                    "border-b border-stone-beige/60 last:border-0",
                    isSel && "bg-ivory/60",
                  )}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label={`Seleccionar ${p.name}`}
                      checked={isSel}
                      onChange={() => toggleOne(p.id)}
                      className="h-4 w-4 accent-ink"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-ink">{p.name}</span>
                    {p.sku && (
                      <span className="ml-2 text-xs text-mineral">{p.sku}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-charcoal">
                    {catName(p.category_id)}
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {formatPrice(p.price, p.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-charcoal">{p.stock}</span>
                      {p.stock <= STOCK_BLOQUEO ? (
                        <span className="inline-flex items-center gap-1 rounded-sm bg-[#a03826]/10 px-2 py-0.5 text-[11px] font-medium text-[#a03826]">
                          <AlertTriangle className="h-3 w-3" /> Sin stock · bloqueado
                        </span>
                      ) : stockBajo(p.stock) ? (
                        <span className="inline-flex items-center gap-1 rounded-sm bg-[#b8863b]/15 px-2 py-0.5 text-[11px] font-medium text-[#8a5f24]">
                          <AlertTriangle className="h-3 w-3" /> Poco stock
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={pending}
                      title={p.available ? "Ocultar de la tienda" : "Mostrar en la tienda"}
                      onClick={() =>
                        startTransition(() => toggleAvailability(p.id, !p.available))
                      }
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1.5 text-xs transition-colors disabled:opacity-50",
                        p.available
                          ? "bg-[#e2ede2] text-[#3f6b41] hover:brightness-95"
                          : "bg-stone-beige text-charcoal hover:brightness-95",
                      )}
                    >
                      {p.available ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                      {p.available ? "Visible" : "Oculto"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/productos/${p.id}`}
                        className="inline-flex items-center gap-1 rounded-sm border border-stone-beige px-2.5 py-1.5 text-xs text-charcoal hover:border-ink"
                      >
                        <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
                        Editar
                      </Link>
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => {
                          if (
                            !confirm(
                              `¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`,
                            )
                          )
                            return;
                          startTransition(() => deleteProduct(p.id));
                        }}
                        aria-label={`Eliminar ${p.name}`}
                        className="inline-flex items-center gap-1 rounded-sm border border-stone-beige px-2.5 py-1.5 text-xs text-charcoal transition-colors hover:border-[#a03826] hover:text-[#a03826] disabled:opacity-50"
                      >
                        <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-mineral">
                  No hay productos en esta categoría. Pulse “Nuevo producto” para agregar uno.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
