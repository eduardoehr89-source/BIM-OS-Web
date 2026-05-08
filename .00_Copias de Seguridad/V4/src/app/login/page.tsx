"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!pin.trim()) return;
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "PIN incorrecto");
      }

      router.push("/dashboard");
      router.refresh(); // Refrescar layout para cargar estado
    } catch (err) {
      console.log("[login page] error", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-8 rounded-2xl bg-muted/30 p-8 shadow-sm dark:bg-muted/10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Lock className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Acceso Restringido</h1>
          <p className="text-sm text-muted-foreground">Ingresa tu PIN de seguridad para acceder al repositorio.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="pin" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              PIN de Acceso
            </label>
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              required
              autoFocus
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-center text-2xl tracking-[0.5em] text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
            />
          </div>

          {error && <p className="text-center text-sm font-medium text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
