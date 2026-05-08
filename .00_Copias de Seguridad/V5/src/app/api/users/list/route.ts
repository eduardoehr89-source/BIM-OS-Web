import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { getCollaborationUserOptions } from "@/lib/users-for-sharing";

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const users = await getCollaborationUserOptions(userId);
    return NextResponse.json(users);
  } catch (e) {
    console.error("[GET /api/users/list]", e);
    return NextResponse.json({ error: "Error fetch" }, { status: 500 });
  }
}
