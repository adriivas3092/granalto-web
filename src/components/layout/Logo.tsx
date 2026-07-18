import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Logotipo oficial de Granalto (archivo provisto por la marca).
 * Dos variantes según el fondo:
 *  - "white": para fondos oscuros (hero, footer).
 *  - "dark": para fondos claros (header con scroll, menú móvil).
 * Los archivos viven en public/images/logo/.
 */
const sizeClasses = {
  sm: "h-5",
  md: "h-7",
  lg: "h-9",
} as const;

export function Logo({
  variant = "dark",
  size = "md",
  priority = false,
  className,
}: {
  variant?: "white" | "dark";
  size?: keyof typeof sizeClasses;
  priority?: boolean;
  className?: string;
}) {
  const src =
    variant === "white"
      ? "/images/logo/logo-granalto-white.png"
      : "/images/logo/logo-granalto-dark.png";

  return (
    <Image
      src={src}
      alt="Granalto"
      width={900}
      height={143}
      priority={priority}
      sizes="220px"
      className={cn("w-auto", sizeClasses[size], className)}
    />
  );
}
