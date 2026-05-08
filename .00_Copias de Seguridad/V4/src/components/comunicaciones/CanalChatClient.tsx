"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Paperclip, Settings, Video, Mic, Send } from "lucide-react";
import { CanalAjustesModal } from "@/components/comunicaciones/CanalAjustesModal";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import type { NotifDetail } from "@/hooks/usePushNotifications";

type Miembro = { id: string; usuarioId: string; usuario: { id: string; nombre: string } };

type CanalDetail = {
  id: string;
  nombre: string;
  tema: string | null;
  descripcion: string | null;
  permiteTexto: boolean;
  permiteVoz: boolean;
  permiteArchivos: boolean;
  permiteVideo: boolean;
  project: { id: string; nombre: string } | null;
  miembros: Miembro[];
  isAdmin: boolean;
};

type Mensaje = {
  id: string;
  contenido: string;
  tipo: string;
  adjuntoUrl: string | null;
  createdAt: string;
  autor: { id: string; nombre: string; tipo?: string }; // Añadimos tipo para saber si es ADMIN
};

type NotifSettings = {
  soloAltaPrioridad: boolean;
  soloMenciones: boolean;
  filtroMensajes: boolean;
  selectedChannels: string;
  clientesFiltro: string;
  proyectosFiltro: string;
  silenceAllDays: boolean;
  silence24h: boolean;
  detalleNotificacion: NotifDetail;
  calendarioSilencio: string;
};

export function CanalChatClient({
  canalId,
  currentUserId,
}: {
  canalId: string;
  currentUserId: string;
}) {
  const { notify } = usePushNotifications();
  const [canal, setCanal] = useState<CanalDetail | null>(null);
  const [settings, setSettings] = useState<NotifSettings | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [lastMsgId, setLastMsgId] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [adjuntoUrl, setAdjuntoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<string>(currentUserId);

  useEffect(() => { userRef.current = currentUserId; }, [currentUserId]);

  const loadCanal = useCallback(async () => {
    const res = await fetch(`/api/comunicaciones/canales/${canalId}`);
    if (!res.ok) {
      setErr("No se pudo cargar el canal");
      setCanal(null);
      return;
    }
    const data = await res.json();
    setCanal(data);
    setErr("");
  }, [canalId]);

  const loadMensajes = useCallback(async (isInitial = false) => {
    const res = await fetch(`/api/comunicaciones/canales/${canalId}/mensajes`);
    if (!res.ok) return;
    const data: Mensaje[] = await res.json();
    const newMsgs = Array.isArray(data) ? data : [];
    
    // Lógica de notificaciones para mensajes nuevos
    if (!isInitial && newMsgs.length > 0 && settings && canal) {
      const lastKnown = lastMsgId;
      const latest = newMsgs[0]; // Asumiendo que el primero es el más reciente (desc)
      
      if (latest && latest.id !== lastKnown && latest.autor.id !== userRef.current) {
        // Verificar filtros
        let shouldNotify = settings.filtroMensajes;
        
        // Filtro por canal específico
        const activeChs = settings.selectedChannels.split(",").filter(Boolean);
        if (activeChs.length > 0 && !activeChs.includes(canalId)) shouldNotify = false;

        // Filtro Solo Menciones
        if (settings.soloMenciones) {
          const mentionStr = `@${canal.miembros.find(m => m.usuarioId === userRef.current)?.usuario.nombre}`;
          if (!latest.contenido.includes(mentionStr)) shouldNotify = false;
        }

        // Filtro Solo Prioridad Alta (Admins)
        const isFromAdmin = latest.autor.tipo === "ADMIN";
        if (settings.soloAltaPrioridad && !isFromAdmin) shouldNotify = false;

        // Filtro Silencio
        let isSilenced = settings.silence24h;
        if (!isSilenced && settings.calendarioSilencio) {
          try {
            const cal = JSON.parse(settings.calendarioSilencio);
            const now = new Date();
            if (cal.dias?.includes(now.getDay())) {
              const currentHM = now.getHours() * 60 + now.getMinutes();
              const [hI, mI] = (cal.horaInicio || "00:00").split(":").map(Number);
              const [hF, mF] = (cal.horaFin || "00:00").split(":").map(Number);
              const start = hI * 60 + mI;
              const end = hF * 60 + mF;
              if (start < end) {
                if (currentHM >= start && currentHM <= end) isSilenced = true;
              } else { // Rango nocturno (ej: 22:00 a 08:00)
                if (currentHM >= start || currentHM <= end) isSilenced = true;
              }
            }
          } catch {}
        }
        if (settings.silenceAllDays) isSilenced = true;

        if (shouldNotify && !isSilenced) {
          notify({
            senderName: latest.autor.nombre,
            channelName: canal.nombre,
            messageText: latest.contenido,
            isAdmin: isFromAdmin,
            detalle: settings.detalleNotificacion,
            silenced: false,
            tag: `msg-${canalId}`
          });
        }
      }
    }

    if (newMsgs.length > 0) setLastMsgId(newMsgs[0].id);
    setMensajes(newMsgs);
  }, [canalId, settings, canal, lastMsgId, notify]);

  const loadSettings = useCallback(async () => {
    const res = await fetch("/api/configuracion");
    if (res.ok) setSettings(await res.json());
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void (async () => {
      await loadSettings();
      await loadCanal();
      await loadMensajes(true);
      if (!cancelled) setLoading(false);
    })();

    // Polling cada 5 segundos para notificaciones en segundo plano
    const interval = setInterval(() => {
      void loadMensajes();
    }, 5000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [loadCanal, loadMensajes, loadSettings]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes.length]);

  async function enviar(tipo: "TEXTO" | "ARCHIVO" | "VOZ" | "VIDEO") {
    const c = canal;
    if (!c) return;
    let contenido = texto.trim();
    let url: string | null = null;
    if (tipo === "ARCHIVO") {
      url = adjuntoUrl.trim() || null;
      contenido = contenido || (url ? `Archivo: ${url}` : "");
      if (!contenido && !url) return;
    }
    if (tipo === "VOZ") {
      contenido = contenido || "Mensaje de voz";
    }
    if (tipo === "VIDEO") {
      contenido = contenido || "Mensaje de video";
      url = adjuntoUrl.trim() || null;
    }
    if (tipo === "TEXTO" && !contenido) return;

    const res = await fetch(`/api/comunicaciones/canales/${canalId}/mensajes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, contenido, adjuntoUrl: url }),
    });
    if (res.ok) {
      setTexto("");
      setAdjuntoUrl("");
      await loadMensajes();
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Cargando…</p>;
  if (err || !canal) return <p className="text-sm text-destructive">{err || "Canal no disponible"}</p>;

  const adminEnCanal = canal.isAdmin;

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[420px] flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
        <div className="min-w-0">
          <Link href="/comunicaciones" className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Canales
          </Link>
          <h1 className="text-xl font-semibold text-foreground">{canal.nombre}</h1>
          {canal.tema ? <p className="text-sm text-muted-foreground">{canal.tema}</p> : null}
          {canal.descripcion ? <p className="mt-1 text-xs text-muted-foreground">{canal.descripcion}</p> : null}
          {canal.project ? (
            <p className="mt-1 text-[11px] text-muted-foreground">Proyecto: {canal.project.nombre}</p>
          ) : null}
        </div>
        {adminEnCanal ? (
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted"
          >
            <Settings className="h-4 w-4" strokeWidth={1.75} />
            Ajustes del canal
          </button>
        ) : null}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-border/40 bg-muted/5 p-4">
        {mensajes.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">Aún no hay mensajes.</p>
        ) : (
          mensajes.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col gap-0.5 rounded-lg px-3 py-2 ${m.autor.id === currentUserId ? "ml-8 bg-accent/15" : "mr-8 bg-muted/30"}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium text-foreground">{m.autor.nombre}</span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(m.createdAt).toLocaleString("es")}
                </span>
              </div>

              <p className="whitespace-pre-wrap text-sm text-foreground">{m.contenido}</p>
              {m.adjuntoUrl ? (
                <a href={m.adjuntoUrl} className="text-xs text-accent underline" target="_blank" rel="noreferrer">
                  {m.adjuntoUrl}
                </a>
              ) : null}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 space-y-2 rounded-xl border border-border/60 bg-background p-3">
        {canal.permiteTexto ? (
          <label className="block text-xs text-muted-foreground">
            Mensaje
            <textarea
              className="mt-1 min-h-[72px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe un mensaje…"
            />
          </label>
        ) : (
          <p className="text-xs text-muted-foreground">El texto está deshabilitado en este canal.</p>
        )}



        <div className="flex flex-wrap items-center gap-2">
          {canal.permiteTexto ? (
            <button
              type="button"
              onClick={() => void enviar("TEXTO")}
              className="inline-flex items-center gap-1 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-accent-foreground"
            >
              <Send className="h-3.5 w-3.5" />
              Enviar
            </button>
          ) : null}
          {canal.permiteArchivos ? (
            <button
              type="button"
              onClick={() => void enviar("ARCHIVO")}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs hover:bg-muted"
            >
              <Paperclip className="h-3.5 w-3.5" />
              Archivo
            </button>
          ) : null}
          {canal.permiteVoz ? (
            <button
              type="button"
              onClick={() => void enviar("VOZ")}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs hover:bg-muted"
            >
              <Mic className="h-3.5 w-3.5" />
              Voz
            </button>
          ) : null}
          {canal.permiteVideo ? (
            <button
              type="button"
              onClick={() => void enviar("VIDEO")}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs hover:bg-muted"
            >
              <Video className="h-3.5 w-3.5" />
              Video
            </button>
          ) : null}
        </div>
      </div>

      <CanalAjustesModal
        open={settingsOpen}
        canalId={canalId}
        canal={canal}
        onClose={() => setSettingsOpen(false)}
        onUpdated={() => {
          void loadCanal();
        }}
      />
    </div>
  );
}
