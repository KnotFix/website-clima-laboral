import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import GithubSlugger from "github-slugger";

import { flatten_nav } from "@/content/docs/nav";
import { DEFAULT_LOCALE, is_locale } from "@/lib/site_config";

const DOCS_ROOT = path.join(process.cwd(), "src", "content", "docs");

/** Los niveles que entran al indice de la pagina. El h1 lo pone la ruta. */
const TOC_LEVELS = [2, 3];

/** `true` si el slug esta en `DOCS_NAV`. Lo demas no existe. */
export function is_doc_slug(slug) {
  return flatten_nav().some((entry) => entry.slug === slug);
}

/**
 * Carga una pagina: el componente compilado y su `meta`.
 *
 * Devuelve `null` en vez de reventar cuando el archivo no esta. Pasa de verdad
 * —una pagina escrita en español y todavia no traducida— y el modo de fallo
 * correcto es un 404, no una pantalla de error: la ruta existe en el otro
 * idioma y el enlace es legitimo.
 */
export async function resolve_doc(lang, slug) {
  const locale = is_locale(lang) ? lang : DEFAULT_LOCALE;
  if (!is_doc_slug(slug)) return null;

  try {
    // El literal de plantilla es lo que hace que el bundler arme un contexto
    // con todos los .mdx de la carpeta. Con `lang` y `slug` variables el
    // contexto es `content/docs/**/*.mdx`, que es exactamente lo que se quiere.
    const mod = await import(`@/content/docs/${locale}/${slug}.mdx`);
    return { Doc: mod.default, meta: mod.meta ?? {} };
  } catch {
    return null;
  }
}

/**
 * Los encabezados de una pagina, para el indice lateral.
 *
 * Se sacan del archivo CRUDO con `fs`, no del modulo compilado: MDX exporta el
 * componente, no su arbol, asi que despues de compilar no hay de donde leerlos
 * sin renderizar. Un plugin de remark seria el otro camino y no sirve acá — con
 * Turbopack los plugins van como strings y no pueden devolver datos al que
 * importa.
 *
 * ⚠️ **El slug se calcula con `github-slugger`, que es el MISMO que usa
 * `rehype-slug` por dentro.** De ahi sale que el `href` del indice coincida con
 * el `id` que termina en el HTML. Si algun dia se cambia uno de los dos, el
 * indice sigue dibujandose igual y deja de saltar a ningun lado: es un fallo
 * silencioso, asi que los dos son la misma decision.
 */
export async function headings_of(lang, slug) {
  const locale = is_locale(lang) ? lang : DEFAULT_LOCALE;
  if (!is_doc_slug(slug)) return [];

  let raw;
  try {
    raw = await readFile(path.join(DOCS_ROOT, locale, `${slug}.mdx`), "utf8");
  } catch {
    return [];
  }

  const slugger = new GithubSlugger();
  const headings = [];
  let in_fence = false;

  for (const line of raw.split("\n")) {
    // Las vallas de codigo se saltean enteras: un `# comentario` dentro de un
    // bloque de shell no es un encabezado, y sin este corte entraria al indice.
    if (line.trimStart().startsWith("```")) {
      in_fence = !in_fence;
      continue;
    }
    if (in_fence) continue;

    const match = /^(#{2,3})\s+(.*)$/.exec(line);
    if (!match) continue;

    const level = match[1].length;
    if (!TOC_LEVELS.includes(level)) continue;

    const text = strip_inline_markdown(match[2]);
    if (!text) continue;

    headings.push({ id: slugger.slug(text), text, level });
  }

  return headings;
}

/**
 * El texto que VE el lector, sin la sintaxis.
 *
 * `rehype-slug` slugifica el contenido de texto del encabezado ya renderizado,
 * asi que un `## El \`meta\` de la pagina` da `el-meta-de-la-pagina` y no
 * `el-meta-de-la-pagina` con los backticks adentro. Sin esta limpieza los dos
 * ids se separan y el indice apunta al vacio.
 */
function strip_inline_markdown(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // enlaces: queda la etiqueta
    .replace(/[`*_]/g, "")
    .trim();
}
