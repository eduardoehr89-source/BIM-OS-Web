import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function getPrismaClient() {
  try {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.warn("ADVERTENCIA: DATABASE_URL no está definida en las variables de entorno.");
    }
    
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({ adapter });
  } catch (error) {
    console.error("[Prisma Initialization Error]", error);
    // Retornamos un PrismaClient sin adaptador para ver si falla más explícitamente, o relanzamos
    return new PrismaClient();
  }
}

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
