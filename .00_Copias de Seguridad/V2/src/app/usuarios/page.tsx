import { UsuariosView } from "@/components/usuarios/UsuariosView";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UsuariosPage() {
  // Double-check de seguridad en el servidor
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  
  if (!token) {
    redirect("/login");
  }

  const payload = await verifyToken(token);
  if (!payload || payload.rol !== "ADMIN") {
    redirect("/dashboard");
  }

  return <UsuariosView />;
}
