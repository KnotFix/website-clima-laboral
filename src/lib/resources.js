import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";

import { DEFAULT_LOCALE, is_locale } from "@/lib/site_config";

const RESOURCES_ROOT = path.join(process.cwd(), "src", "content", "resources");

/** Palabras por minuto de una lectura de corrido, para el «8 min de lectura». */
const WORDS_PER_MINUTE = 200;

/**
 * El cuerpo compilado de un articulo, o `null` si ese idioma no lo tiene.
 *
 * Mismo criterio que `resolve_doc`: un articulo escrito en un idioma y todavia
 * no traducido da 404 en el que falta, no una pantalla de error.
 */
export async function resolve_article(lang, id) {
  const locale = is_locale(lang) ? lang : DEFAULT_LOCALE;
  try {
    // El literal de plantilla arma el contexto con todos los .mdx de
    // `content/resources/`, igual que en `lib/docs.js`.
    const mod = await import(`@/content/resources/${locale}/${id}.mdx`);
    return mod.default;
  } catch {
    return null;
  }
}

/**
 * Los minutos de lectura de un articulo, contados sobre el archivo CRUDO.
 *
 * Se calcula y no se escribe en el manifiesto para que no se desactualice el
 * dia que se edita el texto. Las URLs de los enlaces no se cuentan: no se leen.
 */
export function reading_minutes(lang, id) {
  const locale = is_locale(lang) ? lang : DEFAULT_LOCALE;
  const source = readFileSync(path.join(RESOURCES_ROOT, locale, `${id}.mdx`), "utf8");
  const words = source
    .replace(/\]\([^)]*\)/g, "]")
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** «21 de octubre de 2026» / «October 21, 2026», de una fecha `AAAA-MM-DD`. */
export function format_date(iso, lang) {
  // Mediodia UTC para que ningun huso horario la corra al dia anterior.
  return new Intl.DateTimeFormat(lang === "es" ? "es-419" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T12:00:00Z`));
}
