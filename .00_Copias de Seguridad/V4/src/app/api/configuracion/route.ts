import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  let settings = await prisma.notificationSettings.findUnique({ where: { userId } });
  if (!settings) {
    settings = await prisma.notificationSettings.create({ data: { userId } });
  }
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
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
