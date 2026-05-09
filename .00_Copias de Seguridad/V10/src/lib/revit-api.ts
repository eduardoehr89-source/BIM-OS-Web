import { NextResponse } from "next/server";
import { REVIT_PLUGIN_CORS_HEADERS, withRevitCors } from "@/lib/revit-cors";

export function revitOptions() {
  return new NextResponse(null, { status: 204, headers: REVIT_PLUGIN_CORS_HEADERS });
}

export function revitJson(data: unknown, status = 200) {
  return withRevitCors(NextResponse.json(data, { status }));
}
