import { SearchX } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
};

/** Estado vacío para listados, búsquedas y filtros sin resultados. */
export function EmptyState({
  title = "Sin resultados",
  description = "No encontramos contenido con los criterios seleccionados. Ajuste los filtros o la búsqueda.",
}: Props) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-3 rounded-sm border border-stone-beige bg-white px-6 py-16 text-center"
    >
      <SearchX aria-hidden="true" className="h-8 w-8 text-mineral" />
      <p className="font-serif text-xl text-ink">{title}</p>
      <p className="max-w-md text-sm text-charcoal/70">{description}</p>
    </div>
  );
}
