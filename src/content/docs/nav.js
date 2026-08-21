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
 */
export const DOCS_NAV = [
  {
    // **Empezar va antes que Conceptos y Conceptos antes que Guias.** No es
    // alfabetico ni por importancia: es el recorrido. Poner las guias de clic
    // primero es el error clasico de un sitio de docs — la persona hace los
    // clics, no entiende el resultado, y escribe al formulario de soporte.
    title: { es: "Empezar", en: "Getting started" },
    items: [
      {
        slug: "what-is-clima",
        title: { es: "Qué es Clima", en: "What Clima is" },
      },
      {
        slug: "first-study",
        title: {
          es: "Tu primer estudio",
          en: "Your first study",
        },
      },
      {
        slug: "kiosk",
        title: {
          es: "Aplicar la encuesta: el kiosco",
          en: "Running the survey: the kiosk",
        },
      },
      {
        slug: "roles",
        title: { es: "Roles y permisos", en: "Roles and permissions" },
      },
    ],
  },
  {
    title: { es: "Conceptos", en: "Concepts" },
    items: [
      {
        slug: "org-tree",
        title: { es: "El árbol organizacional", en: "The org tree" },
      },
      {
        slug: "questionnaires",
        title: {
          es: "Boletas y herencia",
          en: "Questionnaires and inheritance",
        },
      },
      {
        slug: "models",
        title: { es: "Modelos teóricos", en: "Theoretical models" },
      },
      {
        slug: "study-lifecycle",
        title: { es: "Los estados de un estudio", en: "A study's states" },
      },
      {
        slug: "indices",
        title: { es: "Satisfacción y Clima", en: "Satisfaction and Climate" },
      },
      {
        slug: "anonymity",
        title: { es: "Anonimato y N mínimo", en: "Anonymity and minimum N" },
      },
      {
        slug: "targets",
        title: { es: "Metas de mejora", en: "Improvement targets" },
      },
    ],
  },
  {
    title: { es: "Interpretar", en: "Interpreting" },
    items: [
      {
        slug: "reading-results",
        title: { es: "Cómo leer un resultado", en: "Reading a result" },
      },
      {
        slug: "segments",
        title: { es: "Segmentos", en: "Segments" },
      },
      {
        slug: "history",
        title: { es: "La serie histórica", en: "The historical series" },
      },
    ],
  },
  {
    // Material que el CLIENTE le reenvia a SUS empleados, no documentacion
    // del producto. Va en el sitio igual porque es lo que un comprador lee
    // antes de comprar: le resuelve el problema que viene despues de la compra.
    title: { es: "Para tu gente", en: "For your people" },
    items: [
      {
        slug: "announcing",
        title: { es: "Cómo comunicar la encuesta", en: "Announcing the survey" },
      },
      {
        slug: "employee-anonymity",
        title: {
          es: "Qué decirles sobre el anonimato",
          en: "What to tell them about anonymity",
        },
      },
    ],
  },
  {
    // Administracion, no producto. Va casi al final porque nadie la lee para
    // aprender a usar Clima — se llega cuando hay que contratar, cuando un tope
    // frena algo, o cuando el area de compras pregunta.
    title: { es: "Cuenta", en: "Account" },
    items: [
      {
        slug: "account-and-plan",
        title: { es: "Cuenta y plan", en: "Account and plan" },
      },
      {
        // **Estaba escrita en los dos idiomas y NO estaba en esta lista**, o
        // sea que `is_doc_slug` la rechazaba y la ruta devolvia 404. La
        // encontro `test/content_parity.test.js`, que justamente busca .mdx
        // huerfanos: es el fallo silencioso de este manifiesto — lo que no se
        // anota no existe, y nadie se entera.
        //
        // Va en "Cuenta" y no en "Conceptos" porque no se lee para aprender a
        // usar Clima: la lee el area de seguridad, de TI o de legal que tiene
        // que aprobar la herramienta, que es el mismo momento en que se lee
        // "Cuenta y plan". Si el criterio editorial es otro, se mueve.
        slug: "security-and-data",
        title: { es: "Seguridad y datos", en: "Security and data" },
      },
    ],
  },
  {
    // No se LEE, se CONSULTA. Por eso va ultima: nadie la recorre de arriba
    // abajo, se llega por busqueda o por un enlace de otra pagina.
    title: { es: "Referencia", en: "Reference" },
    items: [
      {
        slug: "glossary",
        title: { es: "Glosario", en: "Glossary" },
      },
      {
        slug: "roster-format",
        title: { es: "El Excel de la nómina", en: "The roster spreadsheet" },
      },
      {
        slug: "question-types",
        title: { es: "Tipos de pregunta", en: "Question types" },
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
    group.items.map((entry) => ({ ...entry, group_title: group.title })),
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
