import "server-only";

import { find_legal } from "@/content/legal/nav";
import { DEFAULT_LOCALE, is_locale } from "@/lib/site_config";

/**
 * Carga un documento legal: el componente compilado y su entrada de `LEGAL_NAV`.
 *
 * Mismo patron que `resolve_doc` y a proposito mas corto: no hay indice lateral,
 * asi que no hace falta releer el .mdx crudo con `fs` para sacarle los
 * encabezados. Un documento legal se lee de arriba abajo o se busca con Ctrl+F;
 * un indice de veinte clausulas al costado es ruido.
 */
export async function resolve_legal(lang, slug) {
  const locale = is_locale(lang) ? lang : DEFAULT_LOCALE;
  const entry = find_legal(slug);
  if (!entry) return null;

  try {
    // El literal de plantilla arma el contexto con todos los .mdx de la carpeta,
    // igual que en `lib/docs.js`.
    const mod = await import(`@/content/legal/${locale}/${slug}.mdx`);
    return { Legal: mod.default, entry, title: entry.title[locale] };
  } catch {
    // Un documento traducido a medias devuelve 404 en el idioma que falta, no
    // una pantalla de error: la ruta del otro idioma sigue viva.
    return null;
  }
}
