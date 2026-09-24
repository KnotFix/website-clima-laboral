export const LOCALES = ["es", "en"];
export const DEFAULT_LOCALE = "es";

export const site_config = {
  // `brand` es el nombre comercial del titular: solo va en el ©. El nombre que
  // se muestra en navbar, pie, titulos y tarjeta es `product`.
  brand: "Knotfix",
  product: "Censuma",
  domain: "https://censuma.com",
  // El PRODUCTO es otro despliegue, en su propio subdominio. Todo CTA de
  // «Empezar» manda a la RAIZ de la app: quien ya tiene cuenta entra, y quien
  // no la tiene encuentra ahi el enlace a `/registro` (la pantalla de login de
  // Clerk lo ofrece). Mandar directo a `/registro` se probo y se descarto el
  // 2026-09-13: le pedia crear cuenta a quien ya la tenia. La URL base se puede
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

// Conserva el nombre `signup_url` porque asi lo consumen navbar, mobile_menu,
// hero y final_cta; el destino es la raiz de la app (ver arriba).
site_config.signup_url = `${site_config.app_url}/`;

// El enlace «Precios» del navbar. El sitio NO publica una tabla de precios
// (decision del 2026-09-13: se probo una seccion con las cuatro fichas y se
// descarto): los planes se ven en la pantalla de registro del producto, que es
// la que manda el dia que alguien contrata, y tener dos copias es tener una
// desactualizada. Es la unica salida del sitio que va a `/registro` y no a la
// raiz de la app: quien busca precios todavia no tiene cuenta.
//
// Lleva `?lang=` desde el 2026-09-23: sin el parametro la app elegia el idioma
// por el navegador, asi que quien leia el sitio en ingles con el navegador en
// español veia los precios en español. La app lo lee una vez, lo guarda como
// preferencia y lo quita de la URL (`i18n/idiomas.ts::consumirIdiomaDeUrl`).
site_config.register_url = (lang) =>
  `${site_config.app_url}/registro?lang=${is_locale(lang) ? lang : DEFAULT_LOCALE}`;

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
