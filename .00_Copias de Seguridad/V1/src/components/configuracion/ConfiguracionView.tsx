"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AtSign,
  Bell,
  BellOff,
  Calendar,
  Box,
  CheckSquare,
  ChevronDown,
  File,
  FileText,
  Filter,
  FolderKanban,
  Image as ImageIcon,
  Loader2,
  MessageSquare,
  Moon,
  Recycle,
  RotateCcw,
  Save,
  Settings,
  Star,
  Users,
  Zap,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type NotifSettings = {
  id: string;
  soloAltaPrioridad: boolean;
  soloMenciones: boolean;
  filtroMensajes: boolean;
  filtroProyectos: boolean;
  filtroTareas: boolean;
  selectedChannels: string;
  clientesFiltro: string;
  proyectosFiltro: string;
  silenceAllDays: boolean;
  silence24h: boolean;
  detalleNotificacion: "BREVE" | "INTERMEDIO" | "COMPLETO";
  calendarioSilencio: string;
  fileExtensionsFilter: string;
  userWatchlist: string;
};

/** Alineado con Prisma / GET por defecto: tolera respuestas parciales o `null`. */
function normalizeNotifSettings(raw: unknown): NotifSettings {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const d = o.detalleNotificacion;
  const detalle: NotifSettings["detalleNotificacion"] =
    d === "BREVE" || d === "INTERMEDIO" || d === "COMPLETO" ? d : "BREVE";
  const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
  const bool = (v: unknown, fallback: boolean) => (typeof v === "boolean" ? v : fallback);
  const cs = o.calendarioSilencio;
  let cal: string;
  if (typeof cs === "string") {
    cal = cs;
  } else if (cs != null && typeof cs === "object") {
    try {
      cal = JSON.stringify(cs);
    } catch {
      cal = "{}";
    }
  } else {
    cal = "{}";
  }
  return {
    id: str(o.id, "temp_default"),
    soloAltaPrioridad: bool(o.soloAltaPrioridad, false),
    soloMenciones: bool(o.soloMenciones, false),
    filtroMensajes: bool(o.filtroMensajes, true),
    filtroProyectos: bool(o.filtroProyectos, true),
    filtroTareas: bool(o.filtroTareas, true),
    selectedChannels: str(o.selectedChannels),
    clientesFiltro: str(o.clientesFiltro),
    proyectosFiltro: str(o.proyectosFiltro),
    silenceAllDays: bool(o.silenceAllDays, false),
    silence24h: bool(o.silence24h, false),
    detalleNotificacion: detalle,
    calendarioSilencio: cal || "{}",
    fileExtensionsFilter: str(o.fileExtensionsFilter),
    userWatchlist: str(o.userWatchlist),
  };
}

type ChannelItem = { id: string; nombre: string };
type ProjectItem = { id: string; nombre: string };
type ClientItem  = { id: string; nombre: string };
type UserPick = { id: string; nombre: string };

type TrashItem = {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  deletedAt: string | null;
  deletedByUserId: string | null;
  deletedByUser: { id: string; nombre: string } | null;
  projectId: string | null;
  project: { id: string; nombre: string } | null;
};

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const ALL_DIAS = [0, 1, 2, 3, 4, 5, 6];

const DETALLE_NOTIF_OPTIONS: {
  id: NotifSettings["detalleNotificacion"];
  label: string;
  desc: string;
}[] = [
  { id: "BREVE", label: "Breve (Privacidad Máxima)", desc: 'Solo muestra "Tienes un nuevo mensaje"' },
  { id: "INTERMEDIO", label: "Intermedio", desc: "Muestra remitente y canal" },
  { id: "COMPLETO", label: "Completo", desc: "Muestra remitente, canal y contenido" },
];

function formatTrashAuditDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${dd}/${mm}/${yy} ${hh}:${min}:${ss}`;
}

function formatAuditFileSizeMb(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  if (mb >= 0.01) return `${mb.toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function trashFileExtensionLabel(name: string): string {
  const i = name.lastIndexOf(".");
  if (i <= 0 || i === name.length - 1) return "—";
  return `.${name.slice(i + 1).toLowerCase()}`;
}

function TrashFileTypeIcon({ name }: { name: string }) {
  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".") + 1).toLowerCase() : "";
  const cls = "h-4 w-4 shrink-0 text-muted-foreground";
  if (ext === "pdf") return <FileText className={cls} strokeWidth={1.75} />;
  if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) return <ImageIcon className={cls} strokeWidth={1.75} />;
  if (["ifc", "rvt", "dwg", "dxf"].includes(ext)) return <Box className={cls} strokeWidth={1.75} />;
  return <File className={cls} strokeWidth={1.75} />;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  id,
  size = "md",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
  size?: "sm" | "md";
}) {
  const track = size === "sm" ? "h-5 w-9" : "h-6 w-11";
  const thumb = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  const on    = size === "sm" ? "translate-x-5" : "translate-x-6";

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${track} ${
        checked ? "bg-accent" : "bg-slate-700"
      }`}
    >
      <span
        className={`inline-block transform rounded-full bg-white shadow transition-transform duration-200 ${thumb} ${
          checked ? on : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
  accent,
}: {
  icon: React.FC<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/60 p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-5 flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accent ?? "bg-accent/10 text-accent"}`}>
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({
  id,
  label,
  icon: Icon,
  iconClass,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  icon: React.FC<{ className?: string; strokeWidth?: number }>;
  iconClass?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-0.5">
      <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-sm text-foreground select-none">
        <Icon className={`h-4 w-4 ${iconClass ?? "text-muted-foreground"}`} strokeWidth={1.75} />
        {label}
      </label>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ConfiguracionView({ isSupremo, isAdmin }: { isSupremo?: boolean; isAdmin?: boolean }) {
  const [settings, setSettings] = useState<NotifSettings | null>(null);
  const [channels, setChannels]  = useState<ChannelItem[]>([]);
  const [projects, setProjects]  = useState<ProjectItem[]>([]);
  const [clients,  setClients]   = useState<ClientItem[]>([]);
  const [watchUsers, setWatchUsers] = useState<UserPick[]>([]);
  const [loading,  setLoading]   = useState(true);
  const [saving,   setSaving]    = useState(false);
  const [saved,    setSaved]     = useState(false);
  const [error,    setError]     = useState("");
  const [showChannelList, setShowChannelList] = useState(false);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [purgeOpen, setPurgeOpen] = useState(false);
  const [purgePin, setPurgePin] = useState("");
  const [purgeBusy, setPurgeBusy] = useState(false);
  const [restoringTrashId, setRestoringTrashId] = useState<string | null>(null);
  const [hasNip, setHasNip] = useState(false);
  const [nipDraft, setNipDraft] = useState("");
  const [nipBusy, setNipBusy] = useState(false);
  const [nipMsg, setNipMsg] = useState("");
  /** 401 o fallo duro; si hay texto y no hay settings, no mostramos el formulario. */
  const [configLoadError, setConfigLoadError] = useState("");
  /** Aviso suave cuando usamos valores por defecto tras un fallo parcial. */
  const [configLoadWarning, setConfigLoadWarning] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Horario de silencio (estado local derivado del JSON)
  const [silDias,   setSilDias]   = useState<number[]>([]);
  const [silInicio, setSilInicio] = useState("22:00");
  const [silFin, setSilFin] = useState("08:00");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setConfigLoadError("");
    setConfigLoadWarning("");
    try {
      const [rSettings, rProjects, rClients, rChannels, rTrash, rMe] = await Promise.all([
        fetch("/api/configuracion"),
        fetch("/api/projects?limit=100"),
        fetch("/api/clients?activo=true"),
        fetch("/api/channels"),
        fetch("/api/files/trash"),
        fetch("/api/auth/me"),
      ]);

      if (rMe.ok) {
        const me = (await rMe.json()) as { hasNip?: boolean };
        setHasNip(Boolean(me.hasNip));
      } else {
        setHasNip(false);
      }

      if (rSettings.status === 401) {
        setSettings(null);
        setConfigLoadError("No autorizado. Inicia sesión de nuevo para cargar la configuración.");
      } else if (rSettings.ok) {
        try {
          const raw: unknown = await rSettings.json();
          const looksLikeErrOnly =
            raw &&
            typeof raw === "object" &&
            "error" in (raw as object) &&
            !("soloAltaPrioridad" in (raw as object));
          if (looksLikeErrOnly) {
            setSettings(normalizeNotifSettings({}));
            setConfigLoadWarning("No se pudo leer la configuración del servidor. Mostrando valores por defecto.");
          } else {
            const s = normalizeNotifSettings(raw);
            setSettings(s);
            try {
              const cal = JSON.parse(s.calendarioSilencio || "{}");
              if (Array.isArray(cal.dias)) setSilDias(cal.dias);
              if (typeof cal.horaInicio === "string") setSilInicio(cal.horaInicio);
              if (typeof cal.horaFin === "string") setSilFin(cal.horaFin);
            } catch {
              /* noop */
            }
            if (s.filtroMensajes) setShowChannelList(true);
          }
        } catch {
          setSettings(normalizeNotifSettings({}));
          setConfigLoadWarning("Respuesta inválida del servidor. Mostrando valores por defecto.");
        }
      } else {
        setSettings(normalizeNotifSettings({}));
        setConfigLoadWarning("No se pudo sincronizar la configuración. Mostrando valores por defecto.");
      }

      if (rProjects.ok) {
        const d = await rProjects.json();
        setProjects(Array.isArray(d) ? d : d.projects ?? []);
      }
      if (rClients.ok) {
        const d = await rClients.json();
        setClients(Array.isArray(d) ? d : []);
      }
      if (rChannels.ok) {
        const d = await rChannels.json();
        setChannels(Array.isArray(d) ? d : []);
      }

      if (rTrash.ok) {
        const t = await rTrash.json();
        setTrashItems(Array.isArray(t) ? (t as TrashItem[]) : []);
      } else {
        setTrashItems([]);
      }

      if (isAdmin || isSupremo) {
        const ru = await fetch("/api/users");
        if (ru.ok) {
          const list = await ru.json();
          const arr = Array.isArray(list) ? list : [];
          setWatchUsers(
            arr.map((u: { id?: string; nombre?: string }) => ({
              id: String(u.id ?? ""),
              nombre: String(u.nombre ?? ""),
            })).filter((u: UserPick) => u.id && u.nombre),
          );
        } else {
          setWatchUsers([]);
        }
      } else {
        setWatchUsers([]);
      }
    } catch (e) {
      console.error(e);
      setSettings(normalizeNotifSettings({}));
      setConfigLoadWarning("Error de red o del cliente al cargar. Mostrando valores por defecto.");
    } finally {
      setLoading(false);
    }
  }, [isAdmin, isSupremo]);

  useEffect(() => {
    // Carga inicial: fetch y setState ocurren tras microtasks (await fetch).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- patrón estándar de carga al montar
    void loadAll();
  }, [loadAll]);

  async function saveNip() {
    if (nipDraft.length !== 4) return;
    setNipBusy(true);
    setNipMsg("");
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nip: nipDraft }),
      });
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setNipMsg(j.error ?? "No se pudo guardar");
        return;
      }
      setHasNip(true);
      setNipDraft("");
      setNipMsg("NIP guardado correctamente.");
    } finally {
      setNipBusy(false);
    }
  }

  function updateSetting<K extends keyof NotifSettings>(key: K, value: NotifSettings[K]) {
    setSettings(prev => prev ? { ...prev, [key]: value } : prev);
  }

  function toggleCSV(field: "selectedChannels" | "proyectosFiltro" | "clientesFiltro" | "userWatchlist", id: string) {
    if (!settings) return;
    const current = settings[field].split(",").filter(Boolean);
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    updateSetting(field, next.join(","));
  }

  function toggleSilDia(d: number) {
    setSilDias(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  }

  function handleSilenceAllDays(v: boolean) {
    updateSetting("silenceAllDays", v);
    if (v) setSilDias(ALL_DIAS);
    else   setSilDias([]);
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    setError("");
    try {
      const calendarioSilencio = { dias: silDias, horaInicio: silInicio, horaFin: silFin };
      const res = await fetch("/api/configuracion", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...settings, calendarioSilencio }),
      });
      if (!res.ok) throw new Error("Error al guardar");
      const updatedRaw: unknown = await res.json();
      const errOnly =
        updatedRaw &&
        typeof updatedRaw === "object" &&
        "error" in updatedRaw &&
        !("soloAltaPrioridad" in updatedRaw);
      if (errOnly) {
        throw new Error((updatedRaw as { error?: string }).error ?? "Error al guardar");
      }
      setSettings(normalizeNotifSettings(updatedRaw));
      setConfigLoadWarning("");
      setSaved(true);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally { setSaving(false); }
  }

  async function handlePurgeTrash() {
    setPurgeBusy(true);
    try {
      const res = await fetch("/api/files/trash/purge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: purgePin }),
      });
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 403) {
        alert(j.error || "Acceso Denegado");
        return;
      }
      if (!res.ok) {
        alert(j.error || "No se pudo vaciar la papelera");
        return;
      }
      setPurgeOpen(false);
      setPurgePin("");
      void loadAll();
    } finally {
      setPurgeBusy(false);
    }
  }

  async function handleRestoreTrash(fileId: string) {
    setRestoringTrashId(fileId);
    try {
      const res = await fetch(`/api/files/${fileId}/restore`, { method: "POST" });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        alert(j.error || "No se pudo restaurar el archivo");
        return;
      }
      void loadAll();
    } finally {
      setRestoringTrashId(null);
    }
  }

  // ─── Loading / error states ─────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Cargando configuración…</span>
      </div>
    );
  }

  if (!settings) {
    return (
      <p className="text-sm text-destructive">
        {configLoadError || "No se pudo cargar la configuración."}
      </p>
    );
  }

  const activeChannels  = settings.selectedChannels.split(",").filter(Boolean);
  const activeProjects  = settings.proyectosFiltro.split(",").filter(Boolean);
  const activeClients   = settings.clientesFiltro.split(",").filter(Boolean);
  const activeWatchUsers = settings.userWatchlist.split(",").filter(Boolean);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Settings className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Configuración</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSupremo
                ? "Centro de control del sistema · Admin Supremo"
                : "Preferencias personales de notificaciones y privacidad."}
            </p>
          </div>
        </div>

        <button
          id="btn-save-config"
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : saved ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Guardando…" : saved ? "¡Guardado!" : "Guardar cambios"}
        </button>
      </header>

      {configLoadWarning && (
        <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:text-amber-100/90">
          {configLoadWarning}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-border/60 bg-muted/10 px-5 py-4">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Bell className="h-4 w-4 shrink-0 text-foreground/70" strokeWidth={1.75} />
          Los avisos de mensajes nuevos aparecen como burbujas en la esquina superior derecha mientras usas Comunicaciones.
        </p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/40 px-5 py-4">
        <p className="text-sm font-medium text-foreground">NIP de eliminación (Proyectos · DOCS y adjuntos)</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Cuatro dígitos para confirmar al mover archivos a la papelera.{" "}
          {hasNip
            ? "Tu NIP está activo; puedes reemplazarlo indicando un nuevo código."
            : "Aún no tienes NIP. Configúralo aquí para poder eliminar archivos."}
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="block min-w-[160px] text-xs font-medium text-muted-foreground">
            NIP (4 dígitos)
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              autoComplete="new-password"
              className="mt-1 block w-full max-w-[220px] border-0 border-b border-input bg-transparent py-1.5 text-sm tabular-nums tracking-widest text-foreground focus:border-accent focus:outline-none focus:ring-0"
              value={nipDraft}
              onChange={(e) => setNipDraft(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="••••"
            />
          </label>
          <button
            type="button"
            disabled={nipBusy || nipDraft.length !== 4}
            onClick={() => void saveNip()}
            className="rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground shadow-sm transition hover:opacity-90 disabled:opacity-40"
          >
            {nipBusy ? "Guardando…" : "Guardar NIP"}
          </button>
        </div>
        {nipMsg ? (
          <p
            className={`mt-3 text-xs ${nipMsg.includes("correctamente") ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}
          >
            {nipMsg}
          </p>
        ) : null}
      </div>

      {/* ── Admin Supremo Banner (alto contraste, credencial profesional) ─ */}
      {isSupremo && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/60 bg-slate-900 px-6 py-5 shadow-lg shadow-amber-900/10">
          {/* Reflejo dorado sutil */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-400/5" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/10">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide text-amber-400">ADMIN SUPREMO — ACCESO TOTAL</p>
              <p className="mt-0.5 text-xs text-amber-500/70">
                Ninguna restricción de pestañas aplica. Control absoluto del sistema BIM.OS.
              </p>
            </div>
            <Zap className="ml-auto h-5 w-5 text-amber-500/40" strokeWidth={1.5} />
          </div>
        </div>
      )}

      {/* ── Grid de tarjetas ───────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* 1. FILTROS DE INTERACCIÓN */}
        <SectionCard
          icon={Bell}
          title="Filtros de Interacción"
          description="Define qué tipo de alertas recibirás en el sistema."
          accent="bg-violet-500/10 text-violet-400"
        >
          <div className="space-y-4">
            <ToggleRow
              id="toggle-alta"
              label="Solo prioridad alta"
              icon={Star}
              iconClass="text-amber-400"
              checked={settings.soloAltaPrioridad}
              onChange={v => updateSetting("soloAltaPrioridad", v)}
            />
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
              <p className="text-[11px] text-amber-400/80 leading-relaxed">
                <span className="font-semibold">Regla automática:</span> Los mensajes, menciones o asignaciones
                realizadas por un <span className="font-semibold">ADMIN</span> siempre se marcan como Alta Prioridad.
              </p>
            </div>
            <ToggleRow
              id="toggle-menciones"
              label="Solo cuando me mencionan (@)"
              icon={AtSign}
              iconClass="text-sky-400"
              checked={settings.soloMenciones}
              onChange={v => updateSetting("soloMenciones", v)}
            />

            {/* Selector de Nivel de Detalle */}
            <div className="mt-6 space-y-3 rounded-xl border border-border/40 bg-muted/20 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Nivel de detalle en las burbujas de aviso
              </p>
              <div className="grid gap-2">
                {DETALLE_NOTIF_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer flex-col gap-1 rounded-xl border p-3 transition ${
                      settings.detalleNotificacion === opt.id
                        ? "border-accent bg-accent/5 ring-1 ring-accent"
                        : "border-border/60 bg-transparent hover:border-border hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">{opt.label}</span>
                      <input
                        type="radio"
                        name="detalleNotificacion"
                        checked={settings.detalleNotificacion === opt.id}
                        onChange={() => updateSetting("detalleNotificacion", opt.id)}
                        className="h-3.5 w-3.5 accent-accent"
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 2. FILTROS DE CONTEXTO */}
        <SectionCard
          icon={Filter}
          title="Filtros de Contexto"
          description="Activa o desactiva notificaciones por tipo de contenido."
          accent="bg-emerald-500/10 text-emerald-400"
        >
          <div className="space-y-4">

            {/* Mensajes + desplegable de canales */}
            <div>
              <div className="flex items-center justify-between gap-4 py-0.5">
                <label htmlFor="toggle-mensajes" className="flex cursor-pointer items-center gap-2 text-sm text-foreground select-none">
                  <MessageSquare className="h-4 w-4 text-violet-400" strokeWidth={1.75} />
                  Mensajes del canal
                </label>
                <div className="flex items-center gap-2">
                  {settings.filtroMensajes && channels.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowChannelList(v => !v)}
                      className="inline-flex items-center gap-1 rounded-lg bg-muted/60 px-2 py-1 text-[11px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                    >
                      {activeChannels.length > 0 ? `${activeChannels.length} canal${activeChannels.length > 1 ? "es" : ""}` : "Todos"}
                      <ChevronDown className={`h-3 w-3 transition-transform ${showChannelList ? "rotate-180" : ""}`} />
                    </button>
                  )}
                  <Toggle
                    id="toggle-mensajes"
                    checked={settings.filtroMensajes}
                    onChange={v => {
                      updateSetting("filtroMensajes", v);
                      setShowChannelList(v);
                    }}
                  />
                </div>
              </div>

              {/* Lista de canales desplegable */}
              {settings.filtroMensajes && showChannelList && channels.length > 0 && (
                <div className="mt-3 rounded-xl border border-border/60 bg-muted/20 p-3">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Canales activos
                  </p>
                  <div className="space-y-2">
                    {channels.map(ch => {
                      const active = activeChannels.includes(ch.id);
                      return (
                        <label key={ch.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-muted/40 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => toggleCSV("selectedChannels", ch.id)}
                            className="h-4 w-4 accent-accent rounded"
                          />
                          <span className="text-sm text-foreground">{ch.nombre}</span>
                          {active && (
                            <span className="ml-auto rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                              activo
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  {activeChannels.length === 0 && (
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Sin selección = alertas de <span className="font-semibold">todos</span> los canales.
                    </p>
                  )}
                </div>
              )}
            </div>

            <ToggleRow
              id="toggle-proyectos"
              label="Actualizaciones de proyectos"
              icon={FolderKanban}
              iconClass="text-emerald-400"
              checked={settings.filtroProyectos}
              onChange={v => updateSetting("filtroProyectos", v)}
            />
            <ToggleRow
              id="toggle-tareas"
              label="Cambios en tareas"
              icon={CheckSquare}
              iconClass="text-orange-400"
              checked={settings.filtroTareas}
              onChange={v => updateSetting("filtroTareas", v)}
            />
          </div>
        </SectionCard>

        {(isAdmin || isSupremo) && (
          <div className="lg:col-span-2">
            <SectionCard
              icon={File}
              title="Alertas de Archivos"
              description="Los administradores ven avisos en pantalla cuando alguien sube archivos a un proyecto. Filtra por extensión y/o por usuarios concretos (regla OR)."
              accent="bg-sky-500/10 text-sky-400"
            >
              <div className="space-y-5">
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Por defecto</span> se notifica{" "}
                  <span className="font-medium text-foreground">toda</span> subida. Si indicas extensiones o usuarios,
                  solo avisará cuando coincida la extensión <span className="italic">o</span> cuando quien sube esté en tu lista.
                </p>

                <label className="block space-y-2">
                  <span className="text-xs font-medium text-foreground">Extensiones deseadas</span>
                  <input
                    type="text"
                    value={settings.fileExtensionsFilter}
                    onChange={(e) => updateSetting("fileExtensionsFilter", e.target.value)}
                    placeholder="Ej: .ifc, .rvt, .pdf"
                    className="w-full rounded-xl border border-border/60 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
                  />
                  <span className="text-[10px] text-muted-foreground">
                    Separadas por coma o espacio. Punto opcional (.pdf y pdf valen). Vacío = cualquier extensión.
                  </span>
                </label>

                <div className="rounded-xl border border-border/60 bg-muted/15 p-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Usuarios específicos (vigilar subidas)
                  </p>
                  {watchUsers.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No hay usuarios disponibles o no tienes permiso para listarlos.</p>
                  ) : (
                    <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                      {watchUsers.map((u) => {
                        const active = activeWatchUsers.includes(u.id);
                        return (
                          <label
                            key={u.id}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-muted/40 select-none"
                          >
                            <input
                              type="checkbox"
                              checked={active}
                              onChange={() => toggleCSV("userWatchlist", u.id)}
                              className="h-4 w-4 accent-accent rounded"
                            />
                            <span className="text-sm text-foreground">{u.nombre}</span>
                            {active ? (
                              <span className="ml-auto rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                                vigilar
                              </span>
                            ) : null}
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {activeWatchUsers.length === 0 && watchUsers.length > 0 ? (
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Sin selección = no filtras por usuario (siguen aplicando solo las extensiones si las configuraste).
                    </p>
                  ) : null}
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        {/* 3. CALENDARIO DE SILENCIO */}
        <SectionCard
          icon={BellOff}
          title="Calendario de Silencio"
          description="Silencia el sistema en horarios y días específicos."
          accent="bg-rose-500/10 text-rose-400"
        >
          <div className="space-y-5">

            {/* Opciones maestras */}
            <div className="space-y-3 rounded-xl border border-border/50 bg-muted/20 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Opciones maestras
              </p>
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="toggle-silence-all-days" className="flex cursor-pointer items-center gap-2 text-sm text-foreground select-none">
                  <Moon className="h-4 w-4 text-indigo-400" strokeWidth={1.75} />
                  Silenciar todos los días
                </label>
                <Toggle
                  id="toggle-silence-all-days"
                  size="sm"
                  checked={settings.silenceAllDays}
                  onChange={handleSilenceAllDays}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="toggle-silence-24h" className="flex cursor-pointer items-center gap-2 text-sm text-foreground select-none">
                  <BellOff className="h-4 w-4 text-rose-400" strokeWidth={1.75} />
                  Silenciar todo el día (24h)
                </label>
                <Toggle
                  id="toggle-silence-24h"
                  size="sm"
                  checked={settings.silence24h}
                  onChange={v => updateSetting("silence24h", v)}
                />
              </div>
            </div>

            {/* Selector de días */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Días de silencio</p>
              <div className="flex flex-wrap gap-1.5">
                {DIAS.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    disabled={settings.silenceAllDays}
                    onClick={() => toggleSilDia(i)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      silDias.includes(i)
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Rango horario */}
            <div className={`grid grid-cols-2 gap-4 transition-opacity ${settings.silence24h ? "pointer-events-none opacity-40" : ""}`}>
              <label className="block text-xs font-medium text-muted-foreground">
                <Calendar className="mb-1 h-3.5 w-3.5 inline mr-1" />
                Inicio silencio
                <input
                  type="time"
                  value={silInicio}
                  onChange={e => setSilInicio(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </label>
              <label className="block text-xs font-medium text-muted-foreground">
                <Calendar className="mb-1 h-3.5 w-3.5 inline mr-1" />
                Fin silencio
                <input
                  type="time"
                  value={silFin}
                  onChange={e => setSilFin(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
                />
              </label>
            </div>
            {settings.silence24h && (
              <p className="text-[11px] text-rose-400/80">Modo 24h activo — el rango horario queda ignorado.</p>
            )}
          </div>
        </SectionCard>

        {/* 4. FILTRO POR EMPRESA */}
        {clients.length > 0 && (
          <SectionCard
            icon={Users}
            title="Filtro de Origen (Empresa)"
            description="Recibe solo notificaciones de estas empresas. Vacío = todas."
            accent="bg-sky-500/10 text-sky-400"
          >
            <div className="flex flex-wrap gap-2">
              {clients.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCSV("clientesFiltro", c.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activeClients.includes(c.id)
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {c.nombre}
                </button>
              ))}
            </div>
            {activeClients.length === 0 && (
              <p className="mt-2 text-xs text-muted-foreground">Ningún filtro activo — recibes de todas las empresas.</p>
            )}
          </SectionCard>
        )}
      </div>

      {/* Papelera de reciclaje — auditoría de borrado */}
      <SectionCard
        icon={Recycle}
        title="Papelera de Reciclaje"
        description="Trazabilidad: quién movió cada archivo a la papelera y cuándo. Solo administradores pueden vaciarla con PIN."
        accent="bg-orange-500/10 text-orange-400"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {trashItems.length === 0
              ? "La papelera está vacía."
              : `${trashItems.length} archivo${trashItems.length === 1 ? "" : "s"} en la papelera.`}
          </p>
          {isAdmin ? (
            <button
              type="button"
              disabled={trashItems.length === 0}
              onClick={() => {
                setPurgePin("");
                setPurgeOpen(true);
              }}
              className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Vaciar papelera
            </button>
          ) : (
            <p className="text-[10px] text-muted-foreground">Solo administradores pueden vaciar la papelera.</p>
          )}
        </div>
        {trashItems.length > 0 ? (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border/50 bg-muted/20">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead className="border-b border-border/60 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2.5">Archivo</th>
                  <th className="px-3 py-2.5">Usuario (ID)</th>
                  <th className="px-3 py-2.5">Fecha y hora</th>
                  <th className="px-3 py-2.5">Tamaño</th>
                  <th className="px-3 py-2.5">Extensión</th>
                  <th className="px-3 py-2.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {trashItems.map((item) => (
                  <tr key={item.id} className="hover:bg-background/40">
                    <td className="px-3 py-2.5">
                      <div className="flex items-start gap-2">
                        <TrashFileTypeIcon name={item.originalName} />
                        <div>
                          <p className="font-medium text-foreground leading-snug">{item.originalName}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {item.project?.nombre ?? "Documento de empresa (ISO)"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                      {item.deletedByUserId ?? item.deletedByUser?.id ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-muted-foreground">
                      {formatTrashAuditDate(item.deletedAt)}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{formatAuditFileSizeMb(item.size)}</td>
                    <td className="px-3 py-2.5 text-muted-foreground">{trashFileExtensionLabel(item.originalName)}</td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        disabled={restoringTrashId === item.id}
                        onClick={() => void handleRestoreTrash(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border/60 bg-background px-2.5 py-1 text-[11px] font-medium text-foreground transition hover:bg-muted disabled:opacity-50"
                      >
                        <RotateCcw className="h-3 w-3" strokeWidth={1.75} />
                        {restoringTrashId === item.id ? "…" : "Restaurar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </SectionCard>

      {purgeOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="trash-purge-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
            <h4 id="trash-purge-title" className="text-sm font-semibold text-foreground">
              Vaciar papelera
            </h4>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Se eliminarán de forma permanente todos los archivos listados (base de datos y disco). Introduce el PIN de
              seguridad.
            </p>
            <input
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={purgePin}
              onChange={(e) => setPurgePin(e.target.value)}
              className="mt-4 w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
              placeholder="PIN de seguridad"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setPurgeOpen(false);
                  setPurgePin("");
                }}
                className="rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={purgeBusy}
                onClick={() => void handlePurgeTrash()}
                className="rounded-lg bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {purgeBusy ? "Procesando…" : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 5. FILTRO POR PROYECTO — ancho completo */}
      {projects.length > 0 && (
        <SectionCard
          icon={FolderKanban}
          title="Filtro por Proyecto"
          description="Activa o desactiva notificaciones por proyecto individual. Vacío = todos."
          accent="bg-teal-500/10 text-teal-400"
        >
          <div className="flex flex-wrap gap-2">
            {projects.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => toggleCSV("proyectosFiltro", p.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeProjects.includes(p.id)
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {p.nombre}
              </button>
            ))}
          </div>
          {activeProjects.length === 0 && (
            <p className="mt-2 text-xs text-muted-foreground">Sin filtro — recibes de todos los proyectos.</p>
          )}
        </SectionCard>
      )}
    </div>
  );
}
