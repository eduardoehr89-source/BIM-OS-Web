import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/AppChrome";
import { ThemeProvider } from "@/components/ThemeProvider";
import { VoiceCommandsProvider } from "@/context/VoiceCommandsProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Repositorio técnico",
  description: "Gestión de proyectos y archivos PDF/DWG",
};

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("bimos_session")?.value;
  let userRole = "USER";
  let userName = "";
  let userPermisos = "";
  let isSupremo = false;
  let hasSession = false;

  if (token) {
    const payload = await verifyToken(token);
    if (payload) {
      userRole = payload.tipo;
      userName = payload.nombre;
      userPermisos = payload.permisos;
      isSupremo = payload.isSupremo;
      hasSession = true;
    }
  }

  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full antialiased">
        <ThemeProvider>
          <VoiceCommandsProvider>
            {hasSession ? (
              <AppChrome userRole={userRole} userName={userName} userPermisos={userPermisos} isSupremo={isSupremo}>{children}</AppChrome>
            ) : (
              <div className="flex min-h-screen flex-col bg-background text-foreground">
                <main className="flex-1">{children}</main>
              </div>
            )}
          </VoiceCommandsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
