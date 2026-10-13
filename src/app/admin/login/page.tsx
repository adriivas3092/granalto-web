"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, MailCheck } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Modo = "login" | "recuperar";

export default function AdminLoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState<Modo>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Credenciales incorrectas. Verifique correo y contraseña.");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  async function onRecuperar(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAviso(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/reset`,
    });
    setLoading(false);
    if (error) {
      setError(
        `No se pudo enviar el correo. Motivo: ${error.message}. ` +
          "Si dice algo de 'email'/'SMTP'/'rate limit', hay que configurar el envío de correos en Supabase.",
      );
      return;
    }
    setAviso(
      "Si el correo corresponde a una cuenta, te enviamos un enlace para crear una contraseña nueva. Revisá tu bandeja de entrada (y la carpeta de spam).",
    );
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-4 py-16">
      <div className="rounded-sm border border-stone-beige bg-white p-8">
        <p className="font-serif text-2xl uppercase tracking-[0.1em] text-ink">Granalto</p>
        <h1 className="mt-2 font-sans text-xl font-bold text-ink">Panel de administración</h1>

        {modo === "login" ? (
          <>
            <p className="mt-1 text-sm text-charcoal/70">Ingrese con su cuenta autorizada.</p>
            <form onSubmit={onLogin} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm text-charcoal">
                  Correo
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm text-charcoal">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                Ingresar
              </button>
            </form>
            <button
              type="button"
              onClick={() => {
                setModo("recuperar");
                setError(null);
                setAviso(null);
              }}
              className="mt-4 text-sm text-mineral underline-offset-2 hover:text-ink hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-charcoal/70">
              Escribí tu correo y te enviamos un enlace para crear una contraseña nueva.
            </p>
            {aviso ? (
              <div className="mt-6 flex items-start gap-3 rounded-sm border border-emerald-600/30 bg-emerald-50 p-4">
                <MailCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                <p className="text-sm text-emerald-800">{aviso}</p>
              </div>
            ) : (
              <form onSubmit={onRecuperar} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email-rec" className="mb-1 block text-sm text-charcoal">
                    Correo
                  </label>
                  <input
                    id="email-rec"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  Enviar enlace de recuperación
                </button>
              </form>
            )}
            <button
              type="button"
              onClick={() => {
                setModo("login");
                setError(null);
                setAviso(null);
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-mineral hover:text-ink"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Volver al inicio de sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}
