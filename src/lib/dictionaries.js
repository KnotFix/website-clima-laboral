import "server-only";

/**
 * Lo que necesitan los componentes de CLIENTE de la barra y el pie (menu movil,
 * enlaces, idioma, tema): las llaves `nav_*` y `a11y_*`, nada mas.
 *
 * **Todo lo que se le pasa a un componente de cliente viaja serializado en el
 * HTML de cada pagina.** Pasarles el diccionario entero mandaba ~20 KB de texto
 * de la home, los precios y el banner a TODAS las paginas, para que el menu
 * leyera diez llaves. Mismo criterio que `consent_dict_of` en el layout.
 */
export function chrome_dict_of(dict) {
  return Object.fromEntries(
    Object.entries(dict).filter(
      ([key]) => key.startsWith("nav_") || key.startsWith("a11y_"),
    ),
  );
}

import { DEFAULT_LOCALE, is_locale } from "@/lib/site_config";

// Import dinamico: el diccionario que no se usa no viaja en el bundle.
const dictionaries = {
  es: () => import("@/content/es").then((mod) => mod.default),
  en: () => import("@/content/en").then((mod) => mod.default),
};

export async function get_dictionary(lang) {
  const locale = is_locale(lang) ? lang : DEFAULT_LOCALE;
  return dictionaries[locale]();
}
