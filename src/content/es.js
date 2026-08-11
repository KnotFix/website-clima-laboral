const es = {
  meta_title: "Knotfix Clima — Evaluación de clima laboral por segmento",
  meta_description:
    "Medí el clima laboral por segmento, no por promedio. Cruzá filtros, ponderá lo que importa y compará resultados entre áreas y en el tiempo.",

  // Navegación
  nav_links: [
    { label: "Cómo funciona", href: "#how" },
    { label: "Análisis", href: "#weights" },
    { label: "Confidencialidad", href: "#confidentiality" },
  ],
  nav_cta: "Empezar",

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
  hero_subtitle:
    "Medí el clima laboral por segmento, no por promedio. Cruzá filtros y compará áreas entre sí.",
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
  measurement_title: "Una medición, no una encuesta",
  measurement_body:
    "La mayoría de las encuestas de clima terminan en un archivo de opiniones sueltas que no se puede comparar contra nada. Acá cada respuesta suma a un número, y ese número se sostiene sobre un modelo.",
  // Mismo criterio que `problem_items`: el título dice el dato —cuántas
  // opciones, qué tres dimensiones, cómo se guarda— y no lo insinúa. "Listo para
  // presentar" y "Un modelo detrás" se cambiaron por eso: sonaban a promesa de
  // folleto y había que leer el cuerpo entero para saber de qué hablaban.
  measurement_items: [
    {
      title: "Escala de cuatro, sin punto medio",
      body: "No hay “ni de acuerdo ni en desacuerdo” donde esconderse: cada persona se define.",
    },
    {
      title: "Tres dimensiones: existencia, relaciones y condiciones",
      body: "Las preguntas viven en un modelo, no en una lista suelta. El núcleo lo responden todos igual.",
    },
    {
      title: "El resultado se guarda por segmento",
      body: "No un promedio global: cada segmento con su conteo. Después no se puede reconstruir.",
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
  // El título va corto y en dos frases a propósito: entra palabra por palabra
  // con `BlurText`, y una frase larga tarda demasiado en terminar de armarse.
  // La segunda frase nombra QUÉ es lo que no cambia. Sin el sujeto explícito
  // —"nada cambió"— el lector se queda preguntando qué era lo que iba a cambiar.
  //
  // Partido en piezas como `hero_title_segments`, para poder pintar el remate.
  // `tone: "brand"` es el morado, y va SOLO ahí: son las dos palabras que
  // resumen la sección entera.
  problem_title_segments: [
    { text: "Se" },
    { text: "hizo" },
    { text: "la" },
    { text: "encuesta." },
    { text: "El" },
    { text: "clima" },
    { text: "sigue", tone: "brand" },
    { text: "igual.", tone: "brand" },
  ],
  // **El título afirma; el cuerpo da el detalle.** Cada uno nombra UNA falla
  // concreta —el promedio, el formato que cambia, la demora— y se entiende solo,
  // sin leer lo de abajo. Nada de frases que dan vueltas antes de decir qué pasa.
  //
  // El cuerpo va a una sola idea y a un renglón o dos. Se probó con tres y no se
  // leen: es una pila que pasa con el scroll, no una página de documentación.
  problem_items: [
    {
      title: "El promedio tapa al área hundida",
      body: "El número general da bien mientras un equipo se cae. Te enterás cuando ya renunciaron.",
    },
    {
      title: "Si cambia el formato, no hay con qué comparar",
      body: "Otras preguntas cada año dejan dos resultados que no se pueden cruzar.",
    },
    {
      title: "El informe llega semanas tarde",
      body: "Las tablas se arman a mano. Cuando está listo, el problema ya es otro.",
    },
  ],

  // Sección 3 — cómo funciona
  how_title: "Tres pasos, y el primero lo hace el sistema",
  how_steps: [
    {
      step_title: "Subí tu nómina",
      step_body:
        "Arrastrás tu CSV o Excel y elegís qué columnas forman tu jerarquía. El sistema arma solo el árbol de la organización —regiones, empresas, sucursales, áreas— y te lo muestra para que lo revises antes de confirmar.",
    },
    {
      step_title: "Lanzá el estudio",
      step_body:
        "Elegís a quién medir y listo. La boleta de cada persona se compone sola: el núcleo común que responden todos, más las preguntas propias de su rama. No configurás encuestas una por una.",
    },
    {
      step_title: "Leé los resultados",
      step_body:
        "Llegan desglosados por segmento desde el primer estudio. Comparás áreas entre sí, seguís la evolución de cada una y ves dónde hay que actuar, no solo cuánto dio en general.",
    },
  ],

  // Sección 4 — pesos y filtros (la diferenciadora)
  weights_title: "Cruzá filtros. Ponderá lo que importa.",
  weights_body:
    "El análisis no es un promedio más grande. Es poder hacerle preguntas específicas a los datos y que respondan.",
  weights_points: [
    {
      title: "Uní filtros entre sí",
      body: "Región Norte, antigüedad mayor a cinco años y turno noche, todo a la vez. Ves el resultado exacto de ese cruce, no una aproximación.",
    },
    {
      title: "Ponderá por categoría",
      body: "En tu operación no todo pesa igual. Asignás pesos y comparás el resultado ponderado contra el simple para ver qué cambia.",
    },
    {
      title: "Compará poblaciones equivalentes",
      body: "Un segmento contra otro, o contra su propia historia. El sistema no mezcla un estudio global con uno regional en la misma línea.",
    },
    {
      title: "Sabé cuándo no alcanza",
      body: "Al cruzar filtros los grupos se hacen chicos rápido. Cuando un cruce se queda con muy pocas respuestas, el sistema lo avisa en vez de mostrar un número frágil.",
    },
  ],

  // Sección 5 — escala
  scale_title: "De 20 empleados a 50.000, el mismo sistema",
  scale_body:
    "Tu organización no entra en columnas fijas, así que no la obligamos. Se declara como un árbol: la empresa plana es un árbol de un nivel, y el grupo con regiones, empresas y sucursales es el mismo árbol, más profundo. Agregar una sucursal es colgar una rama, y el historial de lo que ya medías queda intacto.",
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

  // Sección 6 — confidencialidad
  confidentiality_title: "Si no es confidencial, no sirve",
  confidentiality_body:
    "La gente responde con honestidad solo cuando sabe que no la pueden identificar. Eso no es una promesa: es cómo está construido el sistema.",
  confidentiality_points: [
    "Las respuestas se desligan de la identidad. El token es por segmento, nunca por nombre.",
    "Ningún segmento muestra resultados por debajo del mínimo de respuestas que definas.",
    "Ese mínimo también se aplica al cruzar filtros, que es justo donde los grupos se achican sin que nadie lo note.",
  ],

  // Sección 7 — CTA final
  final_cta_title: "Lanzá tu primer estudio esta semana",
  final_cta_body:
    "Creá tu cuenta, subí la nómina y medí. Sin proyecto de implementación y sin llamada de ventas.",
  final_cta_button: "Empezar gratis",

  // Footer
  footer_tagline: "Evaluación de clima laboral por segmento.",
  footer_rights: "Todos los derechos reservados.",

  // Accesibilidad
  a11y_toggle_theme: "Cambiar tema",
  a11y_open_menu: "Abrir menú",
  a11y_close_menu: "Cerrar menú",
  a11y_switch_lang: "Cambiar idioma",
  a11y_main_nav: "Navegación principal",
  a11y_mobile_nav: "Navegación del menú",
  // El riel de la medición solo recibe el foco cuando NO está clavado: ahí se
  // recorre a mano y sin esto no hay forma de moverlo con el teclado.
  a11y_measurement_rail: "Fichas de la medición: se recorren de lado",
  a11y_mood_face: "Cara que cambia entre contenta, seria y triste",
  a11y_weather_tile: "Clima que cambia entre soleado, nublado y lluvioso",
  a11y_skip_to_content: "Saltar al contenido",
};

export default es;
