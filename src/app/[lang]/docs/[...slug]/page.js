import { notFound } from "next/navigation";

import { DocsLayout } from "@/components/docs/docs_layout";
import { DocsPager } from "@/components/docs/docs_pager";
import { flatten_nav, neighbours_of } from "@/content/docs/nav";
import { get_dictionary } from "@/lib/dictionaries";
import { headings_of, resolve_doc } from "@/lib/docs";
import { LOCALES, is_locale } from "@/lib/site_config";

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

  return {
    title: doc.meta.title,
    description: doc.meta.description,
    alternates: {
      canonical: `/${lang}/docs/${doc_slug}`,
      // Los slugs son los MISMOS en los dos idiomas (van en ingles), asi que el
      // hreflang se arma sin una tabla de traduccion de rutas. Es la otra mitad
      // de por que los slugs no se traducen — ver `content/docs/nav.js`.
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, `/${locale}/docs/${doc_slug}`]),
      ),
    },
  };
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

  return (
    <DocsLayout
      lang={lang}
      dict={dict}
      active_slug={doc_slug}
      headings={headings}
    >
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
