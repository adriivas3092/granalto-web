"use client";

import { useState, useTransition } from "react";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/app/admin/actions";
import type { Category } from "@/types/store";

type Row = Category & { productCount: number };

const field =
  "w-full rounded-sm border border-stone-beige bg-white px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none";

/** Gestión de categorías de la tienda: crear, renombrar, ordenar y eliminar. */
export function CategoriesManager({ categories }: { categories: Row[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-8">
      {/* Crear categoría */}
      <section className="rounded-sm border border-stone-beige bg-white p-5">
        <h2 className="mb-3 font-sans text-lg font-semibold text-ink">Nueva categoría</h2>
        <form
          action={(fd) => startTransition(() => createCategory(fd))}
          className="flex flex-wrap items-end gap-3"
        >
          <div className="min-w-[220px] flex-1">
            <label htmlFor="new-name" className="mb-1 block text-sm text-charcoal">
              Nombre
            </label>
            <input
              id="new-name"
              name="name"
              required
              placeholder="Ej. Adhesivos"
              className={field}
            />
          </div>
          <div className="w-28">
            <label htmlFor="new-position" className="mb-1 block text-sm text-charcoal">
              Orden
            </label>
            <input
              id="new-position"
              name="position"
              type="number"
              step="1"
              defaultValue={(categories.at(-1)?.position ?? 0) + 1}
              className={field}
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-sm bg-ink px-4 py-2 text-sm font-medium text-ivory hover:bg-charcoal disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Crear
          </button>
        </form>
        <p className="mt-2 text-xs text-mineral">
          La dirección web (slug) se genera automáticamente a partir del nombre.
        </p>
      </section>

      {/* Lista editable */}
      <section className="overflow-x-auto rounded-sm border border-stone-beige bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-stone-beige text-left text-xs uppercase tracking-wide text-mineral">
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Orden</th>
              <th className="px-4 py-3 font-medium">Productos</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <CategoryRow key={c.id} category={c} pending={pending} start={startTransition} />
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-mineral">
                  No hay categorías. Cree la primera arriba.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function CategoryRow({
  category,
  pending,
  start,
}: {
  category: Row;
  pending: boolean;
  start: (cb: () => void) => void;
}) {
  const [name, setName] = useState(category.name);
  const [position, setPosition] = useState(String(category.position));
  const dirty = name.trim() !== category.name || position !== String(category.position);

  const save = () => {
    const fd = new FormData();
    fd.set("name", name);
    fd.set("position", position);
    start(() => updateCategory(category.id, fd));
  };

  const remove = () => {
    const msg =
      category.productCount > 0
        ? `¿Eliminar «${category.name}»? Sus ${category.productCount} producto(s) quedarán sin categoría (no se borran).`
        : `¿Eliminar «${category.name}»?`;
    if (!confirm(msg)) return;
    start(() => deleteCategory(category.id));
  };

  return (
    <tr className="border-b border-stone-beige/60 last:border-0">
      <td className="px-4 py-3">
        <input
          aria-label={`Nombre de ${category.name}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={field}
        />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-mineral">{category.slug}</td>
      <td className="px-4 py-3">
        <input
          aria-label={`Orden de ${category.name}`}
          type="number"
          step="1"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className={`${field} w-20`}
        />
      </td>
      <td className="px-4 py-3 text-charcoal">{category.productCount}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={pending || !dirty}
            className="inline-flex items-center gap-1 rounded-sm border border-stone-beige px-2.5 py-1.5 text-xs text-charcoal hover:border-ink disabled:opacity-40"
          >
            <Save className="h-3.5 w-3.5" /> Guardar
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={pending}
            aria-label={`Eliminar ${category.name}`}
            className="inline-flex items-center gap-1 rounded-sm border border-stone-beige px-2.5 py-1.5 text-xs text-charcoal transition-colors hover:border-[#a03826] hover:text-[#a03826] disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" /> Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
