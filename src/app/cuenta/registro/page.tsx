"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/account/GoogleSignInButton";

function RegistroInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/cuenta";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) {
      setError(error.message.includes("already") ? "Ese correo ya está registrado." : error.message);
      return;
    }
    // Si el proyecto exige confirmación por correo, no habrá sesión activa.
    if (data.session) {
      router.replace(next);
      router.refresh();
    } else {
      setInfo("Cuenta creada. Revisa tu correo para confirmar y luego inicia sesión.");
    }
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-4 py-24">
      <div className="rounded-sm border border-stone-beige bg-white p-8">
        <h1 className="font-sans text-2xl font-bold text-ink">Crear cuenta</h1>
        <p className="mt-1 text-sm text-charcoal/70">Regístrate para comprar y dar seguimiento a tus pedidos.</p>

        {info ? (
          <div className="mt-6 rounded-sm border border-stone-beige bg-ivory p-4 text-sm text-charcoal">
            {info}{" "}
            <Link href="/cuenta/login" className="font-medium text-ink underline underline-offset-4">
              Iniciar sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="full_name" className="mb-1 block text-sm text-charcoal">Nombre completo</label>
              <input
                id="full_name" type="text" autoComplete="name" required
                value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-charcoal">Correo</label>
              <input
                id="email" type="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-charcoal">Contraseña</label>
              <input
                id="password" type="password" autoComplete="new-password" required minLength={6}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
              />
              <p className="mt-1 text-xs text-mineral">Mínimo 6 caracteres.</p>
            </div>
            {error && <p role="alert" className="text-sm text-[#a03826]">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal disabled:opacity-60"
            >
              {loading && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
              Crear cuenta
            </button>
          </form>
        )}

        {!info && (
          <>
            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-stone-beige" />
              <span className="text-xs uppercase tracking-wide text-mineral">o</span>
              <span className="h-px flex-1 bg-stone-beige" />
            </div>
            <GoogleSignInButton next={next} />
          </>
        )}

        <p className="mt-5 text-sm text-charcoal">
          ¿Ya tienes cuenta?{" "}
          <Link
            href={`/cuenta/login${next !== "/cuenta" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-medium text-ink underline underline-offset-4"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CuentaRegistroPage() {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <RegistroInner />
    </Suspense>
  );
}
