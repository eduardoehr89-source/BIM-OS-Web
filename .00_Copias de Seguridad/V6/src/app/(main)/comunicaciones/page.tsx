import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { ComunicacionesPageClient } from "@/components/comunicaciones/ComunicacionesPageClient";

export const dynamic = "force-dynamic";

export default async function ComunicacionesPage() {
  let isAdmin = false;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("bimos_session")?.value;
    const payload = token ? await verifyToken(token) : null;
    const tipo = (payload?.tipo ?? "").toString().trim().toUpperCase();
    isAdmin = tipo === "ADMIN";
  } catch (e) {
    const digest = typeof e === "object" && e !== null && "digest" in e ? String((e as { digest?: string }).digest) : "";
    const message = e instanceof Error ? e.message : "";
    if (digest === "DYNAMIC_SERVER_USAGE" || message.includes("Dynamic server usage")) {
      throw e;
    }
    console.error("[ComunicacionesPage] sesión", e);
  }
  return <ComunicacionesPageClient isAdmin={isAdmin} />;
}
