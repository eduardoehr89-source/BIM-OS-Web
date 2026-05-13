import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyToken } from "@/lib/auth";
import { BEP_ANALYSIS_PROMPT, BEP_DIAGRAM_MODE_SUFFIX } from "@/lib/ai-prompts";
import { getAuthPayload } from "@/lib/comunicaciones-auth";
import { fetchGeminiModelNames } from "@/lib/gemini-list-models";
import { prisma } from "@/lib/prisma";
import { canUserAccessProjectFiles } from "@/lib/project-file-upload-access";
import { readProjectFileBuffer } from "@/lib/read-project-file-buffer";

export const dynamic = "force-dynamic";

// ✅ FIX: Modelo actualizado según logs de Vercel
const GEMINI_MODEL = "gemini-2.5-flash";

type Params = { params: Promise<{ id: string }> };

function extractMermaidBlock(raw: string): string {
  const match = raw.match(/```mermaid\s*([\s\S]*?)```/i);
  if (match) return match[1].trim();
  return raw.replace(/```mermaid/gi, "").replace(/```/g, "").trim();
}

export async function POST(req: Request, ctx: Params) {
  console.log(`[analyze] Iniciando análisis con ${GEMINI_MODEL}...`);

  const { id: projectId } = await ctx.params;

  let auth = await getAuthPayload();
  let userId = auth?.id ?? null;
  if (!userId) {
    const h = req.headers.get("authorization");
    if (h?.startsWith("Bearer ")) {
      auth = await verifyToken(h.slice(7).trim());
      userId = auth?.id ?? null;
    }
  }

  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const allowed = await canUserAccessProjectFiles(projectId, userId, auth);
  if (!allowed) return NextResponse.json({ error: "Sin acceso a este proyecto" }, { status: 403 });

  let body: { fileId?: unknown; mode?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const fileId = typeof body.fileId === "string" ? body.fileId.trim() : "";
  const modeRaw = typeof body.mode === "string" ? body.mode.trim() : "";
  const mode = modeRaw === "mermaid" ? "mermaid" : modeRaw === "analysis" ? "analysis" : null;

  if (!fileId || !mode) {
    return NextResponse.json(
      { error: "Se requieren fileId y mode válido (analysis | mermaid)" },
      { status: 400 },
    );
  }

  const file = await prisma.projectFile.findFirst({
    where: { id: fileId, projectId, isDeleted: false },
    select: { storedPath: true, storageKey: true, mimeType: true, originalName: true },
  });

  if (!file) return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });

  const buffer = await readProjectFileBuffer(file);
  if (!buffer?.length) {
    return NextResponse.json({ error: "No se pudo leer el archivo" }, { status: 502 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json({ error: "GEMINI_API_KEY no configurada" }, { status: 500 });
  }

  const basePrompt = `${BEP_ANALYSIS_PROMPT}\n\nAplica las reglas anteriores al documento adjunto.`;
  const prompt =
    mode === "mermaid"
      ? `${basePrompt}\n\n${BEP_DIAGRAM_MODE_SUFFIX}\n\nTu salida principal debe ser un bloque \`\`\`mermaid con un diagrama graph TD según el BEP.`
      : basePrompt;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  try {
    const mime = (file.mimeType || "").toLowerCase();
    let responseText: string;

    if (mime === "application/pdf" || mime === "application/x-pdf") {
      const result = await model.generateContent([
        { text: prompt },
        { inlineData: { mimeType: "application/pdf", data: buffer.toString("base64") } },
      ]);
      responseText = result.response.text();
    } else {
      const result = await model.generateContent(
        `${prompt}\n\n--- Contenido del documento (${file.originalName}) ---\n\n${buffer.toString("utf8")}`,
      );
      responseText = result.response.text();
    }

    console.log(`[analyze] OK modelo=${GEMINI_MODEL}`);

    if (mode === "mermaid") {
      return NextResponse.json({
        mode: "mermaid",
        markdown: responseText,
        mermaid: extractMermaidBlock(responseText),
      });
    }

    return NextResponse.json({ mode: "analysis", markdown: responseText });
  } catch (e: unknown) {
    console.error(`[analyze] Error modelo=${GEMINI_MODEL}:`, e);

    try {
      console.log("[analyze] Modelos disponibles:", await fetchGeminiModelNames(apiKey));
    } catch (listErr) {
      console.log("[analyze] Error al listar modelos:", listErr);
    }

    const msg = e instanceof Error ? e.message : "Error al analizar con IA";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
