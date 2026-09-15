import { DEFAULT_LOCALE, LOCALES, site_config } from "@/lib/site_config";

/**
 * Los metadatos de una pagina, armados de UNA sola forma para todas.
 *
 * Antes cada ruta escribia su `generateMetadata` a mano y todas cometian el
 * mismo error sin saberlo: declaraban `title` y `alternates` y heredaban el
 * `openGraph` y el `twitter` del layout **enteros**. Next no mezcla esos dos
 * objetos campo por campo —si la pagina no los declara, se quedan los del
 * padre tal cual— asi que `/es/docs/kiosk` salia con `og:title` de la home.
 * Pegar un enlace del kiosco en Slack mostraba la tarjeta de la portada.
 *
 * Aca se declara TODO lo que una pagina necesita, y las rutas solo aportan lo
 * que cambia: idioma, ruta, titulo y descripcion.
 *
 * ## La imagen de la tarjeta se declara aca, y no solo en `opengraph-image.js`
 *
 * El archivo `[lang]/opengraph-image.js` genera la imagen, y Next la mete en
 * `og:image` solo... pero unicamente en el nivel donde vive el archivo (la
 * home). Una pagina hija que declara su propio `openGraph` —y todas lo hacen,
 * ver arriba— pierde la imagen heredada. Se declara entonces la URL de esa
 * misma imagen, sin el hash de cache que Next le agrega: el archivo se sirve
 * igual sin el.
 *
 * ## `x-default`
 *
 * Ademas de `es` y `en`, cada pagina declara un `x-default` que apunta al
 * español. Es lo que le dice a un buscador que mostrar a quien no calza en
 * ninguno de los dos idiomas: sin el, elige solo, y a veces elige mal. Va al
 * español y no a `/` porque `/` es un redirect y un redirect no se indexa.
 *
 * @param {object} opts
 * @param {string} opts.lang        idioma de la pagina
 * @param {string} opts.path        ruta SIN el idioma: "", "/docs", "/docs/kiosk"
 * @param {string} [opts.title]     titulo de la pagina; sin el, sale el de la home
 * @param {string} opts.description
 * @param {"website"|"article"} [opts.type]
 * @param {string} [opts.modified]  fecha ISO de ultima modificacion, solo para article
 */
export function page_metadata({
  lang,
  path = "",
  title,
  description,
  type = "website",
  modified,
}) {
  const languages = hreflang_of(path);
  const url = `${site_config.domain}/${lang}${path}`;
  const images = [
    {
      url: `/${lang}/opengraph-image`,
      width: 1200,
      height: 630,
      alt: site_config.product,
    },
  ];

  return {
    // La home NO declara `title`: usa el `default` del layout, que ya lleva la
    // marca. Las demas pasan por la plantilla `%s — Censuma`.
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: `/${lang}${path}`,
      languages,
    },
    openGraph: {
      // El `title` de Open Graph NO pasa por la plantilla del `<title>`: se le
      // pone la marca aca. Sin esto, la tarjeta de una doc decia solo
      // "Aplicar la encuesta: el kiosco", sin decir de que producto.
      title: title ? branded_title(title) : undefined,
      description,
      url,
      siteName: site_config.product,
      locale: og_locale(lang),
      alternateLocale: LOCALES.filter((other) => other !== lang).map(og_locale),
      type,
      images,
      ...(type === "article" && modified ? { modifiedTime: modified } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ? branded_title(title) : undefined,
      description,
      images,
    },
  };
}

/** "Aplicar la encuesta: el kiosco" -> "Aplicar la encuesta: el kiosco — Censuma" */
export function branded_title(title) {
  return `${title} — ${site_config.product}`;
}

/**
 * Las URLs de una misma pagina en cada idioma, mas el `x-default`.
 *
 * Los slugs son los mismos en los dos idiomas (van en ingles), asi que no
 * hace falta una tabla de traduccion de rutas: la ruta es la misma y cambia
 * solo el segmento de idioma. Lo consume tambien `sitemap.js`, con URLs
 * absolutas — por eso recibe una `base` opcional.
 */
export function hreflang_of(path = "", base = "") {
  return {
    ...Object.fromEntries(
      LOCALES.map((locale) => [locale, `${base}/${locale}${path}`]),
    ),
    "x-default": `${base}/${DEFAULT_LOCALE}${path}`,
  };
}

/**
 * El `og:locale` en el formato que espera Open Graph: idioma_TERRITORIO.
 *
 * `es` a secas lo aceptan pocos consumidores. `es_LA` es "español de
 * Latinoamerica" en la tabla de Facebook, y es el que corresponde: el sitio
 * habla de vos.
 */
export function og_locale(lang) {
  return { es: "es_LA", en: "en_US" }[lang] ?? lang;
}
