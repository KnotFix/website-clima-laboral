export const LOCALES = ["es", "en"];
export const DEFAULT_LOCALE = "es";

export const site_config = {
  brand: "Knotfix",
  product: "Clima",
  domain: "https://knotfix.com",
  // TODO: apuntar al registro real del SaaS cuando exista.
  signup_url: "#",
  // Los 11 caracteres que identifican el video en la URL de YouTube:
  // https://youtu.be/AQUI o https://youtube.com/watch?v=AQUI.
  //
  // TODO: ESTE ES UN VIDEO DE EJEMPLO, hay que reemplazarlo por el de Knotfix.
  // Es "Big Buck Bunny", el corto libre de la Blender Foundation: se eligio a
  // proposito uno que se nota de lejos que es de relleno, para que nadie lo
  // confunda con contenido real ni se publique asi por descuido.
  // Vacio tambien es valido: el hero muestra el marco sin miniatura ni play.
  hero_video_id: "aqz-KE-bpKQ",
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
