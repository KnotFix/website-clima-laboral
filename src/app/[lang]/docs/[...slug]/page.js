import { notFound } from "next/navigation";

import { DocsLayout } from "@/components/docs/docs_layout";
import { DocsPager } from "@/components/docs/docs_pager";
import { JsonLd } from "@/components/site/json_ld";
import { flatten_nav, neighbours_of } from "@/content/docs/nav";
import { get_dictionary } from "@/lib/dictionaries";
import { headings_of, resolve_doc } from "@/lib/docs";
import { page_metadata } from "@/lib/seo";
import { is_locale } from "@/lib/site_config";
import {
  breadcrumb_ld,
  doc_article_ld,
  graph_ld,
} from "@/lib/structured_data";

/**
 * Los slugs salen de `DOCS_NAV`, no de un `readdir`: un .mdx sin entrada en la
 * navegacion no se rutea. `lang` lo aporta el segmento de arriba, que ya tiene
 * su propio `generateStaticParams`; Next combina los dos.
 */
export function generateStaticParams() {
  return flatten_nav().map((entry) => ({ slug: [entry.slug] }));
}

/** Un slug fuera de `DOCS_NAV` responde 404 en vez de intentar renderizarse. */
export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  if (!is_locale(lang)) return {};

  const doc_slug = slug.join("/");
  const doc = await resolve_doc(lang, doc_slug);
  if (!doc) return {};

  // Los slugs son los MISMOS en los dos idiomas (van en ingles), asi que el
  // hreflang se arma sin una tabla de traduccion de rutas. Es la otra mitad
  // de por que los slugs no se traducen — ver `content/docs/nav.js`.
  return page_metadata({
    lang,
    path: `/docs/${doc_slug}`,
    title: doc.meta.title,
    description: doc.meta.description,
    type: "article",
    // `og:modified_time`. La fecha vive en `DOCS_NAV` y no en el `meta` del
    // .mdx porque el sitemap tambien la necesita y no compila los .mdx.
    modified: entry_of(doc_slug)?.updated,
  });
}

/** La entrada de `DOCS_NAV` de una pagina: quien tiene el grupo y las fechas. */
function entry_of(doc_slug) {
  return flatten_nav().find((entry) => entry.slug === doc_slug);
}

export default async function DocPage({ params }) {
  const { lang, slug } = await params;
  if (!is_locale(lang)) notFound();

  const doc_slug = slug.join("/");
  const doc = await resolve_doc(lang, doc_slug);
  // Pasa de verdad cuando una pagina existe en español y todavia no en ingles:
  // el slug esta en `DOCS_NAV` pero el archivo de ESE idioma no. 404 es la
  // respuesta correcta — la ruta del otro idioma sigue viva.
  if (!doc) notFound();

  const { Doc, meta } = doc;
  const dict = await get_dictionary(lang);
  const headings = await headings_of(lang, doc_slug);
  const { prev_doc, next_doc } = neighbours_of(doc_slug);
  const nav_entry = entry_of(doc_slug);

  return (
    <DocsLayout
      lang={lang}
      dict={dict}
      active_slug={doc_slug}
      headings={headings}
    >
      {/* La miga (Inicio > Documentacion > Grupo > Pagina) y el articulo,
          en schema.org. El grupo sale de `DOCS_NAV`, que es quien lo dibuja
          en el sidebar, y apunta a SU SECCION del indice (`/docs#<id>`): no
          tiene pagina propia, pero un escalon sin `item` es error critico de
          Search Console y ademas manda a la persona a ningun lado. */}
      <JsonLd
        data={graph_ld(
          breadcrumb_ld(lang, [
            { name: dict.meta_title, path: "" },
            { name: dict.docs_index_title, path: "/docs" },
            ...(nav_entry
              ? [
                  {
                    name: nav_entry.group_title[lang],
                    path: `/docs#${nav_entry.group_id}`,
                  },
                ]
              : []),
            { name: meta.title, path: null },
          ]),
          doc_article_ld(lang, `/docs/${doc_slug}`, meta, nav_entry ?? {}),
        )}
      />
      <article>
        {/* El h1 lo pone la RUTA y no el .mdx. Asi el titulo de una pagina esta
            en un solo lugar —`nav.js` para el sidebar, `meta` para el <title>—
            y no hay forma de que el encabezado diga una cosa y la barra
            lateral otra. Ademas deja que `mdx_components` trate a todos los
            `##` del archivo como lo que son: secciones, no titulos. */}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {meta.title}
        </h1>
        {meta.description ? (
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            {meta.description}
          </p>
        ) : null}

        <div className="mt-10">
          <Doc />
        </div>
      </article>

      <DocsPager
        lang={lang}
        prev_doc={prev_doc}
        next_doc={next_doc}
        prev_label={dict.docs_prev}
        next_label={dict.docs_next}
      />
    </DocsLayout>
  );
}
