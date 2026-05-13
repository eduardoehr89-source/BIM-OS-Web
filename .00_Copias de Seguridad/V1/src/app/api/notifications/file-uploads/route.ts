import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { shouldNotifyAdminOfFileUpload } from "@/lib/file-upload-notifications";

function logApiError(scope: string, e: unknown) {
  if (e instanceof Error) {
    console.error(scope, e.message, "\n", e.stack);
  } else {
    console.error(scope, String(e));
  }
}

function parseSinceMs(raw: string | null): number | null {
  if (raw == null || raw.trim() === "") return null;
  const d = Date.parse(raw.trim());
  return Number.isFinite(d) ? d : null;
}

export async function GET(req: Request) {
  try {
    const viewerId = await getCurrentUserId();
    if (!viewerId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: viewerId },
      select: { tipo: true, isSupremo: true },
    });

    if (!user || (user.tipo !== "ADMIN" && !user.isSupremo)) {
      const now = new Date();
      return NextResponse.json({ events: [], nextSince: now.toISOString() });
    }

    const url = new URL(req.url);
    const sinceMs = parseSinceMs(url.searchParams.get("since"));
    const sinceDate =
      sinceMs != null ? new Date(sinceMs) : new Date(Date.now() - 60_000);

    const settings = await prisma.notificationSettings.upsert({
      where: { userId: viewerId },
      create: { userId: viewerId },
      update: {},
    });

    const events = await prisma.fileUploadEvent.findMany({
      where: { createdAt: { gt: sinceDate } },
      orderBy: { createdAt: "asc" },
      take: 80,
      include: {
        uploader: { select: { nombre: true } },
      },
    });

    type Out = {
      id: string;
      originalName: string;
      uploaderNombre: string | null;
      createdAt: string;
    };

    const out: Out[] = [];
    let nextSince = sinceDate;

    for (const ev of events) {
      const t = ev.createdAt.getTime();
      if (t > nextSince.getTime()) {
        nextSince = ev.createdAt;
      }

      const slice = {
        fileExtensionsFilter: settings.fileExtensionsFilter ?? "",
        userWatchlist: settings.userWatchlist ?? "",
      };

      if (
        shouldNotifyAdminOfFileUpload(slice, {
          originalName: ev.originalName,
          uploaderId: ev.uploaderId,
          viewerId,
        })
      ) {
        out.push({
          id: ev.id,
          originalName: ev.originalName,
          uploaderNombre: ev.uploader?.nombre ?? null,
          createdAt: ev.createdAt.toISOString(),
        });
      }
    }

    return NextResponse.json({
      events: out,
      nextSince: nextSince.toISOString(),
    });
  } catch (e) {
    logApiError("[GET /api/notifications/file-uploads]", e);
    return NextResponse.json({
      events: [],
      nextSince: new Date().toISOString(),
    });
  }
}
