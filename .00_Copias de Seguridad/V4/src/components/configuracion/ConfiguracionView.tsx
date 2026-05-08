"use client";

import { useEffect, useRef, useState } from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import {
  AtSign,
  Bell,
  BellOff,
  BellRing,
  Calendar,
  CheckSquare,
  ChevronDown,
  Filter,
  FolderKanban,
  Loader2,
  MessageSquare,
  Moon,
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
};

type ChannelItem = { id: string; nombre: string };
type ProjectItem = { id: string; nombre: string };
type ClientItem  = { id: string; nombre: string };

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const ALL_DIAS = [0, 1, 2, 3, 4, 5, 6];

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

export function ConfiguracionView({ isSupremo }: { isSupremo?: boolean }) {
  const { permission, requestPermission } = usePushNotifications();
  const [settings, setSettings] = useState<NotifSettings | null>(null);
  const [channels, setChannels]  = useState<ChannelItem[]>([]);
  const [projects, setProjects]  = useState<ProjectItem[]>([]);
  const [clients,  setClients]   = useState<ClientItem[]>([]);
  const [loading,  setLoading]   = useState(true);
  const [saving,   setSaving]    = useState(false);
  const [saved,    setSaved]     = useState(false);
  const [error,    setError]     = useState("");
  const [showChannelList, setShowChannelList] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Horario de silencio (estado local derivado del JSON)
  const [silDias,   setSilDias]   = useState<number[]>([]);
  const [silInicio, setSilInicio] = useState("22:00");
  const [silFin,    setSilFin]    = useState("08:00");

  useEffect(() => { void loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [rSettings, rProjects, rClients, rChannels] = await Promise.all([
        fetch("/api/configuracion"),
        fetch("/api/projects?limit=100"),
        fetch("/api/clients?activo=true"),
        fetch("/api/channels"),
      ]);

      if (rSettings.ok) {
        const s: NotifSettings = await rSettings.json();
        setSettings(s);
        try {
          const cal = JSON.parse(s.calendarioSilencio || "{}");
          if (Array.isArray(cal.dias))    setSilDias(cal.dias);
          if (typeof cal.horaInicio === "string") setSilInicio(cal.horaInicio);
          if (typeof cal.horaFin    === "string") setSilFin(cal.horaFin);
        } catch { /* noop */ }
        if (s.filtroMensajes) setShowChannelList(true);
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
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  function updateSetting<K extends keyof NotifSettings>(key: K, value: NotifSettings[K]) {
    setSettings(prev => prev ? { ...prev, [key]: value } : prev);
  }

  function toggleCSV(field: "selectedChannels" | "proyectosFiltro" | "clientesFiltro", id: string) {
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
      const updated: NotifSettings = await res.json();
      setSettings(updated);
      setSaved(true);
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally { setSaving(false); }
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
    return <p className="text-sm text-destructive">No se pudo cargar la configuración.</p>;
  }

  const activeChannels  = settings.selectedChannels.split(",").filter(Boolean);
  const activeProjects  = settings.proyectosFiltro.split(",").filter(Boolean);
  const activeClients   = settings.clientesFiltro.split(",").filter(Boolean);

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

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* ── Banner de permisos de escritorio ──────────────────────────── */}
      {permission === "default" && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-sky-500/30 bg-sky-500/5 px-5 py-4">
          <div className="flex items-center gap-3">
            <BellRing className="h-5 w-5 text-sky-400" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-semibold text-foreground">Alertas de escritorio desactivadas</p>
              <p className="text-xs text-muted-foreground">Actívalas para recibir notificaciones incluso con la ventana minimizada.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void requestPermission()}
            className="shrink-0 rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-400"
          >
            Activar alertas
          </button>
        </div>
      )}
      {permission === "denied" && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 px-5 py-4">
          <p className="flex items-center gap-2 text-xs text-rose-400">
            <BellOff className="h-4 w-4" />
            Las alertas de escritorio están bloqueadas por el navegador. Permítelas en la configuración del sitio.
          </p>
        </div>
      )}
      {permission === "granted" && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4">
          <Bell className="h-4 w-4 text-emerald-400" />
          <p className="text-xs font-medium text-emerald-400">Alertas de escritorio activas — Windows mostrará las notificaciones.</p>
        </div>
      )}

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
                Nivel de detalle en alertas de escritorio
              </p>
              <div className="grid gap-2">
                {[
                  { id: "BREVE", label: "Breve (Privacidad Máxima)", desc: 'Solo muestra "Tienes un nuevo mensaje"' },
                  { id: "INTERMEDIO", label: "Intermedio", desc: "Muestra remitente y canal" },
                  { id: "COMPLETO", label: "Completo", desc: "Muestra remitente, canal y contenido" },
                ].map((opt) => (
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
                        onChange={() => updateSetting("detalleNotificacion", opt.id as any)}
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
