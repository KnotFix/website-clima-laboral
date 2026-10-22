import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { RESOURCES, resource_paths } from "@/content/resources/nav";
import { fill } from "@/lib/pricing";
import { format_date, reading_minutes } from "@/lib/resources";

/**
 * El indice de recursos, como el de un blog: una tarjeta por articulo con su
 * fecha, los minutos de lectura y la bajada. El mas nuevo va primero.
 */
export function ResourcesIndex({ lang, dict }) {
  const entries = [...RESOURCES].sort((a, b) => b.published.localeCompare(a.published));

  return (
    <>
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {dict.resources_title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">{dict.resources_body}</p>
      </header>

      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <li key={entry.id}>
            <Link
              href={`/${lang}${resource_paths(entry)[lang]}`}
              className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 text-card-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <time dateTime={entry.published}>{format_date(entry.published, lang)}</time>
                <span aria-hidden="true"> · </span>
                {fill(dict.resources_reading, { minutes: reading_minutes(lang, entry.id) })}
              </p>
              <h2 className="mt-3 text-lg font-semibold tracking-tight text-balance">
                {entry.title[lang]}
              </h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground text-pretty">
                {entry.description[lang]}
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium">
                {dict.resources_card_cta}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
