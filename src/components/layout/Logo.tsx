import { cn } from "@/lib/utils";

/**
 * Logotipo de Granalto como marca denominativa vectorial.
 * Usa `currentColor`, por lo que hereda el color del contexto: blanco sobre
 * el hero y fondos oscuros (footer), negro sobre el header claro. Reproduce
 * el wordmark "GRANALTO®" con la línea inferior característica en Montserrat.
 *
 * Si Granalto prefiere usar su archivo de logo exacto, basta reemplazar este
 * componente por un <Image>/SVG; toda la app lo consume desde aquí.
 */
export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex flex-col text-current",
        className,
      )}
      aria-hidden="true"
    >
      <span
        className={cn(
          "font-sans font-bold uppercase leading-none tracking-[0.14em]",
          sizeClasses,
        )}
      >
        Granalto
        <sup className="ml-[0.15em] align-top text-[0.42em] font-semibold tracking-normal">
          ®
        </sup>
      </span>
      <span className="mt-1 h-px w-full bg-current" />
    </span>
  );
}
