import { site_config } from "@/lib/site_config";

/**
 * Los datos estructurados (schema.org) del sitio, como objetos planos.
 *
 * Son lo que un buscador lee para saber QUE es cada pagina sin adivinarlo
 * por el HTML: que hay una organizacion detras, que el bloque de preguntas es
 * una FAQ, que una doc es un articulo dentro de una seccion, y por donde se
 * llega a ella. Cada funcion devuelve un objeto y `<JsonLd>` lo serializa.
 *
 * **Un tipo se declara COMPLETO o no se declara.** Google publica, por tipo,
 * que campos exige, y a un tipo al que le falta uno lo marca como elemento
 * invalido en Search Console en vez de ignorarlo. Por eso de aca se retiro el
 * `SoftwareApplication` (ver mas abajo): declarar de menos no es declarar a
 * medias, es declarar un error.
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

/*
 * ## Aca vivia `software_ld()`, un `SoftwareApplication` para la home
 *
 * Se retiro el 2026-09-17. Declaraba el producto como software, sin `offers`
 * ni `aggregateRating`, porque el sitio no publica precios (decision del
 * 2026-09-13, ver `site_config.register_url`) y no hay resenas publicas que
 * citar.
 *
 * **El problema es que esos dos campos son OBLIGATORIOS para Google.** La
 * unica funcion de busqueda que consume ese tipo es la ficha de app con
 * estrellas y precio; sin los dos datos, la ficha no puede salir Y ADEMAS
 * Search Console marca las dos homes como elemento invalido. Un bloque que no
 * habilita nada a cambio de dos errores criticos permanentes es una perdida
 * neta, y peor: un tablero con rojos que se aprendio a ignorar deja de avisar
 * el dia que hay un rojo de verdad.
 *
 * Lo que quedo en su lugar es `Organization`, que sigue diciendo que detras
 * del sitio hay un producto llamado Censuma de una empresa llamada Knotfix.
 * Si algun dia el sitio publica precios, este bloque vuelve COMPLETO o no
 * vuelve.
 */

/**
 * Las preguntas de la home, tal cual se ven: `dict.faq_items`.
 *
 * Ya no gana resultado enriquecido: Google limito la ficha de FAQ a sitios de
 * gobierno y salud en agosto de 2023 y la retiro del todo en mayo de 2026. Se
 * queda porque es VALIDA, no genera un solo aviso, y sigue diciendo que este
 * bloque de texto es un par pregunta/respuesta, que es lo que leen los
 * rastreadores que no son Google. El dia que estorbe, se saca sin drama.
 */
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
 *
 * **Un escalon intermedio sin `path` revienta el build a proposito.** Para
 * Google `item` es obligatorio en todos menos en el ultimo, y un `ListItem`
 * sin el invalida la miga ENTERA. Fue el error que Search Console reporto el
 * 2026-09-17 sobre las cuarenta y dos paginas de documentacion, y el modo de
 * fallo es el peor que hay: el sitio se ve perfecto, nadie lo nota, y se
 * entera uno cuatro semanas despues por un correo de Google. Un `throw` al
 * compilar cuesta un minuto; ese silencio costo un mes de rastreo.
 */
export function breadcrumb_ld(lang, crumbs) {
  crumbs.forEach((crumb, index) => {
    const last = index === crumbs.length - 1;
    if (!last && (crumb.path === null || crumb.path === undefined)) {
      throw new Error(
        `breadcrumb_ld: el escalon ${index + 1} ("${crumb.name}") no es el ` +
          `ultimo y va sin \`path\`. Google exige \`item\` ahi.`,
      );
    }
  });

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

/**
 * Una pagina de la documentacion: un articulo tecnico, con su seccion.
 *
 * `Article` no tiene campos obligatorios para Google, pero si cuatro
 * recomendados (`author`, `image`, `datePublished` y `dateModified`) y
 * Search Console los reporta uno por uno como aviso hasta que estan. Las fechas
 * llegan desde `DOCS_NAV` (`entry.published` / `entry.updated`), que es el
 * unico lugar donde existen; `dates` puede venir vacio y entonces los dos
 * campos se omiten, porque una fecha inventada es peor que ninguna.
 *
 * El autor es la ORGANIZACION y no una persona: la doc no la firma nadie, y
 * declarar un autor humano que no aparece en la pagina es justo el tipo de
 * dato que Google contrasta con lo visible.
 *
 * La `image` es la misma tarjeta del Open Graph. No es una ilustracion del
 * articulo, porque no hay una por doc, pero si es la imagen que representa a
 * la pagina en cualquier superficie que la muestre, que es para lo que Google
 * pide el campo.
 */
export function doc_article_ld(lang, path, meta, dates = {}) {
  return {
    "@type": "TechArticle",
    headline: meta.title,
    description: meta.description,
    url: `${site_config.domain}/${lang}${path}`,
    inLanguage: lang,
    image: `${site_config.domain}/${lang}/opengraph-image`,
    author: { "@id": ORG_ID },
    ...(dates.published ? { datePublished: dates.published } : {}),
    ...(dates.updated ? { dateModified: dates.updated } : {}),
    isPartOf: { "@id": `${SITE_ID}-${lang}` },
    publisher: { "@id": ORG_ID },
    // Apuntaba al `SoftwareApplication` hasta que ese bloque se retiro (ver
    // arriba). La organizacion se llama `Censuma` (su `name` es el producto),
    // asi que «este articulo trata sobre Censuma» sigue siendo cierto, y
    // ahora apunta a un nodo que existe de verdad en el grafo.
    about: { "@id": ORG_ID },
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
