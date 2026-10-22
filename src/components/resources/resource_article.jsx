import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { RESOURCES_BASE } from "@/content/resources/nav";
import { fill } from "@/lib/pricing";
import { format_date, reading_minutes } from "@/lib/resources";
import { site_config } from "@/lib/site_config";

/**
 * Un articulo de recursos: la vuelta al indice, la fecha y los minutos de
 * lectura, el titulo y la bajada del manifiesto, el cuerpo en MDX y una
 * invitacion a probar Censuma al final.
 *
 * El cuerpo lo estila `mdx_components`, igual que las docs y el changelog. El
 * h1 lo pone este componente y no el `.mdx`, por lo mismo que en las docs: el
 * titulo vive en un solo lugar (el manifiesto).
 */
export function ResourceArticle({ lang, dict, entry, Body }) {
  const updated = entry.updated !== entry.published ? entry.updated : null;

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href={`/${lang}${RESOURCES_BASE[lang]}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {dict.resources_back}
      </Link>

      <header className="mt-8">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <time dateTime={entry.published}>{format_date(entry.published, lang)}</time>
          <span aria-hidden="true"> · </span>
          {fill(dict.resources_reading, { minutes: reading_minutes(lang, entry.id) })}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {entry.title[lang]}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          {entry.description[lang]}
        </p>
        {updated ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {dict.resources_updated} <time dateTime={updated}>{format_date(updated, lang)}</time>
          </p>
        ) : null}
      </header>

      <div className="mt-10">
        <Body />
      </div>

      <aside className="mt-14 rounded-xl border border-border bg-card p-6 text-card-foreground sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight">{dict.resources_cta_title}</h2>
        <p className="mt-2 text-muted-foreground text-pretty">{dict.resources_cta_body}</p>
        <Button asChild size="lg" className="mt-6">
          <a
            href={site_config.signup_url}
            data-track="article_start"
            data-track-location="resource"
          >
            {dict.resources_cta}
            <ArrowRight aria-hidden="true" />
          </a>
        </Button>
      </aside>
    </article>
  );
}
