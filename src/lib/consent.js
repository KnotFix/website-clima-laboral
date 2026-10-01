/**
 * El consentimiento de cookies del sitio: la cookie que lo guarda, como se lee
 * y como se escribe, y el script que fija el Consent Mode ANTES de que cargue
 * Google Tag Manager.
 *
 * > **La cookie es un contrato con la app** (`app.censuma.com`), que la lee del
 * > otro lado para decidir si informa el registro y el primer pago a Google y a
 * > Meta. El formato no se toca sin tocar los dos repos el mismo dia:
 * >
 * >     censuma_consent = 1.<a>.<m>
 * >
 * > `1` es la version del formato, `<a>` la analitica y `<m>` el marketing, cada
 * > uno `1` o `0`. Path `/`, 180 dias, `SameSite=Lax`, `Secure` bajo https, y
 * > dominio `.censuma.com` SOLO si el sitio corre en ese dominio: en localhost o
 * > en un staging con otro host va sin `domain` (host-only), porque un `domain`
 * > que no coincide con el host hace que el navegador la descarte en silencio.
 *
 * **Fail-closed**: sin cookie, o con una que no se entiende, no hay
 * consentimiento. Es el criterio de la Ley 8968 (el consentimiento tiene que ser
 * expreso) y el de todo el proyecto.
 *
 * Nada de este archivo toca `document` al importarse: el layout lo usa en el
 * servidor para armar el script, y los tests lo corren en Node.
 */

export const CONSENT_COOKIE = "censuma_consent";
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60;

/** El evento que reabre el banner (lo dispara «Preferencias de cookies»). */
export const OPEN_CONSENT_EVENT = "censuma:open-consent";

/** El dominio registrable del sitio: la cookie se comparte con `app.`. */
export const COOKIE_ROOT_DOMAIN = "censuma.com";

/**
 * `1.a.m` -> `{ analytics, marketing }`, o `null` si no hay decision valida.
 * Una version de formato desconocida tambien es `null`: preferimos volver a
 * preguntar antes que adivinar que significaba.
 */
export function parse_consent(value) {
  if (typeof value !== "string") return null;
  const match = /^1\.([01])\.([01])$/.exec(value.trim());
  if (!match) return null;
  return { analytics: match[1] === "1", marketing: match[2] === "1" };
}

/** `{ analytics, marketing }` -> `1.a.m` */
export function serialize_consent({ analytics, marketing }) {
  return `1.${analytics ? 1 : 0}.${marketing ? 1 : 0}`;
}

/**
 * El dominio con el que se escribe la cookie, o `null` para dejarla host-only.
 * Solo `censuma.com` y sus subdominios: fuera de ahi un `domain=.censuma.com`
 * seria rechazado por el navegador.
 */
export function cookie_domain_for(hostname) {
  const host = String(hostname || "").toLowerCase();
  if (host === COOKIE_ROOT_DOMAIN || host.endsWith(`.${COOKIE_ROOT_DOMAIN}`)) {
    return `.${COOKIE_ROOT_DOMAIN}`;
  }
  return null;
}

/**
 * Arma el string de `document.cookie`. Es puro a proposito, para poder
 * probarlo sin navegador. `max_age` en 0 borra la cookie.
 */
export function build_cookie({ name, value, max_age, hostname, secure }) {
  const parts = [`${name}=${value}`, "Path=/", `Max-Age=${max_age}`, "SameSite=Lax"];
  const domain = cookie_domain_for(hostname);
  if (domain) parts.push(`Domain=${domain}`);
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

/** El valor crudo de una cookie dentro de un header `Cookie`, o `null`. */
export function read_cookie_from(cookie_header, name) {
  if (typeof cookie_header !== "string" || !cookie_header) return null;
  for (const piece of cookie_header.split(";")) {
    const eq = piece.indexOf("=");
    if (eq === -1) continue;
    if (piece.slice(0, eq).trim() === name) return piece.slice(eq + 1).trim();
  }
  return null;
}

/**
 * Las señales de Consent Mode v2 que corresponden a una decision. La analitica
 * abre `analytics_storage`; el marketing abre las tres de publicidad juntas:
 * separarlas no tiene sentido para una persona que eligio «Marketing: si».
 */
export function consent_signals({ analytics, marketing }) {
  const ads = marketing ? "granted" : "denied";
  return {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  };
}

// ─── Solo en el navegador ────────────────────────────────────────

/** La decision guardada, o `null`. Seguro de llamar en el servidor. */
export function read_consent() {
  if (typeof document === "undefined") return null;
  return parse_consent(read_cookie_from(document.cookie, CONSENT_COOKIE));
}

/** Escribe una cookie con los flags del contrato. */
export function write_cookie(name, value, max_age) {
  if (typeof document === "undefined") return;
  document.cookie = build_cookie({
    name,
    value,
    max_age,
    hostname: window.location.hostname,
    secure: window.location.protocol === "https:",
  });
}

/** Guarda la decision. */
export function write_consent(consent) {
  write_cookie(CONSENT_COOKIE, serialize_consent(consent), CONSENT_MAX_AGE);
}

// ─── El script del <head> ────────────────────────────────────────

/**
 * El JS que va INLINE en el `<head>`, antes que GTM. Tiene que correr antes que
 * cualquier etiqueta, asi que no puede depender de ningun modulo: es un string
 * autocontenido que repite, en ES5, la lectura de la cookie de arriba.
 *
 * > **Por que un `<script>` crudo y no `next/script`.** En App Router, un
 * > `<Script strategy="beforeInteractive">` inline NO se ejecuta donde se
 * > escribe: Next lo encola en `self.__next_s` y lo corre recien cuando arranca
 * > su propio runtime (`app-bootstrap.js`). Para ese momento GTM ya pudo haber
 * > cargado con el consentimiento sin fijar. Un `<script>` en el `<head>` del
 * > layout raiz lo ejecuta el parser del navegador en el acto.
 *
 * `url_passthrough` y `ads_data_redaction` son lo que deja medir sin cookies
 * mientras no hay consentimiento: el primero pasa el gclid por la URL entre
 * paginas, el segundo borra los identificadores de las pings de publicidad.
 */
export function consent_bootstrap_script() {
  return [
    "window.dataLayer=window.dataLayer||[];",
    "function gtag(){dataLayer.push(arguments);}",
    "window.gtag=window.gtag||gtag;",
    "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});",
    "gtag('set','ads_data_redaction',true);",
    "gtag('set','url_passthrough',true);",
    "try{",
    `var m=document.cookie.match(/(?:^|;\\s*)${CONSENT_COOKIE}=1\\.([01])\\.([01])(?:;|$)/);`,
    "if(m){var a=m[1]==='1'?'granted':'denied',d=m[2]==='1'?'granted':'denied';",
    "gtag('consent','update',{analytics_storage:a,ad_storage:d,ad_user_data:d,ad_personalization:d});}",
    "}catch(e){}",
  ].join("");
}

/**
 * El snippet estandar de GTM. El id se valida antes de meterlo en un script:
 * viene de una variable de entorno y no debe poder inyectar codigo.
 */
export function is_gtm_id(value) {
  return typeof value === "string" && /^GTM-[A-Z0-9]+$/.test(value);
}

export function gtm_loader_script(gtm_id) {
  return (
    "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});" +
    "var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';" +
    "j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);" +
    `})(window,document,'script','dataLayer','${gtm_id}');`
  );
}
