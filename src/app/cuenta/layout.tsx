import type { Metadata } from "next";

/** Área privada de clientes: fuera del índice de buscadores. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CuentaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
