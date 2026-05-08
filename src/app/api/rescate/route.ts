import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** Id estable para upsert: el esquema no tiene `pin` único, Prisma exige un campo único en `where`. */
const RESCATE_EDUARDO_ID = "rescate-eduardo-admin";

export async function GET() {
  await prisma.user.upsert({
    where: { id: RESCATE_EDUARDO_ID },
    create: {
      id: RESCATE_EDUARDO_ID,
      nombre: "Eduardo",
      pin: process.env.ADMIN_PIN || "3350",
      tipo: "ADMIN",
      rol: "BIM MANAGER",
    },
    update: {
      nombre: "Eduardo",
      pin: process.env.ADMIN_PIN || "3350",
      tipo: "ADMIN",
      rol: "BIM MANAGER",
    },
  });

  return NextResponse.json({ success: true, message: "Usuario Eduardo restaurado" });
}
