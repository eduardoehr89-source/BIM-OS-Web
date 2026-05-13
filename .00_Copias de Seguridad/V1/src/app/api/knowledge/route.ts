import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.knowledgeReference.findMany({
    orderBy: [{ category: "asc" }, { orden: "asc" }, { titulo: "asc" }],
  });
  return NextResponse.json(rows);
}
