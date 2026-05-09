import { ProjectsView } from "@/components/projects/ProjectsView";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProyectosPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  let userRole = "USER";
  let userId = "";
  let canManageFolders = false;
  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      userRole = payload.tipo;
      userId = payload.id;
      canManageFolders = payload.canManageFolders;
    }
  }
  return <ProjectsView userRole={userRole} userId={userId} canManageFolders={canManageFolders} />;
}
