"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/cuenta";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-4 py-24">
      <div className="rounded-sm border border-stone-beige bg-white p-8">
        <h1 className="font-sans text-2xl font-bold text-ink">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-charcoal/70">Accede a tu cuenta para comprar y ver tus pedidos.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
              id="password" type="password" autoComplete="current-password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-stone-beige bg-white px-3 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>
          {error && <p role="alert" className="text-sm text-[#a03826]">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-sm bg-ink px-6 py-3 text-sm font-medium text-ivory hover:bg-charcoal disabled:opacity-60"
          >
            {loading && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
            Ingresar
          </button>
        </form>

        <p className="mt-5 text-sm text-charcoal">
          ¿No tienes cuenta?{" "}
          <Link
            href={`/cuenta/registro${next !== "/cuenta" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="font-medium text-ink underline underline-offset-4"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CuentaLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-svh" />}>
      <LoginInner />
    </Suspense>
  );
}
