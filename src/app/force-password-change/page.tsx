import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { ForcePasswordChangeClient } from "@/components/auth/ForcePasswordChangeClient";

export const dynamic = "force-dynamic";

/** La UI incluye cambio de contraseña y enlace «Cerrar Sesión» en `ForcePasswordChangeClient`. */
export default async function ForcePasswordChangePage() {
  let hasValidSession = false;
  let mustChange = false;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("bimos_session")?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        hasValidSession = true;
        mustChange = payload.mustChangePassword === true;
      }
    }
  } catch (e) {
    const digest = typeof e === "object" && e !== null && "digest" in e ? String((e as { digest?: string }).digest) : "";
    if (digest === "DYNAMIC_SERVER_USAGE" || (e instanceof Error && e.message.includes("Dynamic server usage"))) {
      throw e;
    }
    console.error("[ForcePasswordChange] session check error", e);
  }

  if (!hasValidSession) {
    redirect("/login");
  }

  if (!mustChange) {
    redirect("/dashboard");
  }

  return <ForcePasswordChangeClient />;
}
