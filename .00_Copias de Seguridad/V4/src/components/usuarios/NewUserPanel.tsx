"use client";

import { useState } from "react";
import { Plus, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROL_PROFESIONAL_OPCIONES } from "@/lib/professional-roles";

export function NewUserPanel() {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [pin, setPin] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [tipo, setTipo] = useState<"ADMIN" | "USER">("USER");
  const [rolProfesional, setRolProfesional] = useState<string>(ROL_PROFESIONAL_OPCIONES[0].value);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const inputClass =
    "mt-1 w-full border-0 border-b border-input bg-transparent px-0 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-0";

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !pin.trim() || !adminPin.trim()) return;

    setBusy(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          pin: pin.trim(),
          tipo,
          rol: rolProfesional,
          adminPin: adminPin.trim(),
        }),
      });
      if (res.ok) {
        setNombre("");
        setPin("");
        setAdminPin("");
        setTipo("USER");
        setRolProfesional(ROL_PROFESIONAL_OPCIONES[0].value);
        setShowCreateForm(false);
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg((data as { error?: string }).error || "Error al registrar");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-stretch gap-3 sm:max-w-full md:items-end">
      <button
        type="button"
        className="inline-flex items-center gap-2 self-end rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90"
        onClick={() => setShowCreateForm((v) => !v)}
      >
        {showCreateForm ? <X className="h-4 w-4" strokeWidth={1.75} /> : <Plus className="h-4 w-4" strokeWidth={1.75} />}
        {showCreateForm ? "CANCELAR" : "+ NUEVO USUARIO"}
      </button>

      {errorMsg && (
        <div className="mt-3 max-w-md rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {errorMsg}
        </div>
      )}

      {showCreateForm && (
        <section className="mt-1 w-full max-w-4xl rounded-2xl border border-border/40 bg-muted/10 p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <UserPlus className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
            Nuevo usuario
          </h2>
          <form onSubmit={handleCreate} className="mt-5 grid grid-cols-1 items-end gap-4 lg:grid-cols-6">
            <label className="block text-xs font-medium text-muted-foreground">
              Nombre
              <input
                required
                className={inputClass}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Maria"
              />
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Nuevo PIN (Usuario)
              <input
                required
                type="password"
                inputMode="numeric"
                className={inputClass}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
              />
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Tipo
              <select
                className={`${inputClass} cursor-pointer`}
                value={tipo}
                onChange={(e) => setTipo(e.target.value as "ADMIN" | "USER")}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Rol (Cargo)
              <select
                className={`${inputClass} cursor-pointer`}
                value={rolProfesional}
                onChange={(e) => setRolProfesional(e.target.value)}
              >
                {ROL_PROFESIONAL_OPCIONES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-medium text-muted-foreground">
              Tu PIN (Admin)
              <input
                required
                type="password"
                inputMode="numeric"
                className={inputClass}
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Confirma tu PIN"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50 lg:justify-self-start"
            >
              Registrar
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
