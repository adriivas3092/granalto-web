import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { COMPRA_EN_LINEA } from "@/config/tienda";

export default function CarritoLayout({ children }: { children: ReactNode }) {
  if (!COMPRA_EN_LINEA) redirect("/tienda");
  return children;
}
