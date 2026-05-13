"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { labelRolProfesional } from "@/lib/professional-roles";
import { sortDirectoryUsers, type DirectorySortKey } from "@/lib/messaging-directory-sort";

type DirUser = {
  id: string;
  nombre: string;
  tipo: string;
  rol: string;
  client: { nombre: string } | null;
  sharesProjectWithViewer: boolean;
};

type ConversationRow = {
  id: string;
  peer: { id: string; nombre: string } | null;
  mensajes: number;
};

function SortTh({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <th className="px-2 py-2">
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-1 text-left text-[10px] font-semibold uppercase tracking-wide transition hover:text-foreground ${
          active ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
        {active ? <span className="tabular-nums opacity-70">{dir === "asc" ? "↑" : "↓"}</span> : null}
      </button>
    </th>
  );
}

export function DirectMessagesPanel() {
  const router = useRouter();
  const [users, setUsers] = useState<DirUser[]>([]);
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<DirectorySortKey>("nombre");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [opening, setOpening] = useState<string | null>(null);
  const [listaFallo, setListaFallo] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setListaFallo(false);
    try {
      const [rDir, rDm] = await Promise.all([
        fetch("/api/comunicaciones/directory", { credentials: "include" }),
        fetch("/api/comunicaciones/direct", { credentials: "include" }),
      ]);
      if (rDir.ok) {
        const degradedDir = rDir.headers.get("x-bimos-list") === "error";
        const data = await rDir.json();
        setUsers(Array.isArray(data) ? data : []);
        if (degradedDir) setListaFallo(true);
      } else {
        setUsers([]);
        setListaFallo(true);
      }
      if (rDm.ok) {
        const degradedDm = rDm.headers.get("x-bimos-list") === "error";
        const data = await rDm.json();
        setConversations(Array.isArray(data) ? data : []);
        if (degradedDm) setListaFallo(true);
      } else {
        setConversations([]);
        setListaFallo(true);
      }
    } catch {
      setUsers([]);
      setConversations([]);
      setListaFallo(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  function toggleSort(k: DirectorySortKey) {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(k);
      setSortDir("asc");
    }
  }

  const sorted = useMemo(() => sortDirectoryUsers(users, sortKey, sortDir), [users, sortKey, sortDir]);

  async function openDm(peerId: string) {
    setOpening(peerId);
    try {
      const res = await fetch("/api/comunicaciones/direct", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peerUserId: peerId }),
      });
      const j = (await res.json().catch(() => ({}))) as { canalId?: string };
      if (res.ok && j.canalId) router.push(`/comunicaciones/${j.canalId}`);
    } finally {
      setOpening(null);
    }
  }

  return (
    <section className="space-y-4 rounded-xl border border-border/50 bg-muted/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">Mensajes directos</h2>
        <button
          type="button"
          onClick={() => void load()}
          className="text-[11px] font-medium text-muted-foreground underline hover:text-foreground"
        >
          Actualizar
        </button>
      </div>

      {conversations.length > 0 ? (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Conversaciones recientes
          </p>
          <div className="flex flex-wrap gap-2">
            {conversations.map((c) => (
              <Link
                key={c.id}
                href={`/comunicaciones/${c.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted/40"
              >
                <MessageCircle className="h-3.5 w-3.5 text-sky-500" strokeWidth={1.75} />
                {c.peer?.nombre ?? "Chat"}
                <span className="tabular-nums text-[10px] text-muted-foreground">({c.mensajes})</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {loading ? (
        <p className="text-xs text-muted-foreground">Cargando contactos…</p>
      ) : listaFallo ? (
        <p className="text-xs text-muted-foreground">Sin conversaciones</p>
      ) : sorted.length === 0 ? (
        <p className="text-xs text-muted-foreground">No hay usuarios disponibles para mensaje directo.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border/40">
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <SortTh
                  label="Nombre"
                  active={sortKey === "nombre"}
                  dir={sortDir}
                  onClick={() => toggleSort("nombre")}
                />
                <SortTh
                  label="Empresa"
                  active={sortKey === "cliente"}
                  dir={sortDir}
                  onClick={() => toggleSort("cliente")}
                />
                <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Tipo
                </th>
                <SortTh label="Rol" active={sortKey === "rol"} dir={sortDir} onClick={() => toggleSort("rol")} />
                <SortTh
                  label="Proyecto común"
                  active={sortKey === "proyectoComun"}
                  dir={sortDir}
                  onClick={() => toggleSort("proyectoComun")}
                />
                <th className="px-2 py-2 text-right text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {sorted.map((u) => (
                <tr key={u.id} className="hover:bg-muted/20">
                  <td className="px-2 py-1.5 font-medium text-foreground">{u.nombre}</td>
                  <td className="px-2 py-1.5 text-muted-foreground">{u.client?.nombre ?? "—"}</td>
                  <td className="px-2 py-1.5 text-muted-foreground">{u.tipo}</td>
                  <td className="px-2 py-1.5 text-muted-foreground">{labelRolProfesional(u.rol)}</td>
                  <td className="px-2 py-1.5">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        u.sharesProjectWithViewer ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {u.sharesProjectWithViewer ? "Sí" : "No"}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-right">
                    <button
                      type="button"
                      title={`Mensaje privado a ${u.nombre}`}
                      disabled={opening === u.id}
                      onClick={() => void openDm(u.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-sky-500/35 bg-sky-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-700 transition hover:bg-sky-500/20 disabled:opacity-50 dark:text-sky-300"
                    >
                      <MessageCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                      Mensaje privado
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
