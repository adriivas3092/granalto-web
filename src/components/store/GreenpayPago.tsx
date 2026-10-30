"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, Lock, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/store/format";
import { crearOrdenPagoGreenpay, confirmarPagoGreenpay } from "@/app/checkout/actions";
import type { OrdenGreenpay } from "@/lib/pago/greenpay";

// El componente 3DS usa Evervault (solo navegador): se carga sin SSR.
const GreenPay3DSPayment = dynamic(
  () => import("@greenpay_prod/3ds-react").then((m) => m.GreenPay3DSPayment),
  { ssr: false },
);

type OrderLite = { id: string; total: number; currency: string };

/** Codifica a base64 de forma segura con caracteres acentuados (UTF-8). */
function toBase64(s: string): string {
  return btoa(unescape(encodeURIComponent(s)));
}

const field =
  "w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-ink outline-none focus:border-ink";
const label = "mb-1 block text-xs text-charcoal/80";

export function GreenpayPago({ order }: { order: OrderLite }) {
  const router = useRouter();
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");
  const [cvc, setCvc] = useState("");

  const [fase, setFase] = useState<"form" | "procesando">("form");
  const [estado, setEstado] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  // Datos para el SDK una vez creada la orden en GreenPay.
  const [orderData, setOrderData] = useState<{
    cardData: { ed: string; session: string };
    sessionToken: string;
    terminalId: string;
  } | null>(null);
  const [env, setEnv] = useState<OrdenGreenpay["env"]>("sbx");

  const numeroLimpio = cardNumber.replace(/\s+/g, "");
  const formularioValido =
    cardHolder.trim().length > 1 &&
    numeroLimpio.length >= 13 &&
    /^\d{1,2}$/.test(mes) &&
    Number(mes) >= 1 &&
    Number(mes) <= 12 &&
    /^\d{2}$/.test(anio) &&
    /^\d{3,4}$/.test(cvc);

  async function iniciar(e: React.FormEvent) {
    e.preventDefault();
    if (!formularioValido) return;
    setError(null);
    setFase("procesando");
    setEstado("Creando la orden de pago…");

    const res = await crearOrdenPagoGreenpay(order.id);
    if (!res.ok) {
      setError(res.error);
      setFase("form");
      return;
    }

    // Estructura EXACTA del payload `ed` que exige el 3DS de GreenPay
    // (distinta a la de createOrder): card.number/expiry, merchant, payment
    // (monto en CENTAVOS = monto × 100), moneda en minúsculas.
    const edPayload = {
      card: {
        number: numeroLimpio,
        expiry: { month: mes.padStart(2, "0"), year: anio },
      },
      merchant: {
        name: "Granalto",
        website: "https://granaltocr.net",
        categoryCode: "5999",
        country: "cr",
      },
      payment: {
        type: "one-off",
        amount: Math.round(order.total * 100),
        currency: order.currency.toLowerCase(),
      },
    };

    setEnv(res.orden.env);
    setOrderData({
      cardData: { ed: toBase64(JSON.stringify(edPayload)), session: res.orden.session },
      sessionToken: res.orden.token,
      // Obligatorio en /3ds/create-session: GreenPay resuelve con él las
      // credenciales del acquirer según la marca de tarjeta.
      terminalId: res.orden.terminalId,
    });
    setEstado("Iniciando la verificación 3D Secure…");
  }

  async function onSuccess(result: { statusCode: number; data: Record<string, unknown> }) {
    const aprobado = result?.statusCode === 200;
    if (!aprobado) {
      setError("El pago no fue aprobado. Revisá los datos o probá con otra tarjeta.");
      setFase("form");
      setOrderData(null);
      return;
    }
    setEstado("Confirmando tu pago…");
    const ref =
      (result?.data && (result.data.reference as string)) ||
      (result?.data && (result.data.authorization as string)) ||
      "";
    await confirmarPagoGreenpay(order.id, String(ref));
    router.push(`/checkout/gracias?pedido=${order.id}`);
  }

  function onFailure(msg: string) {
    setError(msg || "La verificación 3D Secure fue rechazada por el banco emisor.");
    setFase("form");
    setOrderData(null);
  }

  function onError(err: Error | string) {
    setError(typeof err === "string" ? err : err.message || "Ocurrió un error procesando el pago.");
    setFase("form");
    setOrderData(null);
  }

  return (
    <div className="rounded-sm border border-stone-beige bg-white p-6 sm:p-8">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-mineral">
        <ShieldCheck className="h-4 w-4 text-ink" /> Pago seguro
      </div>
      <h2 className="mt-2 font-serif text-2xl text-ink">Tarjeta de crédito o débito</h2>
      <p className="mt-1 text-sm text-charcoal/75">
        Visa, Mastercard y American Express. Procesado por <strong>GreenPay</strong> con verificación{" "}
        <strong>3D Secure</strong>.
      </p>

      {error && (
        <div className="mt-4 rounded-sm border border-[#a03826]/40 bg-[#a03826]/10 p-3 text-sm text-[#a03826]">
          {error}
        </div>
      )}

      {/* Componente 3DS: se monta cuando ya hay orden creada */}
      {fase === "procesando" && orderData ? (
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2 text-sm text-charcoal">
            <Loader2 className="h-4 w-4 animate-spin" /> {estado || "Procesando…"}
          </div>
          <GreenPay3DSPayment
            config={{ environment: env }}
            orderData={orderData}
            onSuccess={onSuccess}
            onFailure={onFailure}
            onError={onError}
            onStatusChange={(s: string) => setEstado(s)}
            className="min-h-[220px] w-full"
          />
        </div>
      ) : (
        <form onSubmit={iniciar} className="mt-6 space-y-4">
          <div>
            <label htmlFor="gp-holder" className={label}>
              Nombre en la tarjeta
            </label>
            <input
              id="gp-holder"
              autoComplete="cc-name"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className={field}
              placeholder="Como aparece en la tarjeta"
            />
          </div>
          <div>
            <label htmlFor="gp-number" className={label}>
              Número de tarjeta
            </label>
            <input
              id="gp-number"
              inputMode="numeric"
              autoComplete="cc-number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value.replace(/[^\d\s]/g, ""))}
              className={field}
              placeholder="0000 0000 0000 0000"
              maxLength={23}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="gp-mes" className={label}>
                Mes (MM)
              </label>
              <input
                id="gp-mes"
                inputMode="numeric"
                autoComplete="cc-exp-month"
                value={mes}
                onChange={(e) => setMes(e.target.value.replace(/\D/g, "").slice(0, 2))}
                className={field}
                placeholder="12"
              />
            </div>
            <div>
              <label htmlFor="gp-anio" className={label}>
                Año (AA)
              </label>
              <input
                id="gp-anio"
                inputMode="numeric"
                autoComplete="cc-exp-year"
                value={anio}
                onChange={(e) => setAnio(e.target.value.replace(/\D/g, "").slice(0, 2))}
                className={field}
                placeholder="31"
              />
            </div>
            <div>
              <label htmlFor="gp-cvc" className={label}>
                CVC
              </label>
              <input
                id="gp-cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className={field}
                placeholder="123"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!formularioValido || fase === "procesando"}
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3.5 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-charcoal disabled:opacity-60"
          >
            {fase === "procesando" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {estado || "Procesando…"}
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Pagar {formatPrice(order.total, order.currency)}
              </>
            )}
          </button>
        </form>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-mineral">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5" /> Conexión cifrada (SSL)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" /> Verificación 3D Secure
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5" /> No almacenamos tu tarjeta
        </span>
      </div>
    </div>
  );
}
