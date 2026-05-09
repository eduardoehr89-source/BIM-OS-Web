import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Handshake del plugin Revit (BimOsConnector). Acepta metadatos en JSON;
 * el contenido se puede usar más adelante para trazabilidad o persistencia.
 */
export async function POST(request: Request) {
  try {
    await request.json().catch(() => ({}));
  } catch {
    /* cuerpo vacío o no JSON: se ignora */
  }

  return NextResponse.json(
    { success: true, message: "Conexión con Revit establecida correctamente." },
    { status: 200 },
  );
}
