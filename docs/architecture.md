# Arquitectura y registro de nombres

Documento de referencia obligatorio. **Se lee antes de escribir código. Nadie inventa nombres fuera de este archivo.**
Dueño: `architect`. Si necesitás un nombre que no está, se lo pedís; no lo improvises.

---

## Mapa de archivos

```
src/
  proxy.js                      "/" -> "/es" segun Accept-Language      [programmer]
  mdx-components.js             enganche que @next/mdx exige por convencion.
                                Guion medio y en la raiz de src/: lo fija
                                Next, igual que page.js. El mapa real esta en
                                components/docs/mdx_components.jsx      [programmer]
  app/
    globals.css                 tokens + @theme inline                  [programmer]
    layout.js                   NO existe: el layout raiz vive en [lang]
    [lang]/
      layout.js                 <html lang>, fuentes, tema, <PageLight>.
                                El title lleva `template`: de ahi sale que las
                                docs terminen en "— Knotfix Clima"      [programmer]
      page.js                   home: compone las secciones. El envoltorio
                                con bg-background corta la luz bajo el video
                                                                        [programmer]
      not-found.js              404                                     [programmer]
      docs/
        page.js                 indice de la documentacion              [programmer]
        [...slug]/page.js       una pagina de doc. dynamicParams=false y
                                generateStaticParams desde DOCS_NAV     [programmer]
      legal/
        [slug]/page.js          un documento legal. `[slug]` y no catch-all:
                                la lista es plana. dynamicParams=false y
                                generateStaticParams desde LEGAL_NAV    [programmer]
  components/
    site/
      container.jsx             ancho maximo 1200 (UNICO lugar)         [programmer]
      navbar.jsx                contenido del navbar                    [programmer]
      nav_links.jsx             links de seccion + marca de activa      [programmer]
      use_active_section.jsx    hook useActiveSection (IntersectionObs) [programmer]
      mobile_menu.jsx           Sheet para < md                         [programmer]
      theme_provider.jsx        wrapper cliente de next-themes          [programmer]
      theme_toggle.jsx          claro/oscuro                            [programmer]
      light_switch.jsx          <LightSwitch>: el sol del hero. Mismo cambio
                                de tema que theme_toggle, sin etiqueta y
                                solo en la home. Se ve por `.sun-switch`
                                                                        [programmer]
      lang_switch.jsx           es/en                                   [programmer]
      footer.jsx                                                        [programmer]
    home/
      hero.jsx                  titular, copy, CTAs                     [programmer]
      hero_title.jsx            el h1 con la entrada palabra a palabra  [programmer]
      hero_video.jsx            video de YouTube con fachada + zoom     [programmer]
      world_reach.jsx           texto izquierda + planeta derecha       [programmer]
      measurement.jsx           por que los numeros significan algo:
                                encabezado con el empalme + carrusel    [programmer]
      cycling_tile.jsx          fichas del titular: cara y clima        [programmer]
      problem.jsx               seccion 2                               [programmer]
      how_it_works.jsx          seccion 3 (critica: autoservicio): las
                                tres fichas en zigzag + StepCard local  [programmer]
      weights_filters.jsx       seccion 4 (diferenciadora): cuatro
                                bloques, cada uno con su maqueta        [programmer]
      scale_tree.jsx            escala: 4 organizaciones en pestanas    [programmer]
      org_chart.jsx             organigrama recursivo de un arbol       [programmer]
      confidentiality.jsx       seccion 6                               [programmer]
      final_cta.jsx             seccion 7                               [programmer]
    motion/
      parallax.jsx              <Parallax scroll_speed>                 [creative]
      scroll_zoom.jsx           <ScrollZoom zoom_from zoom_to>          [creative]
      word_pull_up.jsx          <WordPullUp> + <WordPullUpPiece>        [creative]
      blur_text.jsx             <BlurText> + <BlurTextPiece>           [creative]
      rotating_text.jsx         <RotatingText>: palabra que se releva   [creative]
      image_cycle.jsx           <ImageCycle>: capturas que se cruzan    [creative]
      scroll_pass.jsx           <ScrollPass>: entra y sale con scroll   [creative]
      scroll_lift.jsx           <ScrollLift>: tapa que se levanta       [creative]
      reveal.jsx                entrada al viewport                     [creative]
      pinned_chapter.jsx        <PinnedChapter> + <ChapterSlide> +
                                useChapter(): dos secciones clavadas
                                que se panean de lado                    [creative]
      cards_stack.jsx           <CardsStack> + <StackCard>: la pila,
                                atada al avance del capitulo             [creative]
      scroll_line.jsx           <ScrollLine> + SEAM_Y: el trazo y la
                                altura de la juntura entre diapos        [creative]
      carousel_rail.jsx         <CarouselRail>: el riel que corre y el
                                grafico que lo sigue mas lento           [creative]
      tilt.jsx                  inclinacion por mouse                   [creative]
      use_reduced_motion.jsx    hook useReducedMotionSafe               [creative]
      use_remeasure.jsx         hook useRemeasure(fn): mide de nuevo
                                cuando cambia el alto del documento     [creative]
    effects/
      glass_bar.jsx             cascara de vidrio del navbar            [creative]
      grid_backdrop.jsx         fondo de puntos + resplandor            [creative]
      page_grain.jsx            <PageGrain>: el grano de pelicula de
                                toda la pagina, corriendose a 12 fps    [creative]
      section_glow.jsx          <SectionGlow>: ENVUELVE una seccion y le
                                da una direccion de luz. Resuelve el
                                apilado (`isolate` + `-z-10`) por vos   [creative]
      god_lights_layer.jsx      <GodLightsLayer>: la maquinaria de una
                                luz de canvas (godlights) — tema,
                                resolucion, animacion, medida. No sabe
                                de composicion                          [creative]
      page_light.jsx            <PageLight>: la luz FIJA de toda la
                                pagina + el lavado de `.page-light`     [creative]
      hero_particles.jsx        <HeroParticles>: el polvo que sube en el
                                hero, en canvas. Se mide a si mismo, se
                                para fuera de pantalla, color de `--spark`
                                                                        [creative]
      hero_cover.jsx            pie opaco del hero + la niebla del pie  [creative]
      stack_backdrop.jsx        degradado del problema                  [creative]
      ruler_marks.jsx           <RulerMarks>: cota con marcas           [creative]
      glass_panel.jsx           superficie translucida                  [creative]
      globe.jsx                 <Globe>: planeta cobe (WebGL)           [creative]
      chart_line.jsx            <ChartLine>: el grafico que corre por
                                detras del carrusel de la medicion      [creative]
      steps_trail.jsx           <StepsTrail>: la ruta punteada que une
                                las fichas de los tres pasos            [creative]
      system_shots.jsx          las CUATRO maquetas del sistema del
                                analisis: <CrossShot>, <WeightsShot>,
                                <CompareShot> y <ThresholdShot>         [creative]
    docs/
      docs_layout.jsx           marco de las docs: navbar, sidebar, contenido,
                                indice y pie. Es un COMPONENTE y no un
                                layout.js — ver el bloque de las docs  [programmer]
      docs_sidebar.jsx          el arbol de DOCS_NAV, con la activa marcada
                                                                        [programmer]
      docs_toc.jsx              indice de la pagina, de los h2/h3       [programmer]
      docs_pager.jsx            anterior/siguiente en el orden de DOCS_NAV
                                                                        [programmer]
      mdx_components.jsx        mapa de etiquetas HTML a los tokens del sitio.
                                SIN @tailwindcss/typography             [programmer]
      doc_shot.jsx              <Shot>: una captura del producto. Si el archivo
                                no esta dibuja un HUECO con el nombre que falta,
                                en vez de romper el build. Se usa en los .mdx
                                sin importarlo                          [programmer]
    legal/
      legal_layout.jsx          el marco de un documento legal: cabecera con
                                version + fecha, aviso de borrador, una sola
                                columna. Sin sidebar ni indice — un legal no
                                es un recorrido                         [programmer]
    ui/                         shadcn — NO SE TOCA
  content/
    es.js                       copy espanol                            [programmer]
    en.js                       copy ingles, MISMAS llaves              [programmer]
    docs/
      nav.js                    DOCS_NAV: el arbol de la documentacion.
                                FUENTE UNICA del orden                  [architect]
      es/*.mdx                  las paginas, en prosa                   [programmer]
      en/*.mdx                  idem, MISMOS slugs                      [programmer]
    legal/
      nav.js                    LEGAL_NAV: slug, titulo, VERSION, fecha y
                                `draft` de cada documento. FUENTE UNICA —
                                de aca los lee tambien el registro de
                                aceptacion del producto                 [architect]
      es/*.mdx                  privacy, terms, dpa                     [programmer]
      en/*.mdx                  idem, MISMOS slugs                      [programmer]
  lib/
    utils.js                    cn() — lo genero shadcn
    dictionaries.js             get_dictionary(lang), LOCALES           [programmer]
    site_config.js              marca, links, constantes                [programmer]
    docs.js                     resolve_doc(), headings_of(). Lee el .mdx
                                CRUDO con fs para el indice             [programmer]
    legal.js                    resolve_legal(). Mas corto que docs.js: sin
                                indice, no hace falta releer el .mdx    [programmer]
docs/
  architecture.md               este archivo                            [architect]
  legal.md                      los tres documentos legales: que falta
                                completar antes de que rijan, y la
                                ESPECIFICACION del registro de aceptacion
                                que implementa el otro proyecto (la app)
                                                                        [architect]
  documentation.md              la seccion de docs del producto: por que
                                vive aca y no en Docusaurus, su FRONTERA
                                con el /ayuda del SaaS, la estructura de
                                contenido y el registro de nombres de
                                DOCS_NAV. El esqueleto ya esta en pie;
                                el contenido se escribe de a poco       [architect]
```

**Reglas de estructura**

- El layout raíz vive en `app/[lang]/layout.js`, no en `app/layout.js`. Es lo que permite `<html lang>` correcto por idioma.
- `hero_visual.jsx` **se retiró**. Las tres tarjetas de gráficos eran una maqueta dibujada a mano, y el hero ahora muestra el producto en video. Con ella se fueron las llaves `hero_visual_*` del diccionario y el primer uso de `Tilt`; hoy la primitiva la consumen **las tarjetas de `problem.jsx`**.
- El ancho de 1200px existe **únicamente** en `container.jsx`. Un `max-w-[1200px]` en cualquier otro archivo es un error.
- `src/components/ui/**` se deja tal como vino del registro shadcn.
- **Las docs no tienen `layout.js`, y es a propósito.** Un layout de App Router recibe los params de
  **su** segmento: `app/[lang]/docs/layout.js` conocería `lang` y nunca el `slug` de la catch-all de
  abajo, así que no podría marcar la página activa en la barra lateral. `DocsLayout` es un componente
  que llaman las dos rutas. Es además el mismo patrón que ya usa la home — `page.js` monta `Navbar` y
  `Footer`, y el layout raíz solo pone `<html>`, el tema y la luz.
- **El detalle de la sección de docs vive en `documentation.md`**, no acá: la frontera con el
  `/ayuda` del producto, el alcance de idiomas, por qué no se versiona y el registro de nombres de
  `DOCS_NAV`. Este archivo tiene el mapa; aquel tiene las reglas.

> **`next dev` no recarga en caliente `src/content/*.js`.** Los componentes sí,
> los diccionarios no: llegan por un `import()` dinámico dentro de
> `get_dictionary`, y Turbopack se queda con el módulo viejo. Se ve feo —el copy
> nuevo no aparece, o una llave nueva llega `undefined` y revienta el
> componente— y **no es un bug del código**. Al cambiar un diccionario, reiniciá
> el dev server.

---

## Registro canónico de nombres

### Movimiento y scroll

| Nombre | Tipo | Significado |
|---|---|---|
| `scroll_progress` | MotionValue 0→1 | avance del scroll ya normalizado |
| `scroll_speed` | prop number | multiplicador de parallax; 0 = fijo, 1 = se mueve con el scroll |
| `layer_depth` | prop number | profundidad de una capa del hero: 1 = fondo, 3 = frente |
| `is_detached` | boolean | el navbar ya se despegó del tope |
| `detach_threshold` | const number | píxeles de scroll a los que se completa el desprendimiento |
| `detach_offset` | const number | cuánto baja la isla al despegarse |
| `island_scale` | MotionValue | escala uniforme de la isla ya despegada (1 → `ISLAND_SCALE`) |
| `scrim_opacity` | MotionValue | opacidad de la franja que tapa el hueco sobre la isla |
| `active_id` | string \| null | id de la sección que el usuario está mirando |
| `reduced_motion` | boolean | el usuario pidió menos movimiento |

> **La isla se achica con `scale`, nunca con `width`.** `island_width` y
> `bar_width` se retiraron: animar el ancho obligaba a
> recalcular el layout del logo, los links y el CTA en cada frame del scroll.
> `island_scale` hace lo mismo con un `transform` y sin layout. Es escala
> **uniforme** a proposito: encoge alto y ancho a la vez, asi el texto se dibuja
> mas chico en vez de deformarse (un `scaleX` solo lo estiraria).
>
> **El radio va antes que la opacidad.** `pill_radius` llega a pastilla al 45%
> del recorrido y `surface_opacity` recién arranca al 78%. Si se invierte, el
> borde de la superficie aparece como un rectángulo a todo lo ancho antes de
> que exista la isla, y el efecto se delata.
| `tilt_strength` | prop number | intensidad de la inclinación por mouse, en grados |
| `STACK_TOP` | const number | dónde se clava la primera ficha de la pila, en px |
| `STACK_GAP` | const string | aire entre ficha y ficha, en `vh`: el scroll que hay que recorrer para que llegue la siguiente |
| `index` / `count` | prop number | turno y escalon de una ficha dentro de `CardsStack` |
| `increment_y` | prop number | cuánto más abajo se clava cada ficha; es lo que asoma de las de abajo |
| `space_after` | prop string | alto del div vacío que va detrás de la ficha. **Nunca un margen** — ver la pila |
| `READ_LINE` | const number | dónde queda la cabeza del trazo dentro de la ventana, en alto de pantalla |
| `TICK_STEP` / `TICK_LENGTH` | const number | separación y largo de la marca corta de la regla, en px |
| `MAJOR_STEP` / `MAJOR_LENGTH` | const number | ídem la marca larga; el ritmo de cuatro en cuatro es lo que la hace regla |
| `reveal_delay` | prop number | retraso de entrada, en segundos |
| `drift` | prop number | recorrido vertical de `ScrollPass`, en px: entra desde `+drift` y se va en `−drift` |
| `fade_in` / `fade_out` | prop number | los dos hitos de la opacidad de `ScrollPass`, en fracciones del cruce. Entre los dos esta a pleno |
| `fill_height` | prop boolean | `ScrollPass` pasa el alto de la celda a sus dos divs, para que el `h-full` del hijo tenga contra quien medir |
| `lift` | prop number | cuánto se levanta de más `ScrollLift`, en px. Es **exactamente** cuánto de la sección siguiente queda tapado |
| `span` | prop number | px de scroll que dura el destape. Más largo = la tapa sube más despacio |
| `HERO_LIFT` / `HERO_SPAN` | const number | los dos valores del hero, en `hero.jsx` |
| `HERO_EDGE` | const number | el pie del hero: `padding-bottom` y `fog` de `HeroCover`, el mismo número |
| `fog` | prop number | px en que `HeroCover` se disuelve al pie; ahí aparece lo que viene detrás |
| `FOG_STOPS` | const array | los puntos de la curva de la niebla: `[cuánto queda del fondo, a qué altura]` |
| `blurred` | prop boolean | `ScrollLine` dibuja la copia difusa, la que va **encima** de las fichas |
| `shape` | prop `"stack"` | qué camino dibuja `ScrollLine`. La geometría vive en su archivo, no en la sección |
| `STACK` | const string | la curva que hilvana la pila del problema, en coordenadas del viewBox (100 × 1000 = porcentajes) |
| `CONNECTOR_NARROW` / `CONNECTOR_WIDE` | const string | el empalme problema → medición, uno por tramo: arranca en `x = 82` o en `x = 91.5` según dónde terminó la pila |
| `SHAPES` | const object | mapa de `shape` a la lista de caminos; más de uno cuando la caja cambia de ancho por breakpoint |
| `travel` | number | px que el riel del carrusel recorre de lado. Es también el scroll que dura el clavado: van 1:1 |
| `is_pinned` | boolean | la pista se clavó. Falso en móvil, con movimiento reducido, en ventana baja, o si el riel ya entra |
| `phase` | MotionValue 0→1 | avance de la sección entera: el tramo de carrera **más** el clavado |
| `glide` | MotionValue | `phase` pasado por el resorte. **Las tres cosas salen de acá**: riel, gráfico y dibujo |
| `race_fraction` | number | qué parte de `phase` es el tramo previo al clavado |
| `rail_x` / `chart_x` | MotionValue | corrimiento de cada capa; el gráfico va a `CHART_SPEED` del riel |
| `CHART_SPEED` | const number | fracción de la velocidad del riel a la que corre el gráfico. **Es todo el parallax** |
| `PEN_X` | const number | dónde queda quieta la punta del trazo, en fracción del ancho visible |
| `pen_fraction` | number | cuánto del gráfico ya está dibujado cuando arranca el clavado. De acá sale que la punta no se mueva |
| `RACE_SPAN` | const number | scroll previo al clavado que se usa para que el trazo cruce la pantalla, en altos de ventana |
| `PIN_MIN_WIDTH` / `PIN_MIN_HEIGHT` | const number | abajo de estos tamaños no se clava nada |
| `LOOSE` | const object | el estado sin clavado: riel a mano y gráfico entregado dibujado |
| `reveal` | prop MotionValue 0→1 | fracción del gráfico dibujada. La pone la pista; `ChartLine` no sabe de scroll |
| `plot_ratio` | prop number | alto de la caja del gráfico sobre su ancho. Sirve para repartir el dibujo entre los vértices |
| `POINTS` | const array | los vértices del gráfico, en coordenadas del viewBox. El primero es de entrada y no lleva punto |
| `BASELINE` / `GRID_TOP` | const number | el eje y el techo de la retícula, en por mil del alto del bloque |
| `DOT_FADE` | const number | cuánto antes de su punto empieza a aparecer un vértice, en fracción del dibujo |
| `PIECE_STAGGER` | const number | retraso entre pieza y pieza de la parte de arriba de una maqueta (chips, categorías), en segundos |
| `BAR_DELAY` / `BAR_STAGGER` | const number | cuánto espera la primera barra después de la última pieza de arriba, y cuánto va entre barra y barra. Las barras son la **consecuencia** de lo que se armó arriba: llegando a la vez, la maqueta se mueve de golpe y no se lee que una cosa produce la otra |
| `shot` | prop object | el contenido de UNA maqueta: `weights_shots[key]` del idioma actual |
| `scale_max` | prop string | el techo de la escala. De dividir cada valor por él sale el largo de su barra |
| `ratio` / `accent` | prop | fracción de la escala que ocupa una barra, y si va morada (la que la sección promete) o gris (la de referencia) |
| `SHOTS` | const array | qué maqueta va con qué punto, en el orden de `weights_points`. Vive en `weights_filters.jsx` — ver por qué no puede vivir con las maquetas |
| `TEXT_DRIFT` / `SHOT_DRIFT` | const number | cuánto deriva cada columna de una fila del análisis. **Distintos a propósito: la diferencia es el parallax** |
| `TRAIL` | const string | la ruta punteada que une los tres pasos, en coordenadas del viewBox de `StepsTrail` (100 × 1000 = porcentajes) |
| `DRAW_START` / `DRAW_END` | const number | dónde arranca y dónde termina de dibujarse la ruta, en altos de ventana medidos contra el bloque de las fichas |
| `STEP_CELLS` | const array | el zigzag: la celda de la reja y el ángulo de cada paso. Vive en `how_it_works.jsx` |
| `cell` / `angle` | prop string | las clases de una entrada de `STEP_CELLS`: dónde cae la ficha y cuánto se tuerce |
| `zoom_from` | prop number | escala con la que `ScrollZoom` entra: 0.7 = 30% más chico |
| `zoom_to` | prop number | escala de llegada; 1 = el tamaño real, reservado en el layout |
| `zoom_origin` | prop `"center"` \| `"top"` | desde donde crece y sobre qué eje se inclina |
| `tilt_from` | prop number | grados de `rotateX` con los que entra inclinado; llega a 0 |
| `PERSPECTIVE` | const number | distancia del ojo al plano para `tilt_from`, en px |
| `ORIGINS` | const object | mapa de `zoom_origin` a `transform-origin` |
| `is_playing` | boolean | el iframe de YouTube ya se montó |
| `poster_quality` | string | archivo de miniatura pedido: `maxresdefault` o `hqdefault` |
| `hero_video_id` | const string | id de 11 caracteres del video, en `site_config` |

### Idioma y contenido

| Nombre | Tipo | Significado |
|---|---|---|
| `lang` | string | `"es"` o `"en"` — el nombre lo fija el segmento `[lang]` |
| `dict` | object | diccionario ya resuelto del idioma actual |
| `LOCALES` | const array | `["es", "en"]` |
| `DEFAULT_LOCALE` | const string | `"es"` |
| `get_dictionary` | función | `get_dictionary(lang) -> dict` |
| `site_config` | object | marca, navegación y URLs |

### Llaves del diccionario

Planas por sección, con prefijo de sección. **`es.js` y `en.js` tienen exactamente las mismas llaves.**

```
nav_links[]        { label, href }   href es un ancla: "#how"
nav_cta            "Empezar"
nav_docs           el link a la documentacion. SUELTO y no dentro de
                   nav_links: esa lista son anclas y NavLinks les saca el id
                   cortando el "#". Ver documentation.md
docs_*             el chrome de la seccion de docs (indice, plegado de movil,
                   "En esta pagina", anterior/siguiente). La PROSA vive en
                   src/content/docs/**.mdx, nunca aca
hero_title             version PLANA, la que usan los metadatos
hero_title_segments[]  { text, tone } | { face: true } | { weather: true }
hero_subtitle
hero_cta_primary
hero_cta_secondary
hero_video_title       title del iframe: no se pinta, lo lee el lector de pantalla
hero_video_play        aria-label del boton de play
world_title_segments[] { text } | { rotating: true } — como hero_title_segments
world_rotating_words[] las palabras que se relevan en el titular del planeta
measurement_title
measurement_body
measurement_items[]    { title, body }  — cuatro; el icono NO vive acá
                       el título dice el dato, no lo insinúa; el cuerpo, un renglón o dos
measurement_shots_title  pie de la ultima ficha del carrusel
measurement_shots[]    { src, alt } — capturas que se van pasando
problem_title_segments[] { text } | { text, tone: "brand" } — como hero_title_segments
problem_items[]    { title, body }  — el título de cada una nombra lo que critica
                   afirma una falla concreta y se entiende sin el cuerpo
how_title
how_steps[]        { step_title, step_body }
weights_title      se parte por espacios para `BlurText`; el punto de una frase
                   corta el renglon, igual que en el titular del problema
weights_body
weights_points[]   { title, body } — el titulo dice que hacés, el cuerpo que ganás
weights_shots      { scale_max, cross, weights, compare, threshold } — una
                   maqueta por punto, en el mismo orden. Cada una lleva su
                   propio `a11y`: son cuatro y describen cosas distintas, asi
                   que el texto vive pegado al contenido que describe.
                   **Los numeros son contenido**: el decimal es coma en español
                   y punto en ingles, y de dividirlos por `scale_max` sale el
                   largo de cada barra
scale_title
scale_body
scale_orgs[]      { label, size, tree }  — `size` es la cifra que se despliega
                  bajo la opcion activa; separador de miles por idioma
confidentiality_title
confidentiality_body
confidentiality_points[]
final_cta_title
final_cta_body
final_cta_button
footer_tagline
footer_rights

a11y_toggle_theme
a11y_light_switch      nombre del sol del hero. Distinto a proposito de
                       a11y_toggle_theme: el disco no dice "tema", dice de
                       que hora es la escena
a11y_open_menu
a11y_close_menu
a11y_switch_lang
a11y_main_nav          nav de escritorio
a11y_mobile_nav        nav del Sheet — nombre distinto a proposito: dos
                       landmarks con el mismo nombre accesible son ambiguos
a11y_docs_nav          sidebar de las docs
a11y_docs_nav_mobile   su copia plegada de movil
a11y_docs_toc          indice de la pagina de doc
                       — los tres, por lo mismo que a11y_mobile_nav: en una
                       pagina de docs hay TRES navs a la vez
a11y_skip_to_content   enlace para saltar al <main id="main">
a11y_measurement_rail  nombre del riel de la medicion. Solo se usa cuando NO
                       esta clavado: ahi el riel recibe el foco y se recorre
                       con el teclado
a11y_mood_face         label de la ficha con la carita del titular
a11y_weather_tile      label de la ficha del clima del titular
```

### Color: botones monocromos, morado en detalles

**`--primary` es negro (claro) / casi-blanco (oscuro), no morado.** Los botones son
monocromos. El morado vive en `--brand` y en `--ring`.

| Token | Para qué |
|---|---|
| `--primary` | relleno de botones: `#0b0a0f` en claro, `#f4f3f6` en oscuro |
| `--brand` | morado de marca: resplandores, gradientes y acentos puntuales. **Nunca** relleno de botón |
| `--ring` | morado; anillo de foco |
| `--chart-1` | morado; el segmento destacado de los gráficos |

Si un detalle tiene que ser morado, usa `--brand` (`text-brand`, `bg-brand`,
`from-brand`). Apuntarlo a `--primary` lo vuelve negro.

### Tokens y clases propios del navbar

Van aparte de `--surface` porque `--surface` lo comparte `glass_panel.jsx`.

| Token / clase | Para qué |
|---|---|
| `--nav-surface` | vidrio del navbar. Bastante translúcido: el navbar viaja sobre el hueso del hero y sobre las secciones blancas, así que no puede tener color propio |
| `.nav-glass` | el vidrio en sí: `--nav-surface` + `backdrop-filter`. Lo usan la barra del tope y la isla |
| `.nav-scrim` | franja de vidrio enmascarada que tapa el hueco entre el tope y la isla |
| `.nav-key` | hover de los links: fondo neutro + sombra difusa abajo. Sin relieve, sin borde y **sin morado** |

> **El navbar es vidrio, no slime.** El efecto gooey (`goo_filter.jsx`,
> `slime_bar.jsx`) se retiró: es incompatible con el `backdrop-filter`, por dos
> razones independientes. El goo necesita formas **opacas** — su rampa de alfa
> (`18a − 7`) lleva a opaco todo lo que pase de ~0.44, así que un slime
> translúcido sale sólido igual. Y un `filter` en cualquier ancestro **anula**
> el `backdrop-filter` de todos sus hijos. Con el hero en hueso, una barra
> blanca sólida se recortaba como una banda; el vidrio no tiene color propio y
> se adapta a lo que tenga detrás.
>
> Son **dos capas de vidrio que se cruzan en opacidad**, no una que cambie de
> ancho: la barra del tope (a lo ancho de la ventana) y la isla (ancho del
> Container). Cruzarlas evita animar `width`. El solape es corto pero
> obligatorio: sin él, a mitad del recorrido el navbar se queda sin fondo.

### Tokens del hero

| Token | Para qué |
|---|---|
| `--background` | **blanco hueso `#d6d5d1` en TODA la página**, no solo el hero. Las tarjetas siguen en `--card` blanco y por eso se levantan |
| `--hero-title-muted` | gris de las palabras apagadas del titular. Texto grande, así que le alcanza 3:1 (AA large) |
| `--signal-*` | `good` / `warn` / `bad` / `cloud` / `rain`: los colores de las fichas |
| `<GodLightsLayer>` | la maquinaria: recibe `halos` y `rays`, y resuelve tema, resolución, animación y medida. **No sabe de composición** |
| `<PageLight>` | la luz de la página: dos abanicos de rayos + dos halos, en **canvas** con `godlights` |
| `halos` / `rays` | prop array | las capas de una escena. **Tienen que ser constantes de módulo**: un array nuevo por render rearma la escena y redibuja el lienzo |
| `.page-light` | lo que queda en CSS: **solo** el lavado de arriba abajo, que hace de piso. Cálido, no blanco |
| `.light-handoff` | el fondo propio de todo lo que va abajo del video. Entra desde transparente: es lo que apaga la luz de a poco |
| `LIGHT_RAY_COLOR` | const string | el marrón cálido con el que se dibuja la sombra de los rayos en tema claro |
| `LIGHT_HALO_COLOR` | const string | el dorado del foco en tema claro. En oscuro el foco es `#ffffff` y no hay constante |
| `<HeroParticles>` | el polvo que sube en el hero. Canvas propio, sin props: se mide a sí mismo |
| `--spark` | color de una mota de polvo. Dorado en claro, blanco helado en oscuro |
| `<LightSwitch>` | el sol: cambia el tema al apretarlo. Vive en `site/` con `theme_toggle`, porque es un control y no un adorno |
| `.sun-switch` | todo su aspecto: disco, núcleo, las tres capas de resplandor y el aura que respira |
| `--sun` / `--sun-core` / `--sun-glow` | disco, centro caliente y resplandor. **Es un solo objeto con dos horas**: la geometría no cambia entre temas, solo estos tres |
| `<PageGrain>` | grano de película sobre toda la página, **animado**. Capa fija, `z-70` |
| `.page-grain` | la MEZCLA, en el envoltorio fijo |
| `.page-grain-texture` | el DIBUJO (`feTurbulence` en data-URI), en el div que se traslada |
| `--grain-opacity` / `--grain-blend` | cuánto pesa el grano y con qué se mezcla. Van juntos: el número no significa nada sin el modo |
| `TILE_SIZE` | const number | lado del mosaico de ruido, en px. Es también el tope del corrimiento |
| `FRAME_MS` | const number | cada cuánto se corre el grano. 12 cuadros por segundo |

> **El grano se mueve, y el movimiento es un `transform`, no un canvas.** La
> versión de Framer que inspiró esto redibuja ruido nuevo en un canvas cada
> cuadro. No hace falta: **la textura es ruido, así que correrla ya se ve como
> ruido nuevo.** Se genera un solo mosaico y cada cuadro se lo traslada a un
> punto al azar dentro de él; el navegador solo recompone una capa ya
> promocionada. Por eso el div de adentro es `inset: -TILE_SIZE`: si midiera lo
> mismo que la pantalla, al correrlo asomaría el borde. Y por eso el mosaico
> lleva `stitchTiles='stitch'` — se corre sobre sí mismo.
>
> **12 cuadros por segundo y no 60.** El grano de película va a la velocidad de
> la película, no a la del monitor: a 60 el ruido se promedia en el ojo y se
> convierte en una niebla gris quieta. **Más cuadros se ve menos.** De paso
> cuesta cinco veces menos. Con `prefers-reduced-motion` el grano se queda
> quieto pero **no se apaga**: la textura es lo que saca a la página de la
> sensación de plano, y eso no es movimiento — lo que molesta es el hervor.

> **El modo de mezcla cambia con el tema.** `overlay` conserva el tono de abajo
> en vez de lavarlo hacia el gris, que es lo que hace que el grano se lea como
> grano y no como una veladura. Pero su fórmula para un fondo oscuro es `2 *
> base * ruido`: sobre el casi negro del tema oscuro (11/255) el resultado no
> llega ni a 20, o sea que el grano **desaparece**. Ahí se usa mezcla común, que
> sobre negro levanta el ruido en vez de multiplicarlo por un fondo que ya es
> cero. Es la misma asimetría que la de los rayos: en claro se resta, en oscuro
> se suma.
>
> Las dos clases están separadas por una razón concreta: `mix-blend-mode` mezcla
> contra el contexto de apilado del **padre**. Puesto en el div que se traslada,
> el contexto sería el envoltorio fijo —que está vacío— y no se mezclaría con la
> página. O sea, no haría nada.
| `.section-band` | cambia el valor del fondo de un tramo, con los bordes desvanecidos **y en diagonal** |
| `--band` | el color de la banda: más oscuro que el fondo en claro, más claro en oscuro |
| `.section-seam` | la línea que separa una sección de la siguiente. **Reemplaza a `border-t border-border`, que en claro no se ve** |
| `<SectionGlow>` | envuelve una sección y le da una dirección de luz. Resuelve el apilado por vos |
| `side` | prop `"left"` \| `"right"` | de qué costado cae el modelado. **Alterna sección a sección** |
| `.section-glow` / `--glow` | el dibujo del resplandor y su color: el fondo movido hacia el color del texto |
| `--panel` / `bg-panel` | la cara de un panel grande. A mitad de camino entre el fondo y `--card` |

> **El lienzo del organigrama no tenía fondo: era el hueso de la página con un
> borde.** Se leía como un hueco, no como una superficie. Ahora lleva `bg-panel`.
>
> `--panel` va a **mitad de camino** entre el fondo y `--card`, y ninguno de los
> dos extremos servía: en `--card` pelado sería blanco puro y las cajas del
> organigrama —que también son `--card`— desaparecerían dentro de él. En el medio
> el panel se levanta del fondo (228 → 242, y contra la banda de la sección son
> 25 valores) y a las cajas les quedan 13 para levantarse de él, más su canto
> sólido y su sombra.
>
> En oscuro la cuenta no sirve: entre el fondo (11) y `--card` (20) hay nueve
> valores y el punto medio sería invisible. Se arma al revés, subiendo desde el
> fondo hacia el texto, y queda **por encima** de la tarjeta. No hunde a las
> cajas: en oscuro su relieve no lo da el relleno sino la línea blanca de arriba
> y el canto de `--box-edge`, que es más claro que la cara.

> **`.org-canvas` NO declara la cara, y es a propósito.** La clase la comparten
> el lienzo del organigrama y las cuatro maquetas del análisis
> (`system_shots.jsx`), y esas ya traen `bg-card` propio. Como la regla va **sin
> capa**, un `background-color` ahí le ganaría a Tailwind y les pisaría el blanco
> a las cuatro. El relleno lo pone quien usa la clase; lo común es el relieve.

> **`border-t border-border` no se veía, y era media página.** `--border` vale
> `#e5e7eb`, más CLARO que el hueso del fondo (`#e4e3df`), así que los cinco
> separadores que había de la sección del planeta para abajo no existían: era un
> solo bloque sin un corte. Es el mismo defecto que ya obligó a inventar
> `--org-line` y `--box-edge` — `--border` está pensado para el borde de las
> tarjetas blancas, no para dibujar sobre el fondo de página.
>
> `.section-seam` sale de `--box-edge` y **se desvanece en las puntas** en vez de
> ir de pared a pared: una línea que toca los dos bordes de la pantalla corta la
> página en dos, una que nace y muere dentro del ancho del contenido acompaña a
> la columna. Va como `background-image` y no como `::before` para no obligar a
> hacer `relative` a cinco secciones que hoy no lo son.

> **La inclinación va en el FONDO, nunca en una línea.** Las bandas cortan a
> 176° —cuatro grados fuera de la vertical, unos cien píxeles de corrimiento a
> lo ancho de la página— y los seams se quedan horizontales. No es inconsistencia:
> un degradado torcido se lee como luz, una raya de 1px torcida se lee como un
> error de alineación. Lo que se busca con los cuatro grados no es que se vea una
> diagonal, es que el borde **no** sea horizontal: con todos los cortes paralelos
> al borde de la pantalla, la mitad de abajo se lee como una pila de rectángulos.
> Las dos bandas llevan el mismo ángulo, paralelas entre sí como los rayos del
> hero — dos diagonales cruzadas serían dos ideas.

> **`SectionGlow` es un envoltorio y no una capa suelta, por el apilado.** El
> resplandor va en `-z-10` y el envoltorio en `isolate`. Sin el `isolate` un
> `-z-10` se escapa hacia arriba hasta el primer contexto de apilado que
> encuentre —acá el `<body>`— y el resplandor terminaría **detrás del fondo de la
> página**, o sea invisible. Con él queda encerrado: fondo del envoltorio (la
> banda, si la hay) → resplandor → contenido. La alternativa era el trato del
> hero (capa absoluta sin `z-index` + contenido en `relative`), pero eso obliga a
> tocar el `Container` de cada sección y a acordarse cada vez.
>
> `--glow` es siempre "el fondo movido hacia el color del texto": en claro un
> gris que **oscurece** el hueso, en oscuro un casi blanco que **aclara** el
> negro. La misma línea de CSS da sombra de un lado y luz del otro, y las dos son
> modelado. Es la misma asimetría que la de los rayos.

`<PageLight>` se monta como una capa **fija a pantalla completa** en el layout,
no como fondo de una sección: así la luz conserva tamaño y ángulo al scrollear
(como fondo de un elemento de 5000px se estiraría). Es un div fijo y no
`background-attachment: fixed` porque eso repinta en cada scroll y iOS Safari lo
trata mal.

| Nombre | Tipo | Significado |
|---|---|---|
| `animated` | prop boolean | enciende el bucle de `requestAnimationFrame` de la luz |
| `ANIMATED` | const boolean | el valor por defecto de `animated`, en `page_light.jsx`. **Encendido** |
| `is_animated` | boolean | si de verdad se está animando: `animated` menos movimiento reducido, menos móvil |
| `ANIMATED_MIN_WIDTH` | const number | ancho de ventana abajo del cual la luz se queda quieta |
| `ANIMATED_MAX_WIDTH` | const number | techo de resolución del lienzo **moviéndose**. Es lo que hace pagable la animación |
| `STATIC_MAX_WIDTH` | const number | ídem quieto |
| `opacity` / `intensity` | campo de capa | la intensidad de esa capa **en el tema oscuro**: el valor tal como salió del editor |
| `light_opacity` / `light_intensity` | campo de capa | la misma capa en el tema claro. Se saca con un rest antes de armar la escena: godlights no lo conoce |
| `is_dark` | param boolean | cuál de los dos juegos de intensidades usa `build_scene` |
| `SCENE_WIDTH` | const number | los 1920px con los que se diseñó la escena; `rayWidth` y `blur` se escalan contra esto |
| `SIZE_STEP` | const number | escalón de la medida de ventana, en px: evita redibujar con la barra de direcciones de móvil |

> **El fondo de la escena va `transparent`, no negro.** La escena que exporta el
> editor de godlights trae un fondo negro sólido porque está pensada para un
> sitio oscuro. Acá el fondo es del sitio —hueso en claro, casi negro en
> oscuro— y pintarlo desde el canvas rompería el tema claro entero. Con
> `bgType: "transparent"` el lienzo solo compone las luces y deja pasar el
> `--background` del `body`, así que **la misma escena sirve para los dos
> temas**. `drawScene` hace `clearRect` siempre, no solo con fondo sólido, así
> que tampoco hay arrastre entre cuadros.

> **En tema claro los rayos son SOMBRA, no luz.** Sobre el hueso (`#e4e3df` =
> 228) un rayo blanco tiene 27 valores de recorrido hasta el 255, y
> `fadeToTransparent` se come una parte a lo largo del haz: en la parte más
> brillante llega a ~248, diecinueve valores sobre el fondo y repartidos en un
> borde desenfocado de 15px. Se dibuja y no se ve. **Subirle la opacidad no
> arregla nada**: el techo no es la opacidad, es que arriba de 255 no hay nada —
> se probó en 0.95 y seguía sin verse.
>
> Sobre el casi negro del oscuro (`#0b0a0f` = 11) el mismo rayo tiene 244
> valores. No son el mismo problema a distinta escala, son dos regímenes
> opuestos.
>
> Por eso en claro el abanico se dibuja en un gris neutro (`LIGHT_RAY_COLOR`,
> de la familia de `--org-line` y `--box-edge`) y lo que queda del fondo entre
> rayo y rayo es lo que el ojo lee como la luz. Hacia abajo hay 228 valores de
> recorrido en vez de 27. Los halos se quedan **blancos** en los dos temas: el
> foco sigue siendo un punto brillante y de él salen las sombras.
>
> **La luz de canvas es UNA sola, y es la de la página.** Se probó una segunda
> en la sección de escala —un haz rasante entrando por el canto izquierdo— y se
> descartó: no gustó. `GodLightsLayer` quedó igual como pieza aparte porque la
> separación es entre la maquinaria y la composición, y mide su propio elemento
> en vez de la ventana, así que sirve tanto para una capa fija como para una
> sección. Si nunca aparece una segunda luz, se puede volver a fusionar con
> `page_light.jsx` sin perder nada.

> Trampa a tener presente: con el fondo de la escena en `transparent`, el
> `blendMode` solo mezcla **dentro** del lienzo — el `<canvas>` después se
> compone sobre la página con alfa común. Lo que oscurece el fondo no es
> `multiply`, es que el gris se dibuja gris. El `blendMode` importa donde los dos
> abanicos se cruzan entre sí.
>
> El lavado de `.page-light` bajó de 0.42 a **0.12** por lo mismo: cae justo
> arriba, donde los rayos son más fuertes, y dejaba el fondo en 239.

> **La luz respira, y se apaga con `prefers-reduced-motion` y en móvil**
> (`ANIMATED_MIN_WIDTH`). Cuesta: cada cuadro redibuja 43 rayos y, como los dos
> abanicos llevan desenfoque, la librería se arma **un `OffscreenCanvas` nuevo
> por capa y por cuadro** y lo pasa por un `blur()` gaussiano. Lo que lo hace
> pagable es `ANIMATED_MAX_WIDTH`: moviéndose se dibuja a 1024 de ancho en vez
> de 1600, que son 2.4 veces menos píxeles por cuadro y 2.4 veces menos memoria
> descartada. Lo que se pierde es nitidez en una mancha ya desenfocada 17px.
>
> Perillas si el scroll se siente pesado, en orden: bajar `ANIMATED_MAX_WIDTH`,
> bajar el `blur` de las capas, y por último `ANIMATED` a `false`. Para medirlo,
> `<GodLights showFps>` dibuja el contador en pantalla.

> **Las amplitudes de `ANIM_PARAMS` hay que leerlas contra la fórmula.** La
> primera versión tenía `speed: 0.3` con amplitudes de 12 a 30 buscando algo
> discreto, y el movimiento salió **invisible**:
>
> - `widthAmp` es la perilla que se ve: el ancho oscila `±(randomnessWidth /
>   400) * (widthAmp / 50)`. Con `randomnessWidth: 100`, 55 da ±27%.
> - `lengthAmp` va segundo: misma forma con `randomnessLength`, que es 24, así
>   que hasta 70 da apenas ±8%.
> - `angleAmp` **casi no hace nada con esta geometría**. El vaivén angular se
>   mide en fracciones del hueco entre rayo y rayo, y con 28 rayos en 70° ese
>   hueco es de 2.6°: aun en 100 el rayo se mueve menos de un cuarto de grado.
>   La palanca real sería `randomnessAngle`, y está en 0 a propósito.
> - `speed` decide si algo se percibe: el tiempo entra como `sin(t * 0.45)`, así
>   que en 0.3 el ciclo del ancho tardaba **46 segundos**. En 1.1 tarda 13.
>
> Cada rayo lleva su propia fase (`h * 2.399`, el ángulo áureo), así que no
> respiran todos juntos y el conjunto no se lee como un ciclo.

> **El `noise` de la escena va en 0: el grano lo pone `.page-grain`.** Tiene que
> haber uno solo. El de la librería cubre este lienzo y nada más —o sea el
> hero—, así que dejarlo prendido deja la primera pantalla con más grano que el
> resto. De paso se ahorra una pasada de `getImageData`/`putImageData` sobre el
> lienzo entero en cada dibujado, y moviéndose, un segundo lienzo a pantalla
> completa compuesto con `mix-blend-mode`.

> **La luz se ENTREGA al pie del hero, no se corta.** Como la capa es **fija**,
> no se puede "terminar" en un punto del documento: lo único que la apaga es que
> de ahí para abajo haya fondo propio. Ese fondo es el envoltorio de `page.js`,
> que lleva `.light-handoff`: entra desde transparente y termina de cerrar a las
> **48rem**, así que el último tramo de luz le sobrevive al pie del hero y se
> apaga scrolleando. De ahí para abajo la página queda en el hueso pelado,
> igual que antes — el estado final no cambió, lo que cambió es que llegar a él
> dejó de ser un evento.
>
> Las 48rem salen de `ScrollLift`: mete los primeros `HERO_LIFT` px (320) del
> envoltorio detrás del hero, donde no se ven. Con un degradado corto la parte
> visible del apagado sería de menos de 100px y volvería a leerse como un corte.
>
> Va en **un** envoltorio y no sección por sección para que sea una sola
> decisión y no ocho que se pueden desincronizar. El `<footer>` sigue con
> `bg-background` opaco: ahí ya no queda luz que entregar.

La luz es **canvas 2D, no WebGL**. Se probó con `SideRays` de React Bits
(dependencia `ogl`) y se descartó por el peso del contexto WebGL; `ogl` se
desinstaló. `godlights` no trae runtime propio, solo React, y cae a un dibujado
de una sola pasada cuando no hay que animar (móvil, movimiento reducido).

Antes eran cuatro `linear-gradient` diagonales. Se fueron al canvas porque un
gradiente no tiene de dónde nacer: cae en bandas de bordes rectos, con la misma
opacidad de punta a punta y sin grano. Es lo que hacía que la primera pantalla se
leyera plana.

> **`--muted-foreground` se oscureció a `#4b5563`.** Sobre el hueso el gris
> anterior (`#6b7280`) daba 3.35:1 y no llegaba al mínimo AA.

> **Los `--signal-*` son la única excepción al blanco y negro.** Ahí el color
> **es** el dato: una cara verde y una roja significan cosas distintas y en gris
> no se distinguirían. Van sobre la ficha, nunca sobre el fondo de página.

### La luz tiene hora: de noche es blanca, de tarde es dorada

El tema claro **no es el tema oscuro con el fondo cambiado**. Es la misma escena
a otra hora del día, y todo lo que sea luz cambia de color con ella: el polvo
del hero (`--spark`), el sol que lo enciende (`--sun*`), el foco de `PageLight`
(`LIGHT_HALO_COLOR`), sus rayos (`LIGHT_RAY_COLOR`) y el lavado de
`.page-light`. Seis lugares, una sola decisión.

**Y el dorado no es una preferencia estética: es lo único que se ve.** Sobre el
hueso (`#e4e3df` = 228) al blanco le quedan 27 valores de recorrido — es la
misma cuenta que ya estaba escrita para los rayos en `god_lights_layer.jsx`, y
para una mota de medio píxel de ancho pega todavía más fuerte. El dorado del
atardecer resuelve las dos cosas al mismo tiempo: es más oscuro que el fondo,
así que tiene con qué existir, y es el color que de verdad tiene la luz cuando
entra baja. En oscuro se vuelve blanco frío porque ahí hay 244 valores hacia
arriba y la luz puede volver a ser luz.

El único que se queda quieto es el morado de marca. La luz cambia de hora; la
marca no.

> **El cambio de tema no se desvanece, y no es un olvido.** `ThemeProvider` va
> con `disableTransitionOnChange`: durante el cambio de clase todas las
> transiciones de la página quedan apagadas. Es una decisión de sitio — con el
> fondo, el texto y las ocho secciones cruzándose de color a destiempo, el
> cambio se ve roto. Si alguna vez se quiere el atardecer animado, hay que sacar
> esa prop y resolver la página entera, no el bloque de `.sun-switch`.

### De dónde salió el hero de partículas, y qué NO se trajo

El polvo y el sol vienen de un componente de partículas de terceros. Entró
menos de la mitad, y lo que quedó afuera importa tanto como lo que entró:

| Del original | Qué pasó |
|---|---|
| el campo de partículas | **entró**, reescrito: mide su elemento y no la ventana, va por `devicePixelRatio`, mueve por delta de tiempo y se para fuera de pantalla |
| el `mid-spot` que encendía un "gold mode" | **entró como control**: es `LightSwitch` y cambia el tema de verdad |
| los abanicos de `conic-gradient` | **no**. `PageLight` ya los dibuja con godlights, con origen y ancho por rayo. Dos capas de haces no se suman, se ensucian |
| las líneas de acento | **no**. El hero ya tiene la retícula de `GridBackdrop` |
| el `gold mode` a fuerza de `filter: invert()` | **no**. Invertir medio hero con un filtro rompe el antialiasing del texto y anula el `backdrop-filter` del navbar. El cambio de hora lo hacen los tokens |
| su titular, su copy y su `<style jsx>` | **no**. El copy vive en los diccionarios y el estilo en `globals.css` |

### Clases de relieve de los CTA

Tres grados de la misma idea, de más a menos. Viven en `globals.css` y se
aplican por `className` sobre el `Button` de shadcn — **`ui/button.jsx` no se
toca**, que es lo que permite seguir actualizando el registro.

| Clase | Dónde | Qué hace |
|---|---|---|
| `.cta-plate` | envuelve el CTA primario del hero | el plato: bandeja `--card` con el pie más ancho que el techo |
| `.cta-key` | CTA primario del hero | cara con textura + canto sólido de 4px; se hunde al presionar |
| `.cta-key-soft` | CTA secundario del hero | mismo idioma, canto de 3px, sin plato |
| `.cta-key-flat` | CTA del navbar | solo luz arriba y sombra abajo; sin canto |
| `.surface-key` | fichas de `Measurement` | el mismo relieve sobre una tarjeta; canto de 4px que se alarga con el hover |
| `.graded-face` | fichas de `Measurement` y de `Problem` | la **cara**: gris arriba, limpia abajo |
| `.org-canvas` | el panel del organigrama en `ScaleTree` | trama de puntos, canto de 1px y sombra corta: es lo que encierra el diagrama |

> **El canto de `.org-canvas` sale de `--box-edge`, NO de `--border`.**
> `--border` vale `#e5e7eb`, **más claro que el hueso del fondo**, así que en
> claro el borde simplemente no existiría — el mismo problema por el que existe
> `--org-line`. `--box-edge` (`#c5c3be`) se creó para esto y ya lo usan las
> cajas del propio organigrama.

> **`.graded-face` y `.surface-key` son dos cosas y por eso son dos clases.**
> Una es la cara y la otra el relieve. Las tarjetas de la pila del problema
> quieren la cara y **no** el relieve: ya tienen sombra propia, calibrada contra
> la línea difusa que les cruza por encima, y sumarle el canto de 4px sería otra
> pieza compitiendo. El degradado salió de `.surface-key` cuando se separaron.
>
> El sentido se invierte con el tema, y no es un descuido. En claro la tarjeta es
> blanca y lo que la despega del fondo es sombra propia arriba: gris que se abre
> hacia el blanco. En oscuro la tarjeta ya es casi negra —oscurecerle la cabeza
> la funde con la página— así que arriba va la luz y la sombra cae al pie.

> **`.surface-key` no tiene `:active`.** Una tarjeta no se pulsa, y hundirse sin
> que pase nada promete una acción que no existe. Su canto sale de `--box-edge`
> y **nunca de `--border`**: ese vale `#e5e7eb`, más claro que el hueso del
> fondo, así que el canto desaparecería — el mismo problema por el que existe
> `--org-line`.

> **El canto es el costado del botón, no una sombra.** Por eso va sólido y sin
> desenfoque (`0 4px 0`). Al presionar, el canto baja a 1px y la cara baja 3px:
> el pie queda clavado y el botón se hunde dentro de su propio grosor. Si la
> cara bajara sin acortar el canto, el objeto entero se mudaría hacia abajo y
> se leería como un deslizamiento.

> **Un solo degradado sirve para los dos temas:** luz blanca arriba, sombra
> negra abajo. Sobre la cara negra del tema claro solo se ve la luz; sobre la
> cara blanca del oscuro solo se ve la sombra. En ambos casos el objeto queda
> iluminado desde arriba, sin una regla duplicada por tema.

> **Las reglas van SIN `@layer`.** En la cascada lo no estratificado le gana a
> todas las utilidades de Tailwind, así que hay que declarar los estados a
> mano: el `:active` propio pisa el `active:translate-y-px` del botón, y el
> `:hover` pisa el `hover:bg-primary/80` que sobre el plato blanco convertía
> la cara negra en gris.

El resplandor morado de `GridBackdrop` se apaga en el hero (`show_glow={false}`)
porque ensucia la esquina donde nace la luz; en el CTA final sigue encendido.

### El titular del hero va partido en piezas

`hero_title_segments` es un array de `{ text, tone }` más las piezas
`{ face: true }` y `{ weather: true }`, donde se incrustan `MoodFace` y
`WeatherTile`. `tone: "muted"` apaga la palabra. `hero_title` se conserva
**plano** porque es el que usan los metadatos.

El peso lo pone cada pieza, no el `h1`: **600 las negras, 400 las grises.**

Las fichas se dimensionan en `em` y no en px: viven dentro de un titular que
cambia de tamaño en cada breakpoint. Todos los iconos se renderizan siempre y se
turnan por opacidad y escala; con `prefers-reduced-motion` queda fijo el
primero. Cara y clima giran a **intervalos distintos** (1600ms y 1900ms) a
propósito: con el mismo ritmo cambiarían siempre juntos y se leería como un
reloj. Tampoco conviene alejarlos mucho — a 2300ms el ciclo del clima tardaba
casi 7 segundos y era fácil no llegar a ver la lluvia.

### El video del hero: fachada primero, iframe al click

`hero_video.jsx` no monta el `<iframe>` de YouTube hasta que alguien da play.
Hasta entonces hay una sola imagen —la miniatura de YouTube— y un botón. El
embed son cientos de kB repartidos en varias conexiones de terceros, y puesto en
el hero lo pagan **todas** las visitas, también las que nunca miran el video.

El segundo motivo es el zoom: escalar una imagen es trabajo del compositor;
escalar un iframe obliga a re-rasterizar un documento entero en cada frame del
scroll. La fachada convierte el efecto en un `transform` sobre un bitmap.

La miniatura se pide como `maxresdefault.jpg` (1280×720), que YouTube solo
genera para videos subidos en HD. Si devuelve 404, `poster_quality` cae a
`hqdefault.jpg`, que existe siempre: es 4:3 con bandas negras, y `object-cover`
las recorta contra el marco 16:9. `i.ytimg.com` es el **único** host externo del
sitio y por eso está en `images.remotePatterns` de `next.config.mjs`.

El id vive en `site_config.hero_video_id`, no en el diccionario: el video es el
mismo en los dos idiomas.

> **`ScrollZoom` escala, no ensancha.** El marco reserva su tamaño final desde
> el primer render (`aspect-video` fija la altura por proporción) y `scale` lo
> dibuja más chico al principio. Así crecer no empuja nada de la página: cero
> reflows durante todo el recorrido, y el contenido de abajo no salta cuando
> carga la miniatura.
>
> El recorrido va de `start end` (el marco asoma por abajo de la ventana) a
> `center center` (su centro llega al centro de la pantalla). Es a propósito el
> tramo largo: cuanto más largo, más chico está el video al cargar la página y
> más se nota que crece. Un tramo corto lo deja casi entero desde el principio.
>
> El progreso pasa por un `useSpring` antes de llegar a la escala. Sin él, la
> rueda del mouse mueve el zoom a saltos de ~100px y el crecimiento se ve
> escalonado.
>
> Con `prefers-reduced-motion` el video se entrega en `zoom_to` y derecho, o sea
> a tamaño real y sin inclinar. **El estado chico e inclinado es la animación,
> no el diseño**: dejarlo achicado o torcido sería castigar con un video peor a
> quien pidió menos movimiento. No se escribe ningún `transform`, ni siquiera
> la perspectiva.

> **El tilt y el zoom comparten el recorrido.** `tilt_from` entra en 18° de
> `rotateX` —el borde de arriba se va, el de abajo se acerca— y llega a 0
> exactamente cuando la escala llega a 1. Que terminen juntos es lo que hace
> que se lea como **un solo gesto**, un panel que se para, y no como dos
> animaciones sueltas compitiendo por la atención.
>
> La perspectiva va como `transformPerspective` sobre el mismo elemento, no
> como `perspective` en el padre: el padre es el div que se mide, y meterle
> propiedades 3D lo saca del flujo plano sin necesidad.
>
> `PERSPECTIVE = 1400` sobre un marco de ~1136px deja el borde de abajo un 7%
> más ancho que el de arriba. Más chico exagera la fuga y el video se vuelve un
> trapecio; más grande aplana la inclinación hasta que parece un aplastado.
>
> **El tilt nunca desborda.** El ensanchado del borde inferior crece cuando el
> ángulo crece, pero el ángulo es máximo justo cuando la escala es mínima: el
> producto `escala × ensanchado` sube monótono hasta 1 y toca su máximo en el
> estado final, que es plano. O sea que el elemento inclinado siempre mide
> menos que el derecho, y el `overflow-hidden` de la sección no lo recorta en
> ningún punto del recorrido. Medido: 983px al cargar, 1136px al terminar.
>
> Si `tilt_from` es 0 no se escriben ni `rotateX` ni la perspectiva. Con solo
> aparecer en el `transform` el navegador promueve el elemento a capa 3D y lo
> rasteriza distinto; quien no pidió inclinación no lo paga.

> **El video crece desde el borde de arriba (`zoom_origin="top"`), no desde el
> centro.** Achicando desde el centro, la escala reparte el faltante a los
> cuatro lados: el borde de arriba caía ~75px por debajo de su posición de
> layout, así que el hueco con los CTA era de 115px cuando el margen pedía 40,
> y encima cambiaba a medida que crecía. Anclado arriba, **el aire con lo que
> tiene encima es exactamente el margen** en cualquier escala, y el video se
> expande hacia abajo, que es justo donde tiene que insinuar que sigue.
>
> El origen cambia dónde se apoya, no la forma: la inclinación sigue leyéndose
> con el borde de arriba más angosto que el de abajo. Lo que sí cambia es el
> ancho máximo, así que se volvió a medir el recorrido completo: 926 → 1136px,
> monótono, sin pasar nunca el ancho de layout. La sección no lo recorta.

### El hero es una tapa que se levanta

El problema **arranca metido detrás del hero** y se destapa con el scroll. El
mecanismo son dos cosas que van juntas y las escribe el mismo componente
(`ScrollLift`), porque una sin la otra es un error:

1. `margin-bottom: -HERO_LIFT` en el hero mete los primeros 320px del problema
   debajo suyo, donde no se ven.
2. Mientras se scrollea, el hero se levanta esos mismos 320px de más.

Separadas no sirven: el margen sin el movimiento deja el arranque del problema
tapado **para siempre**, que es perder contenido. Por eso con
`prefers-reduced-motion` se apagan **las dos**.

> **El estado final es idéntico al que habría sin el efecto.** Al terminar el
> recorrido el hero quedó levantado justo `lift`, así que su borde de abajo cae
> exactamente donde arranca el problema. Medido a 1920×945: borde del hero en
> −15, arranque del problema en −15. A 390×800: −296 y −296. El solape existe
> **solo durante el destape**.

> **El hero sube a 1.5× y el problema a 1×.** La diferencia sale de
> `1 + lift/span`: 320 sobre 640. Con `span` igual a `lift` iría al doble y se
> vería un tirón; el punto es que se lea como una tapa que se corre, no como un
> bloque que sale despedido.

> El destape arranca cuando el borde de abajo del hero llega al pie de la
> ventana — antes, lo tapado está fuera de pantalla igual. **La cuenta lleva
> piso en 0**: en una ventana más alta que el hero daría negativo y la página
> cargaría con el hero ya levantado sin que nadie lo haya movido.

**`HeroCover` es lo que hace posible todo esto**, y existe por una razón que no
es obvia: **el sitio no tiene fondos por sección**. Todas dejan ver el hueso del
`body` y los destellos de `.page-light`, que es una capa **fija** detrás de todo.
O sea que el hero es transparente, y algo transparente no tapa nada. Sin la
franja, el titular del problema se ve a través del hero desde el primer scroll.

> **La franja va solo al pie, no en todo el hero.** La luz diagonal es la firma
> de la primera pantalla y taparla entera para ganar un efecto es un mal
> negocio. Tampoco hace falta: lo único que hay atrás son los `lift` px del pie.
>
> **Solo el borde de arriba va desvanecido; el de abajo corta limpio.** El de
> arriba es el que apaga los destellos de a poco al acercarse al pie. El de
> abajo puede ser un corte porque **debajo del hero ya no hay luz**: las
> secciones de abajo tienen `bg-background` propio, del mismo color que la
> franja, así que a los dos lados del borde hay el mismo gris.
>
> Eso costó una vuelta entera. Mientras hubo luz abajo, el corte limpio dejaba
> una **línea horizontal de lado a lado** —arriba los destellos tapados, abajo
> de golpe— que barría la pantalla y se leía como un error de dibujo. Con 64px
> de bajada la línea desaparecía pero aparecía el problema opuesto: **el titular
> del problema se transparentaba**, y un texto oscuro sobre hueso se lee incluso
> al 20%. El equilibrio estuvo en 16px, y dejó de hacer falta cuando la luz se
> cortó en el video. **Si algún día vuelve la luz abajo, este borde vuelve a
> necesitar bajada y con ella vuelve el fantasma del texto: son la misma
> decisión.**
>
> `height` tiene que ser **más del doble de `lift`**: el degradado recién llega
> a opaco al 45%, así que lo sólido es lo que queda. De ahí sale
> `HeroCover height={HERO_LIFT * 2}`.

### El pie del hero es niebla, no vidrio esmerilado

`HERO_EDGE` vale 60 y es el mismo número para el `padding-bottom` de la sección
y para el `fog` de `HeroCover`, porque son la misma franja: el problema se
destapa apareciendo justo en el aire que hay debajo del video.

> **Se probó con `backdrop-filter` sobre esta franja y funcionaba** —ahí sí, es
> un div normal— pero el resultado era vidrio esmerilado: un plano sólido con un
> borde claro, más cerca de una mampara que de una transición. Se cambió por
> niebla, que no tiene ni plano ni borde: el contenido se disuelve y reaparece.

> **La niebla no es una rampa lineal, y ahí está toda la diferencia.** Un
> degradado de opaco a transparente en línea recta se lee como una *banda*, con
> un principio y un final que el ojo encuentra enseguida. `FOG_STOPS` dibuja una
> ese —se queda arriba, cae en el medio, se va suave— que es la curva con la que
> se disuelve algo de verdad.
>
> La ese además es lo que hace que el tramo sirva. Aguantar arriba significa que
> la mayor parte de la franja sigue tapando bastante, así que **lo que asoma es
> una insinuación y no un texto legible**. Con la rampa recta el titular de abajo
> se leía entero a través del hero.

> El zoom no molesta acá. Con `zoom_origin="top"` el video achicado deja su
> borde de abajo **por encima** del de la sección, pero el recorrido del zoom
> termina mucho antes de que arranque el destape (~400px de scroll contra 461),
> así que cuando el borde importa el video ya está en tamaño real.

> **El `z-10` no es decorativo.** El problema viene después en el flujo y por
> defecto pintaría **encima** del hero. Sin él la tapa no tapa.

> El hero pasó a tener un `transform`, así que ahora es bloque contenedor de
> cualquier `position: fixed` que se le cuelgue adentro. Hoy no hay ninguno.
> También corre la medición de `ScrollZoom` si la página carga ya scrolleada,
> pero el zoom termina bien antes de que el destape empiece (513px de scroll
> contra ~400), así que llega clavado en `zoom_to` y no se nota.

**El problema no se toca.** Todo el movimiento vive del lado del hero, y es a
propósito: `Problem` es `sticky` en dos niveles —la columna del titular y cada
ficha de la pila— y **un `transform` encima le corre el sistema de coordenadas
al pegado**. Si alguna vez hay que mover esta sección, se mueve la de arriba.

### El texto del hero va centrado en la pantalla

El `padding-top` de la sección es `max(8rem, calc(50svh - 11.5rem))`, no un
valor fijo. El bloque de texto mide ~23rem, así que para que **su** centro caiga
en el centro de la ventana hay que bajarlo media pantalla menos media altura
propia. Con un padding fijo el texto queda centrado en un solo tamaño de monitor
y descolgado en todos los demás.

El `max()` es el piso: por debajo de ~624px de alto la cuenta daría menos que el
navbar y el titular se le metería abajo. Ahí el texto deja de estar centrado a
propósito — centrarlo empujaría los CTA fuera de la pantalla.

En móvil el padding sigue fijo (`pt-32`): el titular ocupa cinco líneas, el
bloque pasa largo de 23rem y la cuenta no aplica.

> **El video asoma por abajo a propósito.** Es la señal de que la página sigue:
> ~39% del marco entra en la primera pantalla, a 47px de los CTA. Medido a
> 889px de alto: texto centrado con 1px de error, video visible desde los 678px.

### La entrada del titular: solo el hero

`WordPullUp` va **únicamente** en `hero_title.jsx`. Ningún otro titular del
sitio la usa. La entrada palabra por palabra es cara de mirar y pierde efecto si
se repite en cada sección, así que se reparte: el hero con `WordPullUp`, y
`BlurText` en **dos** titulares —el del planeta y el del problema, las dos
secciones que abren un argumento—. El resto entra con `Reveal`, que es una sola
pieza al cruzar el viewport, salvo el encabezado de `Measurement`, que vive
dentro del capítulo clavado (ver abajo).

### El capítulo clavado: el problema y la medición son un solo tramo

**`Problem` y `Measurement` dejaron de ser dos secciones que se scrollean.** Son
dos diapositivas de un mismo bloque clavado, y durante todo el tramo **la página
no se mueve en vertical**: el scroll mueve las cosas de costado.

```
┌─ pista (1 pantalla + recorrido) ────────────┐
│ ┌─ ventana clavada, h-screen ─────────────┐ │
│ │ [ diapo 1        ][ diapo 2          ]  │ │
│ └─────────────────────────────────────────┘ │
│   x: 0 ──────────────────────> -100vw       │
└─────────────────────────────────────────────┘
```

Cuatro fases sobre un único avance, todas salidas del mismo `useSpring`:

| Fase | Qué se mueve |
|---|---|
| **la pila** | las fichas suben a su lugar; el titular no se mueve |
| **el paneo** | la fila corre una pantalla entera hacia la izquierda |
| **el riel** | adentro de la diapo 2 corren las fichas; el título no |
| **el sostén** | nada; el bloque aguanta antes de soltar |

`PinnedChapter` es el **dueño de toda la geometría**, incluida la del riel y la
del gráfico que viven en la diapo 2. No es acoplamiento gratuito: el alto de la
pista depende de cuánto mide el riel, y el avance de las cuatro fases sale de ese
mismo alto. Repartir la medición entre dos componentes fue exactamente lo que
produjo el huevo y la gallina de la versión anterior.

**El avance viaja por contexto, y es la única vez en el sitio.** Tres piezas de
archivos distintos —la pila, el riel y el gráfico— dependen del mismo valor y
tienen que estar sincronizadas al frame. Por props, `Problem` y `Measurement`
tendrían que volverse Client Components enteros.

Lo que lo sostiene, y no es opcional:

- **La sonda del margen NO lleva `absolute`.** Con `absolute` el `Container` deja
  de centrarse —`w-full` le da el ancho entero y `mx-auto` no tiene nada que
  repartir— y devolvía 32 en vez de 392. Con ese número el recorrido del riel
  daba negativo, se acotaba a cero y **las fichas no se movían nunca**: el paneo
  pasaba y la fase del riel no existía. En flujo normal con `h-0` no ocupa alto y
  mide bien.
- **La fase de sostén no es aire.** El avance pasa por un resorte, así que cuando
  el scroll llega al final el riel todavía se está acomodando; sin ese colchón el
  clavado suelta justo ahí y la última ficha se va de pantalla sin llegar. Es el
  mismo papel que cumplía el `pb-[14vh]` de la pila en la versión vertical.
- **Los hitos de fase se separan aunque el capítulo esté suelto.**
  `useTransform` necesita un rango de entrada estrictamente creciente: con dos
  topes iguales devuelve `NaN` y el estilo queda roto. En reposo las fases valen
  0, así que se reparten en cuartos.
- **Cada diapositiva mide exactamente `w-screen`.** Es lo que hace que el paneo
  cierre: la fila corre `-100vw` y con eso la diapo 2 queda calzada. Con otro
  ancho el paneo termina con las dos a medio mostrar.

Abajo de 1024px de ancho o 640 de alto, y con movimiento reducido, **no hay
capítulo**: las dos diapositivas se apilan como secciones normales, las fichas
van una debajo de otra y el riel vuelve a ser un `overflow-x-auto` con snap.
Verificado forzando `innerWidth`: sin bloque clavado, tres fichas a 1170/1355/1568
con opacidad 1 y sin transform, y el riel enfocable con su `aria-label`.

#### La línea conectada: `SEAM_Y`

Era el pedido explícito, y en la versión vertical **nunca cerró**. `ChartLine`
nacía pensado para empalmar —su primer punto decía estar "donde el empalme deja
la línea"— pero el trazo terminaba en el borde izquierdo del `Container` y el
gráfico arrancaba en `frame_left`, 360px más a la derecha.

En una fila horizontal el problema desaparece: **el borde derecho de la diapo 1
es el borde izquierdo de la diapo 2.** La pila sale por su borde derecho a la
altura `SEAM_Y` y el gráfico entra por el suyo a la misma. No hay trazo de
empalme porque no hay distancia que cubrir — `connector` y sus dos variantes se
retiraron.

`SEAM_Y` vive en `scroll_line.jsx` y lo importa `chart_line.jsx`. **Un número, un
lugar.** Vale 740 —abajo, no arriba— porque el gráfico entra por ahí: su primer
vértice real está en 740 y la banda del medio la ocupan las fichas.

Dos cosas tuvieron que ceder para que la juntura diera exacta, y las dos están
medidas:

- **La caja de la línea es la diapositiva entera, no la columna de las fichas.**
  El trazo termina en `x = 100`, que tiene que ser el borde de la diapo. Con la
  caja acotada a la columna la línea moría en el medio de la pantalla.
- **El gráfico también cuelga de la diapositiva entera, no de la banda del
  riel.** `SEAM_Y` está en por mil del alto: para que caiga en el mismo píxel las
  dos cajas tienen que medir lo mismo. Colgado de la banda medía 612 contra 889 y
  la juntura quedaba **7px corrida** — poco, pero sobre un trazo de 2px es un
  codo que se ve. Medido después del arreglo: `dx = 0`, `dy = 0`.

Y el gráfico **no parallaxea durante el paneo**: si se moviera, su punto de
entrada se despegaría de la juntura justo cuando se la está mirando. El parallax
arranca con el riel, cuando la diapo 1 ya salió de pantalla.

> **El trazo de la pila ya no se mide solo.** Antes calculaba su propio tramo
> contra `scrollY`; adentro del capítulo la caja no se mueve nunca, así que el
> tramo salía degenerado y el trazo quedaba en 0 o en 1. Ahora lo dibuja el mismo
> avance que arma la pila.
>
> **Y va sin atajos `S`.** La versión con curvas encadenadas se desbordaba por la
> derecha: `S` refleja el tirador anterior, y con la caja estirada a una pantalla
> entera esa reflexión mandaba el control más allá de `x = 100`. El trazo salía de
> la diapositiva y volvía, dibujando un rulo.

### Medir una vez no alcanza: `useRemeasure`

**Todo lo atado al scroll —`ScrollPass`, `PinnedChapter`, `ScrollLine`— calcula su
tramo en píxeles de documento.** Eso se podría medir una sola vez si la página no
cambiara de alto después del montaje. Cambia:

- `PinnedChapter` le pone el alto a su pista **desde JavaScript**, en un efecto,
  después del primer pintado. Son ~1500px que aparecen de golpe y empujan hacia
  abajo todo lo que viene después.
- Las imágenes y el video del hero llegan tarde. Las fuentes cambian el alto de
  los bloques de texto al reemplazarse.

Sin volver a medir, un elemento que se midió antes del empujón queda con el tramo
corrido y **el efecto se dispara donde el elemento ya no está**. Se vio con el
planeta: la esfera quedaba en opacidad cero justo mientras cruzaba la pantalla,
porque su tramo había quedado calculado 1500px más arriba.

Por eso los tres usan `useRemeasure`, que corre la medición al montar, en el
`resize` de la ventana, y con un `ResizeObserver` sobre `documentElement`.
**Escuchar solo el `resize` no alcanza**: la ventana no cambia de tamaño cuando
lo que crece es el documento.

### La entrada y la salida de los titulares

**Todos los titulares del sitio entran y salen con el scroll**, con
`ScrollPass {...HEADING_PASS}`. La diferencia con `Reveal` se nota volviendo para
arriba: `Reveal` deja el título puesto para siempre después de la primera vez, y
esto lo devuelve por donde vino.

`HEADING_PASS` vive en `scroll_pass.jsx` y es un solo objeto para todo el sitio.
Va más cerrado que los valores por defecto —recorrido de 60px, hitos en 0.18 y
0.82— para que **nunca haya un título atenuado que alguien esté leyendo**. No son
los valores por defecto de `ScrollPass` porque el componente también envuelve
cosas que no son titulares, como el planeta, y ahí el tramo largo es lo que se
quiere.

Las excepciones, y cada una por su motivo:

- El hero (`WordPullUp`) y el problema (`BlurText`) ya tienen su propia entrada.
- `ScaleTree`: su titular vive **dentro** del bloque clavado —se queda a la vista
  todo el recorrido a propósito— así que un fundido atado al scroll lo haría
  desaparecer a mitad de la pista.
- `FinalCta` va con `Reveal`, y esto **hay que respetarlo**: es la última sección
  y no se puede scrollear más allá de ella, así que el tramo de salida cae justo
  donde alguien se queda mirándola. Con `ScrollPass` el CTA quedaba invisible al
  llegar al pie de la página. Es el botón que tiene que apretar la persona;
  desvanecerse no es una opción.

El titular del problema vive en `problem_title_segments`, con la misma forma que
`hero_title_segments`: partido en piezas para poder pintar el remate. **`tone:
"brand"` es la única aparición del morado en un titular del sitio**, y son dos
palabras — "sigue igual." / "stayed the same." Es la frase que resume la sección
entera; tres palabras más y deja de ser acento.

`problem.jsx` mete además un bloque vacío de ancho completo entre frase y frase
para forzar el renglón: son dos frases y el remate tiene que entrar entero, no
partido con la última palabra colgando sola. Ese bloque es de maquetado y **no
lleva el espacio del texto**: el espacio va igual dentro de la última palabra de
cada frase, o `textContent` sale "encuesta.El".

Y es el titular más grande de la página después del hero (`text-4xl sm:text-5xl`
contra el `text-3xl sm:text-4xl` del resto). Es la sección que abre el problema:
si no pega ahí, lo que sigue no tiene por qué importarle a nadie.

Va en dos partes —`WordPullUp` contenedor y `WordPullUpPiece` por palabra— y
**no recibe un string para partir por espacios.** El titular del hero no es
texto plano: lleva `MoodFace` y `WeatherTile` incrustados y palabras con peso
propio. Un `words.split(" ")` no puede representar eso, así que quien compone
decide qué es cada pieza.

`hero_title.jsx` existe aparte para que `hero.jsx` siga siendo Server
Component. La animación necesita cliente, y marcando el hero entero se irían al
bundle el `Container`, el fondo y los CTA, que no lo necesitan.

`WordPullUp` acepta `heading_level` y `on_view` para poder reusarse en un
titular que no sea el del hero: `h2` porque no puede haber dos `h1` en la
página, y `on_view` para los que están abajo del pliegue, donde si no la entrada
se consumiría mientras el visitante todavía mira el hero. Hoy el único
consumidor es el hero; los dos props existen porque el componente ya se usó así
una vez y volverá a pasar.

Las etiquetas salen de un mapa fijo (`HEADINGS`) y no de `motion[algo]`: si se
calculara al vuelo, React vería un componente distinto en cada render y
remontaría el titular a mitad de la animación.

> **El recorrido va en `em`, no en px.** El titular mide `text-4xl` en móvil y
> `text-6xl` en escritorio; un salto fijo en px se ve exagerado en el chico y
> tímido en el grande.

> **Los retrasos del subtítulo y los CTA continúan la línea del titular**, no
> arrancan de cero: 8 piezas cada 0.075s dejan la última saliendo a los 0.525s,
> así que el subtítulo entra a 0.65s y los CTA a 0.8s. Apareciendo de golpe
> mientras el titular todavía se arma, se leerían como otro bloque.

> Con `prefers-reduced-motion` el `h1` y las piezas se renderizan **planos**,
> sin `motion` y sin un solo estilo inline: nadie se queda mirando un titular
> invisible.

> **Se usa `motion`, no `framer-motion`.** Son la misma librería —`motion` es
> el nombre nuevo— y `motion/react` exporta la misma API. Instalar las dos
> duplicaría el runtime de animación para no ganar nada.

### Tres entradas distintas, y cuándo usar cada una

| | Qué hace | Dispara |
|---|---|---|
| `Reveal` | sube y aparece, una pieza entera | una vez, al cruzar el viewport |
| `WordPullUp` | palabra por palabra, subiendo | una vez (montaje, o `on_view`) |
| `BlurText` | palabra por palabra, desenfocada | una vez, al cruzar el viewport |
| `RotatingText` | una palabra se releva por otra | en bucle, por reloj |
| `Parallax` | deriva vertical mientras cruza | **nunca** — es función del scroll |
| `ScrollPass` | aparece **y desaparece**, con deriva | **nunca** — es función del scroll |
| `ScrollLine` | un trazo que se dibuja y se borra | **nunca** — es función del scroll |
| `ScrollLift` | se levanta y **destapa** lo que tiene detrás | **nunca** — es función del scroll |
| `PinnedChapter` | clava dos secciones y las panea **de lado** | **nunca** — es función del scroll |

`Parallax`, `ScrollPass`, `ScrollLine`, `ScrollLift` y `PinnedChapter` no tienen
disparo: la posición se calcula desde `scrollY`, así que volver hacia arriba
deshace el efecto igual que bajar lo hizo. Los otros tres entran una vez y ahí
quedan.

> **`PinnedChapter` es el único que cambia el eje.** Todo el resto del sitio
> convierte scroll vertical en movimiento vertical; este lo convierte en
> movimiento horizontal. Por eso es también el único que puede quedar sin
> efecto: si no puede clavarse, el riel se entrega para recorrer a mano.

> **`ScrollLine` es una curva SVG que se dibuja con `pathLength`** — ver la
> sección del problema para por qué dejó de ser un `scaleY`. Con movimiento
> reducido va entera y quieta: dibujarse es el efecto, y una línea a medias
> sería información perdida.

> **`Parallax` mide un div exterior sin transform**, igual que `ScrollZoom`.
> Antes ponía el ref de `useScroll({ target })` sobre el mismo `motion.div` que
> trasladaba, y `getBoundingClientRect()` devuelve el rectángulo **con el
> transform ya aplicado**: se movía, se medía corrido y se movía distinto. Con
> un `y` puro no se clavaba como el zoom, pero corría el mapeo.
>
> `class_name` va en el div de **adentro**, no en el que se mide: quien lo usa
> manda layout para los hijos (`flex flex-col gap-4`), y puesto afuera el
> contenedor pasaría a tener un solo hijo y el `gap` no separaría nada.
>
> Medido: a scroll 5600 da +14.2px, a 6100 da −4.0px, y al volver a 5600 da
> +14.2px otra vez. Medido en el planeta:
entrando `0.44 / +63px`, dentro `1.0 / −28px`, saliendo `0 / −90px`.

> **`BlurText` mete el espacio DENTRO de cada palabra** (` `), en vez de
> apoyarse en un `gap` del contenedor. No es maquetado: sin eso el texto del DOM
> queda pegado —"Cualquierorganización"— y un lector de pantalla lo lee como una
> sola palabra.
>
> **`WordPullUp` hace lo mismo**, con la prop `trailing_space` que le pasa quien
> compone: el hero sabe cuál es la última pieza, el componente no. Ahí el
> espacio queda **fuera** del span de las fichas (`MoodFace`, `WeatherTile`),
> así que no las ensancha. Como la ficha no aporta texto, el `textContent`
> muestra dos espacios donde va una — inofensivo, y visualmente es un espacio de
> cada lado, igual que entre dos palabras.
>
> Sacarle el `gap-x` al titular corrió el wrap: el espacio real es más ancho que
> los `0.22em` de antes y la ficha del clima se pasaba al arranque de la tercera
> línea. Se compensó con `max-w-5xl` en vez de `4xl` — **el ancho es lo que
> decide el corte**, no el tamaño de letra.
>
> Se le sacó el `will-change-[transform,filter,opacity]` permanente del
> original: deja una capa de composición viva por palabra para siempre, mucho
> después de que la animación terminó. Motion ya lo administra solo mientras
> anima.
>
> El desenfoque termina en `blur(0px)`, así que el texto final queda tan nítido
> como cualquier otro titular del sitio. Es la única animación de `filter` del
> proyecto y se justifica porque es transitoria; nada queda borroso.

### El orden de la página

```
Hero → Problema → Medición → Planeta → Escala
     → Cómo funciona → Análisis → Confidencialidad → CTA final
```

El **problema va segundo**: primero se plantea que las encuestas de clima no
cambian nada y recién después se afirma la solución. Planeta y escala van
pegados porque son el mismo argumento —alcance— visto de dos maneras.

> **El `pt` entre planeta y escala lo pone escala, no el planeta.** `WorldReach`
> se quedó sin padding vertical a propósito; sin el `pt-24 sm:pt-32` de
> `ScaleTree`, la esfera quedaría apoyada sobre el borde.

Las anclas del navbar (`#how`, `#weights`, `#confidentiality`) conservan su
orden relativo, así que la navegación sigue coincidiendo con la página.

### Las tres secciones de argumento no se ven iguales

`Problem` **apila** `Card` con el scroll y `Measurement` las pone en un **riel
horizontal** con relieve de tecla (`.surface-key`). Lo que no puede pasar es que
todas sean la misma grilla de rectángulos quietos.

**`HowItWorks` desparrama sus fichas en zigzag** y las une con una ruta
punteada: no apila, no corre de costado, se lee bajando en diagonal.

**`WeightsFilters` ya no tiene cajas.** Eran cuatro `GlassPanel` a la deriva;
hoy son una lista numerada con badge y, enfrente, la maqueta del producto. Es la
única de las cuatro que **muestra el sistema** en vez de describirlo, y para la
sección diferenciadora eso es justo lo que faltaba.

> **`Measurement` cambió dos veces, y las dos por lo mismo.** Primero fue sin
> cajas —cada punto sobre una regla— para no ser la tercera reja seguida.
> Después fue una reja bento con relieve, por pedido explícito. Hoy no es una
> reja: es un carrusel, y **el eje es lo que la separa**. Una reja se lee de
> arriba a abajo, igual que las otras dos; el riel se lee de izquierda a derecha
> y ya no compite con nada del sitio.

> **`WeightsFilters` compartía esqueleto con `Problem`** —texto quieto a la
> izquierda, cajas moviéndose a la derecha— y estaba anotado como deuda asumida.
> Al sacarle las cajas, esa deuda se saldó y **se mudó**: ahora el esqueleto que
> repite es el de `WorldReach`, texto a la izquierda e ilustración a la derecha.
> Es un intercambio deliberado y no se leen iguales: enfrente hay una esfera que
> gira contra una captura del producto, y acá la izquierda es una lista numerada
> y no un titular suelto. Si alguna vez se parecen demasiado, la que se mueve es
> `WeightsFilters`: el planeta llegó primero a esa maqueta.

**`Measurement` ya no pone aire propio**: es una diapositiva del capítulo y mide
exactamente una pantalla. El aire con el planeta lo da la pista del capítulo al
soltar.

### La medición tiene dos ejes: la línea llega, y ahí la página gira

Es el recurso de la sección, y todo lo demás está al servicio de eso.

1. La línea que hilvana la pila del problema **no termina ahí**: sale por el
   borde derecho de la diapositiva y **entra al gráfico por el borde izquierdo de
   la siguiente**, a la misma altura.
2. Ahí **se acuesta**. De ese punto en más el scroll ya no arma nada: corre el
   riel hacia la izquierda, y el gráfico del fondo a poco más de la mitad de esa
   velocidad.

**Son dos cajas que se tocan, y eso es lo que lo hace leer como una sola línea.**
Cada una dibuja con el mismo avance del capítulo, así que la cabeza del trazo
pasa de una a la otra sin salto:

| Tramo | Caja | Quién lo dibuja |
|---|---|---|
| la pila del problema | la diapositiva 1 entera | `ScrollLine shape="stack"` |
| el gráfico | la diapositiva 2 entera | `ChartLine`, con el avance del capítulo |

> **Medido a 1920 × 889 en el cuadro del paneo: `dx = 0`, `dy = 0`.** Las dos
> cajas miden 889 de alto y `SEAM_Y` cae en el mismo píxel de las dos.

> **El titular SÍ está a la vista durante el clavado**, igual que en `ScaleTree`.
> Vive dentro de la diapositiva, arriba del riel, y se queda ahí todo el
> recorrido mientras las fichas le pasan por debajo.

### El carrusel de la medición

- **El icono de cada ficha vive en el componente, no en el diccionario**
  (`ITEM_ICONS`, por índice). No se traduce, no cambia por idioma y elegirlo es
  una decisión de interfaz, no de contenido.
- **Las cinco fichas son del mismo alto** (`items-stretch` en el riel) y la
  última, la de imágenes, va **más ancha y última**: las cuatro se leen, esta se
  mira, y al final del recorrido es el premio.
- **El ancho de ficha es fijo, no fluido** (`76vw` en móvil, `292px`, `320px`).
  De ahí sale el ancho del riel, y del ancho del riel sale el recorrido: con
  fichas fluidas el recorrido cambiaría con cada cosa que altere el layout.
- **Las imágenes de `/public/shots/` son de relleno.** Están para que el bloque
  tenga proporciones y ritmo reales. Hoy son **fotos de Unsplash** en JPG
  (`unsplash_*.jpg`), que reemplazaron a los SVG dibujados para ver cómo se
  comporta la ficha con imágenes de verdad: una foto llena el marco, tiene grano
  y contraste propios y se recorta con `object-cover`, cosa que un dibujo plano
  no ponía a prueba. Se reemplazan por capturas del producto dejando las mismas
  llaves de `measurement_shots`, y el `alt` se reescribe con ellas.
- **`ImageCycle` corre por reloj**, como `RotatingText`, y por eso se apaga
  entera con `prefers-reduced-motion`: algo que se mueve solo, sin que el usuario
  haya hecho nada, es exactamente lo que esa preferencia pide que no pase.
  Apagada muestra la primera y se queda ahí.
- `unoptimized` sale de la extensión del archivo: los SVG de relleno no pasan por
  el optimizador de Next salvo que se abra `dangerouslyAllowSVG`, y eso no se
  toca por un placeholder. Las capturas reales van a ser PNG o JPG y se optimizan
  como corresponde.

**El movimiento vertical que le queda a la sección es el del encabezado**, con
`ScrollPass` y un `drift` corto (56, contra los 72 de antes). Va corto a
propósito: el titular es el punto donde la línea del problema termina de bajar, y
si se corre mucho mientras el trazo llega, el encuentro entre los dos deja de
leerse. Los dos hitos de la opacidad siguen cerrados (`FADE_IN` 0.2,
`FADE_OUT` 0.86, contra 0.35 y 0.68 del componente): así el texto llega a pleno
apenas termina de entrar y nunca hay un párrafo atenuado que alguien esté
leyendo.

> **`fill_height` de `ScrollPass` se quedó sin consumidor** al desaparecer la
> reja: era para que el `h-full` de una ficha tuviera contra quién medir a través
> de los dos divs que el componente intercala. La prop y su nota se conservan
> porque el problema es real y va a volver a aparecer la próxima vez que
> `ScrollPass` envuelva una celda de una reja.

#### El clavado y las dos velocidades

```
pista (alto = ventana + travel)
  bloque clavado (sticky top-0, h-screen, overflow-hidden)
    Container
      marco (w-max, h-full)        <- se mide acá: mide lo mismo que el riel
        capa del grafico  x = -travel * CHART_SPEED * u
        riel              x = -travel * u
```

- **`travel` = `rail_width + frame_left * 2 − viewport_width`.** Termina con el
  mismo aire a la derecha que el riel tiene a la izquierda: la última ficha queda
  apoyada en el borde del contenedor, no pegada al de la ventana.
- **El alto de la pista es `ventana + travel`**, o sea 1px de scroll = 1px de
  riel. Es lo que hace que el gesto se sienta como scrollear y no como una
  animación que se dispara sola.
- **Las tres cosas —riel, gráfico y dibujo— salen del mismo `useSpring`.** Si el
  dibujo saliera del scroll crudo y el corrimiento del resorte, la punta del
  trazo quedaría desincronizada del gráfico que la sostiene.

> **El riel se mide con `offsetWidth`, no con `getBoundingClientRect()`.** Lleva
> su propio `transform`, y el rectángulo llega con el transform ya aplicado: se
> mediría corrido, el recorrido cambiaría, y el recorrido nuevo volvería a correr
> la medición. El **marco** de afuera no se transforma y por eso sí se puede
> medir con el rectángulo — de ahí sale `frame_left`.

> **El resorte va corto: `stiffness` 150.** Con uno blando (90 / 26 / 0.6) el
> retraso se ve: en un scroll rápido el bloque se despega **antes** de que el
> riel termine de llegar y la sección se va con la última ficha a medio camino.
> Medido con un salto de ~500px: 370px de riel sin recorrer al soltarse el
> clavado.

#### El gráfico: la punta se queda quieta y el papel corre

`CHART_SPEED` es 0.55. Todo el parallax es eso: con 1 las dos capas viajarían
pegadas y la sección se leería como una sola imagen que se corre de lado.

De ahí sale una cuenta que **no es obvia y es la clave del efecto**: el gráfico
no mide lo que mide el riel, mide `PEN_X × visible + CHART_SPEED × travel`.

- Si midiera lo que el riel, le sobraría justo lo que el gráfico no alcanza a
  traer a pantalla —viaja más lento— y **el pico del final no se vería nunca**.
- Como el trazo crece exactamente lo que el gráfico se corre, la **punta queda
  quieta** en `PEN_X` del ancho visible y el gráfico ya dibujado se le va hacia
  la izquierda: es el papel de un plotter. Es lo que hace ver que el gráfico se
  está dibujando y no que ya estaba hecho. `PEN_X` es 0.9 y no 1 porque pegada al
  borde derecho no se distingue de un trazo que sigue fuera de pantalla.
- El dibujo arranca `RACE_SPAN` (0.55 de una ventana) **antes** del clavado: es
  el tramo en el que el trazo cruza la pantalla y se engancha con el empalme. Sin
  él queda media pantalla de scroll con la retícula vacía entre una cosa y la
  otra.

> **La retícula y el eje van siempre visibles; solo se dibuja el dato.** Es la
> misma idea del riel de `ScrollLine`: el marco de un gráfico existe antes que la
> serie, y ver adónde va a llegar el trazo es lo que hace que dibujarse se lea
> como que se está midiendo algo.

> **Las alturas de la serie están elegidas contra las fichas, no contra el
> plano.** El carrusel va centrado en el bloque y ocupa la banda del medio (~310
> a ~690 de los mil), así que un gráfico prolijo entre esos dos valores queda
> **entero tapado** — se vio en la primera versión, donde de la serie no se veía
> nada. Los vértices se van a las bandas de arriba y de abajo, y lo que cruza el
> medio pasa por detrás de las fichas, que es el mismo recurso de la línea del
> problema. Dos de los ocho caen adentro de la banda a propósito: sin ellos la
> serie alterna arriba-abajo con demasiada regularidad y se lee como una guarda y
> no como un dato.

> **El pico va último y en morado (`--chart-1`).** Es el único color de la
> sección y le toca al dato destacado, que es para lo que existe ese token. Y
> queda a la vista **justo cuando termina el recorrido**: es el remate.

> **`vector-effect="non-scaling-stroke"` reparte el `stroke-dasharray` en
> píxeles de PANTALLA, no en unidades del `viewBox`.** Es lo que hace que la
> punta avance a velocidad uniforme en pantalla aunque la caja esté estirada, y
> también lo que obliga a calcular en qué fracción del dibujo entra cada vértice
> **en tiempo real**: un tramo empinado se come más dibujo que uno plano, y
> cuánto se come depende de la proporción de la caja, que cambia con la ventana.
> De ahí `plot_ratio`. Con las fracciones escritas a mano —o peor, usando la `x`
> de cada punto— los vértices se encienden antes de que el trazo llegue a ellos.
>
> Por lo mismo la serie es una **polilínea** y no curvas: con `L` la cuenta del
> largo de cada tramo es exacta.

> **Los puntos son tramos de largo casi cero con punta redonda**, no `<circle>`.
> Con `preserveAspectRatio="none"` la caja se estira distinto en cada eje —el
> ancho del gráfico contra el alto del bloque— y un círculo saldría ovalado. El
> grosor del trazo, en cambio, lo fija `non-scaling-stroke` en píxeles de
> pantalla, así que la punta redonda es un círculo de verdad en cualquier
> proporción.
>
> `DOT_FADE` es 0.01 y **la rampa termina en el punto, no antes**. Con 0.02 el
> vértice se encendía ~40px antes de que el trazo llegara y quedaba un punto
> flotando adelante de la línea.

> **El gráfico no lleva ni un número ni una etiqueta.** Ningún texto visible del
> sitio vive en un componente, y un eje con valores inventados sería dato falso
> sobre el producto. De este gráfico se lee la forma.

> **La capa del gráfico va primera en el DOM y el riel lleva `relative`.** Sin
> ese `relative`, con una capa absoluta y un riel sin posicionar, el orden de
> pintado se invierte y el gráfico taparía las fichas.

#### Sin clavado: el riel se recorre a mano

Si no se puede clavar —móvil (`PIN_MIN_WIDTH` 1024), ventana baja
(`PIN_MIN_HEIGHT` 640), movimiento reducido, o el riel ya entra en pantalla— la
pista no crece, no hay nada pegado, y el bloque pasa a ser un `overflow-x-auto`
con `scroll-pl-6` y snap. El mismo contenido, manejado por quien lo lee.

- **En móvil el clavado no es una mejora, es una pelea**: un riel horizontal
  tomado del scroll vertical compite con el gesto de la mano.
- **Con movimiento reducido, tomarle el scroll a alguien es exactamente lo que
  esa preferencia pide que no pase.** Ahí el gráfico además se entrega
  **dibujado entero** (`reveal` fijo en 1): dibujarse es el efecto, no el
  contenido.
- **El límite de alto existe porque el bloque clavado mide una pantalla** y las
  fichas tienen que entrar adentro; con `overflow-hidden`, en una ventana muy
  baja se recortarían.
- **El riel suelto recibe el foco** (`tabIndex`, `role="group"`,
  `aria-label` desde `a11y_measurement_rail`): un contenedor que se scrollea
  tiene que poder recorrerse con el teclado. Clavado no hace falta, porque ahí lo
  mueve el scroll de la página, que ya es del teclado.

> **Verificado a 418px de ancho** (en un iframe, porque la ventana de prueba no
> se dejaba redimensionar): sin alto en la pista, bloque en `overflow-x-auto`,
> `scrollWidth` 1792 contra `clientWidth` 403, el gráfico al 100% del riel y
> dibujado, el camino angosto del empalme visible y el ancho oculto.

> **En desarrollo, un cambio que solo toca CSS no vuelve a correr la medición.**
> Los tramos se miden en un `useEffect` que corre al montar y con `resize`;
> Turbopack cambia las clases sin remontar, así que la caja nueva queda medida
> con la geometría vieja y el trazo avanza a una velocidad que no corresponde.
> **No es un bug del código**: se arregla recargando. En una carga limpia los
> tramos coinciden al píxel con la geometría real — verificado.

> El copy sale de `../Clima laboral/flujo_completo_saas_clima.md`, que es la
> fuente que fija `AGENTS.md`. De ahí salen las tres categorías del modelo
> —Existencia, Relaciones, Condiciones— y que el núcleo universal es lo que
> habilita comparar entre organizaciones. **La escala de cuatro opciones sin
> punto medio no está en ese documento**: la aportó el cliente.

### Las fichas del problema se apilan, no se ponen al lado

Las tres no son una reja: son una **pila**. Cada una es `position: sticky` y se
clava 16px más abajo que la anterior (`STACK_TOP` + `index × increment_y`), así
que la que llega tapa a la de antes y le deja asomando el borde. Entre ficha y
ficha hay `STACK_GAP` de aire —medido en pantallas, porque lo que define es
**cuánto scroll hay que recorrer** para que llegue la siguiente— y el `pb` del
contenedor sostiene la pila armada un momento antes de que se vaya.

**Van a la par del titular, no debajo.** De `lg` para arriba la sección es una
reja de dos columnas: el titular se queda quieto a la izquierda (`lg:sticky
lg:top-28`) mientras la pila le pasa por al lado. Los dos arrancan a la misma
altura — `STACK_TOP` es el mismo `top-28`.

> **`lg:items-start` no es opcional.** Sin él la columna del titular se estira a
> la altura de la fila, y un elemento tan alto como su contenedor no tiene por
> dónde pegarse: el `sticky` queda escrito y no hace nada.
>
> **La reja recién entra en `lg`.** En tablet la columna queda tan angosta que el
> titular a `text-5xl` se parte en cuatro renglones. Abajo de ahí van uno debajo
> del otro, y la ficha se acota a `max-w-2xl` para que la línea no se vaya de
> medida.

> **Esto era CSS `sticky` puro y ahora va atado al avance del capítulo.** El
> cambio no fue por gusto: adentro de un bloque clavado la página no se mueve en
> vertical, y `position: sticky` se pega contra un scroll que ahí no existe. Con
> la versión vieja las tres fichas aparecían juntas y quietas.
>
> **Lo que se perdió**: el navegador resolvía el apilado solo, en el compositor,
> sin un frame de JavaScript por movimiento. Ahora hay un `useTransform` por
> ficha. Se paga porque el apilado *es* el contenido de la primera fase del
> capítulo, y sin él la diapositiva no tiene nada que contar mientras se
> scrollea.
>
> **Lo que se ganó**: el reposo de cada ficha es un número y no el resultado de
> una negociación del navegador. Las dos trampas del `sticky` —un `transform`
> sobre el propio elemento pegado, y un margen que le recorta el recorrido al
> `margin box`, las dos medidas al píxel en su momento— **dejaron de aplicar
> porque ya no hay pegado**. La primera sigue viva igual: está anotada en
> `pinned_chapter.jsx`, porque un transform sobre un ancestro sí conviven con el
> `sticky` de la ventana del capítulo.

Sin capítulo clavado —teléfono, pantalla baja, movimiento reducido— **no se apila
nada**: las fichas van una debajo de otra y se leen scrolleando. Apilar tres
tarjetas que nadie puede desapilar sería esconder contenido.

Adentro de cada ficha sigue el relieve, y **cada transform en su propio nodo**:

| Capa | Qué hace |
|---|---|
| `StackCard` | el turno y el escalon; el movimiento sale del avance del capitulo |
| `Tilt` | inclinación 3D siguiendo el mouse (`tilt_strength` 8°) |
| `Card` | la caja, que se levanta 4px con el hover |

> **La sombra en reposo no es decoración.** Apiladas, es lo que dice que una
> ficha está *arriba* de la otra y no al lado. La del hover, más larga, se
> enciende encima.
>
> **El número (01/02/03) es funcional.** Apilada, una ficha tapa a la anterior;
> sin el número no se sabe cuántas van ni cuántas faltan.

El resto de la sección son tres piezas más, y las tres se apoyan en la misma
idea: **plano técnico**, no adorno.

| Pieza | Dónde | Qué hace |
|---|---|---|
| `ScrollLine` | por detrás de las fichas, dos copias | hilvana la pila; se dibuja bajando y se borra subiendo |
| `RulerMarks` | dentro de cada ficha, entre título y cuerpo | cota con marcas: delimita sin meter otra caja adentro de la caja |
| `StackBackdrop` | detrás de toda la sección | degradado vertical que hunde el centro |

> **Tenía un resplandor morado detrás de la pila y se retiró.** El morado es
> acento, no relleno: en esta sección ya se lo gastan las dos palabras del remate
> del titular —"sigue igual."—, y un halo de 34rem detrás de las fichas lo
> repetía en grande sin decir nada. De paso se fue un `blur-3xl` sobre una caja
> enorme, lo más caro de pintar del bloque.

### Las fichas son vidrio y la línea les pasa por detrás

La línea dejó de vivir en el hueco entre columnas: ahora es una **curva que
cruza la columna entera y pasa por detrás de las fichas**, y existe en todos los
anchos — ya no puede quedar encima del texto, porque el texto está arriba de
ella. Las fichas son vidrio (`bg-card/88`, sin `backdrop-filter`), así que el
tramo tapado se ve **desenfocado** a través de cada una.

> **La curva se dibuja con `pathLength`, no con `scaleY`.** El trazo recto
> crecía escalando un rectángulo, que el compositor resuelve gratis;
> `pathLength` termina en `stroke-dashoffset` y repinta el trazo en cada frame.
> Se paga porque **una curva no se puede dibujar escalando**: `scaleY` sobre una
> curva le cambia la forma, no la longitud, y se vería la misma curva cada vez
> más estirada. Es un trazo de 2px sobre un área sin nada más. Si algún día la
> línea deja de ser curva, esto vuelve a ser un `scaleY`.

> **`vector-effect="non-scaling-stroke"` no es opcional con
> `preserveAspectRatio="none"`.** El SVG se estira a una columna mucho más alta
> que ancha, y sin eso el estirado se le aplica también al grosor: el trazo
> saldría finísimo en los tramos verticales y grueso en los horizontales.
>
> Tiene un segundo efecto que conviene saber: **el `stroke-dasharray` también se
> reparte en píxeles de pantalla**, no en unidades del `viewBox`. O sea que la
> cabeza del trazo avanza a velocidad uniforme **en pantalla** aunque la caja
> esté estirada, que es lo que se quiere. Donde eso importa de verdad es en
> `ChartLine`, que tiene que saber en qué fracción del dibujo cae cada vértice —
> ver el gráfico de la medición.

> **El desenfoque NO lo pone `backdrop-filter`.** Es lo primero que se intenta y
> no funciona: sobre estas fichas devuelve siempre un fondo plano. Probado en
> **siete** configuraciones —en la `Card`, en el `Tilt`, en el `sticky` de
> `StackCard`, en una capa absoluta adentro de la ficha, moviendo la línea al
> nivel de la sección, sacando el `isolate`, y aplanando el `preserve-3d`— y en
> todas muestrea algo que no incluye el contenido de la sección. Un div absoluto
> hermano de las fichas **sí** desenfoca, así que la propiedad anda; lo que no
> anda es desde adentro de esta pila. Peor todavía: con `backdrop-filter` puesto,
> la ficha **reemplaza** su fondo por el muestreo y tapa hasta la línea nítida
> que sí se vería por transparencia.
>
> Lo que sí es determinista es el **orden de pintado**. La curva se dibuja dos
> veces: una nítida **debajo** de las fichas y una difusa (`blur-[7px]`, trazo de
> 9px al 16%) **encima**. Donde una ficha tapa a la nítida, lo único que queda a
> la vista es la difusa — o sea que el tramo tapado se lee desenfocado, que es
> exactamente el efecto, sin depender de cómo el navegador arma el backdrop.
>
> La copia difusa **no lleva riel**: encima de una ficha, un riel siempre
> presente se leería como una mancha fija y no como algo que pasa por detrás.
> Y va más gruesa que la nítida porque el desenfoque reparte la tinta: un trazo
> de 2px con `blur(7px)` se disuelve hasta desaparecer.

> **La cara va en `/97`, y el número lo decide cuánto se LEE de la ficha de
> atrás, no cuánto se ve.** Un texto oscuro sobre blanco aguanta muchísimo: al
> 20% se lee entero, al 12 se lee igual, y al 6 todavía se adivinan los
> renglones. Recién abajo del 4% deja de haber letras y queda una veladura.
> Medido en la pila: a `/80`, `/88` y `/94` se leía el cuerpo de la ficha de
> abajo a través de la de arriba, y eso no parece vidrio, parece un error de
> dibujo. Sin `backdrop-filter` no hay cómo desenfocarlo, así que lo único que
> queda es dejar pasar menos.
>
> **El vidrio no lo hace la transparencia de la cara**, lo hace la línea difusa
> que cruza por encima. Por eso subir la opacidad no cuesta nada del efecto. El
> anillo interior claro es el canto; sin él, la cara se lee como una tarjeta
> desteñida.
>
> Lo que sigue viéndose cortado a media línea en el solape **no es la cara**: es
> que la ficha de arriba tapa a la de abajo en mitad de un párrafo. Eso es la
> pila, y pasaba igual cuando las fichas eran opacas.

> **La línea no lleva el morado.** En esta sección el acento ya se lo gastan las
> dos palabras del titular; una segunda pieza morada lo convierte en relleno.
>
> **`StackBackdrop` no repite la retícula de `GridBackdrop`.** Las marcas de
> regla de las fichas ya son la textura de la sección, y dos tramas compitiendo
> se pisan. El resplandor se apaga en móvil: es un `blur-3xl` sobre una caja
> grande.
>
> **Las marcas de la regla son un `repeating-linear-gradient`, no elementos.**
> Treinta y pico de `<span>` por ficha para dibujar rayitas de un píxel es
> pedirle al navegador un layout entero que después nadie lee. El ritmo de una
> marca larga cada cuatro cortas es lo que la hace leer como regla; todas
> iguales es una línea punteada.

> **La sombra del hover es una capa aparte que se enciende por opacidad**, no un
> `box-shadow` que transiciona: la sombra se repinta en cada frame. Va **por
> fuera** de `Card`, que recorta lo que se le salga.
>
> **`Card` lleva `overflow-visible` y `transform-3d`.** Sin lo primero recorta;
> sin lo segundo el `translate-z` del contenido queda aplastado —
> `overflow: hidden` fuerza `transform-style: flat` y la profundidad no existe.
> Ese despegue del texto es lo que hace leer la inclinación como volumen y no
> como una imagen torcida.
>
> **El borde encendido no es adorno.** En oscuro la sombra no se ve contra un
> fondo negro; sin el `ring` del hover, la tarjeta casi no avisa que responde.

`Tilt` ya se apaga sola en touch y con movimiento reducido. Lo que no sabe de eso
es el hover en CSS, así que el levantado y el `translate-z` llevan
`motion-reduce:` propio.

### El análisis: cuatro bloques, y cada uno muestra el sistema

Es la sección **diferenciadora** —el análisis estadístico es lo que separa a este
producto de una encuesta de clima cualquiera— y hasta acá no mostraba el
producto: eran cuatro `GlassPanel` con texto explicándolo.

Hoy es el titular y la bajada arriba, y debajo **cuatro filas: el punto a la
izquierda y su maqueta a la derecha**. Cada maqueta muestra al producto haciendo
exactamente lo que su punto promete.

| | Punto | Maqueta |
|---|---|---|
| 01 | Uní filtros entre sí | `CrossShot`: los tres chips del cruce, `n = 214`, y el cruce (`3,4`) contra el general (`2,9`) |
| 02 | Ponderá por categoría | `WeightsShot`: los pesos por categoría, y el ponderado (`3,1`) contra el simple (`3,4`) |
| 03 | Compará poblaciones equivalentes | `CompareShot`: Norte contra Sur, y al pie lo que las hace comparables |
| 04 | Sabé cuándo no alcanza | `ThresholdShot`: un cruce con `n = 6` y la barra **vacía y punteada** |

**Las cuatro filas van igual** —texto a la izquierda, maqueta a la derecha— y no
alternadas: con el orden fijo el ojo siempre sabe dónde cae el título, y lo que
cambia de fila en fila es la maqueta, que es lo que hay que mirar.

> **El título de cada punto es más grande que la tipografía de ítem del sitio**
> (`text-xl sm:text-2xl` contra `text-lg sm:text-xl`), y es la única excepción a
> esa regla. El rol cambió: ya no es un ítem dentro de una lista apretada, es el
> encabezado de un bloque que se lleva media pantalla y tiene una ilustración al
> lado. A `text-lg` quedaba chico contra la maqueta.

> **El titular lleva el efecto del planeta.** `BlurText` palabra por palabra,
> envuelto en `ScrollPass` para que además se vaya al salir. Es la única mezcla
> de los dos en el sitio: `BlurText` entra una vez y `ScrollPass` es función pura
> del scroll, así que en la primera entrada las dos opacidades se multiplican.
> Se pidió explícitamente y se ve bien; si alguna vez el desenfoque se lee
> lavado, lo que sale es el `ScrollPass`.

> **Se retiró el `sticky` de la columna izquierda.** Existía porque la izquierda
> era corta y la derecha larguísima. Con el texto repartido en cuatro filas, cada
> una al lado de su maqueta, no hay nada que pegar.

#### El parallax sale de la diferencia entre dos números

Las dos columnas de una fila entran con **distinta deriva** —`TEXT_DRIFT` 45 y
`SHOT_DRIFT` 85—, y esa diferencia es el parallax: dos columnas que entran a
distinta velocidad se leen a distinta profundidad. Sale gratis, porque es el
mismo `ScrollPass` que ya hace la entrada y la salida, con otro número.

> **Había un `Parallax` aparte para esto.** Con una sola maqueta se justificaba;
> con cuatro filas eran cuatro componentes más midiendo el mismo scroll para
> conseguir el mismo efecto.

#### `SHOTS` no puede vivir con las maquetas

El array que dice qué maqueta va con qué punto vive en `weights_filters.jsx`, que
es un Server Component, y **no** en `system_shots.jsx`, que es donde están las
maquetas.

Es una restricción de RSC, no una preferencia: `system_shots.jsx` es `"use
client"`, y de un módulo cliente un Server Component sólo puede importar
**componentes**. Un valor común —un array, un objeto— le llega como referencia de
cliente y no como el dato. Estuvo un rato exportado desde ahí como
`SYSTEM_SHOTS`, y la página devolvía 500: `SYSTEM_SHOTS[index]` era `undefined`.

#### Las maquetas no son adornos

Las cuatro van sobre **`.org-canvas`**, la misma superficie del organigrama de la
escala. Es a propósito: tienen que leerse como una parte más del producto y no
como una ilustración de la página de marketing.

- El **morado sale de `--chart-1`** y va sólo en la primera barra de cada
  maqueta, que es la que la sección promete. La de referencia usa `--chart-3`,
  gris, que es exactamente su papel.
- **`ThresholdShot` no dibuja barra**: el valor es una raya y el lugar de la
  barra queda punteado y hueco. Es el remate de las cuatro — donde las otras tres
  muestran un número, ésta muestra que no lo hay. Dibujar una barra corta diría
  justo lo contrario de lo que dice el punto. Y va **sin rojo**: la paleta es
  blanco y negro con morado, y además esto no es un error, es el sistema haciendo
  lo que tiene que hacer.
- Las barras crecen con **`scaleX` y `origin-left`**, nunca con `width`. El valor
  numérico va **fuera** de la barra: escalar el padre le deforma las letras a los
  hijos.
- **La etiqueta va arriba de la barra, no al lado.** Al lado hay que fijarle
  ancho a la columna de texto, y ahí cualquier etiqueta larga —"General de la
  empresa", "This cross-section"— parte en dos renglones y desalinea las dos
  filas. Arriba, el largo del texto deja de importar en los dos idiomas.
- El movimiento entra **una sola vez** al cruzar el viewport, y **las barras
  llegan después de lo de arriba** (`BAR_DELAY`): son la consecuencia del cruce,
  de los pesos, de la comparación. Creciendo a la vez, la maqueta se mueve de
  golpe y no se lee que una cosa produce la otra.
- Las únicas animaciones por reloj del sitio son `RotatingText` e `ImageCycle` y
  no hacen falta cuatro más: el ritmo continuo lo pone la deriva diferencial de
  las dos columnas, que es función del scroll y se deshace al subir.
- Con `prefers-reduced-motion` se entregan armadas. Armarse es el efecto; el
  resultado es el contenido.

### Los pasos: tres fichas clavadas en zigzag

Era una `<ol>` con `Separator` entre ítem e ítem: lo más plano de la página justo
en la sección que más tiene que convencer, porque el producto se vende por
autoservicio. Hoy son tres fichas —chinche arriba, número grande, paso— que
alternan izquierda, derecha, izquierda, con una **ruta punteada** que las une.

El copy también cambió: **una idea por paso**. Los cuerpos tenían tres oraciones
cada uno y en una ficha de 340px eso es un párrafo, no un paso.

#### La reja, y por qué cada ficha declara su fila

El zigzag sale de `STEP_CELLS`: columna, fila y ángulo por paso. Dos cosas que no
son obvias:

- **La fila va declarada.** Con sólo `col-start`, la ficha 2 se mete en el hueco
  que dejó la 1 y las dos terminan en la primera fila: sale una reja de dos
  arriba y una abajo, no un zigzag. Cada una pide su `row-start`.
- **Nada de posiciones absolutas con alto fijo.** La referencia de la que salió
  esto clavaba cada ficha en un `top` y le fijaba el alto al bloque por
  breakpoint. Con eso, un texto una línea más largo —o el mismo texto en inglés—
  desacomoda todo. Con celdas, el alto lo pone el contenido.

La rotación es de 2° y sólo desde `md`. En una columna las fichas van derechas:
torcidas y apiladas se leen como un error de maquetado y no como un tablero. Va
en la propiedad `rotate` de Tailwind v4, que **no** es el `transform`, así que
convive con el `rotateX/rotateY` que `Tilt` pone por `style` en vez de pisarlo.

Medido a 1440: las fichas ocupan del 0 al 30% y del 70 al 100% del ancho de la
reja, y las filas caen en 157, 500 y 843 por mil del alto. De ahí salen los
números de `TRAIL`.

#### La ruta es punteada, y la dibuja el scroll

Punteada **a propósito**: la línea sólida ya es el motivo del capítulo problema →
medición, donde hilvana la pila y termina siendo el gráfico. Acá tiene que leerse
como otra cosa —una ruta de un paso al siguiente— y no como el mismo hilo
cruzando la página de nuevo.

> **El avance va en una máscara, no en el trazo visible.** `pathLength` no
> dibuja: lo que hace es escribir `stroke-dasharray` (ver
> `motion-dom/render/svg/utils/path`), o sea que se pelea por el mismo atributo
> con el que se hace el punteado. Puestos juntos gana `pathLength` y la línea
> sale sólida. Con la máscara cada uno usa su atributo: el trazo de abajo es
> punteado y quieto, y el de la máscara —sólido, blanco y más grueso— es el que
> crece.

> **La máscara NO lleva `non-scaling-stroke`, y costó encontrarlo.** El viewBox
> se estira 11× en `x` y 0.85× en `y`: el largo del camino medido en coordenadas
> del viewBox no es el mismo que medido en pantalla. `pathLength` normaliza
> contra el primero y el trazo constante se dibuja contra el segundo, así que el
> avance se queda corto y **la ruta nunca termina de destaparse** — se cortaba en
> la ficha 2 con el avance ya en 1. Sin él, las dos cuentas viven en el mismo
> espacio. El grosor va en unidades del viewBox y sobrado: lo único que hay
> debajo es una línea de 2px, así que taparla de más no se ve.
>
> El trazo **visible** sí lo lleva: ahí es lo que evita que el punteado salga
> finito en los tramos verticales y grueso en los horizontales.

En `md` para abajo la ruta se apaga: en una columna no hay zigzag que unir.

#### El fade in y el fade out son de cada ficha

Cada una va envuelta en su propio `ScrollPass`, con los hitos abiertos
(`0.28` / `0.78`) para que nunca quede una ficha translúcida mientras alguien la
está leyendo. Volviendo para arriba se deshace, que es lo que lo separa de
`Reveal`.

### Un ítem se ve igual en toda la página

Las cajas cambian —`Card`, `GlassPanel`, o ninguna— pero **la tipografía de un
ítem es la misma en todas las secciones**. Antes cada una tenía la suya
(`text-lg` en el problema y la medición, `text-xl` en los pasos, `text-base` en
los pesos), y el mismo rol se leía de tres tamaños distintos según dónde cayera.

| Rol | Clases |
|---|---|
| Título de ítem (`h3`) | `text-lg font-medium tracking-tight sm:text-xl` |
| Cuerpo gris (ítem y bajada) | `text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]` |

Rige en `problem`, `measurement`, `how_it_works`, `confidentiality`, `scale_tree`
y `final_cta`.

**`weights_filters` es la única excepción, y sólo en el título** (`text-xl
sm:text-2xl`). Ahí el rol dejó de ser un ítem de una lista apretada: cada punto
es un bloque que se lleva media pantalla con una maqueta al lado. El cuerpo gris
sigue siendo el mismo de todos.

> **Todo el texto gris del sitio mide 15px, y 14 en pantalla chica.** Antes era
> `text-lg`: 18px contra los 20 del título, o sea el mismo peso dos veces y una
> ficha sin primera línea de lectura. **El cuerpo es el detalle, no el titular**,
> y el escalón tiene que verse. Los 14px de móvil no son una concesión: 15px en
> una tarjeta de 76vw deja renglones de tres palabras.
>
> Y arrastró el tamaño de las tarjetas. El copy se acortó a una idea por ficha
> —el título afirma, el cuerpo completa— así que las cajas también bajaron: `p-5`
> en el riel, `p-6` en la pila, y la ficha de capturas de `min-h-64` a `min-h-52`
> porque es la que le fija el alto a todo el riel.

### La escala: cuatro organizaciones en pestañas

`scale_tree.jsx` va **debajo de `Measurement`**, no al final. Muestra cuatro
organizaciones de menor a mayor —20, 300, 4.000 y 50.000 personas— con las
pestañas a la izquierda y el organigrama a la derecha. La profundidad del árbol
crece con cada una: 2, 3, 3 y 4 niveles. Eso *es* el argumento de la sección.

> **Esto se recorría con el scroll y ahora son pestañas.** Había una pista de
> 180vh (`4 × 45vh`), un bloque clavado, `useScrollSteps` y un menú de cuatro
> renglones que giraba como un tambor con la posición continua. Se pidió
> cambiarlo por un elemento de pestañas: **el cambio lo dispara la persona, no
> el scroll.** Con eso se fueron la pista, el `sticky`, el tambor 3D y
> `use_scroll_steps.jsx` entero —`scale_tree` era su único consumidor—, y la
> página se acortó ~1.700px.
>
> También se fue **la rama de `prefers-reduced-motion`**, que existía porque
> clavar un bloque y cambiarle el contenido por debajo es justo lo que esa
> preferencia pide que no pase. Un control que se clickea no tiene ese problema:
> lo único que queda por apagar es la animación de entrada del panel.

Se pidió con un componente de Framer
(`framer.com/m/Tabs-card-f58s7K.js`). **No se puede importar**: trae el runtime
privado de Framer (`addFonts`, `ComponentViewportProvider`, `useVariantState`,
`withCSS`, `addPropertyControls`), importa `framer-motion` —acá se usa `motion`
v12— y encadena otro módulo remoto de `framerusercontent.com`, todo compilado y
minificado. Se rehizo con **Radix Tabs, que ya estaba** en el `radix-ui` de las
dependencias: no se agregó nada.

#### La tarjeta activa

La opción activa es una **tarjeta redondeada rellena** que contiene la etiqueta y,
debajo, el tamaño de la organización (`scale_orgs[].size`). Las inactivas quedan
como texto suelto. El panel del diagrama tiene su propio canto redondeado
(`.org-canvas`). Son **dos piezas separadas**, no un marco exterior único.

> **El despliegue del tamaño usa `grid-template-rows: 0fr → 1fr`, y es una
> excepción consciente a "solo `transform` y `opacity`".** Esa regla existe por
> las animaciones atadas al scroll, que recalculan layout **en cada frame**. Esto
> es una transición de 200ms sobre un elemento, disparada por un clic. Empujar a
> los hermanos hacia abajo con `transform` no se puede, y reservar el hueco
> siempre —cuatro espacios vacíos— mata la idea de que se despliega. El
> `min-h-0` del hijo no es decorativo: sin él la fila de `0fr` no lo puede
> achicar.

> **Las pestañas son controladas (`value` + `onValueChange`), no
> `defaultValue`.** El tamaño plegado necesita `aria-hidden`, y eso no se puede
> decidir desde CSS: sin el estado en JavaScript, un lector de pantalla anuncia
> las cuatro cifras aunque tres estén ocultas.

#### Cuatro peleas con el componente del registro

`ui/tabs.jsx` sale del registro y **no se toca a mano**. Todas se resolvieron
desde afuera, y todas están medidas. El patrón es siempre el mismo: **para pisar
una clase del registro hay que igualar su cadena de modificadores**, o
`tailwind-merge` no puede deduplicar y decide el orden del stylesheet.

- **La raíz es `TabsPrimitive.Root`, no el `Tabs` del registro.** El del registro
  se queda con `orientation` para armar su `data-orientation` y **no se lo pasa a
  Radix**, así que el teclado quedaría siempre en horizontal por más que la lista
  se vea en columna. Radix pone ese mismo atributo por su cuenta, así que las
  clases `group-data-vertical/tabs:*` siguen funcionando. Las otras tres piezas
  se usan sin tocar.
- **El indicador se muda a la izquierda, no se reemplaza.** En columna la pestaña
  ocupa el ancho entero de su celda, así que el `after:` anclado al canto derecho
  terminaba a 250px del texto, flotando contra el organigrama. Se probó con
  `border-l-2` y **no sirve**: el registro trae `dark:data-active:border-input`,
  que pinta los cuatro bordes, y como los modificadores no coinciden
  `tailwind-merge` no puede deduplicar — en claro se veía el morado y en oscuro
  no. Reusando `after:*` con los **mismos** modificadores, la deduplicación
  funciona.
- **`justify-start` pisa al `justify-center` del registro.** Un flex centrado que
  desborda reparte el sobrante a los DOS lados, y lo que se va por la izquierda
  **no se alcanza scrolleando**: medido a 390px, la primera pestaña quedaba en
  `left: -176` con `scrollLeft` en 0.
- **El alto de la lista en fila y el fondo de la tarjeta.** Dos casos del mismo
  problema, resueltos distinto porque uno se podía igualar y el otro no:
  - `group-data-horizontal/tabs:h-auto` contra el `group-data-horizontal/tabs:h-8`
    del registro. Un `h-auto` pelado no alcanza. Medido: la lista se quedaba en
    32px con la pestaña activa midiendo 76, y el tamaño desplegado se recortaba.
  - El fondo de la tarjeta va en **`style` en línea**, no en una clase.
    `variant="line"` trae
    `group-data-[variant=line]/tabs-list:data-active:bg-transparent`, que **empata
    en especificidad** con cualquier `group-data-vertical/tabs:bg-*` — ahí no hay
    cadena que igualar, decide el orden del stylesheet. Medido: el fondo salía
    `rgba(0,0,0,0)`. Un estilo en línea gana siempre, y el color sigue saliendo
    del token (`var(--muted)`).

> **Ojo al depurar esto**: `getComputedStyle().backgroundColor` leído por CDP
> devolvió `rgba(0,0,0,0)` **incluso con un `!important` rojo en línea que sí se
> veía en pantalla**. Para decidir si un fondo se aplica, la captura manda sobre
> la lectura.

#### Responsive

La orientación de Radix se sigue de un `matchMedia("(min-width: 1024px)")`
**inline en la sección** —hay un solo consumidor, no amerita un hook—. No es
cosmética: decide qué flechas mueven el foco, ↑/↓ en columna y ←/→ en fila.
Arranca en `false` y se corrige tras el montaje, como `useReducedMotionSafe`; lo
único que cambia es un atributo y el manejo de teclado, así que no hay salto.

En teléfono la lista se recorre de lado y el panel también: `OrgChart` pinta
cajas con `whitespace-nowrap` y el árbol de cuatro niveles no entra. El
`overflow-x-auto` de la lista **recorta también en vertical** —si un eje es
`auto`, el otro deja de ser `visible`—, así que el subrayado del registro, que
cuelga en `bottom-[-5px]`, quedaba invisible: se mete adentro con
`after:bottom-0` y la lista lleva `pb-1.5` para que entre.

> Verificado a 390px de ancho **dentro de un iframe** —las media queries
> resuelven contra el viewport del iframe, que es la única forma de conseguir un
> viewport angosto real cuando la ventana está maximizada—: orientación
> horizontal, la lista scrollea, el árbol de cuatro niveles entra, subrayado
> visible y **cero desborde horizontal de la página**.

> **El alto del organigrama es fijo** (`CHART_MIN_HEIGHT`). Los cuatro árboles
> tienen profundidades distintas; dejándolo libre, el panel cambiaba de alto en
> cada pestaña y todo lo de abajo pegaba un salto.

> **Radix desmonta el panel inactivo**, así que la animación de entrada corre
> sola en cada cambio y no hace falta `key`.

**El organigrama se dibuja con dos trazos por nivel** (`.org-children`,
`.org-branch` en `globals.css`): una vertical que baja del padre y una
horizontal que une a los hermanos.

> **La horizontal la dibuja cada HIJO, media a cada lado**, no el contenedor de
> una sola pieza: el primero la tira desde su centro hacia la derecha, el último
> desde su izquierda hasta su centro, los del medio de lado a lado, y el hijo
> único no la dibuja. Sumadas dan una línea continua del centro del primero al
> centro del último **sea cual sea el ancho de cada rama**.
>
> La versión anterior la dibujaba el contenedor con una cuenta de `50%/n` que
> asumía ramas de igual ancho. Con `flex: 1 1 0` parecía cierto, pero
> **`min-width: auto` le da más ancho a la rama con más contenido**: en los dos
> árboles asimétricos —los dos últimos— los centros se corrían y la línea moría
> antes de llegar a la última caja. Por eso ahora las ramas van a ancho de
> contenido (`flex: 0 0 auto`): ya no hace falta que sean iguales.

> **Las líneas usan `--org-line`, no `--border`.** `--border` vale `#e5e7eb`,
> que es más **claro** que el hueso del fondo (`#d6d5d1`): las líneas
> desaparecían. Ese token está pensado para el borde de las tarjetas blancas,
> no para dibujar sobre el fondo de página. `--org-dot` es la trama de puntitos
> del fondo, más tenue: es textura, no dibujo.

> **El punteado corre**, para que se lea que algo circula del padre al hijo. Se
> anima `background-position`, que no toca el layout: solo repinta una franja de
> 2px. Se apaga con `@media (prefers-reduced-motion: reduce)` en el propio CSS,
> sin depender de nada de JavaScript.
>
> Las líneas son de **2px y más trazo que hueco** (6px de raya, 4px de aire).
> Con 1px y mitad-y-mitad, las esquinas caían seguido dentro de un hueco y los
> codos se veían cortados: la unión entre la vertical y la horizontal es justo
> donde no puede faltar tinta. La horizontal además se estira 1px hacia cada
> lado para meterse debajo de las verticales de las puntas.

> **Las cajas usan el mismo relieve que los CTA del hero**: luz arriba, sombra
> abajo y un canto **sólido** de 3px que es el costado de la pieza, no una
> sombra difusa — por eso va sin desenfoque.
>
> El canto de la raíz sale de un `color-mix` de su propia cara y sirve en los
> dos temas. El de las cajas de rama **no**: necesita un token por tema
> (`--box-edge`, que hoy comparte con `.surface-key`), porque en oscuro la
> tarjeta ya es casi negra y oscurecerla más la funde con el fondo. Ahí el canto
> va más **claro** que la cara.

> **La trama de puntitos va en una capa aparte, no en el contenedor.**
> `mask-image` recorta al elemento **y a todo lo que tenga adentro**: puesta en
> el contenedor, la máscara desvanecía también las cajas de las puntas del
> organigrama. Ahora vive en un `::before` detrás del contenido.

> **No se usó React Flow.** Da los mismos tres efectos —aristas animadas, fondo
> de puntos, grafo— pero suma ~383KB sin comprimir (~110KB gzip) a una página de
> marketing, no trae auto-layout (habría que escribir el posicionamiento igual),
> y su marca de agua solo se quita con suscripción Pro. Encima captura la rueda
> del mouse para hacer zoom, que dentro de una sección con el scroll tomado
> dejaría al visitante atrapado. Las tres cosas salen en CSS por 0KB.

### La palabra que se releva

En el titular del planeta, "organización" se va relevando por "empresa" y
"negocio" (y su equivalente en inglés). Por eso `BlurText` pasó a ser
**contenedor + pieza**, como `WordPullUp`: recibiendo la frase como string no
había dónde meter una pieza que no fuera texto. El titular vive en
`world_title_segments`, con la misma forma que `hero_title_segments`.

> **`RotatingText` declara variantes propias, no objetos `animate` sueltos.** No
> es estilo, es obligatorio: vive dentro de `BlurText`, que maneja su titular
> con variantes (`hidden`/`shown`), y **motion propaga esas etiquetas a todos
> los componentes de movimiento que tenga debajo**. Las letras, que no conocían
> esas etiquetas, se quedaban clavadas en su estado inicial — invisibles y
> corridas 48px. Declarando etiquetas propias (`out`/`in`/`gone`) y poniéndolas
> en el envoltorio, ese subárbol deja de heredar.

> **`popLayout`, no `wait`.** Con `wait` la palabra que sale tiene que terminar
> antes de que entre la siguiente, y en ese hueco el renglón se queda **sin
> nada**: el titular pegaba un salto en cada vuelta. Con `popLayout` la saliente
> se saca del flujo y la nueva ocupa su lugar de inmediato; el `layout` del
> contenedor anima el cambio de ancho, que no es el mismo para las tres
> palabras.

> **La rotación se detiene con la pestaña oculta.** No es solo ahorro: los
> temporizadores siguen corriendo en segundo plano pero las animaciones no, así
> que las palabras que salen nunca terminan de salir y se **amontonan**. Se vio
> en la prueba: llegó a haber tres encimadas.

> **El espacio entre palabras es un ` ` explícito**, no un espacio común:
> al final de un `inline-block` el espacio normal se colapsa y la frase sale
> pegada ("mundoenunmismosistema"). Va escrito como escape y no como carácter
> —aunque el carácter funcione igual— porque un espacio duro invisible en el
> fuente es imposible de ver al leer el código y rompe cualquier búsqueda.

> Con `prefers-reduced-motion` la palabra se queda en la primera y no rota. Ahí
> `RotatingText` devuelve un span plano: sin el `sr-only` duplicado, el
> `textContent` queda limpio.

### El planeta

`globe.jsx` envuelve **cobe**, que dibuja en WebGL. De ahí salen dos cosas que
no se parecen al resto del sitio.

**Los colores no pueden salir de las variables CSS.** El shader recibe tripletas
0-1 y no hay nada que lea CSS del otro lado, así que `PALETTES` repite los
valores del sistema en la unidad que el shader entiende, una entrada por tema, y
se elige con `resolvedTheme` de next-themes.

| | claro | oscuro |
|---|---|---|
| base | `#ebebee` | `#524f5c` |
| marcas y arcos | `#5b21b6` | `#8b5cf6` |
| halo | `#d6d5d1` | `#0b0a0f` |
| `dark` | `0` | `0.55` |
| `diffuse` | `1.5` | `1` |
| `mapBrightness` | `5` | `11` |

> **El halo tiene que ser exactamente el fondo de la página.** Es el resplandor
> que rodea la esfera; si no coincide, se ve el cuadrado del canvas recortado
> contra la sección.

> **En oscuro la esfera va bastante más clara que el fondo** (`#524f5c` contra
> `#0b0a0f`). Igualarla al fondo la convertía en una silueta: se veían los
> puntos flotando y no un planeta.
>
> No alcanza con subir `baseColor`: **el que oscurecía era `dark`**, que
> multiplica por encima del color base, así que con `dark: 1` la esfera seguía
> casi negra por más que se subiera la base. Bajarlo a `0.55` es lo que la hace
> aparecer.
>
> `dark` y `mapBrightness` se mueven juntos en direcciones opuestas: aclarar la
> base lava los continentes, porque `mapBrightness` es el contraste de los
> puntos **contra** esa base. Por eso en oscuro va en `11` y en claro en `5`.

> **Los `markers` y `arcs` son constantes de módulo, no literales en el JSX.**
> Están en las dependencias del efecto que crea el planeta: un array nuevo en
> cada render lo destruiría y lo volvería a crear entero cada vez.

> **El bucle se detiene cuando el planeta no está en pantalla.** Un
> `requestAnimationFrame` con WebGL girando en una sección que nadie mira gasta
> batería por nada, y esta sección vive bien abajo del pliegue. Lo resuelve un
> IntersectionObserver con 200px de margen. Verificado: fuera de pantalla los
> píxeles del canvas dejan de cambiar.

> Con `prefers-reduced-motion` el planeta **no gira solo** (`speed = 0`), pero
> se sigue pudiendo arrastrar: eso lo pide la persona, no se lo imponemos.
> Verificado comparando el canvas a 1.4s de distancia: idéntico con movimiento
> reducido, distinto sin él.

> **Los tooltips de la versión original se retiraron.** Se posicionaban con CSS
> Anchor Positioning (`position-anchor`, `anchor()`), que hoy solo implementa
> Chrome. En Firefox y Safari la variable `--cobe-visible-*` igual se setea —una
> custom property siempre funciona— así que las etiquetas aparecían visibles
> pero ancladas a ningún lado. Los puntos y los arcos se dibujan dentro del
> canvas y no tienen ese problema.

### Props de componentes

| Prop | Usada en | Significado |
|---|---|---|
| `dict` | todas las secciones | el diccionario del idioma actual |
| `lang` | navbar, footer, lang_switch | idioma actual |
| `class_name` | componentes de motion/effects | clases extra desde afuera |
| `children` | container, parallax, reveal | contenido envuelto |
| `shape` | scroll_line | qué camino dibujar; hoy sólo `"stack"` |
| `progress` | scroll_line | avance 0→1 del dibujo; por defecto, el de la pila del capítulo |
| `index` / `count` | cards_stack | turno y escalón de una ficha dentro de la pila |
| `stack_steps` | pinned_chapter | cuántas fichas tiene la pila; de ahí sale el largo de la fase 1 |

| `reveal` | chart_line | fracción del gráfico dibujada, como MotionValue |
| `plot_ratio` | chart_line | alto sobre ancho de la caja del gráfico |
| `rail_label` | carousel_rail | nombre accesible del riel; solo se usa sin clavado |

> `class_name` es la prop **nuestra**; se pasa al DOM como `className`. La distinción es a propósito: `className` es de React, `class_name` es de nuestra API.

---

## Convención de nombres

**snake_case en inglés.** Tres excepciones, obligadas por el framework:

| Caso | Convención | Por qué |
|---|---|---|
| Componentes React | `HeroVisual` | JSX trata las minúsculas como etiqueta HTML |
| Hooks propios | `useParallax` | el linter solo detecta `/^use[A-Z]/`; en snake_case dejaría de vigilar las reglas de hooks |
| Archivos de Next.js | `page.js`, `layout.js`, `proxy.js` | reservados por el router |

Tokens CSS en kebab-case (`--muted-foreground`): los genera shadcn y renombrarlos rompe las actualizaciones del registro.

---

## Zonas de escritura

Ningún archivo tiene dos dueños.

| Agente | Escribe en |
|---|---|
| `architect` | `docs/**` |
| `creative` | `src/components/motion/**`, `src/components/effects/**` |
| `programmer` | todo el resto de `src/` y los configs |
| `qa` | nada — solo reporta |

Si necesitás un cambio fuera de tu zona, lo reportás; lo aplica el dueño.
