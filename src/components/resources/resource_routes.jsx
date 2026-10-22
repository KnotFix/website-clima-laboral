import { notFound } from "next/navigation";

import { ResourceArticle } from "@/components/resources/resource_article";
import { ResourceFrame } from "@/components/resources/resource_frame";
import { ResourcesIndex } from "@/components/resources/resources_index";
import { JsonLd } from "@/components/site/json_ld";
import {
  RESOURCES,
  RESOURCES_BASE,
  find_resource,
  resource_paths,
} from "@/content/resources/nav";
import { get_dictionary } from "@/lib/dictionaries";
import { resolve_article } from "@/lib/resources";
import { page_metadata } from "@/lib/seo";
import { blog_posting_ld, breadcrumb_ld, graph_ld } from "@/lib/structured_data";

/**
 * Las rutas de los recursos, armadas una vez para los dos idiomas.
 *
 * **Hay dos carpetas de rutas y no una**, `app/[lang]/recursos` y
 * `app/[lang]/resources`, porque el slug va traducido (ver
 * `content/resources/nav.js`). Cada carpeta atiende SOLO su idioma: la otra
 * combinacion (`/en/recursos`, `/es/resources`) da 404. Las dos son archivos de
 * cinco lineas que llaman a estas funciones con su idioma; lo que dibujan vive
 * aca una sola vez.
 *
 * Lo que tiene que ser un literal para Next (`dynamicParams`) se declara en la
 * carpeta de la ruta, no aca.
 */

export function resources_index_route(route_lang) {
  async function generateMetadata({ params }) {
    const { lang } = await params;
    if (lang !== route_lang) return {};

    const dict = await get_dictionary(lang);
    return page_metadata({
      lang,
      path: RESOURCES_BASE,
      title: dict.resources_meta_title,
      description: dict.resources_meta_description,
    });
  }

  async function Page({ params }) {
    const { lang } = await params;
    if (lang !== route_lang) notFound();

    const dict = await get_dictionary(lang);
    return (
      <>
        <JsonLd
          data={graph_ld(
            breadcrumb_ld(lang, [
              { name: dict.meta_title, path: "" },
              { name: dict.resources_title, path: null },
            ]),
          )}
        />
        <ResourceFrame lang={lang} dict={dict}>
          <ResourcesIndex lang={lang} dict={dict} />
        </ResourceFrame>
      </>
    );
  }

  return { generateMetadata, Page };
}

export function resource_route(route_lang) {
  // Los slugs de la carpeta, para los DOS idiomas que genera el layout. La
  // combinacion cruzada (`/en/recursos/plantilla-...`) se prerenderiza como
  // 404, igual que `/en/recursos`.
  //
  // **No se puede devolver `[]` para el idioma que no corresponde**, aunque
  // seria lo prolijo: Next (16.3, `build/static-paths/app.js`) toma una lista
  // vacia como «sin resultados» y deja pasar los parametros del padre sin
  // `slug`, y con esa combinacion incompleta descarta la ruta ENTERA. El build
  // salia sin un solo recurso y sin un error.
  function generateStaticParams() {
    return RESOURCES.map((entry) => ({ slug: entry.slug[route_lang] }));
  }

  async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    const entry = lang === route_lang ? find_resource(lang, slug) : null;
    if (!entry) return {};

    return page_metadata({
      lang,
      path: resource_paths(entry),
      title: entry.title[lang],
      description: entry.description[lang],
      type: "article",
      modified: entry.updated,
    });
  }

  async function Page({ params }) {
    const { lang, slug } = await params;
    const entry = lang === route_lang ? find_resource(lang, slug) : null;
    const Body = entry ? await resolve_article(lang, entry.id) : null;
    if (!Body) notFound();

    const dict = await get_dictionary(lang);

    return (
      <>
        {/* La miga y el articulo como BlogPosting, con las fechas del
            manifiesto. */}
        <JsonLd
          data={graph_ld(
            breadcrumb_ld(lang, [
              { name: dict.meta_title, path: "" },
              { name: dict.resources_title, path: RESOURCES_BASE[lang] },
              { name: entry.title[lang], path: null },
            ]),
            blog_posting_ld(lang, resource_paths(entry)[lang], entry),
          )}
        />
        <ResourceFrame lang={lang} dict={dict}>
          <ResourceArticle lang={lang} dict={dict} entry={entry} Body={Body} />
        </ResourceFrame>
      </>
    );
  }

  return { generateStaticParams, generateMetadata, Page };
}
