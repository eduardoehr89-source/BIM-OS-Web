import type { NextResponse } from "next/server";

/** Cabeceras CORS para integración con plugin Revit u otros orígenes externos. */
export const REVIT_PLUGIN_CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS, HEAD",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
  "Access-Control-Max-Age": "86400",
};

export function withRevitCors<T>(response: NextResponse<T>): NextResponse<T> {
  for (const [key, value] of Object.entries(REVIT_PLUGIN_CORS_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}
