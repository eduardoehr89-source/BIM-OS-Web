import { ClientesView } from "@/components/clientes/ClientesView";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function ClientesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  let userRole = "USER";
  if (token) {
    const payload = await verifyToken(token);
    if (payload) userRole = payload.rol;
  }
  return <ClientesView userRole={userRole} />;
}
