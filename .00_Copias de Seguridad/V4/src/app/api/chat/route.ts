import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        organization: true,
        ownedProjects: { include: { sharedWith: true, owner: true } },
        sharedProjects: { include: { sharedWith: true, owner: true } },
      }
    });

    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

    // Determinar usuarios permitidos para chatear
    const allowedUserIds = new Set<string>();
    allowedUserIds.add(user.id);

    // 1. Usuarios de la misma organización
    if (user.organizationId) {
      const orgUsers = await prisma.user.findMany({
        where: { organizationId: user.organizationId }
      });
      orgUsers.forEach(u => allowedUserIds.add(u.id));
    }

    // 2. Usuarios en proyectos compartidos activos
    const allProjects = [...user.ownedProjects, ...user.sharedProjects];
    for (const p of allProjects) {
      if (p.ownerId) allowedUserIds.add(p.ownerId);
      p.sharedWith.forEach(u => allowedUserIds.add(u.id));
    }

    // Obtener mensajes de los usuarios permitidos
    const messages = await prisma.chatMessage.findMany({
      where: {
        senderId: { in: Array.from(allowedUserIds) }
      },
      orderBy: { timestamp: "asc" },
      take: 100,
      include: {
        sender: {
          select: { id: true, nombre: true, tipo: true, rol: true, organization: { select: { nombre: true, tipo: true } } }
        },
        mentions: {
          select: { id: true, nombre: true }
        },
        attachedFile: {
          select: { id: true, originalName: true, projectId: true }
        },
        attachedTask: {
          select: { id: true, nombre: true, projectId: true }
        }
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const formData = await req.formData();
    const contenido = formData.get("contenido") as string;
    const mentionsStr = formData.get("mentions") as string;
    const attachedFileId = formData.get("attachedFileId") as string;
    const attachedTaskId = formData.get("attachedTaskId") as string;
    const voiceFile = formData.get("voiceFile") as File;

    let mentions: string[] = [];
    if (mentionsStr) {
      mentions = JSON.parse(mentionsStr);
    }

    // Validación de seguridad de adjuntos
    if (attachedFileId || attachedTaskId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { tipo: true }
      });
      const isAdmin = user?.tipo === "ADMIN";

      if (attachedFileId) {
        const file = await prisma.projectFile.findUnique({
          where: { id: attachedFileId },
          include: { project: { select: { ownerId: true, sharedWith: { select: { id: true } } } } }
        });
        if (!file) return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
        if (!isAdmin && file.project.ownerId !== userId && !file.project.sharedWith.some(u => u.id === userId)) {
          return NextResponse.json({ error: "No tienes permiso para adjuntar este archivo" }, { status: 403 });
        }
      }

      if (attachedTaskId) {
        const task = await prisma.projectTask.findUnique({
          where: { id: attachedTaskId },
          include: { sharedWith: { select: { id: true } } }
        });
        if (!task) return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
        if (!isAdmin && task.ownerId !== userId && !task.sharedWith.some(u => u.id === userId)) {
          return NextResponse.json({ error: "No tienes permiso para adjuntar esta tarea" }, { status: 403 });
        }
      }
    }

    // Aquí iría la lógica para guardar el voiceFile (se asume en public/uploads/chat)
    let voiceUrl = null;
    if (voiceFile && voiceFile.size > 0) {
      const bytes = await voiceFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const dirPath = path.join(process.cwd(), "public", "uploads", "voice");
      await mkdir(dirPath, { recursive: true });
      const fileName = `voice_${Date.now()}.webm`;
      await writeFile(path.join(dirPath, fileName), buffer);
      voiceUrl = `/uploads/voice/${fileName}`;
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        contenido: contenido || "",
        senderId: userId,
        voiceUrl,
        attachedFileId: attachedFileId || null,
        attachedTaskId: attachedTaskId || null,
        mentions: mentions.length > 0 ? {
          connect: mentions.map(id => ({ id }))
        } : undefined
      },
      include: {
        sender: {
          select: { id: true, nombre: true, tipo: true, rol: true, organization: { select: { nombre: true, tipo: true } } }
        },
        mentions: {
          select: { id: true, nombre: true }
        },
        attachedFile: {
          select: { id: true, originalName: true, projectId: true }
        },
        attachedTask: {
          select: { id: true, nombre: true, projectId: true }
        }
      }
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno al enviar mensaje" }, { status: 500 });
  }
}
