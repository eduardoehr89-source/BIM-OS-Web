"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export type SidebarNavLink = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

type SidebarProps = {
  links: SidebarNavLink[];
  pathname: string;
  isSidebarOpen: boolean;
};

export function Sidebar({ links, pathname, isSidebarOpen }: SidebarProps) {
  return (
    <aside
      id="app-sidebar-nav"
      className={[
        "flex h-full shrink-0 flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 ease-in-out",
        "fixed inset-y-0 left-0 z-40 md:relative md:z-0",
        isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full md:w-16 md:translate-x-0",
      ].join(" ")}
      aria-label="Navegación principal"
    >
      <div className="flex h-14 shrink-0 items-center border-b border-slate-800 px-4 md:hidden">
        <span className="text-sm font-semibold text-slate-100">Menú</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {links.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isSidebarOpen ? "justify-start" : "md:justify-center md:gap-0 md:px-2",
                active
                  ? "bg-slate-800 font-medium text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200",
              ].join(" ")}
            >
              <Icon className="h-5 w-5 shrink-0 opacity-90" strokeWidth={1.75} aria-hidden />
              <span className={isSidebarOpen ? "truncate" : "sr-only"}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
