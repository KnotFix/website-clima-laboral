# Medición del sitio: guía de configuración

Documento de referencia. Dueño: `architect`. Explica cómo dejar andando la medición de
censuma.com (Google Analytics 4, Google Ads, Meta y Microsoft Clarity) **sin tocar código**.
Está escrita para quien no es técnico: cada paso dice dónde hacer clic.

---

## Cómo está armado

El sitio **no trae ninguna herramienta de medición pegada en el código**. Hace solo cuatro
cosas:

1. Carga **Google Tag Manager** (GTM), un contenedor desde el que se encienden y apagan las
   herramientas con clics.
2. Arranca con **todo denegado** (Consent Mode v2 de Google) y muestra el **banner de
   cookies**. Nada se activa hasta que la persona acepta.
3. Avisa lo que pasa en el sitio con **eventos** (ver la tabla de abajo). GTM los escucha y
   decide a qué herramienta mandarlos.
4. Guarda **de dónde llegó** la persona (UTMs, gclid, fbclid) en la cookie `censuma_utm`,
   para que la app pueda informar el registro y el primer pago a Google y a Meta desde el
   servidor.

La consecuencia práctica: sumar, sacar o cambiar una herramienta se hace en GTM y se publica
ahí. No hace falta un deploy del sitio.

### Los eventos que manda el sitio

| Evento | Cuándo | Parámetros |
|---|---|---|
| `virtual_page_view` | Cada página vista, **incluida la primera** | `page_path`, `page_title`, `page_language`, `page_location` |
| `cta_click` | Clic en un botón marcado (ver ids abajo) | `cta_id`, `cta_text`, `cta_location`, `link_url` |
| `app_link_click` | Clic en cualquier enlace a app.censuma.com | `link_url`, `cta_id` |
| `begin_sign_up` | Clic en «Empezar» o «Precios» (la raíz de la app o `/registro`) | `link_url`, `cta_id`, `plan` (si el enlace lo lleva) |
| `contact_click` | Clic en un enlace de correo o de WhatsApp | `method` (`email` o `whatsapp`), `cta_id` |
| `section_view` | La primera vez que cada sección de la home se ve (media sección o media pantalla) | `section_id` |
| `consent_update` | La persona acepta, rechaza o cambia sus preferencias | `consent_analytics`, `consent_marketing` (true/false) |

Ids de los botones (`cta_id`): `hero_start`, `hero_how_it_works`, `nav_start`,
`nav_pricing`, `nav_contact`, `mobile_nav_start`, `mobile_nav_pricing`, `mobile_nav_contact`,
`final_cta_start`, `footer_whatsapp`, `footer_email`, `footer_instagram`, `footer_facebook`,
`footer_youtube`, y `faq_01` a
`faq_08` para las preguntas frecuentes.

Ids de las secciones (`section_id`): `hero`, `problem`, `measurement`, `world`, `scale`,
`how`, `weights`, `reports`, `faq`, `final_cta`.

### La regla de las páginas vistas: UNA sola fuente

**GA4 cuenta páginas solo con el evento `virtual_page_view`.** El sitio es una aplicación
de Next.js: al pasar de una página a otra no se recarga, así que la «carga de página» normal
de GTM solo ve la primera. Por eso el sitio avisa cada página, la primera incluida.

Esto obliga a dos cosas en GTM, y saltarse cualquiera de las dos cuenta cada página doble:

- En la etiqueta de Google, el parámetro **`send_page_view` en `false`**.
- **No usar** el activador «Cambio de historial» (History Change) para nada de páginas.

---

## 1. Google Analytics 4

1. Entrá a [analytics.google.com](https://analytics.google.com) con la cuenta de Google de
   la empresa. **Administrar** (el engranaje, abajo a la izquierda) → **Crear** → **Propiedad**.
2. Nombre: `Censuma`. Zona horaria: Costa Rica. Moneda: dólar estadounidense (USD).
3. Cuando pida la plataforma, elegí **Web**. URL: `censuma.com`. Nombre del flujo:
   `Censuma web`. Dejá activada la **medición mejorada**, pero entrá a su engranaje y
   **apagá «Vistas de página: cambios en el historial del navegador»** (ver la regla de
   arriba).

   **«Clics salientes» se queda PRENDIDO, a propósito** (decisión del 2026-10-02). Manda un
   `click` por cada enlace que sale del sitio, y para WhatsApp, el correo y la app eso
   duplica, con otro nombre, a `contact_click` y `app_link_click`. No infla nada: son
   eventos distintos y los eventos clave son los nuestros. A cambio mide los enlaces
   externos que no llevan `data-track`, como los de las docs y los legales. **Para contar
   contactos se usa siempre `contact_click`, nunca `click`.**
4. Copiá el **ID de medición** (empieza con `G-`). Lo vas a usar en GTM y en Dokploy.
5. **Google Signals**: Administrar → Recopilación de datos → **Activar** la recopilación de
   datos de Google Signals.
6. **Retención**: Administrar → Recopilación de datos → Retención de datos → **14 meses** →
   Guardar.
7. **Dominios cruzados: no hace falta.** `app.censuma.com` es subdominio de `censuma.com`
   y GA4 escribe la cookie `_ga` en `.censuma.com`, así que los dos la comparten solos. La
   app tampoco carga GA4 en el navegador: lee esa cookie en el servidor para mandar
   `sign_up` y `purchase` con el mismo visitante.
8. **Eventos clave**: `purchase`, `sign_up` y `contact_click`. Administrar → Visualización
   de datos → **Eventos** → pestaña **Eventos recientes** → la **estrella** a la izquierda
   del nombre. La interfaz actual no tiene botón «Nuevo evento clave»: **un evento solo se
   puede marcar cuando ya aparece en esa lista, y aparece hasta 24 h después de que llegó
   el primero.** Que no esté no es un error: se confirma en Informes → Tiempo real.
   `purchase` viene marcado de fábrica. `sign_up` y `purchase` los manda la app desde el
   servidor, así que aparecen recién después del primer registro y el primer pago reales.
   Con la interfaz en inglés: Admin → Data display → Events → **Recent events**.
9. **API secret del Measurement Protocol** (lo usa la app para mandar `sign_up` y
   `purchase`): Administrar → Flujos de datos → `Censuma web` → **Secretos de la API del
   Measurement Protocol** → Crear → apodo `backend censuma` → copiá el valor.

## 2. Google Tag Manager

### Crear el contenedor

1. Entrá a [tagmanager.google.com](https://tagmanager.google.com) → **Crear cuenta**.
   Cuenta: `Knotfix`. Contenedor: `censuma.com`, plataforma **Web**.
2. Copiá el **ID del contenedor** (empieza con `GTM-`). **No pegues** el código que ofrece:
   el sitio ya lo trae; solo necesita el ID (ver el paso 6, Dokploy).
3. **Administrar** → **Configuración del contenedor** → marcá **Habilitar la descripción
   general del consentimiento**. Eso agrega el escudo de consentimiento en la lista de
   etiquetas, que se usa abajo.

### Variables (Variables → Variables definidas por el usuario → Nueva → «Variable de capa de datos»)

Creá una por parámetro, con el **mismo nombre** en «Nombre de la variable de capa de datos»:

`cta_id`, `cta_text`, `cta_location`, `link_url`, `plan`, `method`, `section_id`,
`page_path`, `page_title`, `page_language`, `page_location`, `consent_analytics`,
`consent_marketing`.

Ponele a cada variable el nombre `DLV - <parámetro>` (por ejemplo `DLV - cta_id`) para
encontrarlas rápido.

Creá también una **Constante** llamada `GA4 ID` con el ID de medición `G-…`.

### Activadores (Activadores → Nuevo → «Evento personalizado»)

Uno por evento, con el nombre del evento exacto:

| Activador | Nombre del evento |
|---|---|
| `CE - virtual_page_view` | `virtual_page_view` |
| `CE - cta_click` | `cta_click` |
| `CE - begin_sign_up` | `begin_sign_up` |
| `CE - contact_click` | `contact_click` |
| `CE - section_view` | `section_view` |
| `CE - app_link_click` | `app_link_click` |
| `CE - consent_update marketing` | `consent_update`, con la condición «Algunos eventos personalizados» → `DLV - consent_marketing` **es igual a** `true` |

### Etiquetas

**a) Etiqueta de Google (GA4)**

- Tipo: **Etiqueta de Google**. ID de etiqueta: `{{GA4 ID}}`.
- Configuración → parámetro `send_page_view` = `false`.
- Activadores: **Initialization - All Pages** (Inicialización: todas las páginas) **y**
  `CE - consent_update analytics`.
- Consentimiento: **Requerir consentimiento adicional** → `analytics_storage`. Lo mismo en
  TODAS las etiquetas de evento de GA4 (b y c).

  **Por qué GA4 espera al consentimiento** (y no manda señales sin cookies, como haría por
  defecto): el primer hit de la visita es el que lleva `first_visit` y `session_start`, y de
  ahí sale la fuente. Si sale antes de aceptar, GA4 lo descarta para informes y Tiempo real, y
  la visita queda sin campaña aunque la persona acepte un segundo después (probado en
  producción el 2026-10-01). Lo que se pierde es el modelado de quienes rechazan, que GA4
  solo calcula con miles de eventos por día. Al aceptar en la primera página la etiqueta no
  corrió en la inicialización (estaba bloqueada); por eso el segundo activador.

**b) GA4 page_view**

- Tipo: **Google Analytics: evento de GA4**. ID de medición: `{{GA4 ID}}`.
- Nombre del evento: `page_view`.
- Parámetros: `page_location` = `{{DLV - page_location}}`, `page_title` =
  `{{DLV - page_title}}`, `page_path` = `{{DLV - page_path}}`, `language` =
  `{{DLV - page_language}}`.
- Activadores: `CE - virtual_page_view` **y** `CE - consent_update analytics`.

  El segundo no sobra: al aceptar, el `virtual_page_view` de esa página ya pasó con la etiqueta
  bloqueada, y sin repetirlo la primera página no se cuenta. `consent_update` solo lo emite el banner cuando la
  persona decide, así que quien vuelve con el consentimiento ya dado no cuenta doble. El
  `page_location` sale del último `virtual_page_view`, que sigue en la capa de datos.

**c) GA4 eventos del sitio** (una etiqueta «Evento de GA4» por fila; todas con `{{GA4 ID}}`)

| Etiqueta | Nombre del evento en GA4 | Parámetros | Activador |
|---|---|---|---|
| GA4 cta_click | `cta_click` | `cta_id`, `cta_text`, `cta_location`, `link_url` | `CE - cta_click` |
| GA4 begin_sign_up | `begin_sign_up` | `cta_id`, `link_url`, `plan` | `CE - begin_sign_up` |
| GA4 section_view | `section_view` | `section_id` | `CE - section_view` |
| GA4 contact_click | `contact_click` | `method` | `CE - contact_click` |

Cada parámetro toma su variable `{{DLV - …}}`. **Sin dimensión personalizada, GA4 recibe
el parámetro pero no deja abrir los informes por él.** En GA4: Administrar → Visualización
de datos → Definiciones personalizadas → **Crear dimensión personalizada** (en inglés:
Data display → Custom definitions → Create custom dimension), una por fila, alcance
**Evento**. El **Guardar** está arriba a la derecha del panel: cerrarlo de otra forma no
guarda. Si avisa que el parámetro todavía no llegó, se guarda igual.

| Nombre de la dimensión | Parámetro | Para qué |
|---|---|---|
| Método de contacto | `method` | separar WhatsApp de correo en `contact_click` |
| ID del botón | `cta_id` | qué botón se tocó |
| Ubicación del botón | `cta_location` | en qué parte de la página estaba |
| Sección vista | `section_id` | hasta dónde llega la gente en la home |
| Plan | `plan` | qué plan eligió quien fue a registrarse |

Las cinco están creadas en la propiedad de producción desde el 2026-10-02. Se llenan desde
que existen: los datos anteriores no se completan hacia atrás.

**d) Microsoft Clarity**

1. En [clarity.microsoft.com](https://clarity.microsoft.com) creá el proyecto `censuma.com`
   y copiá el **Project ID** (Settings → Overview).
2. En Clarity → Settings → **Masking** → modo **Balanced** o **Strict** (enmascara los
   campos de formulario; la política de privacidad lo promete).
3. En GTM: Etiquetas → Nueva → **Galería de plantillas de la comunidad** → buscá
   **Microsoft Clarity - Official** → agregar. Pegá el Project ID.
4. Activador: `CE - virtual_page_view` (Clarity sigue solo los cambios de página).
5. Consentimiento (Configuración avanzada → Configuración de consentimiento): **Requerir
   consentimiento adicional** → `analytics_storage`.

**e) Meta Pixel**

1. En [business.facebook.com](https://business.facebook.com) → Administrador de eventos →
   **Conectar orígenes de datos** → Web → **Píxel de Meta** → nombre `Censuma` → copiá el
   **ID del píxel**.
2. En GTM: Etiquetas → Nueva → Galería de plantillas de la comunidad → **Facebook Pixel**
   (de facebookarchive) → agregar.
3. Creá tres etiquetas con esa plantilla, todas con el ID del píxel y con **Requerir
   consentimiento adicional** → `ad_storage`:

| Etiqueta | Evento estándar | Activadores |
|---|---|---|
| Meta PageView | `PageView` | `CE - virtual_page_view` y `CE - consent_update marketing` |
| Meta Lead | `Lead` | `CE - begin_sign_up` |
| Meta Contact | `Contact` | `CE - contact_click` |

El segundo activador del PageView existe porque la primera página se ve **antes** de que
la persona acepte: sin él, esa visita no le llega a Meta nunca.

**f) Google Ads**

- **Vinculador de conversiones** (Conversion Linker): tipo «Vinculador de conversiones»,
  activador **All Pages**, marcá **Habilitar la vinculación de dominios** con
  `censuma.com, app.censuma.com`. Consentimiento: requerir `ad_storage`.
- **Remarketing**: tipo «Remarketing de Google Ads», ID de conversión `AW-…` (sale de
  Google Ads → Herramientas → Administrador de audiencias → Fuentes de audiencia).
  Activador: `CE - virtual_page_view`. Consentimiento: requerir `ad_storage`.

### Publicar

Arriba a la derecha → **Enviar** → nombre de la versión (por ejemplo `Medición inicial`) →
**Publicar**. Nada de lo configurado corre en el sitio hasta que se publica.

## 3. Meta: dominio y Conversions API

1. **Verificar el dominio**: Business Settings (Configuración del negocio) → Seguridad de
   la marca → **Dominios** → Agregar `censuma.com` → elegí la verificación por **registro
   DNS TXT** y cargalo donde se administra el DNS del dominio.
2. **Token de Conversions API** (lo usa la app para mandar el registro y el pago desde el
   servidor): Administrador de eventos → el píxel `Censuma` → **Configuración** → Conversions
   API → **Generar token de acceso** → copialo. Solo se muestra una vez.
3. **Código de prueba** (opcional, para probar): Administrador de eventos → el píxel →
   **Probar eventos** → copiá el código `TEST…`.

## 4. Google Ads

1. **Vincular GA4**: en Google Ads → Herramientas → Administrador de datos → **Google
   Analytics (GA4) y Firebase** → Vincular → elegí la propiedad `Censuma`. Activá la
   importación de audiencias y de métricas.
2. **Importar conversiones**: Objetivos → Conversiones → Resumen → **Nueva acción de
   conversión** → **Importar** → Propiedades de Google Analytics 4 → Web → marcá `sign_up`,
   `purchase` y `contact_click` → Importar y continuar.
3. Marcá `purchase` como conversión **principal** y `sign_up` como **secundaria** si las
   campañas van a optimizar por venta; al revés si todavía no hay volumen de pagos.
   **`contact_click` va siempre como secundaria**: si fuera principal, Ads optimizaría para
   que la gente escriba por WhatsApp y no para que se registre o pague.

## 5. Variables de entorno en Dokploy

**Sitio (este repo)**, en **Build Args** (no en Environment: se lee al compilar):

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_GTM_ID` | El ID del contenedor, `GTM-…` |

Después del cambio hay que **reconstruir** el sitio (Deploy), no alcanza con reiniciarlo.
Sin la variable, el sitio no carga GTM, pero el banner y los eventos siguen andando.

**Backend (la app)**, en Environment:

| Variable | Valor |
|---|---|
| `GA4_MEASUREMENT_ID` | El ID de medición `G-…` |
| `GA4_API_SECRET` | El secreto del Measurement Protocol (paso 1.9) |
| `META_PIXEL_ID` | El ID del píxel |
| `META_CAPI_TOKEN` | El token de Conversions API (paso 3.2) |
| `META_CAPI_TEST_CODE` | Opcional. El código `TEST…` mientras se prueba; **borralo después**, o los eventos reales quedan como eventos de prueba |

## 6. Cómo probar

1. **Vista previa de GTM**: en GTM → **Vista previa** → escribí `https://censuma.com` →
   se abre el sitio con Tag Assistant conectado. Comprobá:
   - Antes de tocar el banner, en la pestaña **Consentimiento**, todo en `denied`, y
     Clarity, Meta y Google Ads en «No se activó» (bloqueadas por consentimiento).
   - Al aceptar aparece `consent_update` y las señales pasan a `granted`.
   - Al navegar, un `virtual_page_view` por página, **sin** otro page_view duplicado.
   - Clic en «Empezar»: `cta_click`, `app_link_click` y `begin_sign_up`.
2. **DebugView de GA4**: Administrar → **DebugView**. Con la vista previa abierta, los
   eventos aparecen en vivo a los pocos segundos.
3. **Meta**: Administrador de eventos → el píxel → **Probar eventos** → abrí el sitio desde
   ahí; tienen que aparecer `PageView` y, al hacer clic en «Empezar», `Lead`. Para los del
   servidor, poné `META_CAPI_TEST_CODE` en el backend, registrá una cuenta de prueba y
   buscá en la misma pantalla los eventos del registro y del pago.
4. **Rechazar también se prueba**: abrí el sitio en una ventana privada, elegí «Rechazar»
   y comprobá en la vista previa que ninguna etiqueta de Meta, Clarity ni Google Ads se
   dispara.
5. **Reabrir**: el enlace «Preferencias de cookies» del pie abre el banner con lo elegido.

En local (`npm run dev`) sin `NEXT_PUBLIC_GTM_ID` los eventos se ven escribiendo
`dataLayer` en la consola del navegador.

## Lo que queda afuera del código y conviene saber

- **La cookie `censuma_consent` y la `censuma_utm` son un contrato con la app.** El formato
  está en `src/lib/consent.js` y `src/lib/attribution.js`; cambiarlo es cambiar los dos
  repos el mismo día.
- **«Último toque no directo»**: una visita con UTMs, gclid, fbclid o que viene de otro
  sitio (un buscador, una red social) reemplaza el origen guardado; una visita directa no.
- La política de privacidad describe exactamente esta configuración. **Si se suma una
  herramienta en GTM, se suma también a la política** (sección «Cookies y medición del
  sitio») antes de publicarla.

## Mejora futura (opcional): GTM del lado del servidor

Hoy las etiquetas corren en el navegador de cada visitante, y los bloqueadores de anuncios
cortan una parte. Un **contenedor de GTM del lado del servidor** corriendo en el VPS (por
ejemplo en `metrics.censuma.com`, como un servicio más de Dokploy) recibe los eventos en un
dominio propio y los reenvía a GA4 y a Meta: mejora la cobertura, alarga la vida de las
cookies propias y saca scripts de terceros del sitio. No es necesario para arrancar; tiene
sentido cuando el gasto en anuncios justifique medir mejor.
