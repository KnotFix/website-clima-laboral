import Link from "next/link";

import { DOCS_NAV } from "@/content/docs/nav";
import { cn } from "@/lib/utils";

/**
 * El arbol de `DOCS_NAV`, con la pagina actual marcada.
 *
 * Server Component: es una lista de enlaces y no tiene un solo estado. Lo que
 * en otros sitios de docs es cliente —marcar la activa— aca lo sabe el
 * servidor, porque el slug viene en la URL.
 *
 * Debajo de `lg` se dibuja dentro de un `<details>` (ver `DocsLayout`), asi que
 * este componente no sabe de breakpoints: dibuja la lista y nada mas.
 */
export function DocsSidebar({ lang, active_slug, class_name, label }) {
  return (
    <nav aria-label={label} className={cn("text-sm", class_name)}>
      {DOCS_NAV.map((group) => (
        <div key={group.title.en} className="mb-6 last:mb-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
            {group.title[lang]}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((entry) => {
              const is_active = entry.slug === active_slug;

              return (
                <li key={entry.slug}>
                  <Link
                    href={`/${lang}/docs/${entry.slug}`}
                    // `aria-current` y no solo el color: en alto contraste y
                    // para un lector de pantalla, el gris mas oscuro no dice
                    // nada.
                    aria-current={is_active ? "page" : undefined}
                    className={cn(
                      // El canto de la izquierda es lo que marca la activa. Va
                      // en `border-l` sobre TODAS y no solo sobre la activa: si
                      // apareciera al activarse, la fila se correria 2px de
                      // lado al navegar.
                      "block border-l-2 py-1.5 pl-3 transition-colors",
                      is_active
                        ? "border-brand font-medium text-foreground"
                        : "border-box-edge text-muted-foreground hover:border-foreground hover:text-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    )}
                  >
                    {entry.title[lang]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
