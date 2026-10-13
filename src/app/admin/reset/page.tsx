"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Estado = "verificando" | "listo" | "invalido" | "ok";

/**
 * Página a la que llega el enlace de recuperación de contraseña del correo.
 * Supabase establece una sesión temporal de recuperación (evento
 * PASSWORD_RECOVERY). Con esa sesión, el usuario define una contraseña nueva.
 */
export default function AdminResetPage() {
  const router = useRouter();
  const [estado, setEstado] = useState<Estado>("verificando");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Procesa el enlace del correo y detecta la sesión de recuperación.
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let cancelado = false;

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelado) return;
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
        setEstado("listo");
      }
    });

    (async () => {
      // 1) ¿Ya hay sesión (el cliente procesó el enlace automáticamente)?
      const { data } = await supabase.auth.getSession();
      if (!cancelado && data.session) {
        setEstado("listo");
        return;
      }
      // 2) Flujo PKCE: intercambiar el ?code= del enlace por una sesión.
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!cancelado) setEstado(error ? "invalido" : "listo");
        return;
      }
      // 3) Sin sesión y sin código: el enlace no es válido o expiró.
      if (!cancelado) {
        // Damos un pequeño margen por si onAuthStateChange llega enseguida.
        setTimeout(() => {
          if (!cancelado) setEstado((prev) => (prev === "verificando" ? "invalido" : prev));
        }, 1200);
      }
    })();

    return () => {
      cancelado = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError("No se pudo actualizar la contraseña. Intentá de nuevo con el enlace del correo.");
      return;
    }
    setEstado("ok");
    setTimeout(() => {
      router.replace("/admin");
      router.refresh();
    }, 1600);
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-sm border border-stone-beige bg-white p-8">
        <p className="font-serif text-2xl uppercase tracking-[0.1em] text-ink">Granalto</p>
        <h1 className="mt-2 font-sans text-xl font-bold text-ink">Nueva contraseña</h1>

        {estado === "verificando" && (
          <p className="mt-6 flex items-center gap-2 text-sm text-charcoal/70">
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> Verificando el enlace…
          </p>
        )}

        {estado === "invalido" && (
          <div className="mt-6 space-y-4">
            <p className="text-sm text-[#a03826]">
              El enlace no es válido o ya expiró. Pedí uno nuevo desde el inicio de sesión. Importante: abrí
              el enlace en el <strong>mismo navegador</strong> donde solicitaste la recuperación.
            </p>
            <Link
              href="/admin/login"
              className="inline-flex min-h-[44px] items-center justify-center rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        )}

        {estado === "ok" && (
          <div className="mt-6 flex items-start gap-3 rounded-sm border border-emerald-600/30 bg-emerald-50 p-4">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            <p className="text-sm text-emerald-800">
              Contraseña actualizada. Entrando al panel…
            </p>
          </div>
        )}

        {estado === "listo" && (
          <>
            <p className="mt-1 text-sm text-charcoal/70">Elegí una contraseña nueva para tu cuenta.</p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="pw" className="mb-1 block text-sm text-charcoal">
                  Contraseña nueva
                </label>
                <input
                  id="pw"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="pw2" className="mb-1 block text-sm text-charcoal">
                  Repetir contraseña
                </label>
                <input
                  id="pw2"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                />
              </div>
              {error && (
                <p role="alert" className="text-sm text-[#a03826]">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal disabled:opacity-60"
              >
                {loading && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
                Guardar contraseña
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
