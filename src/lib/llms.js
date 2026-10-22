import { DOCS_NAV } from "@/content/docs/nav";
import { LEGAL_NAV } from "@/content/legal/nav";
import { RESOURCES, resource_paths } from "@/content/resources/nav";
import { DEFAULT_LOCALE, LOCALES, site_config } from "@/lib/site_config";

/**
 * El texto de `/llms.txt`: el sitio resumido en Markdown para un asistente.
 *
 * Un modelo que abre la home recibe 260 KB de HTML con animaciones, y de ahi
 * tiene que deducir que hay cuarenta y dos paginas de documentacion detras.
 * Este archivo le da el mapa en un solo pedido: que es el producto, y cada doc
 * con su titulo, su URL y su descripcion. Es la convencion de llmstxt.org
 * (un `# titulo`, un `> resumen` y secciones `##` con listas de enlaces).
 *
 * **Sale de los mismos manifiestos que el sitemap** (`DOCS_NAV`, `LEGAL_NAV`),
 * por la misma razon: una lista escrita a mano se desincroniza el dia que
 * alguien agrega una doc, y nadie se entera.
 *
 * Es una funcion pura y recibe las descripciones ya resueltas: quien abre los
 * `.mdx` es la ruta (`app/llms.txt/route.js`), y asi esto se puede probar sin
 * compilar MDX.
 *
 * @param {object} opts
 * @param {Record<string, object>} opts.dicts         diccionario por idioma
 * @param {Record<string, Record<string, string>>} opts.descriptions
 *        descripcion de cada doc: `descriptions[lang][slug]`
 */
export function llms_txt({ dicts, descriptions }) {
  const other_locales = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);
  const names = { en: "English" };
  const lines = [
    `# ${site_config.product}`,
    "",
    `> ${dicts[DEFAULT_LOCALE].meta_description}`,
    "",
    `Sitio: ${site_config.domain}/${DEFAULT_LOCALE} (español) y ` +
      other_locales.map((l) => `${site_config.domain}/${l} (${names[l] ?? l})`).join(", ") +
      `. La aplicación vive en ${site_config.app_url}. ` +
      `Contacto: ${site_config.contact.email}, ${site_config.contact.phone}.`,
    "",
  ];

  for (const lang of LOCALES) {
    const tag = lang === DEFAULT_LOCALE ? "" : ` (${names[lang] ?? lang})`;
    const base = `${site_config.domain}/${lang}`;

    // Precios va primero: es lo que mas se le pregunta a un asistente sobre un
    // SaaS. Solo el enlace, SIN montos: este archivo se arma una vez en el
    // build y los precios cambian con un UPDATE en el producto, asi que un
    // numero escrito aca quedaria viejo. La pagina se regenera sola.
    lines.push(`## ${dicts[lang].nav_pricing}${tag}`, "");
    lines.push(
      link_line(
        dicts[lang].pricing_meta_title,
        `${base}/pricing`,
        dicts[lang].pricing_meta_description,
      ),
    );
    lines.push("");

    for (const group of DOCS_NAV) {
      lines.push(`## ${group.title[lang]}${tag}`, "");
      for (const entry of group.items) {
        lines.push(
          link_line(
            entry.title[lang],
            `${base}/docs/${entry.slug}`,
            descriptions[lang]?.[entry.slug],
          ),
        );
      }
      lines.push("");
    }

    // Los articulos de recursos, con el slug de su idioma.
    lines.push(`## ${dicts[lang].resources_title}${tag}`, "");
    for (const entry of RESOURCES) {
      lines.push(
        link_line(entry.title[lang], `${base}${resource_paths(entry)[lang]}`, entry.description[lang]),
      );
    }
    lines.push("");

    lines.push(`## Legal${tag}`, "");
    for (const entry of LEGAL_NAV) {
      lines.push(
        link_line(
          entry.title[lang],
          `${base}/legal/${entry.slug}`,
          entry.description?.[lang],
        ),
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

function link_line(title, url, description) {
  return `- [${title}](${url})${description ? `: ${description}` : ""}`;
}
