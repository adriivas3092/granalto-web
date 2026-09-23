"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/** Enlace para volver al panel principal. Se oculta en el propio panel (/admin). */
export function AdminBack() {
  const pathname = usePathname();
  if (pathname === "/admin") return null;
  return (
    <Link
      href="/admin"
      className="mb-5 inline-flex items-center gap-2 text-sm text-charcoal hover:text-ink"
    >
      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
      Volver al panel
    </Link>
  );
}
