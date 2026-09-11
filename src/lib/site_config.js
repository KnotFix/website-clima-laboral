export const LOCALES = ["es", "en"];
export const DEFAULT_LOCALE = "es";

export const site_config = {
  // `brand` es el nombre comercial del titular: solo va en el ©. El nombre que
  // se muestra en navbar, pie, titulos y tarjeta es `product`.
  brand: "Knotfix",
  product: "Censuma",
  domain: "https://knotfix.com",
  // TODO: apuntar al registro real del SaaS cuando exista.
  signup_url: "#",
};

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
