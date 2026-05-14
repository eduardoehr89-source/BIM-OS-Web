"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface Req { label: string; test: (v: string) => boolean }

const REQUIREMENTS: Req[] = [
  { label: "Mínimo 9 caracteres",   test: (v) => v.length >= 9 },
  { label: "Una letra mayúscula",   test: (v) => /[A-Z]/.test(v) },
  { label: "Un número",             test: (v) => /[0-9]/.test(v) },
  { label: "Un símbolo (@, #, !…)", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

export function ForcePasswordChangeClient() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);

  const allPassed = REQUIREMENTS.every((r) => r.test(password));

  async function handleSubmit() {
    if (!allPassed || loading) return;
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setApiError(data?.error ?? `Error ${res.status}.`); return; }
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      setApiError("Error de red. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.push("/login");
  }

  if (success) {
    return (
      <div style={styles.root}>
        <div style={styles.card}>
          <div style={{ fontSize: 40, textAlign: "center" }}>✅</div>
          <p style={{ ...styles.subtitle, textAlign: "center", marginTop: 12 }}>Contraseña actualizada. Redirigiendo…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={styles.title}>Configura tu contraseña</h1>
          <p style={styles.subtitle}>Elige una contraseña segura para continuar a la plataforma.</p>
        </div>

        <label style={styles.label}>Nueva contraseña</label>
        <div style={styles.inputWrapper}>
          <input
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mín. 9 caracteres"
            style={styles.input}
            disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button type="button" onClick={() => setShowPwd((v) => !v)} style={styles.eyeBtn}>
            <EyeIcon open={showPwd} />
          </button>
        </div>

        {password.length > 0 && (
          <ul style={styles.reqList}>
            {REQUIREMENTS.map((r) => (
              <li key={r.label} style={{ ...styles.reqItem, color: r.test(password) ? "#22c55e" : "#94a3b8" }}>
                <span style={{ marginRight: 6 }}>{r.test(password) ? "✓" : "○"}</span>{r.label}
              </li>
            ))}
          </ul>
        )}

        {apiError && <div style={styles.errorBox}>{apiError}</div>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allPassed || loading}
          style={{ ...styles.primaryBtn, opacity: !allPassed || loading ? 0.5 : 1, cursor: !allPassed || loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Guardando…" : "Guardar contraseña"}
        </button>

        <button type="button" onClick={handleLogout} style={styles.ghostBtn} disabled={loading}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root:         { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding: 16 },
  card:         { background: "#1e293b", border: "1px solid #334155", borderRadius: 16, padding: "36px 32px", width: "100%", maxWidth: 420, boxShadow: "0 25px 50px rgba(0,0,0,0.5)" },
  title:        { margin: 0, fontSize: 22, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.3px" },
  subtitle:     { margin: "6px 0 0", fontSize: 14, color: "#94a3b8", lineHeight: 1.5 },
  label:        { display: "block", fontSize: 13, fontWeight: 500, color: "#cbd5e1", marginBottom: 6, marginTop: 20 },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  input:        { width: "100%", padding: "10px 44px 10px 14px", background: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#f1f5f9", fontSize: 15, outline: "none", boxSizing: "border-box" },
  eyeBtn:       { position: "absolute", right: 12, background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 0, lineHeight: 0 },
  reqList:      { listStyle: "none", padding: 0, margin: "12px 0 0", display: "grid", gap: 4 },
  reqItem:      { fontSize: 13, display: "flex", alignItems: "center", transition: "color 0.2s" },
  errorBox:     { marginTop: 14, padding: "10px 14px", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#fca5a5", fontSize: 13 },
  primaryBtn:   { marginTop: 20, width: "100%", padding: "12px 0", background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, transition: "opacity 0.2s", boxSizing: "border-box" },
  ghostBtn:     { marginTop: 10, width: "100%", padding: "10px 0", background: "none", color: "#64748b", border: "1px solid #334155", borderRadius: 8, fontSize: 14, cursor: "pointer", boxSizing: "border-box" },
};
