"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Hash, Plus } from "lucide-react";
import { NuevoCanalModal } from "@/components/comunicaciones/NuevoCanalModal";

type CanalRow = {
  id: string;
  nombre: string;
  tema: string | null;
  descripcion: string | null;
  proyectoId: string | null;
  permiteTexto: boolean;
  permiteVoz: boolean;
  permiteArchivos: boolean;
  permiteVideo: boolean;
  project: { id: string; nombre: string } | null;
  _count: { mensajes: number; miembros: number };
};

export function ComunicacionesPageClient({ isAdmin }: { isAdmin: boolean }) {
  const [canales, setCanales] = useState<CanalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionIsAdmin, setSessionIsAdmin] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/comunicaciones/canales");
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setErr((j as { error?: string }).error || "No se pudieron cargar los canales");
        setCanales([]);
        return;
      }
      const data = await res.json();
      setCanales(Array.isArray(data) ? data : []);
    } catch {
      setErr("Error de red");
      setCanales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    void fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { tipo?: string } | null) => {
        if (j?.tipo) setSessionIsAdmin(j.tipo.trim().toUpperCase() === "ADMIN");
      })
      .catch(() => {});
  }, []);

  const showAdminUi = isAdmin || sessionIsAdmin === true;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <header>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Comunicaciones</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {showAdminUi
              ? "Como administrador ves todos los canales del sistema. Los usuarios normales solo ven los canales en los que son miembros."
              : "Canales por proyecto o equipo. Solo ves los canales en los que eres miembro."}
          </p>
        </header>
        {showAdminUi ? (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            + CREAR NUEVO CANAL
          </button>
        ) : null}
      </div>

      {err && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">{err}</div>}

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando canales…</p>
      ) : canales.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {showAdminUi
            ? "Aún no hay canales. Pulsa «+ CREAR NUEVO CANAL» para crear el primero."
            : "No perteneces a ningún canal. Pide a un administrador que te añada."}
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {canales.map((c) => (
            <li key={c.id}>
              <Link
                href={`/comunicaciones/${c.id}`}
                className="flex flex-col gap-1 rounded-xl border border-border/60 bg-muted/5 p-4 transition hover:bg-muted/15"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Hash className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                  {c.nombre}
                </span>
                {c.tema ? <span className="text-xs text-muted-foreground">{c.tema}</span> : null}
                {c.project ? (
                  <span className="text-[11px] text-muted-foreground">Proyecto: {c.project.nombre}</span>
                ) : null}
                <span className="text-[11px] tabular-nums text-muted-foreground">
                  {c._count.miembros} miembros · {c._count.mensajes} mensajes
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <NuevoCanalModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={() => void load()} />
    </div>
  );
}
