export const LOCALES = ["es", "en"];
export const DEFAULT_LOCALE = "es";

export const site_config = {
  // `brand` es el nombre comercial del titular: solo va en el ©. El nombre que
  // se muestra en navbar, pie, titulos y tarjeta es `product`.
  brand: "Knotfix",
  product: "Censuma",
  domain: "https://censuma.com",
  // El PRODUCTO es otro despliegue, en su propio subdominio. Todo CTA de
  // «Empezar» manda al registro autoservicio de la app (`/registro`), que es la
  // pantalla publica que crea la cuenta y abre la prueba. La URL base se puede
  // pisar por entorno (staging apunta a otro host) con `NEXT_PUBLIC_APP_URL`;
  // como es `NEXT_PUBLIC_*`, se inyecta en BUILD, no al arrancar el servidor.
  //
  // `||` y no `??`, a proposito: el Dockerfile hace `ENV NEXT_PUBLIC_APP_URL=$ARG`,
  // y si el build arg no se pasa, la variable queda en CADENA VACIA, no ausente.
  // Con `??` eso no caia al default, `app_url` quedaba "" y los tres «Empezar»
  // del sitio publicado apuntaban a `/registro` relativo al sitio: 404 en
  // censuma.com/registro (2026-09-13). Vacio = no configurado.
  app_url: (process.env.NEXT_PUBLIC_APP_URL || "https://app.censuma.com").replace(/\/$/, ""),
};

site_config.signup_url = `${site_config.app_url}/registro`;

export function is_locale(value) {
  return LOCALES.includes(value);
}

/** Reemplaza el segmento de idioma de una ruta: /es/precios -> /en/precios */
export function swap_locale_in_path(pathname, next_locale) {
  const segments = pathname.split("/");
  // segments[0] siempre es "" porque la ruta arranca con "/"
  if (is_locale(segments[1])) {
    segments[1] = next_locale;
    return segments.join("/");
  }
  return `/${next_locale}${pathname}`;
}
