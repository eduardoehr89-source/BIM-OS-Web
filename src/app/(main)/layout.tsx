import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppChrome } from "@/components/AppChrome";
import { VoiceCommandsProvider } from "@/context/VoiceCommandsProvider";
import { verifyToken } from "@/lib/auth";

export default async function MainLayout({ children }: { children: ReactNode }) {
  let userRole = "USER";
  let userName = "";
  let userPermisos = "";
  let isSupremo = false;
  let hasSession = false;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("bimos_session")?.value;
    if (token) {
      try {
        const payload = await verifyToken(token);
        if (payload) {
          userRole = payload.tipo;
          userName = payload.nombre;
          userPermisos = payload.permisos;
          isSupremo = payload.isSupremo;
          hasSession = true;
        }
      } catch {
        hasSession = false;
      }
    }
  } catch (e) {
    const digest = typeof e === "object" && e !== null && "digest" in e ? String((e as { digest?: string }).digest) : "";
    const message = e instanceof Error ? e.message : "";
    if (digest === "DYNAMIC_SERVER_USAGE" || message.includes("Dynamic server usage")) {
      throw e;
    }
    console.error("[MainLayout] sesión / cookies", e);
    hasSession = false;
  }

  if (!hasSession) {
    redirect("/login");
  }

  return (
    <VoiceCommandsProvider>
      <AppChrome userRole={userRole} userName={userName} userPermisos={userPermisos} isSupremo={isSupremo}>
        {children}
      </AppChrome>
    </VoiceCommandsProvider>
  );
}
