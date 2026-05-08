"use client";

import { useState, useEffect, useRef } from "react";
import { Search, FolderKanban, ListTodo, Users, FolderOpen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { labelRolProfesional } from "@/lib/professional-roles";

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    projects: { id: string; nombre: string }[];
    tasks: { id: string; nombre: string; projectId: string }[];
    clients: { id: string; nombre: string }[];
    users: { id: string; nombre: string; tipo: string; rol: string }[];
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      return;
    }

    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const hasResults = results && (results.projects.length > 0 || results.tasks.length > 0 || results.clients.length > 0 || results.users.length > 0);

  return (
    <div className="relative flex items-center" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen && e.target.value.length >= 2) setIsOpen(true);
          }}
          onFocus={() => {
            if (query.length >= 2) setIsOpen(true);
          }}
          className="h-8 w-48 rounded-md bg-muted/50 pl-9 pr-3 text-xs text-foreground outline-none transition-all focus:w-64 focus:bg-background focus:ring-1 focus:ring-accent"
        />
        {loading && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">...</span>}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full right-0 mt-2 w-80 overflow-hidden rounded-xl border border-border/60 bg-background/95 backdrop-blur-md shadow-lg z-50">
          <div className="max-h-96 overflow-y-auto p-2">
            {!hasResults && !loading && (
              <p className="p-3 text-center text-xs text-muted-foreground">No se encontraron resultados.</p>
            )}

            {results?.projects.length ? (
              <div className="mb-2">
                <h4 className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Proyectos</h4>
                {results.projects.map(p => (
                  <button key={p.id} onClick={() => { setIsOpen(false); router.push(`/proyectos`); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted/50">
                    <FolderKanban className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{p.nombre}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {results?.tasks.length ? (
              <div className="mb-2">
                <h4 className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tareas</h4>
                {results.tasks.map(t => (
                  <button key={t.id} onClick={() => { setIsOpen(false); router.push(`/proyectos`); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted/50">
                    <ListTodo className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{t.nombre}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {results?.clients.length ? (
              <div className="mb-2">
                <h4 className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Clientes</h4>
                {results.clients.map(c => (
                  <button key={c.id} onClick={() => { setIsOpen(false); router.push(`/clientes`); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted/50">
                    <FolderOpen className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{c.nombre}</span>
                  </button>
                ))}
              </div>
            ) : null}

            {results?.users.length ? (
              <div>
                <h4 className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Usuarios</h4>
                {results.users.map(u => (
                  <button key={u.id} onClick={() => { setIsOpen(false); router.push(`/usuarios`); }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted/50">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{u.nombre}{" "}<span className="text-[10px] text-muted-foreground">({u.tipo} · {labelRolProfesional(u.rol)})</span></span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
