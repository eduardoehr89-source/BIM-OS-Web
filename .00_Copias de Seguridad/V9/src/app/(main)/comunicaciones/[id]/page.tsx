import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { CanalChatClient } from "@/components/comunicaciones/CanalChatClient";
import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function ComunicacionesCanalPage({ params }: Props) {
  const { id } = await params;
  const token = (await cookies()).get("bimos_session")?.value;
  const payload = token ? await verifyToken(token) : null;
  if (!payload) {
    redirect("/login");
  }

  return <CanalChatClient canalId={id} currentUserId={payload.id} />;
}
