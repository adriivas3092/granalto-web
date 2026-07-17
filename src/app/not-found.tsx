import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-3xl flex-col items-center justify-center px-4 py-32 text-center sm:px-6">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-mineral">
        Error 404
      </p>
      <h1 className="mt-4 text-4xl leading-tight md:text-6xl">
        Página no encontrada
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-charcoal/80">
        La página que busca no existe o fue movida. Explore nuestras
        colecciones o vuelva al inicio.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Volver al inicio</ButtonLink>
        <ButtonLink href="/colecciones" variant="outline">
          Explorar colecciones
        </ButtonLink>
      </div>
    </div>
  );
}
