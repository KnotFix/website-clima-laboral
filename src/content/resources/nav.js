/**
 * El manifiesto de los recursos gratuitos: `/es/recursos` y `/en/resources`.
 *
 * De aca salen las rutas, la tarjeta del indice, el sitemap, `/llms.txt` y el
 * cambio de idioma. Es la misma idea que `DOCS_NAV` y `LEGAL_NAV`: una sola
 * lista, y nadie escribe una URL de recurso a mano en otro lado.
 *
 * ## Los slugs van TRADUCIDOS, y es la unica seccion del sitio asi
 *
 * El resto del sitio usa el mismo slug en ingles para los dos idiomas
 * (`/es/pricing`, `/es/docs/kiosk`). Los recursos no, por decision del usuario
 * (2026-10-12): existen para atraer busquedas, y quien busca «plantilla
 * encuesta de clima laboral» la encuentra mejor si la URL dice eso. El costo es
 * que las dos versiones no comparten ruta, asi que el hreflang, el sitemap y el
 * conmutador de idioma leen la pareja de rutas de aca (`LOCALIZED_PATHS`) en vez
 * de cambiar solo el segmento de idioma.
 *
 * ## Regla de confidencialidad
 *
 * Los recursos son marketing para gente que todavia no es cliente. **Nada de lo
 * que se publique aca sale del metodo del producto**: ni las preguntas del
 * nucleo (ni parafraseadas), ni los modelos y sus dimensiones o pesos, ni como
 * se calculan los indices, ni como funciona el anonimato por dentro. Del
 * producto se nombra solo lo que ya dice la home, como beneficio y sin explicar
 * como funciona. Las preguntas de la plantilla se escribieron desde cero
 * (`survey_template.json`).
 *
 * Este archivo NO importa el `.json` de la plantilla a proposito: lo lee el
 * conmutador de idioma, que es un componente de cliente, y todo lo que importa
 * viaja al navegador.
 */

export const RESOURCES_BASE = { es: "/recursos", en: "/resources" };

export const RESOURCES = [
  {
    id: "survey_template",
    slug: {
      es: "plantilla-encuesta-clima-laboral",
      en: "workplace-climate-survey-template",
    },
    title: {
      es: "Plantilla de encuesta de clima laboral en Excel",
      en: "Workplace climate survey template in Excel",
    },
    description: {
      es: "30 preguntas en 6 dimensiones, eNPS y dos preguntas abiertas. Lista para imprimir, cargar las respuestas y ver el porcentaje favorable.",
      en: "30 statements across 6 dimensions, eNPS and two open questions. Ready to print, enter the answers and see the percentage favorable.",
    },
    published: "2026-10-12",
    updated: "2026-10-12",
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
