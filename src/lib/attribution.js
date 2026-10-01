import { read_cookie_from, write_cookie } from "@/lib/consent";

/**
 * De donde vino la persona: los UTM, los identificadores de clic de Google y de
 * Meta, la pagina en la que aterrizo y el sitio que la mando.
 *
 * > **La cookie es un contrato con la app**, que la lee al registrar la cuenta
 * > para saber que campaña trajo el alta. El formato no se toca sin tocar los
 * > dos repos el mismo dia:
 * >
 * >     censuma_utm = encodeURIComponent(JSON.stringify({ s, m, c, t, n,
 * >                                       gclid, fbclid, l, r, ts }))
 * >
 * > `s` utm_source, `m` utm_medium, `c` utm_campaign, `t` utm_term,
 * > `n` utm_content, `l` la ruta de aterrizaje sin query, `r` el HOST del
 * > referrer, `ts` epoch en segundos. Todas opcionales; cada string cortado a
 * > 200. Mismos flags que `censuma_consent`, pero 90 dias.
 *
 * **Semantica: ultimo toque NO directo.** Una visita que trae de donde vino
 * pisa lo anterior; una visita directa no toca nada. Se captura SIEMPRE en
 * `sessionStorage` (no es una cookie ni sale del navegador), y pasa a cookie
 * solo cuando hay consentimiento de analitica o de marketing.
 *
 * > **Que cuenta como «no directo»**: parametros `utm_*`, `gclid` o `fbclid`, y
 * > ademas un referrer EXTERNO sin parametros (una busqueda organica, un enlace
 * > desde otro sitio). Es la definicion de GA4 de «ultimo clic no directo»: sin
 * > el referrer, un alta que llego por Google organico quedaria atribuida a la
 * > campaña paga de hace dos meses. El referrer propio (`censuma.com`, la app,
 * > el mismo host) es navegacion interna y cuenta como directo.
 */

export const UTM_COOKIE = "censuma_utm";
export const UTM_MAX_AGE = 90 * 24 * 60 * 60;
export const UTM_SESSION_KEY = "censuma_utm";
const MAX_LENGTH = 200;

const PARAM_KEYS = [
  ["utm_source", "s"],
  ["utm_medium", "m"],
  ["utm_campaign", "c"],
  ["utm_term", "t"],
  ["utm_content", "n"],
  ["gclid", "gclid"],
  ["fbclid", "fbclid"],
];

function clip(value) {
  return String(value).slice(0, MAX_LENGTH);
}

/** El host de un referrer, o `null` si no es una URL. */
export function referrer_host(referrer) {
  if (!referrer) return null;
  try {
    return new URL(referrer).hostname.toLowerCase() || null;
  } catch {
    return null;
  }
}

/** Un referrer propio es navegacion interna, no un toque. */
export function is_own_host(host, current_host) {
  if (!host) return false;
  const current = String(current_host || "").toLowerCase();
  return (
    host === current ||
    host === "censuma.com" ||
    host.endsWith(".censuma.com")
  );
}

/**
 * El toque de esta visita, o `null` si es directa. Puro: recibe todo lo que
 * lee del navegador.
 *
 * `search` es `location.search`, `pathname` la ruta de aterrizaje, `referrer`
 * `document.referrer`, `hostname` el host del sitio y `now_ms` la hora.
 */
export function capture_touch({ search, pathname, referrer, hostname, now_ms }) {
  const params = new URLSearchParams(search || "");
  const touch = {};

  for (const [param, key] of PARAM_KEYS) {
    const value = params.get(param);
    if (value) touch[key] = clip(value);
  }

  const host = referrer_host(referrer);
  const external_referrer = host && !is_own_host(host, hostname) ? host : null;
  const has_params = Object.keys(touch).length > 0;

  if (!has_params && !external_referrer) return null;

  if (pathname) touch.l = clip(pathname);
  if (external_referrer) touch.r = clip(external_referrer);
  touch.ts = Math.floor(now_ms / 1000);
  return touch;
}

/**
 * Tope del valor codificado. Un navegador descarta ENTERA una cookie de mas de
 * ~4 KB, y el peor caso (nueve campos de 200 caracteres con acentos, que el
 * `encodeURIComponent` triplica) lo pasa. Rarisimo, pero perder la atribucion
 * entera por un `utm_content` largo es peor que perder el `utm_content`.
 */
const MAX_ENCODED = 3500;
// Lo ultimo en caer es el `gclid`: es lo unico que Google Ads necesita para
// atribuir la conversion.
const DROP_ORDER = ["n", "t", "r", "l", "c", "m", "fbclid", "s"];

/** El objeto de la cookie -> su valor codificado. */
export function encode_touch(touch) {
  const copy = { ...touch };
  let encoded = encodeURIComponent(JSON.stringify(copy));
  for (const key of DROP_ORDER) {
    if (encoded.length <= MAX_ENCODED) break;
    delete copy[key];
    encoded = encodeURIComponent(JSON.stringify(copy));
  }
  return encoded;
}

/** El valor de la cookie -> el objeto, o `null` si esta roto. */
export function decode_touch(value) {
  if (typeof value !== "string" || !value) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : null;
  } catch {
    return null;
  }
}

// ─── Solo en el navegador ────────────────────────────────────────

function session_get() {
  try {
    return window.sessionStorage.getItem(UTM_SESSION_KEY);
  } catch {
    return null;
  }
}

function session_set(value) {
  try {
    window.sessionStorage.setItem(UTM_SESSION_KEY, value);
  } catch {
    // Navegacion privada o almacenamiento bloqueado: sin toque guardado, el
    // alta simplemente queda sin atribucion.
  }
}

/**
 * Se llama UNA vez por carga de documento. Si la visita no es directa, su toque
 * pisa el de la sesion. Devuelve el toque vigente de la sesion (o `null`).
 */
export function record_landing() {
  if (typeof window === "undefined") return null;
  const touch = capture_touch({
    search: window.location.search,
    pathname: window.location.pathname,
    referrer: document.referrer,
    hostname: window.location.hostname,
    now_ms: Date.now(),
  });
  if (touch) session_set(encode_touch(touch));
  return decode_touch(session_get());
}

/**
 * Pasa el toque de la sesion a la cookie, si hay consentimiento. Sin toque en la
 * sesion (visita directa) la cookie existente se deja como esta: es el ultimo
 * toque no directo, y una visita directa no lo reemplaza.
 *
 * Sin ningun consentimiento se BORRA: quien retira el permiso no deja atras la
 * atribucion que se guardo mientras lo tenia.
 */
export function persist_attribution(consent) {
  if (typeof window === "undefined") return;
  const allowed = Boolean(consent && (consent.analytics || consent.marketing));

  if (!allowed) {
    if (read_cookie_from(document.cookie, UTM_COOKIE) !== null) {
      write_cookie(UTM_COOKIE, "", 0);
    }
    return;
  }

  const stored = session_get();
  if (stored && decode_touch(stored)) {
    write_cookie(UTM_COOKIE, stored, UTM_MAX_AGE);
  }
}
