import type { ReactNode } from "react";
import { connection } from "next/server";

/** Acceso público: sin AppChrome. Fondo oscuro BIM.OS (fallback inline si fallara Tailwind). */
export default async function AuthLayout({ children }: { children: ReactNode }) {
  try {
    await connection();
  } catch {
    /* continuar */
  }

  return (
    <div
      className="flex min-h-screen w-full flex-col items-center justify-center bg-[#020617] text-slate-200"
      style={{ backgroundColor: "#020617", minHeight: "100vh" }}
    >
      {children}
    </div>
  );
}
