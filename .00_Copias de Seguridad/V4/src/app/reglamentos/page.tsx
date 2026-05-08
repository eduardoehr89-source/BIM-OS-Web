import { BookOpen, ExternalLink } from "lucide-react";
import type { KnowledgeCategory } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const CATEGORY_ORDER: KnowledgeCategory[] = ["NORMAS", "ESTANDARES", "CONCEPTOS", "REGLAMENTOS"];

const CATEGORY_LABEL: Record<KnowledgeCategory, string> = {
  NORMAS: "Normas",
  ESTANDARES: "Estándares",
  CONCEPTOS: "Conceptos",
  REGLAMENTOS: "Reglamentos",
};

export default async function ReglamentosPage() {
  const rows = await prisma.knowledgeReference.findMany({
    orderBy: [{ category: "asc" }, { orden: "asc" }, { titulo: "asc" }],
  });

  const byCat = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABEL[cat],
    items: rows.filter((r) => r.category === cat),
  }));

  return (
    <div className="space-y-12">
      <header className="flex flex-wrap items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
          <BookOpen className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Reglamentos</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Base de consulta técnica: normas, estándares, conceptos y reglamentos. Las fuentes enlazadas son de referencia;
            verifica siempre la vigencia aplicable a tu jurisdicción.
          </p>
        </div>
      </header>

      <div className="space-y-10">
        {byCat.map(({ category, label, items }) => (
          <section key={category} className="rounded-2xl bg-muted/40 px-6 py-8 dark:bg-muted/20">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">{label}</h2>
            <ul className="mt-6 space-y-6">
              {items.length === 0 ? (
                <li className="text-sm text-muted-foreground">Sin entradas en esta categoría. Puedes añadir registros en la base de datos o ejecutar el seed.</li>
              ) : (
                items.map((item) => (
                  <li key={item.id} className="border-b border-border/40 pb-6 last:border-0 last:pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <p className="font-medium text-foreground">{item.titulo}</p>
                        {item.descripcion ? <p className="text-sm leading-relaxed text-muted-foreground">{item.descripcion}</p> : null}
                        {item.fuente ? <p className="text-xs text-muted-foreground">Fuente: {item.fuente}</p> : null}
                      </div>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-accent underline-offset-4 hover:underline"
                        >
                          Consultar
                          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                        </a>
                      ) : null}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
