import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";

import { DEFAULT_LOCALE, is_locale } from "@/lib/site_config";

const CHANGELOG_ROOT = path.join(process.cwd(), "src", "content", "changelog");

/**
 * Las entradas del changelog de un idioma, de la mas nueva a la mas vieja.
 *
 * **Se leen del DIRECTORIO, y eso se aparta de docs y de legales a proposito.**
 * Alla el orden es una decision editorial y por eso vive en un `nav.js`: un
 * `.mdx` que no esta en la lista no existe. Aca el orden es la FECHA, que ya
 * esta en el nombre del archivo, asi que una lista aparte no aportaria un dato
 * nuevo — solo un lugar mas donde olvidarse de anotar algo. Y el modo de fallo
 * se invierte a favor: con manifiesto, la entrada que alguien escribio y no
 * registro desaparece en silencio; sin el, aparece sola.
 *
 * El nombre del archivo es la fecha (`2026-08-17.mdx`) y `meta.date` la repite.
 * Se ordena por `meta.date` cuando esta y por el nombre cuando no: las dos dan
 * lo mismo mientras coincidan, y si divergen manda lo que la entrada DICE.
 *
 * Una entrada que existe en un idioma y no en el otro simplemente no aparece en
 * el que falta. Es el mismo criterio que `resolve_doc`: la pagina del otro
 * idioma sigue viva.
 */
export async function changelog_entries(lang) {
  const locale = is_locale(lang) ? lang : DEFAULT_LOCALE;

  let archivos;
  try {
    archivos = await readdir(path.join(CHANGELOG_ROOT, locale));
  } catch {
    // Todavia no hay carpeta para ese idioma: la pagina se dibuja vacia en vez
    // de romperse.
    return [];
  }

  const slugs = archivos
    .filter((archivo) => archivo.endsWith(".mdx"))
    .map((archivo) => archivo.replace(/\.mdx$/, ""));

  const entries = [];
  for (const slug of slugs) {
    try {
      // El literal de plantilla es lo que arma el contexto con todos los .mdx
      // de la carpeta, igual que en `lib/docs.js` y `lib/legal.js`.
      const mod = await import(`@/content/changelog/${locale}/${slug}.mdx`);
      entries.push({ slug, Entry: mod.default, meta: mod.meta ?? {} });
    } catch {
      // Un archivo que no compila no puede tumbar la pagina entera.
    }
  }

  return entries.sort((a, b) =>
    (b.meta.date ?? b.slug).localeCompare(a.meta.date ?? a.slug),
  );
}
