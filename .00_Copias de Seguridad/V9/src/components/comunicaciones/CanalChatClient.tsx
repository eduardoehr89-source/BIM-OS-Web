"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Paperclip, Settings, Video, Mic, Send } from "lucide-react";
import { CanalAjustesModal } from "@/components/comunicaciones/CanalAjustesModal";
import type { NotifDetail } from "@/hooks/usePushNotifications";

type Miembro = { id: string; usuarioId: string; usuario: { id: string; nombre: string } };

type CanalDetail = {
  id: string;
  tipo?: string;
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
  isDirect?: boolean;
  peerUsuario?: { id: string; nombre: string } | null;
};

type Mensaje = {
  id: string;
  contenido: string;
  tipo: string;
  adjuntoUrl: string | null;
  createdAt: string;
  autor: { id: string; nombre: string; tipo?: string };
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

function mensajePreview(text: string, detalle: NotifDetail): string {
  const limits: Record<NotifDetail, number> = { BREVE: 0, INTERMEDIO: 160, COMPLETO: 960 };
  const max = limits[detalle];
  const t = text.trim();
  if (detalle === "BREVE") return "";
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function toastCopyForDetalle(
  detalle: NotifDetail,
  senderName: string,
  channelName: string,
  messageText: string,
  isAdmin: boolean,
): { headline: string; sub: string; body: string } {
  switch (detalle) {
    case "COMPLETO":
      return {
        headline: `${isAdmin ? "Administrador · " : ""}${senderName}`,
        sub: channelName,
        body: mensajePreview(messageText, "COMPLETO") || "…",
      };
    case "INTERMEDIO":
      return {
        headline: `${isAdmin ? "Administrador · " : ""}${senderName}`,
        sub: `Mensaje en ${channelName}`,
        body: mensajePreview(messageText, "INTERMEDIO"),
      };
    default:
      return {
        headline: isAdmin ? "Mensaje de administrador" : "Nuevo mensaje",
        sub: channelName,
        body: isAdmin
          ? "Tienes un mensaje prioritario en este canal."
          : "Abre el hilo para ver el contenido.",
      };
  }
}

const CHAT_NOTIF_ICON = "/icon.png";

function desktopAlertForDetail(
  detalle: NotifDetail,
  senderName: string,
  channelName: string,
  messageText: string,
): { title: string; body: string } {
  switch (detalle) {
    case "BREVE":
      return { title: "Chat BIM.OS", body: "Tienes un nuevo mensaje" };
    case "INTERMEDIO":
      return { title: "Chat BIM.OS", body: `${senderName} en ${channelName}` };
    case "COMPLETO":
    default: {
      const text = mensajePreview(messageText, "COMPLETO") || "(sin texto)";
      return { title: "Chat BIM.OS", body: `[${senderName}]: ${text}` };
    }
  }
}

async function showDesktopChatMessage(opts: {
  title: string;
  body: string;
  canalIdForTag: string;
  requireInteraction?: boolean;
}) {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (document.visibilityState === "visible") return;
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  try {
    const registration = await navigator.serviceWorker.ready;
    const sw = registration.active;
    if (sw) {
      sw.postMessage({
        type: "CHAT_MESSAGE_NOTIFICATION",
        title: opts.title,
        body: opts.body,
        icon: CHAT_NOTIF_ICON,
        tag: `chat-message:${opts.canalIdForTag}`,
        requireInteraction: Boolean(opts.requireInteraction),
      });
      return;
    }
    await registration.showNotification(opts.title, {
      body: opts.body,
      icon: CHAT_NOTIF_ICON,
      badge: "/favicon.ico",
      tag: `chat-message:${opts.canalIdForTag}`,
      requireInteraction: Boolean(opts.requireInteraction),
    });
  } catch {
    /* noop */
  }
}

function showNewMessageToast(opts: {
  senderName: string;
  channelName: string;
  messageText: string;
  isAdmin: boolean;
  detalle: NotifDetail;
}) {
  const { headline, sub, body } = toastCopyForDetalle(
    opts.detalle,
    opts.senderName,
    opts.channelName,
    opts.messageText,
    opts.isAdmin,
  );
  const duration = opts.detalle === "COMPLETO" ? 9000 : opts.detalle === "INTERMEDIO" ? 6500 : 4500;
  const admin = opts.isAdmin;

  toast.custom(
    () => (
      <div
        className={`pointer-events-auto flex w-[min(100vw-2rem,20rem)] flex-col gap-0.5 rounded-xl border px-4 py-3 shadow-2xl ${
          admin
            ? "border-amber-500/90 bg-zinc-950 ring-1 ring-amber-400/30"
            : "border-zinc-600/95 bg-zinc-950"
        }`}
      >
        <p className="text-[13px] font-semibold leading-tight text-zinc-50">{headline}</p>
        <p className="text-[11px] font-medium tracking-wide text-zinc-400">{sub}</p>
        {body ? <p className="mt-1 text-[13px] leading-snug whitespace-pre-wrap text-zinc-200">{body}</p> : null}
      </div>
    ),
    { duration },
  );
}

const DEFAULT_NOTIF_SETTINGS: NotifSettings = {
  soloAltaPrioridad: false,
  soloMenciones: false,
  filtroMensajes: true,
  selectedChannels: "",
  clientesFiltro: "",
  proyectosFiltro: "",
  silenceAllDays: false,
  silence24h: false,
  detalleNotificacion: "BREVE",
  calendarioSilencio: "{}",
};

export function CanalChatClient({
  canalId,
  currentUserId,
}: {
  canalId: string;
  currentUserId: string;
}) {
  const [canal, setCanal] = useState<CanalDetail | null>(null);
  const [settings, setSettings] = useState<NotifSettings>(DEFAULT_NOTIF_SETTINGS);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [lastMsgId, setLastMsgId] = useState<string | null>(null);
  const [texto, setTexto] = useState("");
  const [adjuntoUrl, setAdjuntoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const [err, setErr] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<string>(currentUserId);
  const settingsRef = useRef(settings);
  const canalRef = useRef<CanalDetail | null>(null);
  const lastMsgIdRef = useRef<string | null>(null);

  useEffect(() => {
    userRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    canalRef.current = canal;
  }, [canal]);

  useEffect(() => {
    lastMsgIdRef.current = lastMsgId;
  }, [lastMsgId]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
  }, []);

  const loadCanal = useCallback(async () => {
    const res = await fetch(`/api/comunicaciones/canales/${canalId}`);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr((j as { error?: string }).error || "No se pudo cargar el canal");
      setCanal(null);
      return;
    }
    const data = await res.json();
    setCanal(data);
    setErr("");
  }, [canalId]);

  const loadMensajes = useCallback(
    async (isInitial = false) => {
      const res = await fetch(`/api/comunicaciones/canales/${canalId}/mensajes`);
      if (!res.ok) return;
      const data: Mensaje[] = await res.json();
      const newMsgs = Array.isArray(data) ? data : [];

      const settingsSnap = settingsRef.current;
      const canalSnap = canalRef.current;
      const lastKnown = lastMsgIdRef.current;
      const latest = newMsgs.length > 0 ? newMsgs[newMsgs.length - 1] : null;

      const isDm = Boolean(
        canalSnap && (canalSnap.tipo === "DIRECT" || canalSnap.isDirect === true),
      );

      const channelLabel =
        canalSnap &&
        (isDm
          ? `Chat con ${canalSnap.peerUsuario?.nombre ?? canalSnap.nombre}`
          : canalSnap.nombre);

      if (
        !isInitial &&
        latest &&
        settingsSnap &&
        canalSnap &&
        latest.id !== lastKnown &&
        latest.autor.id !== userRef.current
      ) {
        let shouldNotify = settingsSnap.filtroMensajes;

        const activeChs = settingsSnap.selectedChannels.split(",").filter(Boolean);
        if (!isDm && activeChs.length > 0 && !activeChs.includes(canalId)) shouldNotify = false;

        if (settingsSnap.soloMenciones) {
          const myName =
            canalSnap.miembros.find((m) => m.usuarioId === userRef.current)?.usuario.nombre.trim() ?? "";
          const mentionStr = myName ? `@${myName}` : "";
          if (!mentionStr || !latest.contenido.includes(mentionStr)) shouldNotify = false;
        }

        const isFromAdmin = latest.autor.tipo === "ADMIN";
        if (settingsSnap.soloAltaPrioridad && !isFromAdmin) shouldNotify = false;

        let isSilenced = settingsSnap.silence24h;
        if (!isSilenced && settingsSnap.calendarioSilencio) {
          try {
            const cal = JSON.parse(settingsSnap.calendarioSilencio);
            const now = new Date();
            if (cal.dias?.includes(now.getDay())) {
              const currentHM = now.getHours() * 60 + now.getMinutes();
              const [hI, mI] = (cal.horaInicio || "00:00").split(":").map(Number);
              const [hF, mF] = (cal.horaFin || "00:00").split(":").map(Number);
              const start = hI * 60 + mI;
              const end = hF * 60 + mF;
              if (start < end) {
                if (currentHM >= start && currentHM <= end) isSilenced = true;
              } else {
                if (currentHM >= start || currentHM <= end) isSilenced = true;
              }
            }
          } catch {
            /* noop */
          }
        }
        if (settingsSnap.silenceAllDays) isSilenced = true;

        if (shouldNotify && !isSilenced && channelLabel) {
          const toastOpts = {
            senderName: latest.autor.nombre,
            channelName: channelLabel,
            messageText: latest.contenido,
            isAdmin: isFromAdmin,
            detalle: settingsSnap.detalleNotificacion,
          };

          if (typeof document !== "undefined" && document.visibilityState === "visible") {
            showNewMessageToast(toastOpts);
          } else {
            void (async () => {
              const { title: dTitle, body: dBody } = desktopAlertForDetail(
                settingsSnap.detalleNotificacion,
                latest.autor.nombre,
                channelLabel,
                latest.contenido,
              );
              await showDesktopChatMessage({
                title: dTitle,
                body: dBody,
                canalIdForTag: canalId,
                requireInteraction: true,
              });
              if (
                typeof document !== "undefined" &&
                document.visibilityState !== "visible" &&
                (!("Notification" in window) || Notification.permission !== "granted")
              ) {
                showNewMessageToast(toastOpts);
              }
            })();
          }
        }
      }

      if (latest) setLastMsgId(latest.id);
      setMensajes(newMsgs);
    },
    [canalId],
  );

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/configuracion", { credentials: "same-origin" });
      if (res.ok) {
        const data = (await res.json()) as NotifSettings;
        const detalle = (["BREVE", "INTERMEDIO", "COMPLETO"] as const).includes(data.detalleNotificacion as NotifDetail)
          ? (data.detalleNotificacion as NotifDetail)
          : "BREVE";
        setSettings({ ...data, detalleNotificacion: detalle });
      }
    } catch {
      /* mantener DEFAULT_NOTIF_SETTINGS */
    }
  }, []);

  const retryLoad = useCallback(async () => {
    setLoadTimedOut(false);
    setLoading(true);
    setErr("");
    await Promise.all([loadCanal(), loadMensajes(true)]);
    void loadSettings();
    setLoading(false);
    setLoadTimedOut(false);
  }, [loadCanal, loadMensajes, loadSettings]);

  useEffect(() => {
    let cancelled = false;
    const slowId = window.setTimeout(() => {
      if (!cancelled) {
        setLoadTimedOut(true);
        setLoading(false);
      }
    }, 3000);

    queueMicrotask(() => {
      if (cancelled) return;
      setLoading(true);
      setLoadTimedOut(false);
    });

    void (async () => {
      await Promise.all([loadCanal(), loadMensajes(true)]);
      void loadSettings();
      if (!cancelled) {
        window.clearTimeout(slowId);
        setLoading(false);
        setLoadTimedOut(false);
      }
    })();

    const interval = setInterval(() => void loadMensajes(), 12000);
    return () => {
      cancelled = true;
      window.clearTimeout(slowId);
      clearInterval(interval);
    };
  }, [canalId, loadCanal, loadMensajes, loadSettings]);

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
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, contenido, adjuntoUrl: url }),
    });
    if (res.ok) {
      setTexto("");
      setAdjuntoUrl("");
      await loadMensajes();
    }
  }

  if (loading && !loadTimedOut) {
    return <p className="text-sm text-muted-foreground">Cargando…</p>;
  }

  if (err || !canal) {
    return (
      <div className="space-y-3">
        {loadTimedOut ? (
          <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-sm text-foreground">
            La carga superó 3 segundos.{" "}
            <button type="button" className="font-medium underline" onClick={() => void retryLoad()}>
              Reintentar
            </button>
          </div>
        ) : null}
        <p className="text-sm text-destructive">{err || "Canal no disponible"}</p>
        <button
          type="button"
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted"
          onClick={() => void retryLoad()}
        >
          Reintentar carga
        </button>
        <Link href="/comunicaciones" className="block text-xs text-muted-foreground underline">
          Volver a canales
        </Link>
      </div>
    );
  }

  const adminEnCanal = canal.isAdmin;
  const isDirectChat = canal.tipo === "DIRECT" || canal.isDirect === true;
  const peerNombre = canal.peerUsuario?.nombre ?? "Usuario";

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[420px] flex-col gap-4">
      {loadTimedOut ? (
        <div className="rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-2 text-xs text-foreground">
          Respuesta lenta detectada. Si algo falla,{" "}
          <button type="button" className="font-medium underline" onClick={() => void retryLoad()}>
            recargar datos
          </button>
          .
        </div>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 pb-4">
        <div className="min-w-0">
          <Link href="/comunicaciones" className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" />
            Canales
          </Link>
          <h1 className="text-xl font-semibold text-foreground">
            {isDirectChat ? `Chat privado con ${peerNombre}` : canal.nombre}
          </h1>
          {!isDirectChat && canal.tema ? <p className="text-sm text-muted-foreground">{canal.tema}</p> : null}
          {!isDirectChat && canal.descripcion ? (
            <p className="mt-1 text-xs text-muted-foreground">{canal.descripcion}</p>
          ) : null}
          {!isDirectChat && canal.project ? (
            <p className="mt-1 text-[11px] text-muted-foreground">Proyecto: {canal.project.nombre}</p>
          ) : null}
        </div>
        {adminEnCanal && !isDirectChat ? (
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
          <textarea
            className="min-h-[72px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe un mensaje…"
            aria-label="Mensaje"
          />
        ) : (
          <p className="text-xs text-muted-foreground">El texto está deshabilitado en este canal.</p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {canal.permiteTexto ? (
            <button
              type="button"
              onClick={() => void enviar("TEXTO")}
              className="inline-flex items-center gap-1 rounded-lg bg-accent px-3 py-2 text-xs font-semibold uppercase tracking-wide text-accent-foreground"
            >
              <Send className="h-3.5 w-3.5" />
              Enviar
            </button>
          ) : null}
          {!isDirectChat && canal.permiteArchivos ? (
            <button
              type="button"
              onClick={() => void enviar("ARCHIVO")}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs hover:bg-muted"
            >
              <Paperclip className="h-3.5 w-3.5" />
              Archivo
            </button>
          ) : null}
          {!isDirectChat && canal.permiteVoz ? (
            <button
              type="button"
              onClick={() => void enviar("VOZ")}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs hover:bg-muted"
            >
              <Mic className="h-3.5 w-3.5" />
              Voz
            </button>
          ) : null}
          {!isDirectChat && canal.permiteVideo ? (
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
        open={settingsOpen && !isDirectChat}
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
