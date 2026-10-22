/**
 * El manifiesto de los articulos de recursos: `/es/recursos` y `/en/resources`.
 *
 * De aca salen las rutas, la tarjeta del indice, el sitemap, `/llms.txt` y el
 * cambio de idioma. Es la misma idea que `DOCS_NAV` y `LEGAL_NAV`: una sola
 * lista, y nadie escribe una URL de recurso a mano en otro lado.
 *
 * Cada entrada es un articulo tipo blog. El cuerpo vive en
 * `content/resources/{es,en}/<id>.mdx`; el titulo, la descripcion y las fechas
 * viven aca y no en el `.mdx` porque el indice, el sitemap y `/llms.txt` los
 * leen sin compilar el articulo (el mismo motivo que las fechas de `DOCS_NAV`).
 *
 * Hasta el 2026-10-21 aca habia una plantilla de encuesta en Excel; el usuario
 * la cambio por articulos (la plantilla sigue en la historia de git, commit
 * 4d354c1).
 *
 * ## Los slugs van TRADUCIDOS, y es la unica seccion del sitio asi
 *
 * El resto del sitio usa el mismo slug en ingles para los dos idiomas
 * (`/es/pricing`, `/es/docs/kiosk`). Los recursos no, por decision del usuario
 * (2026-10-12): existen para atraer busquedas, y quien busca «por que medir el
 * clima laboral» la encuentra mejor si la URL dice eso. El costo es que las dos
 * versiones no comparten ruta, asi que el hreflang, el sitemap y el conmutador
 * de idioma leen la pareja de rutas de aca (`LOCALIZED_PATHS`) en vez de
 * cambiar solo el segmento de idioma.
 *
 * ## Regla de confidencialidad
 *
 * Los articulos son marketing para gente que todavia no es cliente. **Nada de
 * lo que se publique aca sale del metodo del producto**: ni las preguntas del
 * nucleo (ni parafraseadas), ni los modelos y sus dimensiones o pesos, ni como
 * se calculan los indices, ni como funciona el anonimato por dentro. Del
 * producto se nombra solo lo que ya dice la home, como beneficio y sin explicar
 * como funciona. Y toda cifra lleva su fuente enlazada al pie del articulo.
 */

export const RESOURCES_BASE = { es: "/recursos", en: "/resources" };

export const RESOURCES = [
  {
    id: "why_measure",
    slug: {
      es: "por-que-medir-clima-laboral-y-satisfaccion",
      en: "why-measure-workplace-climate-and-satisfaction",
    },
    title: {
      es: "Por qué medir el clima laboral y la satisfacción de tu equipo",
      en: "Why measure your team's workplace climate and satisfaction",
    },
    description: {
      es: "Lo que cuesta enterarse tarde, por qué el clima y la satisfacción se miden por separado y cinco condiciones para que una encuesta sirva de verdad.",
      en: "What finding out too late costs, why climate and satisfaction are measured separately, and five conditions for a survey that is actually useful.",
    },
    published: "2026-10-21",
    updated: "2026-10-21",
  },
];

/** La ruta de un recurso en cada idioma, sin el segmento de idioma. */
export function resource_paths(entry) {
  return Object.fromEntries(
    Object.entries(RESOURCES_BASE).map(([lang, base]) => [
      lang,
      `${base}/${entry.slug[lang]}`,
    ]),
  );
}

export function find_resource(lang, slug) {
  return RESOURCES.find((entry) => entry.slug[lang] === slug) ?? null;
}

/**
 * Las rutas que cambian de nombre segun el idioma: cada item es la MISMA
 * pagina, `{ es: "/recursos", en: "/resources" }`. Lo consume
 * `swap_locale_in_path` (`lib/site_config.js`).
 */
export const LOCALIZED_PATHS = [RESOURCES_BASE, ...RESOURCES.map(resource_paths)];
