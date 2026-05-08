import { AuditoriaView } from "@/components/AuditoriaView";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuditoriaPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  
  if (!token) redirect("/login");

  const payload = await verifyToken(token);
  if (!payload) {
    redirect("/login");
  }

  return <AuditoriaView />;
}
