"use client";

import { BookOpen, FolderKanban, LayoutDashboard, ListTodo, Users, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AssistantButton } from "@/components/AssistantButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InvitationsWidget } from "@/components/InvitationsWidget";

const allLinks = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/proyectos", label: "Proyectos", Icon: FolderKanban },
  { href: "/tareas", label: "Tareas", Icon: ListTodo },
  { href: "/clientes", label: "Clientes", Icon: Users },
  { href: "/reglamentos", label: "Reglamentos", Icon: BookOpen },
  { href: "/usuarios", label: "Usuarios", Icon: Users },
];

export function AppChrome({ children, userRole, userName }: { children: ReactNode; userRole?: string; userName?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const links = allLinks.filter(l => l.href !== "/usuarios" || userRole === "ADMIN");

  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-10">
            <Link
              href="/dashboard"
              className="shrink-0 text-sm font-semibold tracking-tight text-foreground"
            >
              Repositorio técnico
            </Link>
            <nav className="flex gap-1 sm:gap-2">
              {links.map(({ href, label, Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={
                      active
                        ? "inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground"
                        : "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <InvitationsWidget />
            <ThemeToggle />
            <AssistantButton />
            <div className="ml-2 flex items-center gap-3 pl-2 border-l border-border/60">
              {userName && (
                <span className="text-sm font-medium text-foreground">{userName}</span>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">{children}</main>
    </div>
  );
}
