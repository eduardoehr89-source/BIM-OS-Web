"use client";

import { useState } from "react";
import { Lock, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";
import { validateNewPassword } from "@/lib/password-policy";

export function ForcePasswordChangeClient() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rules = [
    { label: "Mínimo 9 caracteres", valid: password.length >= 9 },
    { label: "Al menos una letra mayúscula", valid: /[A-Z]/.test(password) },
    { label: "Al menos un número", valid: /[0-9]/.test(password) },
    { label: "Al menos un símbolo (ej. !@#$%^&*)", valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password) },
  ];

  const allRulesValid = validateNewPassword(password);

  async function handleSubmit() {
    setError(null);
    if (!validateNewPassword(password)) {
      setError("La contraseña no cumple con los requisitos de seguridad.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ newPassword: password }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        setError(errJson.error || "Ocurrió un error al actualizar la contraseña.");
        return;
      }
      
      // La actualización de contraseña reemitirá la cookie sin 'mustChangePassword'
      // o invalidará la sesión. Para que funcione transparente, recargamos hacia el dashboard.
      window.location.href = "/dashboard";
    } catch {
      setError("Error de red al actualizar la contraseña.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 shadow-lg">
            <ShieldAlert className="h-7 w-7 text-red-400" strokeWidth={1.5} aria-hidden />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Actualización Obligatoria</h1>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">Debes actualizar tu contraseña para continuar accediendo al sistema.</p>
        </div>

        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-10 rounded-3xl shadow-2xl w-full max-w-md"
        >
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="new-password"
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400 mb-2"
              >
                <Lock className="h-3.5 w-3.5 text-sky-400" strokeWidth={1.75} aria-hidden />
                Nueva contraseña
              </label>
              <input
                id="new-password"
                type="password"
                required
                autoFocus
                className="bg-slate-950 border border-slate-800 text-white p-3 rounded-lg w-full mb-2 text-lg focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="space-y-2 mb-4 bg-slate-950/50 p-4 rounded-lg border border-slate-800/50">
              {rules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  {rule.valid ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-slate-600 shrink-0" />
                  )}
                  <span className={rule.valid ? "text-slate-300" : "text-slate-500"}>{rule.label}</span>
                </div>
              ))}
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400 mb-2"
              >
                <Lock className="h-3.5 w-3.5 text-slate-400" strokeWidth={1.75} aria-hidden />
                Confirmar contraseña
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                className="bg-slate-950 border border-slate-800 text-white p-3 rounded-lg w-full mb-4 text-lg focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={busy || !allRulesValid || password !== confirmPassword}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-lg w-full transition-all shadow-lg disabled:pointer-events-none disabled:opacity-50 mt-4"
            >
              {busy ? "Actualizando…" : "Actualizar Contraseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
