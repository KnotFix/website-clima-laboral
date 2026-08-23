# La documentación del producto

Documento de referencia de la sección de docs. **Se lee antes de escribir la primera página.**
Dueño: `architect`. Extiende a `architecture.md`: los nombres que se inventen acá se registran acá,
pero el mapa de archivos y las reglas de diseño del sitio siguen siendo de aquel.

Estado: **esqueleto en pie, 21 páginas publicadas** en los dos idiomas (42 archivos) y **las seis
capturas puestas** (2026-08-17): «Empezar», «Conceptos», «Interpretar», «Para tu gente», «Cuenta» y
«Referencia», más el **changelog con 9 entradas**. La última en entrar fue **«Seguridad y datos»**,
publicada el 2026-08-18 tras cerrarse el hueco de los respaldos. Falta lo marcado abajo: las
capturas de la HOME, que siguen siendo fotos de Unsplash.

**`anonymity` se publica** (decisión del usuario, 2026-08-17) — ver «Lo que necesita verificación».

---

## Las capturas — PUESTAS el 2026-08-17

Las seis están en `public/docs/` y el build ya no dibuja ningún hueco. Las páginas se habían escrito
**con su lugar reservado**: `<Shot>` dibuja un recuadro punteado con el nombre del archivo que
espera, así que la doc se leía entera antes de que existieran las imágenes. El hueco es visible a
propósito — una captura faltante que no se nota se publica.

| Archivo | Dónde | Qué muestra |
|---|---|---|
| `estructura-arbol.png` | `first-study` | El árbol de una cuenta: raíz, áreas y departamentos |
| `nomina-importar.png` | `first-study` | El asistente de nómina en el **paso 1**: mapeo de columnas y muestra de filas |
| `boletas-editor.png` | `first-study` | El detalle de una boleta: las dos secciones fijas con candado y las propias debajo |
| `estudio-wizard.png` | `first-study` | El wizard en **Alcance**: árbol, población elegible y muestra mínima |
| `kiosco-panel.png` | `kiosk` | Dos estaciones ocupadas con quién responde en cada una, y la lista de personas con su progreso |
| `segmentos-panel.png` | `segments` | El panel lateral: árbol de rama arriba, ejes demográficos debajo, contador de respuestas |

⚠️ **Cada `<Shot>` lleva su `ratio` REAL** (`ratio="1387 / 768"` y así). El default es 16:9 con
`object-cover object-top`, o sea que una captura más alta que ancha —el diálogo de nómina es
retrato— se publicaría **recortada por abajo** sin que nada falle. Si se reemplaza una imagen por
otra de distinta proporción, ese atributo es parte del cambio.

⚠️ **El `alt` describe lo que la imagen MUESTRA, no lo que se había planeado mostrar.** Los seis
`alt` originales describían la captura ideal y tres no coincidían con la que llegó (el organigrama
al costado que no está, el paso de previsualización que terminó siendo el de mapeo, los filtros
demográficos aplicados que están todos en «Cualquiera»). Un `alt` que describe algo ausente no es un
detalle de estilo: es exactamente la información que recibe quien no ve la imagen.

### De dónde salen — la regla CAMBIÓ

**Salen de una cuenta con datos SEMBRADOS Y FICTICIOS** («Ingenio Santa Rita»), no del modo demo
(decisión explícita del usuario, 2026-08-17). Hasta ese día este documento exigía el modo demo, y el
motivo de fondo sigue en pie y no se toca: **una captura no puede publicar la estructura, la nómina
ni los resultados de un cliente real**. Lo que se aflojó es el CÓMO, no el qué — la demo garantizaba
esa propiedad por construcción, un tenant sembrado la garantiza porque quien lo sembró sabe que los
datos son inventados.

> **Consecuencia conocida:** las docs muestran «Ingenio Santa Rita» y la demo a la que el lector
> puede entrar es «Café del Valle S.A.». Los nombres no coinciden. Es aceptable —nadie compara— pero
> si algún día se linkea la demo desde cada página («probá esto en la demo», decisión abierta #3),
> conviene rehacerlas ahí.

> **A la HOME le siguen faltando.** `public/shots/` son tres fotos de Unsplash
> (`unsplash_compare`, `unsplash_segments`, `unsplash_team`) alimentando el carrusel de la medición:
> el sitio vende el producto sin mostrarlo. Es un problema aparte del de las docs y sigue abierto.

---

## Dónde viven las docs, y por qué acá

**MDX dentro de este mismo sitio, en `/[lang]/docs`.** No un proyecto aparte.

> **No es Docusaurus, y la razón no es el gusto.** Docusaurus es React pero no es Next: build propio,
> router propio y CSS propio (Infima). Nada de este sitio cruzaría esa frontera —ni `Container`, ni
> `PageLight`, ni `PageGrain`, ni el `ThemeProvider`, ni un solo token—, así que las docs serían un
> segundo design system envejeciendo en paralelo al primero. Su i18n tampoco es el de acá: es
> `i18n/<locale>/docusaurus-plugin-content-docs/`, no `/es` y `/en`, y `swap_locale_in_path` no lo
> cruza. Y son dos builds y dos deploys pegados con un rewrite.
>
> Lo que Docusaurus da a cambio —sidebar, TOC, búsqueda, versionado— es una tarde de trabajo lo
> primero y **algo que este producto no necesita** lo último (ver «Versionado»).

> **Tampoco en el front del producto.** `Front-End/` es una SPA de Vite detrás de Clerk: sin SSG y
> sin SEO. Las docs de un SaaS que se vende **en autoservicio** son captación, no solo soporte —
> «muestreo estratificado clima laboral» o «N mínimo confidencialidad encuesta» las busca gente que
> está por comprar algo. Eso pide un sitio estático indexable, que es este.

> **Path y no subdominio.** `knotfix.com/es/docs`, nunca `docs.knotfix.com`. Un subdominio es otro
> sitio para los buscadores y parte la autoridad del dominio justo en el contenido que más
> long-tail genera.

### Las dependencias, y qué hace cada una

Seis paquetes, **todos de build**: no agregan un byte de JavaScript al cliente.

| Paquete | Para qué |
|---|---|
| `@next/mdx` + `@mdx-js/loader` + `@mdx-js/react` | que Next compile `.mdx`. Es el paquete oficial |
| `remark-gfm` | tablas, listas de tareas, tachado |
| `rehype-slug` | ids en los headings: anclas y TOC |
| `github-slugger` | recalcular esos mismos ids para el índice de la página |

> **Con Turbopack los plugins van como STRINGS, no como imports:**
> `remarkPlugins: ["remark-gfm"]`. Turbopack no serializa referencias a funciones en la config. Con
> la sintaxis vieja compila en `dev` y falla al construir.

> **`github-slugger` es el mismo módulo que `rehype-slug` usa por dentro**, y esa coincidencia es
> todo el punto: el `href` del índice tiene que dar exactamente el mismo string que el `id` del
> encabezado. Se recalcula en vez de leerse porque MDX exporta el componente, no su árbol — después
> de compilar no hay de dónde sacar los encabezados sin renderizar, y un plugin de remark no puede
> devolverle datos al que importa. **Si se cambia uno de los dos lados, el índice se sigue dibujando
> igual y deja de saltar a ningún lado: es un fallo silencioso.**

> **`rehype-pretty-code` NO se instaló.** Estaba en el plan y se sacó: es un producto de RRHH y las
> páginas no tienen un solo bloque de código. `pre` y `code` se estilan a mano con la fuente mono que
> el sitio ya carga. Si algún día hay código de verdad, se agrega — con opciones serializables, por
> lo de Turbopack.

---

## Qué NO se publica: el método de cálculo

**Decisión del usuario, 2026-08-16. Vale para toda página futura, no solo las escritas.**

Las docs explican **qué significa** un resultado y **cómo usarlo**. No explican **cómo
se calcula**. El método es del producto y este es un sitio público e indexable.

Prohibido en cualquier `.mdx`:

| No va | Sí va |
|---|---|
| Nombres de algoritmo («Rank Sum») | «Satisfacción mide qué tan conforme está la gente» |
| Que Satisfacción pondera y Clima promedia parejo | «Se construyen con métodos distintos, así que no se comparan» |
| Cuántas categorías tiene cada índice | «Sus categorías las define el modelo» |
| La regla de corte de «aceptable» | «Agrupa las respuestas del lado favorable» |
| La aritmética de la meta (tasa aditiva, ejemplos numéricos) | «Se calcula por rama sobre su último resultado y la tasa que configuraste» |
| Cómo reparte el muestreo estratificado | «Es muestreo estratificado, que evita que un segmento quede sub-representado» |

> **La prueba a aplicar antes de escribir un párrafo:** ¿esto le permite a alguien
> **reproducir** el número sin el producto? Si sí, no va. Si solo le permite
> **interpretarlo** o **actuar**, va.

> **Lo que sí se publica y no es negociable: las garantías de anonimato.** No son
> método, son la promesa que hace usable el instrumento — y el cliente tiene que poder
> explicárselas a su gente. Ver [Para tu gente].

⚠️ **Dos lugares que dicen MÁS que las docs y quedan a decisión del usuario:**
1. `ayuda.json` del producto detalla que Satisfacción pondera por importancia y que
   Clima promedia cinco categorías con el mismo peso. Está detrás de login, pero son
   ocho idiomas y llega a todos los usuarios.
2. La home del sitio habla de ponderar, pero describe una **función del usuario**
   (asignar pesos y comparar ponderado contra simple), no el cálculo del índice. Se
   dejó como está: es el diferenciador que se vende.

## La frontera con `/ayuda` del producto

**Esto es lo más importante del documento.**

El producto **ya tiene documentación**: `/ayuda` lleva ocho preguntas frecuentes en ocho idiomas
(`Front-End/src/i18n/catalogos/*/ayuda.json`), y no son de «dónde hago clic» — son la capa
conceptual difícil: por qué un segmento aparece oculto, quién mueve el umbral, si se puede ver qué
respondió una persona, cómo se calcula la meta, por qué Satisfacción y Clima no se comparan, si se
puede editar una pregunta con el estudio en curso, qué significa que una pregunta corta la serie,
qué pasa con los datos si vence el plan.

> **La regla: la FAQ RESPONDE, las docs EXPLICAN. Ninguna copia a la otra.**
>
> La FAQ se queda como está —corta, ocho idiomas, dentro del producto— y cada respuesta linkea a la
> página de docs que desarrolla el tema. Las docs desarrollan y **no repiten el párrafo**.
>
> El motivo es una regla que el producto ya tiene escrita: cada una de esas ocho respuestas describe
> una regla que el backend hace cumplir, y su `CLAUDE.md` avisa que tocar la regla obliga a tocar
> `ayuda.json` **y sus siete traducciones**. Una tercera copia en las docs lleva ese cambio a tres
> lugares por dos idiomas más. El proyecto entero está construido contra eso: `verificar:i18n` y
> `verificar:demo` existen para reventar el build cuando dos fuentes se desincronizan.

> **Corolario para quien escriba una página de Conceptos:** si estás por explicar el N mínimo,
> abrí primero `ayuda.json` y escribí **lo que la FAQ no dice**. Si terminás con el mismo párrafo
> más largo, la página no hacía falta y lo que hacía falta era el enlace.

El enlace va en las dos direcciones: la FAQ del producto sale hacia las docs, y las páginas de
Conceptos vuelven hacia la pantalla del producto que corresponde.

### La mitad que sale del producto — HECHA el 2026-08-17

Las ocho respuestas de `/ayuda` llevan **«Leer más en la documentación»** al pie, cada una apuntando
a la página que desarrolla su tema. Vive en `Front-End/src/components/ayuda/preguntas-frecuentes.tsx`
(un campo `doc` por entrada) y la URL la compone `Front-End/src/lib/sitio.ts`, que es donde se mudó
el mapeo de los OCHO idiomas del producto a los DOS del sitio — no era una regla de los legales, era
una regla del sitio.

| Pregunta de la FAQ | Página |
|---|---|
| ¿Por qué un segmento aparece oculto? | `anonymity` |
| ¿Quién cambia el umbral? | `anonymity` |
| ¿Puedo ver qué respondió una persona? | `employee-anonymity` |
| ¿Cómo se calcula la meta de mejora? | `targets` |
| ¿Por qué Satisfacción y Clima no se comparan? | `indices` |
| ¿Puedo cambiar una pregunta con el estudio en curso? | `study-lifecycle` |
| ¿Qué significa que una pregunta corta la serie? | `history` |
| ¿Qué pasa con mis datos si vence el plan? | `account-and-plan` |

⚠️ **Esa tabla es un acoplamiento ENTRE REPOS y no hay build que lo verifique**, igual que
`LEGAL_NAV` ↔ `DOCUMENTOS_LEGALES`: son dos despliegues. **Renombrar el slug de una de esas siete
páginas rompe un enlace del producto sin que nada falle acá.** Si hay que renombrar una, el cambio
incluye tocar el otro repo el mismo día. Es una razón más para no traducir los slugs.

Dos preguntas apuntan a `anonymity`, que **ya no está retenida** (ver «Lo que necesita
verificación»): se publica con el resto del sitio.

---

## Idiomas: el producto habla ocho, el sitio dos

| | Idiomas |
|---|---|
| Producto (`Front-End/src/i18n/`) | es, en, pt, fr, de, it, zh, ja |
| Este sitio (`LOCALES`) | es, en |
| **Docs** | **es, en** |

**Las docs se escriben en dos idiomas y punto.** Veinte páginas de prosa por ocho idiomas es un
compromiso de mantenimiento que no se sostiene, y hay precedente explícito de alcance acotado en el
producto: los reportes descargables y las pantallas del empleado tampoco se traducen.

> **Pero es una decisión, no un accidente, y tiene una consecuencia que hay que escribir a
> propósito.** El enlace que sale del producto hacia las docs mapea los ocho idiomas a dos: `es` se
> queda en `es` y **todo lo demás cae en `en`**. Sin ese mapeo, un usuario en japonés que hace clic
> en «Ayuda» aterriza en una URL `/ja/docs` que no existe.
>
> Es una función de tres líneas y vive del lado del producto, no de acá.

---

## Versionado: no. Changelog: sí.

**Las docs no se versionan.** Verificado contra el repo del producto, no por argumento general:

- No hay API pública. El API es interno y lo consume el propio front — al punto que `respuestas.*` y
  `aplicacion.*` ni siquiera se exponen como CRUD.
- No hay edición on-prem.
- Hay un solo despliegue.

> Versionar docs sirve cuando el usuario corre una versión vieja: una librería, un SDK, software
> self-hosted. Acá no existe el usuario para el que la doc vieja sea correcta — cuando el producto
> cambia, cambia para todos esa misma tarde. Publicar la versión anterior es publicar documentación
> equivocada con una etiqueta que dice que está bien.
>
> El historial ya está versionado donde corresponde: en git. No hace falta publicarlo.

> **Si algún día aparece API pública o una edición on-prem**, la respuesta tampoco es Docusaurus:
> una carpeta más (`content/docs/{version}/{lang}/`) y un segmento en la ruta. Sobre esta estructura
> es un día de trabajo. **No es razón para elegir framework hoy.**

**El changelog CONSTRUIDO el 2026-08-17.** `/[lang]/changelog`, un `.mdx` por entrada con la fecha
en el nombre, **todas en una sola página** y la más nueva arriba. Es lo que la gente busca de verdad
cuando dice «versiones»: qué cambió y si les rompe algo. Arrancó con **9 entradas** que van del
2026-07-29 al 2026-08-17.

⚠️ **Las entradas se leen del DIRECTORIO, sin `nav.js`, y eso se aparta de docs y de legales a
propósito.** Allá el orden es una decisión editorial y por eso vive en una lista; acá el orden es la
FECHA, que ya está en el nombre del archivo, así que un manifiesto no aportaría un dato nuevo — solo
un lugar más donde olvidarse de anotar algo. El modo de fallo se invierte a favor: con manifiesto,
una entrada escrita y no registrada desaparece en silencio; sin él, aparece sola.

⚠️ **No entra al sidebar de las docs**, y no es un olvido: no explica nada, así que en el árbol
quedaría metida en el anterior/siguiente entre dos conceptos que sí se leen seguidos. Se ofrece
desde el **índice de la documentación**, que es donde llega quien busca «qué cambió».

Dos reglas de contenido que valen para toda entrada futura:

- **Solo lo que el cliente NOTA.** Ni refactors, ni migraciones, ni nada de lo que este documento
  prohíbe publicar del método de cálculo. Si una entrada no cambia lo que alguien ve o puede hacer,
  no es una entrada.
- **Las entradas viejas NO se corrigen.** Es lo contrario de las docs —que se reescriben porque solo
  hay un despliegue y la versión vieja no es correcta para nadie— y es exactamente lo que hace útil
  al changelog: es historia a propósito.

---

## Estructura de contenido

`✓` = escrita en los dos idiomas.

```
Empezar
✓ Qué es Clima y qué mide                        what-is-clima
✓ Tu primer estudio                              first-study
✓ Aplicar la encuesta: el kiosco                 kiosk
✓ Roles y permisos: quién puede hacer qué        roles

Conceptos
✓ El árbol organizacional                        org-tree
✓ Boletas y herencia: la boleta efectiva         questionnaires
✓ Modelos teóricos: el modelo como espacio       models
✓ Los estados de un estudio                      study-lifecycle
✓ Satisfacción y Clima: dos índices              indices
✓ Anonimato y N mínimo                           anonymity
✓ Metas de mejora                                targets

Interpretar
✓ Cómo leer un resultado                         reading-results
✓ Segmentos                                      segments
✓ La serie histórica y el corte de serie         history

Para tu gente
✓ Cómo comunicar la encuesta                     announcing
✓ Qué decirles sobre el anonimato                employee-anonymity

Referencia
✓ Glosario                                       glossary
✓ El Excel de la nómina                          roster-format
✓ Tipos de pregunta                              question-types

Guías                                            ← DIFERIDAS a propósito, ver abajo
  Estructura · Nómina · Boletas · Estudios · Aplicación
  Resultados · Estadísticas · Reportes · Configuración

Cuenta
✓ Cuenta y plan                                  account-and-plan
✓ Seguridad y datos                              security-and-data

✓ Changelog                                      /[lang]/changelog — ruta aparte, fuera del sidebar
```

> **«Cuenta y plan» NO salió de la captura de la pantalla de precios, y no podría.** Los
> cuatro planes con sus topes son cuatro filas; la página son las **reglas alrededor** de
> esas filas, y todas viven en `apps/facturacion` del repo del producto: qué es un
> «período» (el año contratado, no el calendario), que el cupo de estudios se consume al
> lanzar y no se devuelve, que el tope de nómina usa el mismo criterio de «activo» que el
> muestreo, que los correos cuentan envíos y no personas, la ventana de gracia de 14 días,
> que bajar de plan se bloquea **antes** de cobrar, y que cancelar corre hasta el fin del
> período pagado. Un precio sin esas reglas es una tabla, no una doc.
>
> ⚠️ **Dos cosas de esa página no están en la pantalla de precios y son deliberadas:**
> el **excedente de nómina** (se puede pasar el tope incluido pagando por cabeza hasta un
> techo, y se factura aparte del cobro anual) y el **estado «solo lectura»** (los
> resultados y el histórico quedan disponibles para siempre). Las dos salen de
> `facturacion/services.py` y las dos son argumentos de venta que hoy no se dicen en
> ningún lado. Si la pantalla de precios cambia, esta página y aquella se desincronizan
> **en silencio** — no hay verificación que las ate.

> **Las guías de clic están diferidas a propósito, y no por falta de tiempo.** Son la
> parte que más rápido envejece: describen pantallas, así que cada rediseño las
> desactualiza, y una doc desactualizada miente. Conceptos, Interpretar y Referencia
> describen **reglas**, y sobreviven a los rediseños.
>
> El orden en que se escribió no es casual: primero lo que no caduca. Las guías se
> escriben cuando el producto se quede quieto, y con capturas — que es cuando de
> verdad sirven.

> **«Seguridad y datos»: PUBLICADA el 2026-08-18.** Estuvo escrita y FUERA de `nav.js`
> —o sea sin rutear y sin enlazar, que es el mecanismo que este documento fija— porque le
> faltaba «Continuidad y respaldos», y una página de seguridad sin respuesta sobre
> respaldos es la que no conviene publicar a medias. Lo que la destrabó fueron datos
> reales: la base ya migró a **PlanetScale**, con respaldos automáticos **diarios** y **2
> días de retención**.
>
> ⚠️ **La sección dice el número Y su contracara**, y eso es lo que la hace servir: 2 días
> es excelente para la privacidad (las copias de una cuenta eliminada desaparecen en 48
> horas) y corto para recuperar (un problema detectado al tercer día ya no tiene respaldo).
> Un área de seguridad evalúa su propio riesgo con el segundo dato, no con el primero.
>
> ⚠️ Al publicarla se descubrió que la tabla de subprocesadores —en esta página y en
> `privacy`— **seguía diciendo Supabase** después de la migración. Ver `legal.md`: esa fila
> no se entera sola.
>
> Lo que la destrabó fue que dejó de ser un dictado: los tres documentos legales
> (2026-08-17) ya fijaron los subprocesadores, los plazos de retención, el aviso de
> incidentes y las medidas del artículo 10, así que la página se pudo **derivar** de
> ellos y del código, en vez de inventarse. Lo que sigue siendo dictado es el respaldo,
> porque depende de un plan de Supabase que todavía no se compró.
>
> ⚠️ **Regla de esa página: no puede decir MÁS que la política de privacidad y el DPA.**
> Si algo hace falta afirmar y no está allá, se agrega allá primero. La página lo dice de
> entrada («si parecen decir cosas distintas, manda el documento legal») y por eso la
> tabla de subprocesadores está marcada como resumen, con la del `privacy` como la que
> manda.
>
> ⚠️ **Lo que NO se puede publicar hasta que sea cierto:** los **12 meses de bitácoras**
> que promete la política de privacidad. Hoy `views._auditar_lectura` escribe a consola,
> o sea al log del contenedor, que un redeploy borra. La página menciona que las consultas
> quedan registradas —eso sí es cierto— y **no repite el plazo**. El arreglo correcto es
> hacer verdadero el plazo (mandar los logs a un destino que los conserve), no aflojar la
> promesa: doce meses es lo que hace detectable el riesgo residual de anonimato.

> **«Conceptos» es la sección que importa y la que hay que escribir primero.** El producto se vende
> en autoservicio con prueba gratis: **no hay nadie del otro lado** explicando qué es un nodo, por
> qué el resultado que esperaba ver está oculto, o por qué no puede restar Clima menos Satisfacción.
> Las guías de clic son las fáciles de escribir y las que menos valen — un producto bien hecho las
> vuelve casi innecesarias. La capa conceptual no la reemplaza ninguna interfaz.

> **«Para tu gente» no es soporte, es venta.** El cliente compra el producto y acto seguido tiene
> que convencer a cientos de empleados de que la encuesta es anónima de verdad. El argumento técnico
> ya existe entero en el producto —la participación y el contenido se guardan sin relación entre sí,
> y la fecha de respuesta se guarda sin hora para que tampoco se puedan reunir por el orden de
> llegada—. Dárselo escrito y listo para reenviar es diferencial competitivo. Es también la sección
> que un comprador lee **antes** de comprar.

> **El orden de arriba es el del sidebar y es deliberado**: Empezar → Conceptos → Guías. Poner las
> guías antes de los conceptos es el error clásico: la persona hace los clics, no entiende el
> resultado, y escribe al formulario de soporte.

---

## Reglas de estructura

**El mapa de archivos vive en `architecture.md`**, con el resto del sitio, y no se repite acá: es
exactamente la duplicación contra la que argumenta este documento tres secciones más arriba. Acá van
las reglas, que son propias de las docs.

Ya existen y cuelgan del mismo mapa: `src/content/changelog/{es,en}/*.mdx` (una entrada por fecha),
`src/lib/changelog.js` (las lee del directorio y las ordena) y `src/app/[lang]/changelog/page.js`
— la lista entera en una página, no una página por entrada.

- **Los slugs van en INGLÉS en los dos idiomas.** `/es/docs/org-tree` y `/en/docs/org-tree`. Es la
  regla del proyecto (la interfaz se traduce, los identificadores no) y además es lo que hace que
  `swap_locale_in_path` siga funcionando sin tocar `lang_switch`: con slugs traducidos, cambiar de
  idioma desde una doc daría 404.
- **`nav.js` es la fuente única del orden.** De ahí salen el sidebar, el `generateStaticParams` y el
  anterior/siguiente. Un `.mdx` que no está en `nav.js` no existe: no se rutea y no se linkea.
- **La metadata de cada página va como `export const meta` DENTRO del `.mdx`**, no como frontmatter.
  Así no hace falta `gray-matter` ni un plugin de frontmatter, y el objeto se importa junto con el
  componente en la misma llamada.
- El ancho máximo sigue viviendo **solo** en `Container`. La grilla de tres columnas de las docs se
  arma adentro de él, no en paralelo.
- **El `h1` lo pone la RUTA, no el `.mdx`.** El título de una página está en un solo lugar —`nav.js`
  para el sidebar, `meta` para el `<title>`— así que no hay forma de que el encabezado diga una cosa
  y la barra lateral otra. De paso, todos los `##` del archivo son secciones y no títulos de página.
- **Las docs no tienen `layout.js`**, y la razón está anotada en `architecture.md`: un layout no
  conoce el `slug` de la catch-all, así que no podría marcar la página activa.
- **Las líneas sobre el fondo de página van en `border-box-edge`, nunca en `border-border`.**
  `--border` (#e5e7eb) es el contorno de una tarjeta: demasiado flojo para una línea que tiene que
  leerse como estructura de la prosa. La regla nació cuando el fondo era un hueso (#e4e3df) y
  `--border`, más claro que él, directamente no se veía; con la página en blanco ya se ve, pero
  sigue sin alcanzar. La prosa de las docs dibuja muchas —separadores de `h2`, borde de cita, filas
  de tabla—, y por eso `--color-box-edge` se registró en el `@theme` de `globals.css`: el token
  existía y la utilidad no. El mismo criterio lo usa `.org-canvas` para su canto.

> **La ruta catch-all resuelve con un import dinámico:**
> `` await import(`@/content/docs/${lang}/${slug}.mdx`) ``, que es el patrón que documenta Next para
> esto. Con `generateStaticParams` alimentado desde `nav.js` sale todo estático, igual que el resto
> del sitio hoy.

---

## Registro de nombres

| Nombre | Tipo | Significado |
|---|---|---|
| `DOCS_NAV` | const array | el árbol entero, en `content/docs/nav.js`. **Fuente única del orden** |
| `doc_slug` | string | el identificador de una página, en inglés y sin idioma: `org-tree` |
| `meta` | export de un `.mdx` | `{ title, description }` de esa página. Alimenta `generateMetadata` |
| `active_slug` | prop string \| null | qué página marca el sidebar. `null` en el índice |
| `headings` | array | los `{ id, text, level }` que dibuja el `DocsToc` |
| `prev_doc` / `next_doc` | objeto \| null | los vecinos en el recorrido plano de `DOCS_NAV` |
| `flatten_nav` | función | aplana `DOCS_NAV` a la lista ordenada de entradas |
| `neighbours_of` | función | `neighbours_of(slug)` → `{ prev_doc, next_doc }` |
| `resolve_doc` | función | `resolve_doc(lang, slug)` → `{ Doc, meta }`, o `null` si falta el archivo |
| `headings_of` | función | `headings_of(lang, slug)` → los encabezados, leyendo el `.mdx` crudo |
| `is_doc_slug` | función | si el slug está en `DOCS_NAV`. Lo demás no existe |
| `changelog_entries` | función | `changelog_entries(lang)` → las entradas del changelog, de la más nueva a la más vieja. Las lee del DIRECTORIO, sin manifiesto |

### Los dos props que se agregaron al navbar y al pie

No son de las docs pero salieron de ellas, y valen para cualquier página futura que no sea la home.

| Nombre | Tipo | Significado |
|---|---|---|
| `section_base` | prop string | prefijo de los enlaces de sección. `""` en la home —son anclas de esta página, y así `useActiveSection` puede marcarlas—; `/es` o `/en` fuera de ella. Lo toman `Navbar`, `NavLinks`, `MobileMenu` y `Footer` |
| `docs_active` | prop boolean | marca el enlace de Documentación en el navbar |

> **Son dos props y no uno derivado del otro**, aunque hoy siempre viajen juntos: uno dice a dónde
> apuntan las anclas y el otro en qué página estamos. La página que venga después —precios, un blog—
> va a necesitar el primero sin el segundo.

> **`nav_docs` va suelto y NO dentro de `nav_links`.** Todos los items de esa lista son anclas, y
> `NavLinks` les saca el id con `section_id_of`, que corta el `#`. Un `/es/docs` le devolvería string
> vacío: nunca se marcaría como activo, y encima entraría un id vacío a `useActiveSection`. Es el
> primer item de navegación del sitio que sale de la home, así que se dibuja aparte y se marca por
> ruta, no por scroll.

### Llaves nuevas del diccionario

Solo el **chrome**. La prosa vive en los `.mdx` y **nunca** en `es.js` / `en.js`: son cuarenta
páginas de texto largo y meterlas en el diccionario lo vuelve inmanejable.

```
nav_docs               "Documentación" / "Docs" — el link del navbar, el pie y el menú móvil
docs_index_title
docs_index_body
docs_all_pages         el <summary> del sidebar plegado de móvil
docs_on_this_page      encabezado del índice de la página
docs_prev              "Anterior"
docs_next              "Siguiente"
a11y_docs_nav          nombre accesible del sidebar de escritorio
a11y_docs_nav_mobile   ídem de su copia plegada
a11y_docs_toc          ídem del índice de la página

changelog_title        "Novedades" / "What's new" — encabezado de /[lang]/changelog
changelog_body         el subtítulo de esa página
changelog_hint         la línea que la ofrece desde el índice de las docs

todavía no existe:
docs_search            placeholder, cuando exista la búsqueda
```

> **Los tres `a11y_docs_*` son nombres DISTINTOS y no uno repetido.** En una página de docs conviven
> el árbol lateral, su copia plegada de móvil y el índice de la página: son tres landmarks de
> navegación a la vez. Con el mismo nombre accesible, un lector de pantalla los lista como tres
> entradas idénticas y no hay forma de elegir. Es la misma razón por la que ya existen
> `a11y_main_nav` y `a11y_mobile_nav` separados.

> **`nav_links` de hoy son ANCLAS, y el link de docs no lo es.** `NavLinks` deriva el id de sección
> con `section_id_of`, que corta el `#` — un href `/es/docs` le devuelve `""`, así que nunca se
> marcaría como activo y encima entraría un id vacío a `useActiveSection`. Por eso el link de docs
> **no se agrega a `nav_links`**: va como `nav_docs`, aparte, y `Navbar` lo pinta como un `Link` de
> Next junto al `nav_cta`. Es el primer ítem de navegación del sitio que sale de la home.

> El footer hoy solo tiene `footer_tagline` y `footer_rights`: no hay columnas de enlaces. Si las
> docs quieren estar ahí —y conviene— eso es inventar una estructura de footer que no existe, y es
> un cambio aparte con su propio registro de nombres.

---

## Lo que necesita verificación antes de publicar

| Página | Qué afirma | Pendiente del producto |
|---|---|---|
| `targets` | La tasa aditiva, el arrastre del faltante y el congelado al lanzar | `metas-mejora-supuestos` — los supuestos de §6.3 están sin validar contra el libro de CATSA |

Lo de `targets` sale de la FAQ del propio producto (`ayuda.json`), así que si está mal, están mal
los dos lugares — pero conviene cerrarlo antes de repetirlo en un sitio público e indexable.

### `anonymity` — DESBLOQUEADA el 2026-08-17

Estuvo retenida por el hueco de **diferenciación por conjuntos**: la protección contra el despeje
por resta se aplica dentro de una consulta, pero pedir el padre y después el hijo en dos consultas
separadas sigue permitiendo restar. **Decisión explícita del usuario: se sigue adelante como si ese
hueco no existiera**, porque el ataque exige un insider autenticado, con permisos sobre esa rama,
haciendo la aritmética a mano entre dos pantallas.

Lo que hizo que la página se publicara **sin cambiarle una palabra** es que su afirmación ya está
acotada a la TABLA —«si de restar las que se ven se pudiera deducir una que no llega, esa
combinación tampoco se publica»—, y eso es exactamente lo que `_suprimir_complemento` y la regla de
tabla hacen. La página nunca prometió nada sobre dos consultas distintas; la marca de bloqueo era
más ancha que el texto que bloqueaba.

⚠️ **«Ignorar el hueco» significa NO construir la contabilidad entre requests. No significa aflojar
nada de lo que ya existe.** La supresión complementaria, la regla de tabla *value-blind*, que
`nodo_ids` no sea un parámetro público y la prohibición de negación y resta como filtros **siguen
siendo obligatorias**: son las que hacen cierta la frase de esta página. Si alguien lee esta
decisión y concluye que esa maquinaria sobra, entendió lo contrario.

## Lo que NO se documenta todavía

**Se documenta solo lo que funciona.** Es la misma regla que el producto ya aplica a `ayuda.json`:
una ayuda que miente es peor que no tenerla, porque quien la lee deja de mirar la pantalla y le cree.

| Hueco | Estado | Consecuencia para las docs |
|---|---|---|
| ~~**Aplicación por CORREO**~~ | **CERRADO el 2026-08-17**: la pantalla `/responder/:token` existe y monta el mismo formulario que el kiosco | ya no es un hueco. `kiosk` habla del modo mixto; lo que queda es que **el modo correo no tiene página propia** y la lista de pendientes de abajo no lo refleja |
| **eNPS** | no existe como métrica (solo un ejemplo de etiqueta libre en un comentario de `boletas/models.py`) | no aparece en Resultados |

> Cuando cualquiera de los dos se cierre, la página correspondiente es **parte de ese cambio**, no un
> pendiente posterior. Es la misma disciplina que ata `ayuda.json` a las reglas del backend.

---

## Decisiones abiertas

1. **Búsqueda.** No se construye ahora. Con menos de veinte páginas el sidebar alcanza y una
   búsqueda vacía se ve peor que ninguna. Cuando haga falta: **Pagefind** (estático, se indexa en el
   build, sin servicio ni costo) o **Algolia DocSearch** (gratis para docs públicas). La decisión se
   toma con las páginas escritas, no antes.
2. **Enlace desde el producto.** Dónde exactamente cuelga —la FAQ de `/ayuda`, la barra lateral, o
   ambos— es del lado del producto y hay que decidirlo con su `architect`. Acá solo se fija que las
   URLs son estables y que el mapeo de ocho idiomas a dos vive allá.
3. **Docs de la demo.** El producto tiene un modo demo de solo lectura (`lib/demo/api.ts`). Las docs
   podrían linkear a él desde cada guía —«probá esto en la demo»—, que es lo más cerca que se puede
   estar de un tutorial interactivo sin construir uno. No decidido.
4. **Columnas de enlaces en el footer.** Ver arriba: hoy no existen.
