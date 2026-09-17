/**
 * El arbol de la documentacion. FUENTE UNICA del orden.
 *
 * De aca salen tres cosas y por eso no puede haber una segunda lista: el
 * sidebar, el `generateStaticParams` de la ruta catch-all, y el anterior/
 * siguiente del pie de cada pagina.
 *
 * **Un .mdx que no esta aca no existe**: no se rutea (con `dynamicParams =
 * false` responde 404) y no se linkea desde ningun lado. Es a proposito —
 * el orden de lectura es una decision, no el resultado de un `readdir`.
 *
 * **Los slugs van en INGLES en los dos idiomas.** Es la regla del proyecto
 * (la interfaz se traduce, los identificadores no) y ademas es lo que deja
 * funcionar a `swap_locale_in_path` sin tocarlo: /es/docs/org-tree y
 * /en/docs/org-tree son la misma ruta con otro idioma. Con slugs traducidos,
 * cambiar de idioma parado en una doc daria 404.
 *
 * El titulo vive ACA y no en el .mdx: el sidebar tiene que poder dibujar el
 * arbol entero sin abrir cuarenta archivos. El `.mdx` igual exporta su `meta`
 * para el <title> y la metadescripcion de esa pagina.
 *
 * **El `id` del grupo es una URL, no un adorno.** Es el ancla de su seccion en
 * `/docs` y el destino de ese escalon en la miga de pan de cada pagina. Para
 * Google, un `ListItem` sin `item` es error critico: lo reporto Search Console
 * el 2026-09-17 sobre «Interpretar» y «Para tu gente», que hasta entonces
 * eran escalones sin adonde apuntar. Va en ingles y no se traduce, por la
 * misma regla que los slugs: es un identificador, y ademas tiene que
 * sobrevivir al cambio de idioma parado en la misma pagina.
 *
 * **`published` y `updated` viven ACA y no en el `meta` del .mdx** por una
 * razon concreta: `sitemap.js` las necesita para el `lastmod` y no puede
 * compilar veintiun .mdx para leer dos fechas (ver el comentario de arriba de
 * ese archivo). De paso son una sola fecha por pagina y no una por idioma, que
 * es lo correcto: el español y el ingles son la MISMA pagina traducida, y
 * declarar que la version inglesa se actualizo tres dias despues seria decir
 * que son dos documentos distintos.
 *
 * Se sembraron el 2026-09-17 desde el historial de git de cada archivo
 * (primer commit y ultimo commit), y de ahi en adelante se mantienen a mano:
 * el dia que se reescribe una doc se le mueve el `updated`. Una fecha vieja es
 * peor que ninguna, asi que si se edita el contenido sin tocarla, mejor
 * borrarla. Salen en el JSON-LD (`datePublished`/`dateModified`), en el
 * `og:modified_time` y en el `lastmod` del sitemap: los tres campos con los
 * que un buscador decide cada cuanto vuelve a pasar.
 */
export const DOCS_NAV = [
  {
    // **Empezar va antes que Conceptos y Conceptos antes que Guias.** No es
    // alfabetico ni por importancia: es el recorrido. Poner las guias de clic
    // primero es el error clasico de un sitio de docs — la persona hace los
    // clics, no entiende el resultado, y escribe al formulario de soporte.
    id: "getting-started",
    title: { es: "Empezar", en: "Getting started" },
    items: [
      {
        slug: "what-is-censuma",
        title: { es: "Qué es Censuma", en: "What Censuma is" },
        published: "2026-09-11",
        updated: "2026-09-11",
      },
      {
        slug: "first-study",
        title: {
          es: "Tu primer estudio",
          en: "Your first study",
        },
        published: "2026-08-17",
        updated: "2026-09-13",
      },
      {
        slug: "kiosk",
        title: {
          es: "Aplicar la encuesta: el kiosco",
          en: "Running the survey: the kiosk",
        },
        published: "2026-08-17",
        updated: "2026-08-17",
      },
      {
        slug: "roles",
        title: { es: "Roles y permisos", en: "Roles and permissions" },
        published: "2026-08-17",
        updated: "2026-09-11",
      },
    ],
  },
  {
    id: "concepts",
    title: { es: "Conceptos", en: "Concepts" },
    items: [
      {
        slug: "org-tree",
        title: { es: "El árbol organizacional", en: "The org tree" },
        published: "2026-08-17",
        updated: "2026-09-11",
      },
      {
        slug: "questionnaires",
        title: {
          es: "Boletas y herencia",
          en: "Questionnaires and inheritance",
        },
        published: "2026-08-17",
        updated: "2026-08-17",
      },
      {
        slug: "models",
        title: { es: "Modelos teóricos", en: "Theoretical models" },
        published: "2026-08-17",
        updated: "2026-08-17",
      },
      {
        slug: "study-lifecycle",
        title: { es: "Los estados de un estudio", en: "A study's states" },
        published: "2026-08-17",
        updated: "2026-08-17",
      },
      {
        slug: "indices",
        title: { es: "Satisfacción y Clima", en: "Satisfaction and Climate" },
        published: "2026-08-17",
        updated: "2026-08-17",
      },
      {
        slug: "anonymity",
        title: { es: "Anonimato y N mínimo", en: "Anonymity and minimum N" },
        published: "2026-08-17",
        updated: "2026-09-11",
      },
      {
        slug: "targets",
        title: { es: "Metas de mejora", en: "Improvement targets" },
        published: "2026-08-17",
        updated: "2026-08-17",
      },
    ],
  },
  {
    id: "interpreting",
    title: { es: "Interpretar", en: "Interpreting" },
    items: [
      {
        slug: "reading-results",
        title: { es: "Cómo leer un resultado", en: "Reading a result" },
        published: "2026-08-17",
        updated: "2026-09-13",
      },
      {
        slug: "segments",
        title: { es: "Segmentos", en: "Segments" },
        published: "2026-08-17",
        updated: "2026-08-17",
      },
      {
        slug: "history",
        title: { es: "La serie histórica", en: "The historical series" },
        published: "2026-08-17",
        updated: "2026-09-11",
      },
    ],
  },
  {
    // Material que el CLIENTE le reenvia a SUS empleados, no documentacion
    // del producto. Va en el sitio igual porque es lo que un comprador lee
    // antes de comprar: le resuelve el problema que viene despues de la compra.
    id: "for-your-people",
    title: { es: "Para tu gente", en: "For your people" },
    items: [
      {
        slug: "announcing",
        title: { es: "Cómo comunicar la encuesta", en: "Announcing the survey" },
        published: "2026-08-17",
        updated: "2026-08-17",
      },
      {
        slug: "employee-anonymity",
        title: {
          es: "Qué decirles sobre el anonimato",
          en: "What to tell them about anonymity",
        },
        published: "2026-08-17",
        updated: "2026-08-17",
      },
    ],
  },
  {
    // Administracion, no producto. Va casi al final porque nadie la lee para
    // aprender a usar Censuma — se llega cuando hay que contratar, cuando un tope
    // frena algo, o cuando el area de compras pregunta.
    id: "account",
    title: { es: "Cuenta", en: "Account" },
    items: [
      {
        slug: "account-and-plan",
        title: { es: "Cuenta y plan", en: "Account and plan" },
        published: "2026-08-17",
        updated: "2026-09-17",
      },
      {
        // La pagina de CONFIANZA: no la lee el usuario del producto sino el
        // area de seguridad, TI o legal que tiene que aprobar la herramienta
        // antes de que la compren. Por eso va en "Cuenta" y no en "Conceptos":
        // se lee en el mismo momento que "Cuenta y plan", no para aprender a
        // usar Censuma.
        //
        // Estuvo escrita en los dos idiomas y FUERA de esta lista hasta el
        // 2026-08-18, sin rutear (`dynamicParams = false` responde 404) y sin
        // enlazar, porque le faltaba "Continuidad y respaldos", y una pagina de
        // seguridad sin respuesta sobre respaldos es la que no conviene
        // publicar a medias. Ese es el fallo silencioso de este manifiesto: lo
        // que no se anota no existe y nadie se entera. Hoy esa clase de huerfano
        // la caza `test/content_parity.test.js`.
        slug: "security-and-data",
        title: { es: "Seguridad y datos", en: "Security and data" },
        // El archivo es del 17, pero la pagina no existio hasta el 18: es el
        // dia que entro a esta lista y empezo a rutear. Eso es `published`.
        published: "2026-08-18",
        updated: "2026-09-17",
      },
    ],
  },
  {
    // No se LEE, se CONSULTA. Por eso va ultima: nadie la recorre de arriba
    // abajo, se llega por busqueda o por un enlace de otra pagina.
    id: "reference",
    title: { es: "Referencia", en: "Reference" },
    items: [
      {
        slug: "glossary",
        title: { es: "Glosario", en: "Glossary" },
        published: "2026-08-17",
        updated: "2026-09-13",
      },
      {
        slug: "roster-format",
        title: { es: "El Excel de la nómina", en: "The roster spreadsheet" },
        published: "2026-08-17",
        updated: "2026-09-13",
      },
      {
        slug: "question-types",
        title: { es: "Tipos de pregunta", en: "Question types" },
        published: "2026-08-17",
        updated: "2026-09-13",
      },
    ],
  },
];

/**
 * `DOCS_NAV` aplanado al orden de lectura: la lista con la que se arman el
 * `generateStaticParams` y los vecinos de cada pagina.
 */
export function flatten_nav() {
  return DOCS_NAV.flatMap((group) =>
    group.items.map((entry) => ({
      ...entry,
      group_title: group.title,
      group_id: group.id,
    })),
  );
}

/** Los vecinos de una pagina en el recorrido plano. `null` en las puntas. */
export function neighbours_of(slug) {
  const flat = flatten_nav();
  const index = flat.findIndex((entry) => entry.slug === slug);

  if (index === -1) return { prev_doc: null, next_doc: null };

  return {
    prev_doc: flat[index - 1] ?? null,
    next_doc: flat[index + 1] ?? null,
  };
}
