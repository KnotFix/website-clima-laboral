import { consent_signals } from "@/lib/consent";

/**
 * Lo que el sitio le cuenta a Google Tag Manager.
 *
 * **El codigo solo empuja eventos al `dataLayer`.** Que herramienta escucha
 * cual (GA4, Google Ads, Meta, Clarity) se configura DENTRO de GTM, y la guia
 * esta en `docs/analytics_setup.md`. Asi, sumar o sacar una herramienta no es
 * un deploy.
 *
 * Los eventos, y los unicos nombres que GTM tiene que conocer:
 *
 *     virtual_page_view  page_path, page_title, page_language, page_location
 *     cta_click          cta_id, cta_text, cta_location, link_url
 *     app_link_click     link_url, cta_id
 *     begin_sign_up      link_url, cta_id, plan?
 *     contact_click      method ("email" | "whatsapp"), cta_id
 *     section_view       section_id
 *     consent_update     consent_analytics, consent_marketing
 *
 * > **`virtual_page_view` es la UNICA fuente de paginas vistas**, incluida la
 * > primera. El tag de GA4 se configura con `send_page_view: false` y el
 * > `page_view` sale de este evento; si ademas se disparara con la carga normal
 * > o con el «Cambio de historial» de GTM, cada pagina contaria doble.
 *
 * Todo es seguro de llamar en el servidor: ahi no hace nada.
 */

/** Empuja un evento. Sin `window` (SSR) no hace nada. */
export function push_event(name, params = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...params });
}

/**
 * Aplica una decision de consentimiento a Consent Mode. Usa el `gtag` que
 * define el script del `<head>`; si por lo que sea no esta, lo define igual.
 *
 * > **Tiene que ser un objeto `arguments`, no un array.** GTM distingue los
 * > comandos de `gtag` de los eventos comunes justamente por eso: un
 * > `["consent", "update", {...}]` empujado a mano lo ignora sin avisar.
 */
export function update_consent_mode(consent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
  window.gtag("consent", "update", consent_signals(consent));
}

/**
 * Si una seccion cuenta como vista: la mitad de ella en pantalla, o la mitad de
 * la PANTALLA ocupada por ella. Se mide en AREA y no en alto.
 *
 * > **La segunda condicion no es un detalle.** Con «50% de la seccion» a secas,
 * > una seccion mas alta que dos pantallas (el analisis, en un telefono) no
 * > llega nunca al umbral y jamas se reporta, justo la que mas se leyo.
 * >
 * > **Y es area porque el capitulo clavado se mueve de lado.** La medicion
 * > entra por la derecha a pantalla completa de alto: medida en alto contaria
 * > como vista con una franja de diez pixeles asomando.
 */
export function is_section_seen({ visible_area, section_area, viewport_area }) {
  if (!(visible_area > 0)) return false;
  const needed = Math.min(section_area, viewport_area) * 0.5;
  return visible_area >= needed;
}

/** Recorta y aplana el texto visible de un CTA. */
export function clip_text(text, max = 100) {
  return String(text || "").replace(/\s+/g, " ").trim().slice(0, max);
}

/**
 * Que es un enlace, para los eventos. Puro, para poder probarlo.
 *
 * - `is_app`: va al producto (`site_config.app_url`).
 * - `is_sign_up`: es intencion de alta. Son las dos salidas del sitio al
 *   producto: la raiz («Empezar», donde Clerk ofrece crear cuenta) y
 *   `/registro` («Precios», donde se elige plan). Otra ruta de la app (si algun
 *   dia se enlaza una pagina de ayuda del producto) es solo `app_link_click`.
 * - `plan`: el `?plan=` del enlace, si lo lleva.
 * - `is_mailto`: un enlace de correo.
 * - `is_whatsapp`: un enlace a un chat de WhatsApp (wa.me o api.whatsapp.com).
 */
export function classify_link(href, app_url) {
  const result = {
    is_app: false,
    is_sign_up: false,
    plan: null,
    is_mailto: false,
    is_whatsapp: false,
  };
  if (typeof href !== "string" || !href) return result;

  if (href.toLowerCase().startsWith("mailto:")) {
    result.is_mailto = true;
    return result;
  }

  if (/^https?:\/\/(wa\.me|api\.whatsapp\.com)(\/|$)/i.test(href)) {
    result.is_whatsapp = true;
    return result;
  }

  const base = String(app_url || "").replace(/\/$/, "");
  if (!base || !(href === base || href.startsWith(`${base}/`) || href.startsWith(`${base}?`))) {
    return result;
  }
  result.is_app = true;

  let url;
  try {
    url = new URL(href);
  } catch {
    return result;
  }
  const path = url.pathname.replace(/\/$/, "") || "/";
  result.is_sign_up = path === "/" || path === "/registro" || path.startsWith("/registro/");
  result.plan = url.searchParams.get("plan") || null;
  return result;
}
