import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { WelcomeLogin } from "@/components/auth/WelcomeLogin";

export const dynamic = "force-dynamic";

export default async function Home() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("bimos_session")?.value;
    if (token) {
      try {
        const payload = await verifyToken(token);
        if (payload) redirect("/dashboard");
      } catch {
        /* Token inválido: mostrar login */
      }
    }
  } catch (e) {
    const digest = typeof e === "object" && e !== null && "digest" in e ? String((e as { digest?: string }).digest) : "";
    const message = e instanceof Error ? e.message : "";
    if (digest === "DYNAMIC_SERVER_USAGE" || message.includes("Dynamic server usage")) {
      throw e;
    }
    console.error("[Home] cookies / sesión", e);
  }
  return <WelcomeLogin />;
}
