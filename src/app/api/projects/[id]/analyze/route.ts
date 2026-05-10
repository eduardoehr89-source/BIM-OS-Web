import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { verifyToken } from "@/lib/auth";
import { BEP_ANALYSIS_PROMPT, BEP_DIAGRAM_MODE_SUFFIX } from "@/lib/ai-prompts";
import { getAuthPayload } from "@/lib/comunicaciones-auth";
import { logGeminiModelsOnFailure } from "@/lib/gemini-list-models";
import { prisma } from "@/lib/prisma";
import { canUserAccessProjectFiles } from "@/lib/project-file-upload-access";
import { readProjectFileBuffer } from "@/lib/read-project-file-buffer";

export const dynamic = "force-dynamic";

const GEMINI_MODEL_PRIMARY = "gemini-1.5-flash-latest";
const GEMINI_MODEL_FALLBACK = "gemini-pro";
const GEMINI_API_VERSION = "v1beta" as const;

type Params = { params: Promise<{ id: string }> };

function extractMermaidBlock(raw: string): string {
  const match = raw.match(/```mermaid\s*([\s\S]*?)```/i);
  if (match) return match[1].trim();
  return raw.replace(/```mermaid/gi, "").replace(/```/g, "").trim();
}

function shouldRetryWithFallbackModel(e: unknown): boolean {
  const status =
    e && typeof e === "object" && "status" in e && typeof (e as { status: unknown }).status === "number"
      ? (e as { status: number }).status
      : undefined;
  if (status === 404 || status === 400) return true;
  const msg = e instanceof Error ? e.message : String(e);
  const lower = msg.toLowerCase();
  return (
    lower.includes("404") ||
    lower.includes("not found") ||
    lower.includes("not_found") ||
    lower.includes("invalid model") ||
    lower.includes("unknown model") ||
    lower.includes("model not found")
  );
}

async function generateWithGeminiModel(
  apiKey: string,
  modelName: string,
  mime: string,
  buffer: Buffer,
  fileName: string,
  prompt: string,
): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: GEMINI_API_VERSION });

  if (mime === "application/pdf" || mime === "application/x-pdf") {
    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: "application/pdf", data: buffer.toString("base64") } },
    ]);
    return result.response.text();
  }

  const textBody = buffer.toString("utf8");
  const result = await model.generateContent(
    `${prompt}\n\n--- Contenido del documento (${fileName}) ---\n\n${textBody}`,
  );
  return result.response.text();
}

export async function POST(req: Request, ctx: Params) {
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

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const allowed = await canUserAccessProjectFiles(projectId, userId, auth);
  if (!allowed) {
    return NextResponse.json({ error: "Sin acceso a este proyecto" }, { status: 403 });
  }

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

  if (!file) {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }

  const buffer = await readProjectFileBuffer(file);
  if (!buffer?.length) {
    return NextResponse.json({ error: "No se pudo leer el archivo" }, { status: 502 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY no configurada" }, { status: 500 });
  }

  const basePrompt = `${BEP_ANALYSIS_PROMPT}\n\nAplica las reglas anteriores al documento que se adjunta en este mensaje.`;
  const prompt =
    mode === "mermaid"
      ? `${basePrompt}\n\n${BEP_DIAGRAM_MODE_SUFFIX}\n\nTu salida principal debe ser un bloque \`\`\`mermaid que contenga un diagrama graph TD (salvo que otro tipo sea más adecuado) según el BEP.`
      : basePrompt;

  try {
    const mime = (file.mimeType || "").toLowerCase();
    let responseText: string;
    let usedModel = GEMINI_MODEL_PRIMARY;

    try {
      responseText = await generateWithGeminiModel(
        apiKey,
        GEMINI_MODEL_PRIMARY,
        mime,
        buffer,
        file.originalName,
        prompt,
      );
    } catch (first: unknown) {
      if (!shouldRetryWithFallbackModel(first)) throw first;
      console.warn(
        `[POST /api/projects/[id]/analyze] ${GEMINI_MODEL_PRIMARY} falló; reintentando con ${GEMINI_MODEL_FALLBACK}:`,
        first,
      );
      responseText = await generateWithGeminiModel(
        apiKey,
        GEMINI_MODEL_FALLBACK,
        mime,
        buffer,
        file.originalName,
        prompt,
      );
      usedModel = GEMINI_MODEL_FALLBACK;
    }

    console.log(`[POST /api/projects/[id]/analyze] OK modelo=${usedModel} api=${GEMINI_API_VERSION}`);

    if (mode === "mermaid") {
      return NextResponse.json({
        mode: "mermaid",
        markdown: responseText,
        mermaid: extractMermaidBlock(responseText),
      });
    }

    return NextResponse.json({
      mode: "analysis",
      markdown: responseText,
    });
  } catch (e: unknown) {
    console.error(
      `[POST /api/projects/[id]/analyze] Error tras ${GEMINI_MODEL_PRIMARY} y posible ${GEMINI_MODEL_FALLBACK} (API ${GEMINI_API_VERSION}):`,
      e,
    );
    logGeminiModelsOnFailure(apiKey, "POST /api/projects/[id]/analyze");
    const msg = e instanceof Error ? e.message : "Error al analizar con IA";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
