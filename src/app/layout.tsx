import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BIM.OS",
  description: "Gestión de proyectos y archivos PDF/DWG",
};

/** Sin cookies ni Prisma: el login y rutas públicas no deben fallar por sesión inexistente. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-screen bg-[#020617] antialiased text-slate-200">
        <ThemeProvider>
          {children}
          <Toaster position="top-right" theme="dark" closeButton offset={16} />
        </ThemeProvider>
      </body>
    </html>
  );
}
