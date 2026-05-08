import { ConfiguracionView } from "@/components/configuracion/ConfiguracionView";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function ConfiguracionPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  let isSupremo = false;
  if (token) {
    const payload = await verifyToken(token);
    isSupremo = payload?.isSupremo ?? false;
  }

  return <ConfiguracionView isSupremo={isSupremo} />;
}
