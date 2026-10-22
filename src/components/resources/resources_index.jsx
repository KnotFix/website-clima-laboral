import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { RESOURCES, resource_paths } from "@/content/resources/nav";

/**
 * El indice de recursos: una tarjeta por recurso, con su descripcion.
 *
 * Hoy hay uno solo. Va igual en tarjeta y no como redireccion a la plantilla
 * porque es la pagina que enlaza el menu, y la que va a crecer.
 */
export function ResourcesIndex({ lang, dict }) {
  return (
    <>
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {dict.resources_title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">{dict.resources_body}</p>
      </header>

      <ul className="mt-10 grid gap-4 md:grid-cols-2">
        {RESOURCES.map((entry) => (
          <li key={entry.id}>
            <Link
              href={`/${lang}${resource_paths(entry)[lang]}`}
              className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 text-card-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="w-fit rounded-full bg-foreground px-2.5 py-0.5 text-xs font-medium text-background">
                {dict.resources_free}
              </span>
              <h2 className="mt-4 text-lg font-semibold tracking-tight">{entry.title[lang]}</h2>
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
