import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { ComunicacionesPageClient } from "@/components/comunicaciones/ComunicacionesPageClient";

export const dynamic = "force-dynamic";

export default async function ComunicacionesPage() {
  const token = (await cookies()).get("bimos_session")?.value;
  const payload = token ? await verifyToken(token) : null;
  const tipo = (payload?.tipo ?? "").toString().trim().toUpperCase();
  const isAdmin = tipo === "ADMIN";
  return <ComunicacionesPageClient isAdmin={isAdmin} />;
}
