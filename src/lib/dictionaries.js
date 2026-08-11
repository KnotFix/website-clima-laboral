import "server-only";

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
