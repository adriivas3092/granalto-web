"use client";

import { useEffect } from "react";
import { logError } from "@/lib/logger";

/**
 * Frontera de error global: se activa si falla el propio layout raíz. Debe
 * renderizar <html>/<body> porque reemplaza todo el documento. Registra el
 * error y ofrece recargar.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logError(error, { digest: error.digest, boundary: "global" });
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, Helvetica, sans-serif",
          background: "#faf9f6",
          color: "#1e1e1e",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: 28, margin: "0 0 12px" }}>Tuvimos un inconveniente</h1>
          <p style={{ color: "#5b5b57", lineHeight: 1.5, margin: "0 0 24px" }}>
            Ocurrió un error inesperado. Intentá recargar la página.
          </p>
          <button
            onClick={reset}
            style={{
              minHeight: 44,
              padding: "12px 24px",
              background: "#263a2c",
              color: "#faf9f6",
              border: "none",
              borderRadius: 4,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Recargar
          </button>
        </div>
      </body>
    </html>
  );
}
