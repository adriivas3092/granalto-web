import { AlertTriangle } from "lucide-react";

type Props = {
  title?: string;
  description?: string;
};

/** Estado de error para secciones que no pudieron cargar. */
export function ErrorState({
  title = "Algo salió mal",
  description = "No pudimos cargar este contenido. Intente de nuevo en unos momentos.",
}: Props) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-sm border border-stone-beige bg-white px-6 py-16 text-center"
    >
      <AlertTriangle aria-hidden="true" className="h-8 w-8 text-mineral" />
      <p className="font-serif text-xl text-ink">{title}</p>
      <p className="max-w-md text-sm text-charcoal/70">{description}</p>
    </div>
  );
}
