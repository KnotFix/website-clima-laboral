import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * Anterior / siguiente, en el orden de `DOCS_NAV`.
 *
 * Existe porque el orden del sidebar ES un recorrido: Conceptos antes que
 * Guias no es alfabetico, es que uno se entiende con el otro leido. Sin el
 * pie, ese recorrido solo lo ve quien mira la barra lateral — o sea nadie en
 * movil, donde va plegada.
 */
export function DocsPager({ lang, prev_doc, next_doc, prev_label, next_label }) {
  if (!prev_doc && !next_doc) return null;

  return (
    <nav className="mt-16 grid gap-4 border-t border-box-edge pt-8 sm:grid-cols-2">
      {prev_doc ? (
        <Link
          href={`/${lang}/docs/${prev_doc.slug}`}
          className="group flex flex-col gap-1 rounded-lg border border-box-edge bg-card p-4 transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ArrowLeft className="size-3.5" />
            {prev_label}
          </span>
          <span className="text-sm font-medium">{prev_doc.title[lang]}</span>
        </Link>
      ) : (
        // Celda vacia y no `justify-between`: sin ella, en la primera pagina el
        // "Siguiente" se correria a la izquierda y en las del medio no, asi que
        // el mismo boton cambiaria de lugar al navegar.
        <div aria-hidden="true" />
      )}

      {next_doc ? (
        <Link
          href={`/${lang}/docs/${next_doc.slug}`}
          className="group flex flex-col items-end gap-1 rounded-lg border border-box-edge bg-card p-4 text-right transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {next_label}
            <ArrowRight className="size-3.5" />
          </span>
          <span className="text-sm font-medium">{next_doc.title[lang]}</span>
        </Link>
      ) : null}
    </nav>
  );
}
