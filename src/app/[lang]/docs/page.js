import Link from "next/link";
import { notFound } from "next/navigation";

import { DocsLayout } from "@/components/docs/docs_layout";
import { DOCS_NAV } from "@/content/docs/nav";
import { get_dictionary } from "@/lib/dictionaries";
import { LOCALES, is_locale } from "@/lib/site_config";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!is_locale(lang)) return {};

  const dict = await get_dictionary(lang);

  return {
    title: dict.docs_index_title,
    description: dict.docs_index_body,
    alternates: {
      canonical: `/${lang}/docs`,
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, `/${locale}/docs`]),
      ),
    },
  };
}

/**
 * El indice de la seccion.
 *
 * No repite el sidebar: dibuja los grupos como TARJETAS, con su descripcion.
 * El sidebar dice donde estas parado, esta pagina dice que hay para leer — y
 * es la que ve alguien que llego desde un buscador, para quien la barra
 * lateral es una lista de titulos sin contexto.
 */
export default async function DocsIndexPage({ params }) {
  const { lang } = await params;
  if (!is_locale(lang)) notFound();

  const dict = await get_dictionary(lang);

  return (
    <DocsLayout lang={lang} dict={dict}>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {dict.docs_index_title}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        {dict.docs_index_body}
      </p>

      <div className="mt-12 space-y-10">
        {DOCS_NAV.map((group) => (
          <section key={group.title.en}>
            <h2 className="text-xs font-semibold uppercase tracking-wider">
              {group.title[lang]}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {group.items.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/${lang}/docs/${entry.slug}`}
                    className="block rounded-lg border border-box-edge bg-card p-4 transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="text-sm font-medium">
                      {entry.title[lang]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* El changelog NO entra al sidebar: no es una página de documentación
          —no explica nada— y ponerla en el árbol la metería en el
          anterior/siguiente, entre dos conceptos que sí se leen seguidos. Se
          ofrece desde acá, que es donde llega quien busca «qué cambió». */}
      <div className="mt-14 border-t border-box-edge pt-6">
        <Link
          href={`/${lang}/changelog`}
          className="group inline-flex items-baseline gap-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="text-muted-foreground">{dict.changelog_hint}</span>
          <span className="font-medium underline underline-offset-4 group-hover:text-foreground">
            {dict.changelog_title}
          </span>
        </Link>
      </div>
    </DocsLayout>
  );
}
