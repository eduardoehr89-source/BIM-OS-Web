import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

function getDefaultSettings(userId: string) {
  return {
    id: "temp_default",
    userId,
    soloAltaPrioridad: false,
    soloMenciones: false,
    filtroMensajes: true,
    filtroProyectos: true,
    filtroTareas: true,
    selectedChannels: "",
    clientesFiltro: "",
    proyectosFiltro: "",
    silenceAllDays: false,
    silence24h: false,
    detalleNotificacion: "BREVE",
    calendarioSilencio: "{}",
    fileExtensionsFilter: "",
    userWatchlist: "",
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    let settings = await prisma.notificationSettings.findUnique({ where: { userId } });
    if (!settings) {
      const userExists = await prisma.user.findUnique({ where: { id: userId } });
      if (userExists) {
        settings = await prisma.notificationSettings.upsert({
          where: { userId },
          create: { userId },
          update: {},
        });
      } else {
        return NextResponse.json(getDefaultSettings(userId));
      }
    }
    return NextResponse.json(settings);
  } catch (e) {
    console.error("[GET /api/configuracion]", e);
    return NextResponse.json(getDefaultSettings(userId));
  }
}

export async function PATCH(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const userExists = await prisma.user.findUnique({ where: { id: userId } });
    const body = await request.json();
    const {
      soloAltaPrioridad,
      soloMenciones,
      filtroMensajes,
      filtroProyectos,
      filtroTareas,
      selectedChannels,
      clientesFiltro,
      proyectosFiltro,
      silenceAllDays,
      silence24h,
      detalleNotificacion,
      calendarioSilencio,
      fileExtensionsFilter,
      userWatchlist,
    } = body;

    const data: Record<string, unknown> = {};
    if (soloAltaPrioridad !== undefined) data.soloAltaPrioridad = Boolean(soloAltaPrioridad);
    if (soloMenciones !== undefined) data.soloMenciones = Boolean(soloMenciones);
    if (filtroMensajes !== undefined) data.filtroMensajes = Boolean(filtroMensajes);
    if (filtroProyectos !== undefined) data.filtroProyectos = Boolean(filtroProyectos);
    if (filtroTareas !== undefined) data.filtroTareas = Boolean(filtroTareas);
    if (selectedChannels !== undefined) data.selectedChannels = String(selectedChannels);
    if (clientesFiltro !== undefined) data.clientesFiltro = String(clientesFiltro);
    if (proyectosFiltro !== undefined) data.proyectosFiltro = String(proyectosFiltro);
    if (silenceAllDays !== undefined) data.silenceAllDays = Boolean(silenceAllDays);
    if (silence24h !== undefined) data.silence24h = Boolean(silence24h);
    if (detalleNotificacion !== undefined) data.detalleNotificacion = String(detalleNotificacion);
    if (calendarioSilencio !== undefined) {
      data.calendarioSilencio =
        typeof calendarioSilencio === "string"
          ? calendarioSilencio
          : JSON.stringify(calendarioSilencio);
    }
    if (fileExtensionsFilter !== undefined) data.fileExtensionsFilter = String(fileExtensionsFilter);
    if (userWatchlist !== undefined) data.userWatchlist = String(userWatchlist);

    if (!userExists) {
      // Si es cuenta de rescate, simplemente ignoramos el guardado pero reportamos éxito.
      console.warn("[PATCH /api/configuracion] Ignorado: usuario de rescate (no BD).");
      return NextResponse.json({ ...getDefaultSettings(userId), ...data });
    }

    const updated = await prisma.notificationSettings.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("[PATCH /api/configuracion]", e);
    return NextResponse.json({ error: "Error guardando configuración" }, { status: 500 });
  }
}
