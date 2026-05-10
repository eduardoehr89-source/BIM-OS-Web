import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getCurrentUserId, verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let userId = await getCurrentUserId();
  if (!userId) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const payload = await verifyToken(token);
      userId = payload?.id || null;
    }
  }

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API Key de Gemini no configurada" }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  try {
    const body = await req.json();
    const { action, text } = body;

    if (!text) {
      return NextResponse.json({ error: "Texto del BEP no proporcionado" }, { status: 400 });
    }

    if (action === "audit") {
      const prompt = `Analiza el siguiente texto de un Plan de Ejecución BIM (BEP).
Debes devolver SOLO un JSON válido con la siguiente estructura y ninguna otra palabra:
{
  "errores": ["error 1", "error 2"],
  "oportunidades": ["oportunidad 1", "oportunidad 2"],
  "sugerencia": "Sugerencia general de mejora"
}

Texto del BEP:
${text}
`;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      try {
        const parsed = JSON.parse(cleanJson);
        return NextResponse.json(parsed);
      } catch (e: unknown) {
        return NextResponse.json({ error: "El modelo no devolvió un JSON válido", details: responseText }, { status: 500 });
      }
    } else if (action === "mermaid") {
      const prompt = `Genera un diagrama Mermaid del tipo "graph TD" basado en el siguiente texto de un Plan de Ejecución BIM (BEP).
Debes devolver SOLO el código Mermaid, sin bloques de código \`\`\`mermaid ni ningún otro texto adicional.
Asegúrate de que la primera línea sea "graph TD".

Texto del BEP:
${text}
`;
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleanMermaid = responseText.replace(/```mermaid/gi, '').replace(/```/g, '').trim();
      return new NextResponse(cleanMermaid, {
        headers: { "Content-Type": "text/plain" },
      });
    } else {
      return NextResponse.json({ error: "Acción no válida. Usa 'audit' o 'mermaid'." }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error("[POST /api/ai/bep-process]", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message || "Error al procesar la solicitud" }, { status: 500 });
    }
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
  }
}
