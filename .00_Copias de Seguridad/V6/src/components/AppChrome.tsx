"use client";

import {
  BookOpen,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { AssistantButton } from "@/components/AssistantButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InvitationsWidget } from "@/components/InvitationsWidget";
import { GlobalSearch } from "@/components/GlobalSearch";
import { Sidebar, type SidebarNavLink } from "@/components/Sidebar";
import { useFileUploadAlerts } from "@/hooks/useFileUploadAlerts";

const allLinks: SidebarNavLink[] = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/proyectos", label: "Proyectos", Icon: FolderKanban },
  { href: "/tareas", label: "Tareas", Icon: ListTodo },
  { href: "/clientes", label: "Clientes", Icon: Users },
  { href: "/reglamentos", label: "Docs", Icon: BookOpen },
  { href: "/comunicaciones", label: "Comunicaciones", Icon: MessageSquare },
  { href: "/usuarios", label: "Usuarios", Icon: UsersRound },
  { href: "/auditoria", label: "Auditoría", Icon: Shield },
];

// Configuracion siempre al final, visible para todos
const configLink: SidebarNavLink = { href: "/configuracion", label: "Configuración", Icon: Settings };

export function AppChrome({
  children,
  userRole,
  userName,
  userPermisos,
  isSupremo,
}: {
  children: ReactNode;
  userRole?: string;
  userName?: string;
  userPermisos?: string;
  isSupremo?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useFileUploadAlerts(userRole, isSupremo);

  async function handleLogout() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    }
  }

  // JERARQUÍA: Supremo ve todo. Otros ADMIN filtrados. USER filtrado.
  const filteredLinks = isSupremo
    ? allLinks
    : allLinks.filter((l) => {
        const routeId = l.href.split("/")[1];
        if (routeId === "reglamentos") return (userPermisos || "").split(",").includes("docs");
        return (userPermisos || "").split(",").map(s => s.trim()).includes(routeId);
      });

  const links = [...filteredLinks, configLink];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      {isSidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 md:hidden"
          aria-label="Cerrar menú"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <Sidebar links={links} pathname={pathname} isSidebarOpen={isSidebarOpen} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-800 bg-slate-900/95 px-3 backdrop-blur-sm sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSidebarOpen((v) => !v)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-800 hover:text-white"
              aria-expanded={isSidebarOpen}
              aria-controls="app-sidebar-nav"
              title={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </button>
            <Link
              href="/dashboard"
              className="truncate text-sm font-semibold tracking-tight text-slate-100 transition hover:text-white"
            >
              Repositorio técnico
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <div className="hidden min-w-0 sm:block sm:max-w-[200px] md:max-w-xs lg:max-w-md">
              <GlobalSearch />
            </div>
            <div className="mx-0.5 h-5 w-px shrink-0 bg-slate-700 sm:mx-1" />
            <InvitationsWidget />
            <ThemeToggle />
            <AssistantButton />
            <div className="ml-1 flex items-center gap-2 border-l border-slate-700 pl-2 sm:ml-2 sm:pl-3">
              {userName ? (
                <span className="hidden max-w-[7rem] truncate text-sm font-medium text-slate-200 sm:inline">
                  {userName}
                </span>
              ) : null}
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex shrink-0 items-center justify-center rounded-lg p-2 text-slate-400 transition hover:bg-red-950/40 hover:text-red-400"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4 opacity-90" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </header>

        <div className="border-b border-slate-800 bg-slate-900/80 px-3 py-2 sm:hidden">
          <GlobalSearch />
        </div>

        <main className="min-h-0 flex-1 overflow-y-auto bg-background text-foreground">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
