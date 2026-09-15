import { site_config } from "@/lib/site_config";

/**
 * Los datos estructurados (schema.org) del sitio, como objetos planos.
 *
 * Son lo que un buscador lee para saber QUE es cada pagina sin adivinarlo
 * por el HTML: que hay una organizacion detras, que el producto es software,
 * que el bloque de preguntas es una FAQ, que una doc es un articulo dentro de
 * una seccion. Cada funcion devuelve un objeto y `<JsonLd>` lo serializa.
 *
 * **Todo sale de los mismos diccionarios y manifiestos que dibujan la pagina.**
 * Google verifica que lo declarado este visible; una FAQ declarada con otro
 * texto que el que se ve es exactamente lo que penaliza. Por eso ninguna
 * funcion recibe texto propio: recibe `dict`, `entry` o `meta`.
 *
 * Los ids (`@id`) son URLs fijas por entidad, para que la organizacion que
 * declara la home y la que referencia una doc como `publisher` sean LA MISMA
 * y no dos organizaciones con el mismo nombre.
 */

const ORG_ID = `${site_config.domain}/#organization`;
const SITE_ID = `${site_config.domain}/#website`;
const APP_ID = `${site_config.domain}/#software`;

/** El logo tiene que ser un PNG cuadrado de 112px o mas: es el apple-icon. */
const LOGO_URL = `${site_config.domain}/apple-icon.png`;

/** Quien publica el sitio. `brand` es el titular; `product` es la marca. */
export function organization_ld() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site_config.product,
    legalName: site_config.brand,
    url: site_config.domain,
    logo: {
      "@type": "ImageObject",
      url: LOGO_URL,
      width: 180,
      height: 180,
    },
  };
}

/** El sitio, con su idioma. Una entidad por idioma, misma organizacion. */
export function website_ld(lang, dict) {
  return {
    "@type": "WebSite",
    "@id": `${SITE_ID}-${lang}`,
    url: `${site_config.domain}/${lang}`,
    name: site_config.product,
    description: dict.meta_description,
    inLanguage: lang,
    publisher: { "@id": ORG_ID },
  };
}

/**
 * El producto. `applicationCategory` y `operatingSystem` son lo minimo que
 * Google pide para entender que es software y no una empresa de servicios.
 * Sin `offers` a proposito: el sitio no publica precios (ver
 * `site_config.register_url`), y declarar un precio aca seria la tercera
 * copia que se desactualiza.
 */
export function software_ld(lang, dict) {
  return {
    "@type": "SoftwareApplication",
    "@id": APP_ID,
    name: site_config.product,
    description: dict.meta_description,
    url: `${site_config.domain}/${lang}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: lang,
    publisher: { "@id": ORG_ID },
    screenshot: `${site_config.domain}/${lang}/opengraph-image`,
  };
}

/** Las preguntas de la home, tal cual se ven: `dict.faq_items`. */
export function faq_ld(dict) {
  return {
    "@type": "FAQPage",
    mainEntity: dict.faq_items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * La miga de una pagina: Inicio > Documentacion > Grupo > Pagina. Cada
 * escalon con URL salvo el ultimo, que es la pagina en la que se esta.
 * `crumbs` es una lista de `{ name, path }`; `path` sin idioma y `null` en
 * el ultimo.
 */
export function breadcrumb_ld(lang, crumbs) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.path !== null && crumb.path !== undefined
        ? { item: `${site_config.domain}/${lang}${crumb.path}` }
        : {}),
    })),
  };
}

/** Una pagina de la documentacion: un articulo tecnico, con su seccion. */
export function doc_article_ld(lang, path, meta) {
  return {
    "@type": "TechArticle",
    headline: meta.title,
    description: meta.description,
    url: `${site_config.domain}/${lang}${path}`,
    inLanguage: lang,
    isPartOf: { "@id": `${SITE_ID}-${lang}` },
    publisher: { "@id": ORG_ID },
    about: { "@id": APP_ID },
  };
}

/** Un documento legal: pagina con version y fecha, las de `LEGAL_NAV`. */
export function legal_page_ld(lang, path, entry) {
  return {
    "@type": "WebPage",
    name: entry.title[lang],
    url: `${site_config.domain}/${lang}${path}`,
    inLanguage: lang,
    dateModified: entry.updated,
    version: entry.version,
    isPartOf: { "@id": `${SITE_ID}-${lang}` },
    publisher: { "@id": ORG_ID },
  };
}

/**
 * Envuelve varias entidades en un solo grafo. Un `<script>` por pagina con
 * todo adentro, y no uno por entidad: es lo que deja que se referencien por
 * `@id` entre si.
 */
export function graph_ld(...entities) {
  return {
    "@context": "https://schema.org",
    "@graph": entities.filter(Boolean),
  };
}
