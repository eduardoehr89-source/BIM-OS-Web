"use client";

import { useState } from "react";
import { Building2, Lock, User } from "lucide-react";

export function WelcomeLogin() {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    const n = nombre.trim();
    const p = password.trim();

    if (!n || !p) return;

    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ nombre: n, password: p }),
      });
      if (!res.ok) {
        const errJson = (await res.json().catch(() => ({}))) as {
          error?: string;
          code?: string;
          details?: string;
        };
        if (res.status === 503) {
          // El detalle real del fallo (p. ej. better-sqlite3 / Node) sale en consola del servidor vía [auth/login].
          console.error("[WelcomeLogin] 503 en /api/auth/login", {
            code: errJson.code,
            error: errJson.error,
            details: errJson.details,
          });
        }
        alert(errJson.error || "Usuario o PIN incorrectos");
        return;
      }
      window.location.href = "/dashboard";
    } catch {
      alert("Usuario o contraseña incorrectos");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 shadow-lg">
            <Building2 className="h-7 w-7 text-sky-400" strokeWidth={1.5} aria-hidden />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Bienvenido a BIM.OS</h1>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">Gestión de Activos e Integridad de Datos ISO 19650</p>
        </div>

        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="welcome-nombre"
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400 mb-2"
              >
                <User className="h-3.5 w-3.5 text-sky-400" strokeWidth={1.75} aria-hidden />
                Nombre de usuario
              </label>
              <input
                id="welcome-nombre"
                type="text"
                name="nombre"
                autoComplete="off"
                required
                autoFocus
                className="bg-slate-950 border border-slate-800 text-white p-3 rounded-lg w-full mb-4 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="welcome-pin"
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400 mb-2"
              >
                <Lock className="h-3.5 w-3.5 text-sky-400" strokeWidth={1.75} aria-hidden />
                Contraseña
              </label>
              <input
                id="welcome-password"
                type="password"
                name="password"
                autoComplete="off"
                required
                className="bg-slate-950 border border-slate-800 text-white p-3 rounded-lg w-full mb-4 text-lg focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-lg w-full transition-all shadow-lg disabled:pointer-events-none disabled:opacity-50"
            >
              {busy ? "Verificando…" : "Acceder al Repositorio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
