/**
 * El indice de la pagina: los h2 y h3, con ancla.
 *
 * Los `id` no los pone este componente — los pone `rehype-slug` al compilar el
 * .mdx. Aca solo se recalculan con el mismo algoritmo (ver `lib/docs.js`), asi
 * que **si se toca uno de los dos lados el indice deja de saltar a ningun
 * lado, sin romper nada visible**. Son la misma decision.
 *
 * No marca la seccion activa al scrollear, y es a proposito por ahora: eso
 * pide un IntersectionObserver, o sea volver cliente una lista de enlaces. El
 * sitio ya tiene `useActiveSection` para el navbar; si algun dia se quiere
 * aca, se reusa ese hook en vez de escribir un segundo.
 */
export function DocsToc({ headings, title, label }) {
  if (headings.length === 0) return null;

  return (
    <nav aria-label={label} className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </p>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "pl-4" : undefined}
          >
            <a
              href={`#${heading.id}`}
              className="block text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
