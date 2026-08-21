const es = {
  meta_title: "Knotfix Clima — Evaluación de clima laboral por segmento",
  meta_description:
    "Medí el clima y la satisfacción laboral por segmento, no por promedio. Cruzá filtros y compará resultados entre áreas y en el tiempo.",

  // Navegación
  nav_links: [
    { label: "Cómo funciona", href: "#how" },
    { label: "Análisis", href: "#weights" },
    { label: "Preguntas", href: "#faq" },
  ],
  nav_cta: "Empezar",
  // Va SUELTA y no dentro de `nav_links`: los items de esa lista son anclas de
  // la home y `NavLinks` les saca el id cortando el "#". Ver `navbar.jsx`.
  nav_docs: "Documentación",

  // Hero
  hero_title: "Equipos comprometidos alcanzan siempre resultados extraordinarios",
  // El titular partido en piezas, para poder apagar una palabra y meter las
  // fichas en medio. Seis palabras y UNA sola gris. `hero_title` se conserva
  // porque es la version plana que usan los metadatos.
  hero_title_segments: [
    { text: "Equipos" },
    { face: true },
    { text: "comprometidos" },
    { text: "alcanzan" },
    { text: "siempre", tone: "muted" },
    { text: "resultados" },
    { weather: true },
    { text: "extraordinarios", tone: "muted" },
  ],
  hero_subtitle: "Medí el clima y satisfacción laboral por segmento.",
  hero_cta_primary: "Empezar gratis",
  hero_cta_secondary: "Ver cómo funciona",

  // Video del hero. `hero_video_title` es el title del iframe: no se ve en
  // pantalla, pero es lo que anuncia el lector de pantalla al entrar.
  hero_video_title: "Knotfix Clima en dos minutos",
  hero_video_play: "Reproducir el video de presentación",

  // Alcance: texto a la izquierda, planeta a la derecha.
  // El titular va partido en piezas para poder incrustar la palabra que rota,
  // igual que `hero_title_segments` con las fichas del hero.
  world_title_segments: [
    { text: "Cualquier" },
    { rotating: true },
    { text: "del" },
    { text: "mundo" },
    { text: "en" },
    { text: "un" },
    { text: "mismo" },
    { text: "sistema" },
  ],
  world_rotating_words: ["organización", "empresa", "negocio"],

  // Por qué los números significan algo: escala, modelo y desglose
  measurement_title_segments: [
    { text: "Una" },
    { text: "medición,", tone: "brand" },
    { text: "no" },
    { text: "una" },
    { text: "encuesta" },
  ],
  measurement_body:
    "La mayoría de las encuestas de clima y satisfacción laboral terminan en un archivo que no se puede comparar con nada. Acá cada respuesta suma a un número, y ese número se sostiene sobre un modelo.",
  // Mismo criterio que `problem_items`: el título dice el dato —cuántas
  // opciones, cuántos modelos, de dónde salen los gráficos— y no lo insinúa.
  // "Listo para presentar" y "Un modelo detrás" se cambiaron por eso: sonaban a
  // promesa de folleto y había que leer el cuerpo entero para saber de qué
  // hablaban.
  //
  // **El cuerpo entra en tres renglones y eso es un límite, no un estilo.** En
  // el riel clavado las fichas van centradas (`items-center`), así que no se
  // igualan de alto: una con un renglón de más sobresale arriba y abajo de sus
  // vecinas. A 320px de ancho y 16px de cuerpo son ~88 caracteres.
  //
  // **Son TRES y no cuatro.** Se retiró "El resultado se guarda por segmento":
  // el desglose por segmento es lo que dice la sección entera —el titular, la
  // bajada, los pesos y filtros que vienen después— y como ficha suelta repetía
  // sin agregar. Al sacarla también sale su icono de `ITEM_ICONS`, que va por
  // posición.
  measurement_items: [
    {
      title: "Escala de cuatro, sin punto medio",
      body: "No hay “ni de acuerdo ni en desacuerdo” donde esconderse: cada persona se define.",
    },
    {
      title: "Varios modelos, uno por dimensión",
      body: "No hay un solo modelo: hay varios, y cada uno da un peso numérico para comparar.",
    },
    {
      title: "Los gráficos salen listos del sistema",
      body: "Con el desglose que elegiste. Nada que rehacer en Excel antes de la reunión.",
    },
  ],

  // La última ficha del carrusel: capturas del producto pasando.
  // **Los archivos de `/shots/` son de relleno** y están para que el bloque
  // tenga medidas y ritmo reales. Hoy son fotos de Unsplash, para ver cómo se
  // comporta el bloque con imágenes de verdad en vez de los SVG dibujados.
  // Se reemplazan por capturas del producto dejando las mismas llaves; el `alt`
  // describe lo que se ve —hoy la foto, mañana la captura—, porque es lo único
  // que le llega a quien no puede ver la imagen.
  measurement_shots_title: "El resultado, por dentro",
  measurement_shots: [
    {
      src: "/shots/unsplash_segments.jpg",
      alt: "Pantalla con varios gráficos de resultados abiertos a la vez",
    },
    {
      src: "/shots/unsplash_compare.jpg",
      alt: "Un tablero de resultados abierto en una notebook",
    },
    {
      src: "/shots/unsplash_team.jpg",
      alt: "Un equipo reunido mirando una presentación de resultados",
    },
  ],

  // Sección 2 — el problema.
  // **Es una pregunta, no una afirmación.** Afirmando —"Se hizo la encuesta. El
  // clima sigue igual."— el lector tenía que reconocerse en una frase ajena y
  // deducir que hablaba de él. Preguntándole directo no hay nada que deducir: o
  // le pasa o no le pasa.
  // Va corto igual: entra palabra por palabra con `BlurText` y una frase larga
  // tarda demasiado en terminar de armarse. Nombra el sujeto —"tu clima
  // laboral"— porque sin él la pregunta no dice qué era lo que iba a cambiar.
  //
  // Partido en piezas como `hero_title_segments`, para poder pintar el remate.
  // `tone: "brand"` es el acento, y va SOLO ahí: son las dos palabras que
  // resumen la sección entera.
  problem_title_segments: [
    { text: "¿Hiciste" },
    { text: "la" },
    { text: "encuesta" },
    { text: "y" },
    { text: "tu" },
    { text: "clima" },
    { text: "laboral" },
    { text: "sigue", tone: "brand" },
    { text: "igual?", tone: "brand" },
  ],
  // **El título afirma; el cuerpo da el detalle.** Cada uno nombra UNA falla
  // concreta —el promedio, el formato que cambia, la demora— y se entiende solo,
  // sin leer lo de abajo. Nada de frases que dan vueltas antes de decir qué pasa.
  //
  // El cuerpo va a una sola idea y a un renglón o dos. Se probó con tres y no se
  // leen: es una pila que pasa con el scroll, no una página de documentación.
  //
  // Va en segunda persona y en voseo, como el resto del sitio: el problema es
  // del que lee, no de una empresa abstracta.
  problem_items: [
    {
      title: "El promedio tapa al área hundida",
      body: "El resultado sale bien pero el equipo se está cayendo. Te enterás cuando ya renunciaron.",
    },
    {
      title: "Si cambia el formato, no hay con qué comparar",
      body: "Hacés preguntas diferentes cada año y después no podés comparar los resultados.",
    },
    {
      title: "El informe llega semanas tarde",
      body: "Las tablas se arman a mano. Cuando está listo, el problema ya es otro.",
    },
  ],

  // Sección 3 — cómo funciona
  // **Son CUATRO pasos y antes eran tres.** Faltaba el primero: armar la
  // organización. El paso de la nómina daba a entender que el árbol salía del
  // CSV, y es al revés — armás el árbol y el sistema te devuelve la plantilla
  // para completar. Con el paso puesto, el titular tampoco puede decir que el
  // primero lo hace el sistema: ahora nombra el recorrido de punta a punta.
  how_title_segments: [
    { text: "Cuatro" },
    { text: "pasos," },
    { text: "del" },
    { text: "organigrama" },
    { text: "al", tone: "brand" },
    { text: "resultado", tone: "brand" },
  ],
  how_steps: [
    {
      step_title: "Creá tu organización",
      step_body:
        "Armás el árbol de tu empresa: sucursales, departamentos y áreas, como estén hoy.",
    },
    {
      step_title: "Subí tu nómina",
      step_body:
        "El sistema te da la plantilla del árbol que armaste. La completás con tu gente y la subís.",
    },
    {
      step_title: "Lanzá el estudio",
      step_body:
        "Elegís si medir a un departamento o a toda la empresa. Cada boleta se compone sola: las preguntas del modelo más tus preguntas personalizadas.",
    },
    {
      step_title: "Leé los resultados",
      step_body:
        "Llegan desglosados por segmento. Comparás áreas y ves dónde actuar, no solo cuánto dio en general.",
    },
  ],

  // Sección 4 — cruce de filtros y comparación (la diferenciadora)
  //
  // > **Se retiró el punto de la ponderación por pesos**, y con él su maqueta.
  // > La llave y el `id` de la sección siguen diciendo `weights` porque son la
  // > dirección de un ancla del menú: renombrarlos rompe `#weights` sin cambiar
  // > nada de lo que se ve. El TITULAR sí se cambió: anunciaba "Ponderá lo que
  // > importa" y abajo ya no había con qué cumplirlo.
  weights_title: "Cruzá filtros. Compará lo que importa.",
  weights_body:
    "El análisis no es un promedio más grande. Es poder hacerle preguntas específicas a los datos y que respondan.",
  // Los títulos dicen qué hacés y los cuerpos qué ganás. Antes los cuerpos
  // describían el mecanismo —"asignás pesos y comparás"— y había que deducir
  // solo para qué servía.
  weights_points: [
    {
      title: "Uní filtros entre sí",
      body: "Región Norte, turno noche y más de cinco años, todo junto. Dejás de discutir promedios y ves el grupo exacto que te preocupa.",
    },
    {
      title: "Compará poblaciones equivalentes",
      body: "Un área contra otra, o contra su propio pasado. Nadie va a poder decirte que la comparación no era válida.",
    },
    {
      title: "Sabé cuándo no alcanza",
      body: "Si un cruce se queda con pocas respuestas, el sistema lo avisa. No decidís sobre un número que no se sostiene.",
    },
  ],

  // Una maqueta del sistema por punto, en el mismo orden que `weights_points`.
  // Cada una muestra al producto haciendo lo que su punto promete.
  //
  // **Los números son parte del contenido**: en español el decimal es coma y en
  // inglés punto, así que no pueden vivir en el componente. De dividirlos por
  // `scale_max` sale el largo de cada barra.
  weights_shots: {
    scale_max: "4",
    cross: {
      a11y: "Maqueta del sistema: tres filtros cruzados y el resultado de ese grupo",
      title: "Resultado del cruce",
      chips: ["Región Norte", "Turno noche", "Antigüedad > 5 años"],
      count: "214",
      count_label: "respuestas en este cruce",
      bars: [
        { label: "Este cruce", value: "3,4" },
        { label: "General de la empresa", value: "2,9" },
      ],
    },
    compare: {
      a11y: "Maqueta del sistema: dos regiones comparadas en el mismo período",
      title: "Norte contra Sur",
      bars: [
        { label: "Región Norte", value: "3,4" },
        { label: "Región Sur", value: "2,8" },
      ],
      footnote:
        "Mismo período, mismo núcleo de preguntas y la misma escala. Por eso los dos números se pueden poner en la misma línea.",
    },
    threshold: {
      a11y: "Maqueta del sistema: un cruce con muy pocas respuestas, sin resultado",
      title: "Cruce sin muestra suficiente",
      chips: ["Turno noche", "Sede 3"],
      count: "6",
      count_label: "respuestas en este cruce",
      result_label: "Resultado",
      notice:
        "Por debajo del mínimo que definiste. El sistema no muestra este segmento, en vez de darte un número que no se sostiene.",
    },
  },

  // Sección 5 — escala
  scale_title_segments: [
    { text: "De" },
    { text: "20" },
    { text: "empleados" },
    { text: "a" },
    { text: "50.000," },
    { text: "en" },
    { text: "el", tone: "brand" },
    { text: "mismo", tone: "brand" },
    { text: "sistema", tone: "brand" },
  ],
  // El punto es la adaptabilidad, no el arbol. La version anterior explicaba la
  // estructura de datos —"se declara como un arbol", "un arbol de un nivel"— y
  // eso es como lo hacemos, no que gana quien lee. Los cuatro organigramas de
  // abajo ya muestran el arbol; el texto tiene que decir de que sirve.
  scale_body:
    "No te adaptás a nuestro sistema: el sistema se adapta a tu empresa. Empresa, sucursales, departamentos y áreas, como estén armados hoy. Si mañana abrís una sucursal, la agregás y el historial de lo que ya medías queda intacto.",
  // Cuatro organizaciones, de la más chica a la más grande. El organigrama de
  // cada una se dibuja desde `tree`: un nodo con hijos, recursivo.
  scale_orgs: [
    {
      label: "Una empresa sola",
      size: "20 personas",
      tree: {
        label: "Empresa",
        children: [
          { label: "Producción" },
          { label: "Ventas" },
          { label: "Administración" },
        ],
      },
    },
    {
      label: "Con sucursales",
      size: "300 personas",
      tree: {
        label: "Empresa",
        children: [
          {
            label: "Sucursal Centro",
            children: [{ label: "Operaciones" }, { label: "Ventas" }],
          },
          {
            label: "Sucursal Norte",
            children: [{ label: "Operaciones" }, { label: "Ventas" }],
          },
        ],
      },
    },
    {
      label: "Un grupo de empresas",
      size: "4.000 personas",
      tree: {
        label: "Grupo",
        children: [
          {
            label: "Empresa A",
            children: [{ label: "Planta 1" }, { label: "Planta 2" }],
          },
          { label: "Empresa B", children: [{ label: "Planta 3" }] },
        ],
      },
    },
    {
      label: "Un grupo en varios países",
      size: "50.000 personas",
      tree: {
        label: "Grupo",
        children: [
          {
            label: "Región Norte",
            children: [
              {
                label: "Empresa A",
                children: [{ label: "Planta 1" }, { label: "Planta 2" }],
              },
            ],
          },
          {
            label: "Región Sur",
            children: [
              { label: "Empresa B", children: [{ label: "Planta 3" }] },
            ],
          },
        ],
      },
    },
  ],

  // Sección 6 — preguntas frecuentes
  // > **Acá vivía la sección de confidencialidad.** Se retiró como sección
  // > propia, pero el argumento NO se perdió: era la objeción más grande que
  // > tiene una encuesta de clima, así que entró como la primera pregunta del
  // > FAQ —que es donde alguien la busca— junto con el umbral mínimo, que era
  // > su segundo punto.
  //
  // **Ninguna respuesta afirma nada que el sitio no diga ya en otra parte.** Se
  // venden solas por autoservicio: acá no hay nadie del otro lado para aclarar
  // una promesa de más. Precio, duración de la prueba y plazos concretos quedan
  // afuera a propósito, porque no están en el producto documentado.
  faq_title_segments: [
    { text: "Antes" },
    { text: "de" },
    { text: "empezar," },
    { text: "lo", tone: "brand" },
    { text: "que", tone: "brand" },
    { text: "todos", tone: "brand" },
    { text: "preguntan", tone: "brand" },
  ],
  faq_body:
    "Las dudas que aparecen antes de lanzar el primer estudio, respondidas sin vueltas.",
  faq_items: [
    {
      question: "¿Alguien puede saber qué respondí?",
      answer:
        "No. Las respuestas se desligan de la identidad: el token es por segmento, nunca por nombre. La gente responde con honestidad solo cuando sabe que no la pueden identificar, y eso no es una promesa: es cómo está construido el sistema.",
    },
    {
      question: "¿Y si mi equipo es muy chico?",
      answer:
        "Ningún segmento muestra resultados por debajo del mínimo de respuestas que definas. Ese mínimo también se aplica al cruzar filtros, que es justo donde los grupos se achican sin que nadie lo note.",
    },
    {
      question: "¿Qué preguntas incluye?",
      answer:
        "Un núcleo universal que responden todos igual, más las preguntas que agregues pegadas a una rama de tu organización. La escala es de cuatro opciones y no tiene punto medio: cada persona se define.",
    },
    {
      question: "¿Puedo comparar contra la medición anterior?",
      answer:
        "Sí, mientras el núcleo de preguntas y la escala sean los mismos. Por eso el núcleo no cambia entre estudios: es lo que hace que dos resultados se puedan poner en la misma línea.",
    },
    {
      question: "¿Cuánto lleva ponerlo en marcha?",
      answer:
        "El sistema te da una plantilla del árbol de tu empresa. Completás la nómina y la subís en la sección de nómina. Después elegís a quién medir y lanzás el estudio. No hay proyecto de implementación.",
    },
    {
      question: "¿Tengo que hablar con alguien para probarlo?",
      answer: "No. Creás la cuenta y empezás.",
    },
  ],

  // Sección 7 — CTA final
  final_cta_title_segments: [
    { text: "Lanzá" },
    { text: "tu" },
    { text: "primer" },
    { text: "estudio" },
    { text: "esta", tone: "brand" },
    { text: "semana", tone: "brand" },
  ],
  final_cta_body: "Creá tu cuenta, subí la nómina y medí.",
  final_cta_button: "Empezar gratis",

  // Documentación. Acá va SOLO el chrome: los títulos y la prosa de cada
  // página viven en `src/content/docs/**.mdx` y en `docs/nav.js`. Meter texto
  // largo en el diccionario lo vuelve inmanejable a la décima página.
  docs_index_title: "Documentación",
  docs_index_body:
    "Cómo funciona Clima por dentro: los conceptos que hay que tener claros para leer un resultado, y las guías de cada módulo.",
  docs_all_pages: "Todas las páginas",
  docs_on_this_page: "En esta página",
  docs_prev: "Anterior",
  docs_next: "Siguiente",

  // Footer
  footer_tagline: "Evaluación de clima y satisfacción laboral.",
  footer_rights: "Todos los derechos reservados.",

  // Legales. Acá va SOLO el chrome, igual que en docs: el texto de cada
  // documento vive en `src/content/legal/**.mdx`, y su título, versión y fecha
  // en `legal/nav.js` — que es de donde los lee también el registro de
  // aceptación del producto.
  // Novedades. La prosa de cada entrada vive en `src/content/changelog/es/*.mdx`
  // —una por fecha—; acá va solo el encabezado de la página y el enlace que la
  // ofrece desde el índice de la documentación.
  changelog_title: "Novedades",
  changelog_body:
    "Qué cambió en Clima y cuándo. Lo más nuevo arriba; las entradas viejas no se corrigen.",
  changelog_hint: "¿Buscás qué cambió y cuándo?",

  legal_version: "Versión",
  legal_updated: "Actualizado el",
  legal_draft_title: "Borrador sin revisión legal",
  legal_draft_body:
    "Este documento todavía no fue revisado por un abogado y no rige. Está publicado para poder trabajarlo, no para ser invocado.",

  // Accesibilidad
  a11y_toggle_theme: "Cambiar tema",
  a11y_open_menu: "Abrir menú",
  a11y_close_menu: "Cerrar menú",
  a11y_switch_lang: "Cambiar idioma",
  a11y_main_nav: "Navegación principal",
  a11y_mobile_nav: "Navegación del menú",
  a11y_legal_nav: "Documentos legales",
  // Tres nombres distintos y no uno repetido: en las docs conviven el árbol
  // lateral, su copia plegada de móvil y el índice de la página. Con el mismo
  // nombre accesible, un lector de pantalla lista landmarks indistinguibles.
  a11y_docs_nav: "Páginas de la documentación",
  a11y_docs_nav_mobile: "Páginas de la documentación (plegado)",
  a11y_docs_toc: "Secciones de esta página",
  // El riel de la medición solo recibe el foco cuando NO está clavado: ahí se
  // recorre a mano y sin esto no hay forma de moverlo con el teclado.
  a11y_measurement_rail: "Fichas de la medición: se recorren de lado",
  // Las maquetas del análisis llevan su propio `a11y` adentro de
  // `weights_shots`: son cuatro y cada una describe algo distinto, así que el
  // texto vive pegado al contenido que describe y no acá suelto.
  a11y_mood_face: "Cara que cambia entre contenta, seria y triste",
  a11y_weather_tile: "Clima que cambia entre soleado, nublado y lluvioso",
  a11y_skip_to_content: "Saltar al contenido",
};

export default es;
