import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthPayload } from "@/lib/comunicaciones-auth";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
// Vercel limita Streaming a 25 s en el plan gratuito — usamos un ciclo de 20 s.
export const maxDuration = 25;

/**
 * GET /api/sse/file-uploads?since=<ISO-timestamp>
 *
 * Devuelve un stream Server-Sent Events.  El cliente abre la conexión con la
 * última marca de tiempo conocida; el servidor espera hasta ~20 s buscando
 * eventos nuevos (long-poll SSE) y cierra la respuesta.  El cliente reabre
 * inmediatamente — esto es compatible con Vercel sin WebSockets.
 */
export async function GET(req: Request) {
  // ── Autenticación ────────────────────────────────────────────────────────
  let auth = await getAuthPayload();
  if (!auth) {
    const bearer = req.headers.get("authorization");
    if (bearer?.startsWith("Bearer ")) {
      auth = await verifyToken(bearer.slice(7));
    }
  }
  if (!auth) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const viewerId = auth.id;

  // ── Parámetros ───────────────────────────────────────────────────────────
  const url = new URL(req.url);
  const sinceRaw = url.searchParams.get("since");
  let since = sinceRaw ? new Date(sinceRaw) : new Date(Date.now() - 5_000);
  if (isNaN(since.getTime())) since = new Date(Date.now() - 5_000);

  // ── Configuración de notificaciones del usuario ───────────────────────────
  const settings = await prisma.notificationSettings.findUnique({
    where: { userId: viewerId },
    select: {
      filtroProyectos: true,
      fileExtensionsFilter: true,
      userWatchlist: true,
      silenceAllDays: true,
      silence24h: true,
    },
  });

  // Si el usuario desactivó notificaciones de proyectos → stream vacío
  if (settings?.filtroProyectos === false || settings?.silence24h) {
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(": silenced\n\n"));
        controller.close();
      },
    });
    return new Response(body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  // ── SSE Stream con long-poll ──────────────────────────────────────────────
  const encoder = new TextEncoder();
  let isClosed = false;

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        if (isClosed) return;
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      // Heartbeat inmediato para que el navegador registre la conexión
      controller.enqueue(encoder.encode(": connected\n\n"));

      const POLL_INTERVAL_MS = 3_000;
      const MAX_WAIT_MS = 20_000;
      let elapsed = 0;
      let lastSeen = since;

      while (elapsed < MAX_WAIT_MS && !isClosed) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
        elapsed += POLL_INTERVAL_MS;

        try {
          const events = await prisma.fileUploadEvent.findMany({
            where: { createdAt: { gt: lastSeen } },
            orderBy: { createdAt: "asc" },
            take: 20,
            include: {
              uploader: { select: { id: true, nombre: true } },
              project: { select: { nombre: true } },
            },
          });

          for (const ev of events) {
            // No notificar al propio subidor
            if (ev.uploaderId && ev.uploaderId === viewerId) continue;

            // Filtro por extensión / watchlist
            const extCsv = settings?.fileExtensionsFilter?.trim() ?? "";
            const watchCsv = settings?.userWatchlist?.trim() ?? "";
            const extList = extCsv
              .split(/[,;\s]+/)
              .map((s) => s.trim().toLowerCase())
              .filter(Boolean)
              .map((s) => (s.startsWith(".") ? s : `.${s}`));
            const watchIds = watchCsv
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);

            const hasExtRules = extList.length > 0;
            const hasWatchRules = watchIds.length > 0;

            if (hasExtRules || hasWatchRules) {
              const dot = ev.originalName.lastIndexOf(".");
              const ext = dot >= 0 ? ev.originalName.slice(dot).toLowerCase() : "";
              const extMatch = hasExtRules && extList.includes(ext);
              const userMatch =
                hasWatchRules && ev.uploaderId != null && watchIds.includes(ev.uploaderId);
              if (!extMatch && !userMatch) {
                lastSeen = ev.createdAt;
                continue;
              }
            }

            send({
              type: "FILE_UPLOADED",
              eventId: ev.id,
              projectId: ev.projectId,
              projectName: ev.project?.nombre ?? "",
              fileName: ev.originalName,
              uploaderName: ev.uploader?.nombre ?? "Usuario",
              uploaderId: ev.uploaderId,
              createdAt: ev.createdAt.toISOString(),
            });

            lastSeen = ev.createdAt;
          }
        } catch {
          // Error de DB — continuamos hasta que expire el ciclo
        }
      }

      if (!isClosed) controller.close();
    },
    cancel() {
      isClosed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Desactiva buffering en proxies nginx
    },
  });
}
