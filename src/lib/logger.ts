/**
 * Registro de errores de la aplicación.
 *
 * Emite un log estructurado que Vercel captura en sus "Runtime Logs" (tanto en
 * servidor como en navegador). Está preparado para reenviar los errores a un
 * servicio externo de monitoreo (p. ej. Sentry) cuando se configure: basta con
 * enchufar el envío en el punto indicado más abajo.
 */

type LogContext = Record<string, unknown>;

export function logError(error: unknown, context?: LogContext): void {
  const payload = {
    level: "error" as const,
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    at: new Date().toISOString(),
    ...context,
  };

  // Vercel registra console.error en Runtime Logs (servidor y cliente).
  // eslint-disable-next-line no-console
  console.error("[app-error]", JSON.stringify(payload));

  // Punto de integración con un monitor externo (Sentry u otro). Cuando se
  // configure, enviar aquí `payload` sin romper si el servicio no está presente.
  // if (typeof window !== "undefined" && window.__SENTRY__) { ... }
}
