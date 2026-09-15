const es = {
  // <title> y metadescripción de la home, y lo que muestra el buscador.
  // El título lleva «encuestas de clima laboral» porque es lo que la gente
  // escribe en el buscador; «por segmento» es lo que nos distingue. Menos de
  // 60 caracteres, para que no se corte en el resultado.
  meta_title: "Censuma — Encuestas de clima laboral por segmento",
  // La descripción se usa también como texto de la tarjeta de Open Graph
  // (`opengraph-image.js`), así que tiene que seguir cabiendo en cuatro
  // renglones a 52px.
  meta_description:
    "Medí el clima y la satisfacción laboral por segmento, no por promedio. Cruzá filtros, compará áreas y seguí la evolución estudio a estudio. Prueba gratis.",

  // Navegación
  nav_links: [
    { label: "Cómo funciona", href: "#how" },
    { label: "Análisis", href: "#weights" },
    { label: "Preguntas", href: "#faq" },
  ],
  // «Empezar gratis» y no «Empezar»: a un enlace que dice solo «Empezar» el
  // buscador lo cuenta como texto genérico (mismo cajón que «clic acá»), y
  // «gratis» es además el dato que decide el clic.
  nav_cta: "Empezar gratis",
  // Va SUELTA y no dentro de `nav_links`: los items de esa lista son anclas de
  // la home y `NavLinks` les saca el id cortando el "#". Ver `navbar.jsx`.
  nav_docs: "Documentación",
  // También SUELTA, y por lo mismo: no es un ancla, es el registro del
  // producto, que es donde se ven los planes. Ver `site_config.register_url`.
  nav_pricing: "Precios",

  // Hero
  hero_title: "El clima de tu empresa, medido por quienes lo viven",
  // El titular partido en piezas, para poder apagar palabras y meter las
  // fichas en medio. Cada ficha va pegada a lo que muestra: el clima junto a
  // "El clima" y las caras junto a "quienes lo viven". Gris solo el nexo
  // ("medido por"), que las dos mitades con peso se lean solas. `hero_title`
  // se conserva porque es la version plana que usan los metadatos.
  hero_title_segments: [
    { text: "El" },
    { text: "clima" },
    { weather: true },
    { text: "de" },
    { text: "tu" },
    { text: "empresa," },
    { text: "medido", tone: "muted" },
    { text: "por", tone: "muted" },
    { face: true },
    { text: "quienes" },
    { text: "lo" },
    { text: "viven." },
  ],
  // En piezas como el titular: `tone: "strong"` sube la palabra al color del
  // texto sobre el gris del resto. Son las dos cosas que se miden; mas palabras
  // resaltadas y el subtitulo deja de tener fondo contra el cual resaltar.
  hero_subtitle_segments: [
    { text: "Medí el" },
    { text: "clima", tone: "strong" },
    { text: "y" },
    { text: "satisfacción", tone: "strong" },
    { text: "laboral por segmento." },
  ],
  hero_cta_primary: "Empezar gratis",
  hero_cta_secondary: "Ver cómo funciona",

  // El panel bajo los CTA: una captura y tres tarjetas que flotan encima.
  // **Los números son de la MISMA serie demo que la captura** —Clima Laboral
  // 2027 - eNPS, 144 respuestas, el undécimo estudio de Ingenio Santa Rita— y
  // tienen que seguir coincidiendo con ella: una tarjeta que contradice al
  // panel de abajo se lee como inventada. Si cambia la captura, se revisan acá.
  // La captura es la de 2027 porque es la que muestra el eNPS junto a los dos
  // índices; `trend` termina en ese mismo 71,42 % que se lee en el panel.
  // `goal` sigue siendo la meta de 2026 —la de `metas_resultado`, más abajo—:
  // la de 2027 no se cumplió por 20 puntos y no es lo que va en el hero.
  // `series` es el índice de clima estudio por estudio, 2017 a 2027, leído de
  // `indices_evolucion` más el punto de 2027; solo dibuja la línea, no se
  // imprime. `*_value` son los largos de la barra de la meta, de 0 a 100.
  hero_showcase: {
    shot: {
      light: "/shots/resumen_estudio-light.png",
      dark: "/shots/resumen_estudio-dark.png",
      alt: "Resumen de un estudio de clima laboral: 144 encuestados, satisfacción laboral de 71,52 %, clima laboral de 71,42 %, eNPS de +0,69 con promotores, pasivos y detractores, y cada categoría con su porcentaje",
    },
    trend: {
      label: "Clima laboral",
      value: "71,42 %",
      delta: "+11,1 pts",
      span: "11 estudios, de 2017 a 2027",
      series: [60.31, 64.0, 65.7, 65.4, 65.4, 70.0, 71.7, 70.7, 71.7, 75.41, 71.42],
    },
    goal: {
      label: "Satisfacción laboral 2026",
      status: "Meta cumplida",
      target_label: "Meta",
      target: "73,13 %",
      target_value: 73.13,
      result_label: "Resultado",
      result: "75,03 %",
      result_value: 75.03,
    },
    anonymity: {
      title: "Anónimo por diseño",
      body: "Ningún segmento se muestra por debajo del N mínimo.",
    },
  },

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
  // Son capturas de verdad del panel, sacadas del MODO DEMO —datos sembrados,
  // solo lectura—, nunca de una cuenta de un cliente.
  // **Cada una viene en sus dos temas.** El sitio se ve claro u oscuro según
  // quien mire, y una captura clara sobre el fondo oscuro es un rectángulo que
  // encandila; `ImageCycle` deja visible la que corresponde. Las dos llaves son
  // obligatorias: no hay caída a una sola.
  // El `alt` describe lo que se ve, porque es lo único que le llega a quien no
  // puede ver la imagen; va una sola vez por par —el tema no cambia lo que la
  // pantalla muestra.
  // **`resumen_estudio` no va acá**: es la captura del hero, y repetirla en el
  // carrusel es mostrar dos veces la misma pantalla en el mismo scroll.
  measurement_shots_title: "El resultado, por dentro",
  measurement_shots: [
    {
      light: "/shots/indices_evolucion-light.png",
      dark: "/shots/indices_evolucion-dark.png",
      alt: "La evolución del índice de clima estudio por estudio, de 2017 a 2026, con el valor de un punto abierto",
    },
    {
      light: "/shots/pregunta_serie-light.png",
      dark: "/shots/pregunta_serie-dark.png",
      alt: "Una pregunta sola a lo largo de los años, con la repartición de las respuestas de cada estudio abajo",
    },
    {
      light: "/shots/metas_resultado-light.png",
      dark: "/shots/metas_resultado-dark.png",
      alt: "Meta contra resultado por período, con cada estudio marcado como cumplida o no cumplida",
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
  // Las capturas EN MOVIMIENTO, por punto. Reemplazan a la maqueta dibujada del
  // mismo punto: `weights_filters.jsx` usa el clip cuando la fila declara uno, y
  // cae a `weights_shots` cuando no.
  //
  // Salen del modo demo, como las de `/shots/`, y van sin audio: se reproducen
  // solas y en loop, y un video que suena solo no se le hace a nadie.
  //
  // **Van en par claro/oscuro, como las capturas fijas.** La clara sobre el sitio
  // en oscuro es un panel blanco que encandila, y cada una es su propia
  // grabacion, no un filtro sobre la otra. `SystemClip` baja solo la del tema
  // activo, y recien cuando la fila se acerca.
  weights_clips: {
    cross: {
      light: {
        src: "/clips/filtros_cruzados.mp4",
        poster: "/clips/filtros_cruzados-poster.webp",
      },
      dark: {
        src: "/clips/filtros_cruzados-dark.mp4",
        poster: "/clips/filtros_cruzados-dark-poster.webp",
      },
      title: "El cruce, armándose",
      a11y: "Video del sistema: se eligen una rama y un puesto en el panel de filtros y el resultado del grupo se recalcula",
    },
    compare: {
      light: {
        src: "/clips/poblaciones_comparadas.mp4",
        poster: "/clips/poblaciones_comparadas-poster.webp",
      },
      dark: {
        src: "/clips/poblaciones_comparadas-dark.mp4",
        poster: "/clips/poblaciones_comparadas-dark-poster.webp",
      },
      title: "Rama contra rama",
      a11y: "Video del sistema: las ramas de un segmento puestas una contra otra y contra el general, en el radar, el ranking, la brecha y la tabla por categoría",
    },
    threshold: {
      light: {
        src: "/clips/umbral_muestra.mp4",
        poster: "/clips/umbral_muestra-poster.webp",
      },
      dark: {
        src: "/clips/umbral_muestra-dark.mp4",
        poster: "/clips/umbral_muestra-dark-poster.webp",
      },
      title: "El cruce que no se sostiene",
      a11y: "Video del sistema: se suman filtros de puesto, sexo y rango de edad hasta que el grupo queda con muy pocas personas, y el panel avisa que ese segmento no se puede mostrar sin comprometer el anonimato",
    },
  },

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

  // Sección 4b — los reportes que salen del análisis
  //
  // Va pegada al análisis y en su misma banda: es su consecuencia. Primero se
  // cruza y se compara, y recién ahí tiene sentido decir en qué formato te
  // llevás eso.
  reports_title_segments: [
    { text: "Todo" },
    { text: "lo" },
    { text: "que" },
    { text: "cruzás," },
    { text: "en" },
    { text: "un", tone: "brand" },
    { text: "reporte", tone: "brand" },
  ],
  reports_body:
    "El informe sale con los cruces que hiciste: los filtros aplicados, el resultado de cada segmento y las comparaciones. Lo descargás en XLSX, PDF o HTML, según qué vayas a hacer con él.",
  // Los tres formatos, en el orden en que se muestran. El cuerpo dice para qué
  // sirve cada uno, no qué es un XLSX. El icono va por posición en
  // `reports.jsx`: sacar un formato es sacar también su icono.
  reports_formats: [
    {
      name: "XLSX",
      body: "La tabla completa, para seguir cruzando en tu planilla.",
    },
    {
      name: "PDF",
      body: "El informe armado, listo para imprimir o presentar a dirección.",
    },
    {
      name: "HTML",
      body: "El reporte navegable, con los gráficos y los filtros que aplicaste.",
    },
  ],
  // Las capturas del entregable, en el MISMO orden que `reports_formats`: la
  // planilla, una página del PDF y el reporte abierto en el navegador.
  //
  // **Van con UNA sola imagen y no en par claro/oscuro**, que es la única
  // excepción del sitio: un export no tiene tema — un PDF es blanco en las dos
  // pantallas—, así que no hay versión oscura que sacar. `reports.jsx` le baja
  // apenas el brillo en oscuro para que el papel no encandile.
  //
  // Las dos primeras muestran además **un segmento oculto por no llegar al
  // mínimo de respuestas** ("Distribución", con rayas en vez de números). Es la
  // promesa del umbral que el sitio hace en el análisis y en el FAQ, cumplida
  // dentro del entregable — por eso ninguna de las dos se recorta.
  //
  // El `alt` describe lo que se ve; el `caption` es el pie bajo la imagen.
  reports_shots: [
    {
      src: "/shots/reporte_xlsx.png",
      alt: "El reporte abierto en una planilla de cálculo: una tabla por pregunta, con las respuestas de cada segmento repartidas entre Nada, Algo, Mucho y Completamente, y su porcentaje aceptable",
      caption: "La planilla, pregunta por pregunta",
    },
    {
      src: "/shots/reporte_pdf.png",
      alt: "Una página del informe en PDF: la repartición de respuestas de una pregunta por segmento, con la cantidad de respuestas de cada uno, la tabla de conteos y un segmento que queda oculto por no llegar al mínimo",
      caption: "El informe, listo para presentar",
    },
    {
      src: "/shots/reporte_html.png",
      alt: "El reporte en HTML abierto en el navegador: el índice de satisfacción laboral en 87.64 sobre 100 con 324 respuestas, y el resultado de cada categoría",
      caption: "El reporte navegable",
    },
  ],

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
  // La capacitación al contratar es la excepción: no sale del producto sino de
  // una decisión comercial (2026-09-11), y se repite en el CTA final. Si el
  // compromiso cambia, cambia en los dos lugares.
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
      question: "¿Nos capacitan para usarlo?",
      answer:
        "Sí. Al contratarnos te damos la capacitación incluida, de una: cómo armar la nómina, lanzar el estudio y leer los resultados por segmento.",
    },
    {
      question: "¿Tengo que hablar con alguien para probarlo?",
      answer: "No. Creás la cuenta y empezás.",
    },
    // La única respuesta que afirma algo que el sitio no dice en otra parte, y
    // es a propósito: el estudio asistido no es una función del producto sino
    // un servicio aparte, y esta es la pregunta que lo ofrece.
    {
      question: "¿Y si no quiero hacer el estudio yo?",
      answer:
        "Tampoco hace falta. Ofrecemos un servicio aparte en el que nosotros aplicamos el estudio en tu empresa, de principio a fin: armamos la nómina, lanzamos la recolección y te entregamos los resultados. Escribinos a knotfixservice@knotfix.com.",
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
  final_cta_body:
    "Creá tu cuenta, subí la nómina y medí. Al contratarnos, la capacitación va incluida.",
  final_cta_button: "Empezar gratis",

  // Documentación. Acá va SOLO el chrome: los títulos y la prosa de cada
  // página viven en `src/content/docs/**.mdx` y en `docs/nav.js`. Meter texto
  // largo en el diccionario lo vuelve inmanejable a la décima página.
  docs_index_title: "Documentación",
  docs_index_body:
    "Cómo funciona Censuma por dentro: los conceptos que hay que tener claros para leer un resultado, y las guías de cada módulo.",
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
    "Qué cambió en Censuma y cuándo. Lo más nuevo arriba; las entradas viejas no se corrigen.",
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
