import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/auth";
import { getCollaborationUserOptions } from "@/lib/users-for-sharing";

/** Lista de usuarios para invitaciones / UI admin (alias esperado por producto). */
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const users = await getCollaborationUserOptions(userId);
    return NextResponse.json(users);
  } catch (e) {
    console.error("[GET /api/usuarios]", e);
    return NextResponse.json({ error: "Error al listar usuarios" }, { status: 500 });
  }
}
