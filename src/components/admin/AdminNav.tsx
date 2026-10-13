"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, FileText, Users, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Inicio", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/materiales", label: "Materiales", icon: Layers },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/solicitudes", label: "Pedidos de sobres", icon: FileText },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap items-center gap-1">
      {items.map((it) => {
        const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm transition-colors",
              active ? "bg-ink text-ivory" : "text-charcoal hover:bg-stone-beige/60",
            )}
          >
            <it.icon aria-hidden="true" className="h-4 w-4" />
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
