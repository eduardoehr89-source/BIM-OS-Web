import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma";

function resolveSqlitePath(): string {
  const url = process.env.DATABASE_URL;
  if (url?.startsWith("file:")) {
    let p = url.slice("file:".length);
    if (p.startsWith("//")) p = p.slice(2);
    return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p.replace(/^\.\//, ""));
  }
  return path.join(process.cwd(), "prisma", "dev.db");
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: resolveSqlitePath() }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
