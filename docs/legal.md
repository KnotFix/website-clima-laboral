# Los documentos legales

Documento de referencia. Dueño: `architect`. Extiende a `architecture.md`, que tiene el mapa de
archivos; acá están las reglas y lo que falta.

Cubre dos cosas que se confunden todo el tiempo: **publicar** un documento legal (este sitio) y
**hacerlo aceptar** (el producto). Son momentos distintos, personas distintas y efectos legales
distintos.

Estado: **los tres documentos RIGEN desde el 2026-08-18.** Están escritos en los dos idiomas,
cumplen los dos criterios de abajo y el flag `draft` quedó apagado en los tres (decisión del
usuario). Antes de esa fecha estaban publicados con el aviso de borrador.

⚠️ **El 2026-08-20 se INTERNACIONALIZARON** (`terms` 1.1, `privacy` 1.1, `dpa` 2.0), porque
estaban escritos para vender en Costa Rica y el producto se vende afuera. Lo que cambió, lo que
se decidió no hacer y lo que queda abierto está en «La internacionalización» al final de este
documento. **Leelo antes de tocar cualquiera de los seis `.mdx`.**

---

## Los tres documentos

| Slug | Qué es | A quién le habla |
|---|---|---|
| `privacy` | Política de privacidad | Cualquiera. Es la que se enlaza desde afuera |
| `terms` | Términos del servicio | La organización que contrata |
| `dpa` | Anexo de tratamiento de datos | El área de compras o legal del cliente |

Viven en `src/content/legal/{es,en}/*.mdx` y se rutean por `app/[lang]/legal/[slug]/page.js`.
El título, la **versión**, la fecha y el flag `draft` salen de `content/legal/nav.js`.

**Están fuera de `DOCS_NAV` a propósito.** Comparten el patrón con las docs y no comparten la
naturaleza: las docs son un recorrido de lectura con sidebar y anterior/siguiente; esto son tres
textos que se consultan por enlace directo. Meterlos en el árbol de la documentación los pondría
en el sidebar y en el paginador, que es justo donde nadie los busca.

### Por qué la versión vive en `LEGAL_NAV` y no en el `meta` de cada `.mdx`

Porque es **independiente del idioma** —el mismo documento en español y en inglés tiene que ser la
misma versión, y duplicado en dos archivos se separa en silencio— y porque **el registro de
aceptación del producto la lee de ahí**. Un registro que guarde «aceptó los términos» sin decir
cuál versión no prueba nada el día que el texto cambie.

### El aviso de borrador — APAGADO el 2026-08-18

⚠️ **Los tres están hoy en `draft: false`.** Lo que sigue es la regla, que queda viva para el día
que se redacte un documento nuevo o se abra una versión — no una descripción del estado de hoy.

**Por qué se apagó, además de que los dos criterios se cumplían:** el cartel afirmaba «no rige» y
«no invocar» mientras el producto ya OBLIGABA a aceptar los tres —`POST /api/registro/` es
fail-closed sin `acepta_legales`, y la pantalla de re-aceptación es un gate de sesión—. Un texto que
se hace aceptar diciendo de sí mismo que no rige es peor que cualquiera de las dos cosas por
separado.

⚠️ **Apagar el flag NO es una versión nueva.** `version` sigue en 1.0 en los dos repos, así que no
dispara el preaviso de 30 días ni le pide a nadie volver a aceptar.

`draft: true` en `LEGAL_NAV` dibuja el aviso arriba del documento. **Ya NO se apaga «cuando vuelva
del abogado»** —esa revisión no va a existir, ver abajo—: se apaga cuando no queda ningún
`[PENDIENTE:]` en los seis `.mdx` y ninguna cláusula promete algo que el producto no haga. Lo que el
aviso protege es eso: un documento con huecos adentro publicado sin marca es peor que no tenerlo,
porque parece que rige.

Es la misma disciplina que `<Shot>` con las capturas que faltan — el hueco es visible a propósito.

---

## Lo que falta antes de que rijan

**Ya no queda ninguno** (2026-08-18). El verificador sigue siendo
`grep -rniE "PENDIENTE|PENDING" src/content/legal/`, y tiene que devolver vacío: si algún día
aparece uno, es un hueco que se abrió después.

⚠️ **La alternancia del patrón no es cosmética: los marcadores están TRADUCIDOS.** Los `.mdx` en
inglés dicen `[PENDING: …]`, así que un `grep` por «PENDIENTE» a secas devuelve solo la mitad y
deja creer que el inglés está limpio. Es la mitad que se publica sin que nadie la relea.

**El grueso se cerró el 2026-08-17.** Lo que queda es corto y está listado abajo; lo que se
decidió, más abajo todavía, para que nadie lo vuelva a abrir sin saber que ya se cerró.

### Datos de la entidad — CERRADOS el 2026-08-17

**Knotfix es una PERSONA FÍSICA, no una sociedad**, y eso cambia etiquetas en los documentos:
donde el borrador decía «razón social» y «cédula jurídica» va **nombre** y **cédula de
identidad**. Si algún día se constituye una S.R.L. o S.A., estas cuatro líneas se tocan todas
juntas —el responsable del tratamiento pasa a ser otro sujeto de derecho—:

| | |
|---|---|
| Responsable | José Alejandro Chaves Ramírez, persona física, nombre comercial «Knotfix» |
| Cédula | 5-0448-0254 |
| Domicilio | Guanacaste, Liberia, Liberia, La Cruz. Código postal 50101 |
| Jurisdicción | Tribunales de **Liberia, Guanacaste** (el domicilio del proveedor, no San José) |
| Correo | `knotfixservice@knotfix.com`, la misma casilla pública de la tarjeta del plan a medida |
| Teléfono | +506 8791 7066 |

⚠️ **El teléfono está para identificar al proveedor, no para tramitar por ahí.** Los dos
documentos lo dicen en su sección de contacto: las solicitudes de derechos ARCO y los avisos
contractuales (cancelar, oponerse a un cambio) **van por escrito**, porque hay que poder
verificar quién pide y dejar constancia de qué se respondió. Una llamada no hace ninguna de las
dos cosas.

⚠️ El domicilio se declara **sin señas de ubicación**. Alcanza para identificar el domicilio
legal; no alcanza para que a alguien lo notifiquen ahí. Si un cliente corporativo o PRODHAB
pide una dirección notificable, hay que agregar las señas.

### El sitio todavía no publica precios

`terms` decía «los precios publicados en el sitio», y **el sitio no tiene página de precios**:
las rutas son la home, `/docs` y `/legal`. La cláusula apuntaba a nada. Se corrigió el
2026-08-17 para que nombre las dos superficies posibles —la pantalla de contratación del
producto, que hoy es la que muestra la lista, y la página de precios del sitio cuando exista—.

Cuando esa página se construya, **la lista tiene que coincidir con la tabla `planes`**, que es
lo que se cobra: el producto ya tiene esa parity cuidada entre la demo y la migración
(`npm run verificar:demo`), y una tercera copia en el sitio de marketing es la que se
desactualiza sin que nadie se entere. Ver «La oferta comercial» en el `CLAUDE.md` del producto.

### El tope de responsabilidad — ESCRITO el 2026-08-18

`terms` decía `[PENDIENTE: definir el tope]`, que **no es una pregunta para el abogado sino un
hueco literal en el texto**: se puede publicar un documento con una cláusula discutible, no uno
con un corchete adentro. Quedó la fórmula estándar de SaaS —**lo efectivamente pagado en los 12
meses anteriores al hecho**, por cualquier causa y sumadas todas las reclamaciones del período—,
en `es` y en `en`.

Borrar la cláusula NO era la alternativa neutral: sin tope la indemnización la fija un juez
mirando el daño del Cliente y no lo que se le cobró, y como Knotfix es persona física eso se
paga con patrimonio personal. Con la fórmula, la exposición máxima queda igual a un año de esa
suscripción (hoy entre $2.500 y $12.000 según el plan, `facturacion/0007`).

Las dos frases que la rodean **no se tocaron y son parte del mismo párrafo**: la exclusión de
daños indirectos —que acota el TIPO de daño, no el monto— y la salvedad de dolo y culpa grave,
que es la que hace que el tope no sea abusivo por sí solo.

⚠️ **La fórmula sola daba CERO durante la prueba gratis, y por eso lleva un piso de USD 1.000**
(decisión del usuario, 2026-08-18). La prueba no pide tarjeta y permite cargar la nómina entera,
así que hay datos personales reales en un período sin monto pagado. Un tope de cero es justo la
clase de cláusula que se declara abusiva y cae —y si cae, lo que queda no es el cero sino la
exposición ilimitada que la fórmula venía a evitar—. El piso es lo que la mantiene en pie.

El piso está redactado como «si en ese lapso no hubiera monto pagado», no como «durante la
prueba»: cubre la prueba, que es el caso conocido, y también cualquier otro período sin cobro
que aparezca después. **Si algún día la prueba pide tarjeta o nace un plan gratuito, esta frase
se relee** — no porque deje de ser cierta, sino porque el piso podría quedar corto.

### El precio congelado — CORREGIDO el 2026-08-18

`terms` decía «el precio nuevo rige desde la renovación siguiente», y **`onvo.py` no sabe hacer
eso**: sabe crear, leer y cancelar suscripciones, no cambiarle el ítem a una vigente
(`sincronizar_planes_onvo` arregla el catálogo para contrataciones NUEVAS). La suscripción queda
atada al `onvo_price_id` con el que se contrató, o sea que el precio ya estaba congelado en los
hechos y la cláusula decía lo contrario.

Se corrigió el TEXTO en vez de construir la actualización contra la API de ONVO: el precio
contratado no cambia en las renovaciones mientras el Cliente mantenga el plan, y el precio nuevo
alcanza a las contrataciones nuevas y a quien cambie de plan. Es lo que el código ya hace, es más
favorable para el Cliente, y evita construir la pieza más frágil de la integración por una
promesa que nadie pidió.

⚠️ **Quedó una puerta de escape con aviso de 30 días, y es a propósito.** Sin ella la cláusula
sería un congelamiento de precio perpetuo, que es un compromiso más fuerte del que conviene dar.
La diferencia con los otros correos que se prometen —fin de la prueba, cobro fallido— es que
**este lo dispara un acto deliberado nuestro y no el sistema**: se puede cumplir a mano el día
que se decida subir un precio, sin infraestructura de correo. Los otros los dispara el reloj y
por eso necesitan código.

Si algún día se implementa el cambio de ítem en ONVO, esta cláusula se puede volver a abrir —
pero no hace falta para publicar.

### Las bitácoras — SEPARADAS el 2026-08-18

La tabla de conservación metía en UNA fila «bitácoras de seguridad y de consultas de resultados: 12
meses», y eran dos cosas con destinos distintos. La de **consultas de resultados** la produce el
producto y hoy vive en Postgres con purga por retención, así que los 12 meses son ciertos. Las de
**acceso del servidor** —IP, dispositivo— las produce la infraestructura, se van con cada
despliegue, y prometer 12 meses de eso era afirmar algo que no ocurre.

Se eligió **separar la fila** en vez de montar un almacén de logs (decisión del usuario,
2026-08-18). El motivo de fondo no es el costo: un proveedor de logs gestionado es un
**subprocesador nuevo** —fila nueva en la tabla del `dpa`, en los seis `.mdx`, y una transferencia
internacional más que declarar— y esos logs llevan IP y correo, o sea datos personales. Pagar eso
por una retención que nadie pidió es caro en el sentido que no aparece en la factura.

⚠️ **Si algún día un cliente corporativo exige retención auditada de los logs de acceso**, las dos
salidas son un volumen persistente con rotación en el propio VPS (no agrega subprocesador) o un
gestionado (sí lo agrega, y entonces la tabla del `dpa` se toca el mismo día).

### La cláusula de auditoría del `dpa` — CERRADA el 2026-08-18

Se queda **tal cual estaba** (decisión del usuario) y se le quitó el marcador `[PENDIENTE:]` en los
dos idiomas: una auditoría al año, con 30 días de preaviso, en horario laboral, sobre los sistemas
que tratan los datos del Cliente y a su costa, sin alcanzar datos de otros clientes y sin esperar la
cadencia anual si la motiva un incidente. Es el estándar de la industria.

⚠️ **Lo que el marcador preguntaba no era «falta redactar esto»** —el párrafo estaba completo—
**sino «hasta dónde cedés si un cliente corporativo pide más»**. Esa pregunta sigue existiendo y se
va a contestar en una negociación, no en el documento: si algún día se acepta más de una auditoría
anual o se asume el costo, es un ADENDA para ese cliente y no un cambio de este texto, que rige para
todos los demás.

⚠️ **No confundir con la BITÁCORA** (`estudios.ConsultaResultados` en el producto). Son dos cosas
que en español se llaman igual y no se tocan: aquella es interna y técnica —nosotros auditamos a los
usuarios del Cliente para detectar intentos de reidentificación— y esta es contractual y externa —el
Cliente nos audita a nosotros—.

### NO hay revisión legal — decisión del usuario, 2026-08-18

**Los documentos se publican sin que un abogado los revise.** Es una decisión tomada y no un
pendiente: quien lea esto no tiene que volver a proponerla. Nada obliga a esa revisión —un contrato
no vale más ni menos por haber pasado por un despacho, y en Costa Rica no hay aprobación previa de
términos y condiciones— y el estado de los textos la hace defendible: no queda un solo
`[PENDIENTE:]` y no queda ninguna cláusula que afirme algo que el producto no haga.

**Consecuencia directa: la regla del borrador cambió.** Este documento decía que `draft: true` se
apaga «cuando el texto volvió revisado por el abogado, **y no antes**». Ese criterio ya no existe.
Hoy se apaga cuando se cumplen los dos que quedaron, que son los que de verdad protegían algo:

1. ningún `[PENDIENTE:]` en los seis `.mdx` — **cumplido**;
2. ninguna cláusula que prometa algo que el producto no hace — **cumplido** (fue el trabajo del
   2026-08-18: tope de responsabilidad, precios, retención, borrado, correos de ciclo de vida y
   bitácora).

**Los dos se verificaron y el flag se apagó ese mismo día.** El verificador de (1)
—`grep -rniE "PENDIENTE|PENDING" src/content/legal/`— devuelve vacío; para (2), además del trabajo
listado, se comprobó la paridad es/en sección por sección (17 en `terms`, 14 en `privacy`, 13 en
`dpa`), que `version` coincide con `DOCUMENTOS_LEGALES` del producto, y que la tabla de
subprocesadores dice PlanetScale y no nombra a Supabase en ninguno de los cuatro archivos
publicados.

#### Las tres preguntas que quedaron sin contestar, y de quién son

No desaparecen porque no haya abogado; cambian de dueño. Van acá para que no se pierdan:

- **¿Hay que inscribir esta base ante PRODHAB?** (Ley 8968, art. 21). ⚠️ **Esto NO es una opinión
  legal, es un trámite**: existe o no existe, y tiene sanción si correspondía y no se hizo. Se puede
  preguntar directo a PRODHAB, que es un órgano público y atiende consultas. La duda concreta es que
  la inscripción alcanza a las bases de distribución o comercialización de datos, y acá se tratan
  por cuenta del Cliente. **Sigue abierta.**
- **¿Conviene constituir una sociedad?** Como persona física, quien responde por un incidente de
  datos responde con su patrimonio personal, y el tope de `terms` es lo único que amortigua eso. Es
  una decisión de negocio y la puede acompañar un contador, no necesariamente un abogado. **Sigue
  abierta**, y se toma antes del primer cliente, no después.
- **¿La fórmula del tope aguanta frente a la normativa de consumidor?** Esta es la única que sin
  criterio legal no se puede contestar. Lo que se hizo es lo que se podía hacer: la fórmula estándar
  de la industria (lo pagado en 12 meses, con piso de USD 1.000) más la salvedad de dolo y culpa
  grave, que es lo que evita que se lea como abusiva. **Se asume el riesgo residual.**

### Lo técnico está completo

El último hueco —el proveedor de facturación electrónica— se cerró el 2026-08-17: es **Allegra**.

⚠️ **El proveedor de cobro CAMBIÓ el 2026-08-19: es Polar (Estados Unidos), no ONVOPay.** Y no es
solo un renglón de la tabla, porque cambian dos cosas de fondo:

1. **El PAÍS.** ONVO era costarricense y Polar es estadounidense, así que el cobro pasó a ser una
   **transferencia internacional** más de las que la política declara al amparo del artículo 14 de
   la Ley 8968. Las seis páginas ya lo dicen; si algún día se vuelve a `PASARELA=onvo`, hay que
   volver a tocarlas.
2. **Quién VENDE.** Polar es *merchant of record*: legalmente le vende la suscripción al Cliente,
   cobra y emite el comprobante con los impuestos que correspondan en su país. Eso significa que
   **un cliente costarricense NO recibe factura electrónica ante Hacienda por esa vía** — la única
   forma de emitirla es cobrando desde Costa Rica, o sea con `PASARELA=onvo`.

⚠️ **Allegra sigue declarada y sigue sin estar cableada en el repo** (no hay integración ni
variables de entorno): la factura se emite por fuera de la aplicación. Con Polar como MoR, además,
lo que se facturaría es otra cosa: nosotros le facturamos a Polar (exportación de servicios), no al
cliente final. **Ese punto necesita revisión contable antes del primer cobro real.**

---

## Lo que ya está decidido (2026-08-17)

Sale del código del producto o de una decisión explícita del usuario. **No lo vuelvas a marcar
como pendiente**: si algo de esto cambia en el producto, cambia acá y en los seis `.mdx`.

| Punto | Decisión | De dónde sale |
|---|---|---|
| Prueba gratis | 30 días naturales, **sin tarjeta** | `facturacion/models.py::DIAS_TRIAL` |
| Qué NO permite la prueba | Solo **lanzar un estudio**; configurar todo lo demás sí, y sin topes de plan | `ESTADOS_CON_LANZAMIENTO`, `services._topes_aplican` |
| Conversión automática | **Imposible**: no hay medio de pago registrado | `iniciar_contratacion` es un acto expreso |
| Al vencer sin contratar | **Solo lectura permanente**, no «sin acceso» ni borrado | `services.estado_efectivo` → `archivo` |
| Moneda e IVA | USD; con Polar como *merchant of record* el impuesto que corresponda lo liquida y lo cobra Polar | `facturacion/0007`, `PASARELA` |
| Periodicidad | **Anual adelantada**, un solo SKU | `Plan.precio_anual_centavos` |
| Cobro fallido | 14 días naturales de gracia con servicio completo | `services.DIAS_GRACIA` |
| Reembolsos | **No hay**; la cancelación corre hasta el fin del período pagado | decisión del usuario + `estado_efectivo` |
| Excedente de nómina | Se cobra por cabeza, **por la pasarela** (precio medido) y sobre el **PICO** del período | `cobro.publicar_tarifa_excedente`, `manage.py reportar_excedentes` |
| Tarjeta | **Nunca toca nuestros servidores** (checkout del proveedor, en el navegador) | `apps/facturacion/pasarelas/` — alcance PCI |
| Exportar al terminar | Las herramientas del producto (.xlsx/.pdf), **sin límite de tiempo**; NO hay volcado completo de la base | decisión del usuario, 2026-08-18 |
| Eliminar la cuenta | **Inmediato e irreversible**, lo ejecuta el OWNER; sin ventana de gracia | `organizaciones/purga.py` |
| Bitácora de consultas de resultados | **12 meses**, y se cumple: vive en Postgres (`estudios.ConsultaResultados`) con purga por retención | `manage.py purgar_bitacoras` |
| Bitácoras de acceso del servidor | **Operativas y efímeras**, sin plazo declarado: se descartan en cada despliegue | decisión del usuario, 2026-08-18 |
| Soporte | Formulario de `/ayuda` + correo, L–V 8:00–17:00 CR | `SOPORTE_EMAIL`, `apps/common/soporte.py` |
| Preavisos | 30 días (precios, subencargados, versión de los documentos) | decisión del usuario |
| Incidentes | 72 horas desde la detección | decisión del usuario |
| Analítica | **No hay ninguna**, ni en el sitio ni en la app | verificado en el repo |
| Auditoría del `dpa` | Una al año, 30 días de preaviso, a costa del Cliente | propuesta, sujeta a revisión legal |

### La tabla de subprocesadores

Es la que sostiene la autorización de transferencia internacional del artículo 14, así que tiene
que ser exacta y estar al día. Hoy: **Hostinger** (VPS con Dokploy, EE. UU.) · **PlanetScale**
(Postgres, EE. UU.) · **Clerk** (identidad) · **Resend** (correo) · **Cloudflare R2** (logo) ·
**Polar** (cobro y facturación como *merchant of record*, EE. UU.) · **Allegra** (factura
electrónica, Costa Rica).

⚠️ **Esa fila la decide `PASARELA` del backend, no una preferencia**: si un despliegue vuelve a
`onvo`, quien procesa la tarjeta es ONVOPay (Costa Rica) y las seis páginas mienten hasta que se
corrijan. Es el subencargado más fácil de cambiar sin darse cuenta, porque es una variable de
entorno.

⚠️ **Clerk faltaba en el borrador y es el más sensible de todos**: guarda el correo, la
contraseña y los factores de MFA de quienes administran la cuenta. Si mañana se apaga Clerk o se
cambia de proveedor de identidad, esa fila se toca el mismo día.

**La base migró de Supabase a PlanetScale, y la tabla se corrigió el 2026-08-18.** Región
confirmada: **Estados Unidos**. Es exactamente el caso que el párrafo anterior de este documento
anticipaba —«si algún día se migra… esta fila se toca el mismo día»— y llegó: la migración se
había hecho y los cuatro lugares publicados seguían nombrando a Supabase. **Declarar un proveedor
que ya no tiene los datos, y omitir el que sí los tiene, es justo la inexactitud que el artículo
14 castiga.** La lección operativa es que la fila NO se entera sola: si se cambia de proveedor de
base, de identidad o de correo, este documento y los cuatro archivos publicados son parte de ese
cambio.

⚠️ **Supabase todavía EXISTE y se elimina al publicar el producto** (dato del usuario,
2026-08-18). Mientras solo tenga datos sembrados de desarrollo no es subprocesador y por eso salió
de la tabla. **La señal**: si llega el primer cliente real antes de que se apague, vuelve a la
tabla el mismo día, porque volvería a tratar datos personales de terceros. El orden correcto es
apagarlo ANTES de abrir el registro.

**Los respaldos se declaran desde el 2026-08-18** en la doc pública `security-and-data`:
automáticos y **diarios**, con **2 días de retención** (el default de PlanetScale, sin tocar). Ese
número es el que hace verdadera la frase del `dpa` sobre las copias en respaldos —«desaparecen
cuando el ciclo de rotación las sobrescribe»—: son 48 horas. Si algún día se sube la retención
para poder recuperar más atrás, esa frase gana un plazo y la página de seguridad cambia con ella.

### Lo que el producto expone y el borrador no decía

Dos cosas que la revisión del 2026-08-17 agregó a `privacy` y a `dpa`, y que no son cosméticas:

- **Los verbatims se publican tal cual.** El N mínimo protege AGREGADOS; un texto libre es un
  registro individual y se le entrega al Cliente sin filtro de PII (§10.5 nunca se construyó). Va
  dicho en los tres lugares —`privacy` para quien responde, `dpa` para el Cliente, y `terms` como
  obligación de advertirlo en el aviso previo—.
- **La bitácora de consultas de resultados** (`views._auditar_lectura`) es un dato personal de
  uso y estaba sin declarar. Se declara como medida de anonimato y con la aclaración de que **no
  registra los valores** consultados.

---

## El registro de aceptación — CONSTRUIDO el 2026-08-17

**Vive en el otro proyecto**, no en este sitio. Acá queda la especificación, que sigue siendo la
referencia de por qué cada cosa es como es; lo que cambió es que ya no es una propuesta.

En el producto: `Back-End/apps/accesos/legales.py` (la autoridad de qué versión rige y el único
escritor), la tabla `aceptaciones_legales` (`accesos/0005`), `POST /api/registro/` —que ahora
exige `acepta_legales: true` y escribe las filas en la MISMA transacción que crea el tenant—,
`GET /api/legales/` + `POST /api/legales/aceptar/`, y del lado del front
`Front-End/src/components/legales/casilla-legales.tsx`. Red: `test_aceptacion_legal.py`.

⚠️ **Las versiones de `LEGAL_NAV` (este repo) y de `DOCUMENTOS_LEGALES` (el del producto) son dos
copias y no hay build que las compare.** Subir la versión de un documento acá y olvidarla allá
hace que la gente acepte un número que el texto publicado no lleva. Es el mismo problema que
`idiomas.json`/`escala.json` del producto, pero sin verificador posible: son dos despliegues.

**La pantalla de RE-aceptación se CONSTRUYÓ el 2026-08-17** (este párrafo decía que faltaba). Es
un gate en el arranque de la sesión: mientras queden documentos pendientes, no se monta el
producto. Alcanza a las dos poblaciones que el alta no cubre —quien fue INVITADO, que nunca pasa
por el alta y por lo tanto nunca vio la casilla, y todo el mundo el día que un documento sube de
versión—. En el producto: `Front-End/src/components/legales/pantalla-aceptar-legales.tsx`, y del
lado del backend `legales.estado_legal`, que además publica `legales_primera_vez` para poder
distinguir los dos casos (a quien nunca los vio no se le puede decir «actualizamos nuestros
documentos»).

⚠️ **Eso NO reemplaza el aviso previo, y la diferencia es de este documento y no del código.** Los
Términos prometen 30 días de antelación por correo antes de que rija una versión nueva; la
pantalla es el recordatorio al entrar. **Subir la versión en `LEGAL_NAV` y en `DOCUMENTOS_LEGALES`
sin haber mandado ese correo convierte la pantalla en una imposición**, que es justo lo que
invalida un consentimiento. El orden es: avisar → esperar los 30 días → subir las dos constantes el
mismo día.

### La regla

Un enlace en el pie **no es consentimiento**. El artículo 5 de la Ley 8968 pide consentimiento
**expreso**, otorgado por escrito físico o electrónico y **revocable**. Recolectar sin
consentimiento es falta grave (artículo 30). Entonces en el registro hace falta un acto, y hace
falta guardar evidencia de ese acto.

### Cómo se pide

- **Una casilla, sin premarcar.** Premarcada no es consentimiento expreso: es una omisión.
- **No se acepta con el botón de registrarse.** «Al continuar aceptás…» es aceptación tácita, que
  es exactamente lo que el artículo 5 no admite.
- **Los enlaces abren en pestaña nueva**, para que leerlos no borre el formulario a medio llenar.
- **La casilla cubre los tres documentos**, porque `terms` incorpora a `dpa` por referencia y
  `privacy` es condición del tratamiento. Una casilla por documento no agrega garantía y sí
  abandono.
- **El aviso de cobro va junto, no escondido**: cuándo empieza, cuánto y cómo se cancela. Es Ley
  7472, y en autoservicio con prueba gratis es el punto que el MEIC mira.

### El texto exacto

Español:

> ☐ He leído y acepto los **Términos del servicio**, el **Anexo de tratamiento de datos** y la
> **Política de privacidad**.
>
> La prueba es gratis por 30 días y no pide tarjeta. No se cobra nada hasta que contrates un
> plan, y podés cancelar desde tu cuenta en cualquier momento.

Inglés:

> ☐ I have read and accept the **Terms of service**, the **Data processing addendum** and the
> **Privacy policy**.
>
> The trial is free for 30 days and asks for no card. Nothing is charged until you subscribe, and
> you can cancel from your account at any time.

⚠️ **«No pide tarjeta» es parte del aviso, no un adorno**, y es lo que vuelve honesto el resto:
sin medio de pago registrado no existe el cobro sorpresa que la Ley 7472 vigila en autoservicio.
El día que la prueba pida tarjeta, este texto cambia ANTES que el formulario.

### Qué se guarda

Una fila **por documento y por versión**, no una sola por registro: los documentos cambian por
separado y hay que poder demostrar qué versión de cuál aceptó cada persona.

```
Table aceptaciones_legales {
  id            serial      [primary key]
  usuario_id    integer     [ref: > usuarios.id, not null]
  documento     varchar(32) [not null, note: "privacy | terms | dpa — el slug de LEGAL_NAV"]
  version       varchar(16) [not null, note: "COPIADA, no referenciada: si el documento
                                              sube de version, esta fila tiene que seguir
                                              diciendo lo que se acepto ese dia"]
  aceptado_at   timestamptz [not null]
  ip            inet        [null]
  user_agent    text        [null]

  indexes {
    (usuario_id, documento, version) [unique]
  }
}
```

**La versión se copia, no se referencia.** Es la misma decisión que
`estudios.n_minimo_confidencialidad`: un valor congelado que un cambio posterior no puede
reescribir hacia atrás. Con una FK a la versión vigente, subir el documento reescribiría en
silencio lo que todo el mundo aceptó.

### Cuándo se vuelve a pedir

Al subir la versión de un documento en `LEGAL_NAV`, quien tenga aceptada una versión anterior
recibe aviso por correo con los días de antelación que fijen los términos, y al entrar se le pide
aceptar la nueva. Hasta entonces sigue rigiendo la que aceptó.

### Revocación — CONSTRUIDA el 2026-08-18

El artículo 5 exige que el consentimiento sea revocable, y hasta esta fecha no había forma: la
política de privacidad ofrecía revocar escribiendo al correo de soporte —un canal válido— pero
detrás no había nada que ejecutarlo, así que honrar una revocación era trabajo manual sobre la
base. Hoy es `POST /organizaciones/{id}/eliminar/` (`Back-End/apps/organizaciones/purga.py`),
solo OWNER, con el nombre de la organización tecleado y verificado **en el servidor**.

Revocar implica cerrar la cuenta, y esa consecuencia va escrita al lado: sin esos datos el
servicio no se puede prestar. **El borrado es inmediato y sin ventana de arrepentimiento**
(decisión del usuario, 2026-08-18), y los tres documentos se corrigieron el mismo día — prometían
30 días para exportar y una purga a los 90, dos plazos que ya no existen.

⚠️ **Y con eso cayó la regla que esta sección fijaba: las filas de aceptación SÍ se borran.**
Decía que revocar no podía llevárselas, porque son la prueba del periodo en que el tratamiento
estuvo consentido; `AceptacionLegal.usuario` es `CASCADE`, así que al eliminar la cuenta se van
con las fichas. **Es una consecuencia de elegir el borrado total y hay que saberla**: el día que
alguien discuta si hubo consentimiento, la evidencia ya no está. Conservarla exigiría romper esa
FK y guardar una fila anonimizada, que es una decisión de esquema y está **sin tomar**.

⚠️ El **canal por correo sigue publicado en `privacy`** y sigue siendo válido: no todo el mundo
que quiera revocar es el titular de la cuenta, y quien no lo sea no tiene ese botón.

---

## El tercer momento: el aviso a la persona empleada — CONSTRUIDO el 2026-08-17

**El que más se olvida, y en este producto es el que más importa.**

En el producto: `Back-End/apps/organizaciones/avisos.py` (el texto modelo y su
interpolación), `organizaciones.aviso_privacidad` (lo que el cliente escribe, editable en
Configuración → General), `estudios.aviso_privacidad` (SNAPSHOT congelado por
`ciclo.lanzar_estudio`), el campo `aviso_privacidad` en el payload de captura, y del lado
del front `Front-End/src/components/kiosco/aviso-privacidad.tsx`, que montan las DOS
superficies del empleado porque vive dentro de `FormularioBoleta`. Red:
`test_aviso_privacidad.py` y `test_aviso_en_captura.py`.

⚠️ **Hasta ese día los Términos prometían un aviso modelo que el producto no entregaba.**
Si algún día se saca esta pantalla, esa cláusula deja de ser cierta.

Quien responde la encuesta **nunca pasa por el registro**. No es cliente, no acepta los términos de
Knotfix, y sin embargo es la titular de los datos que de verdad importan. Necesita su propio aviso,
en su propio momento: **la pantalla previa a la primera pregunta de la boleta**, en kiosco y en
correo por igual.

Ese aviso lo da **el cliente**, que es el responsable de la base. Knotfix lo provee armado dentro
del producto, con el nombre de la organización interpolado, y el cliente lo revisa y lo adapta.

Tiene que cubrir lo que exige el artículo 5: **quién trata los datos** (la organización, no
Knotfix), **para qué**, **quién va a ver los resultados**, **si responder es obligatorio o no y qué
pasa si no se responde**, **qué derechos tiene y cómo ejercerlos**, y **cuánto se conservan**.

El texto de la garantía de anonimato ya está escrito y probado en la doc
`employee-anonymity` — sirve como base, pero **no alcanza solo**: es el argumento, no el aviso
legal. Le faltan finalidad, destinatarios, carácter facultativo y derechos.

> **Este aviso no es una casilla.** Al empleado se le informa; el consentimiento en una relación
> laboral es discutible por la asimetría entre las partes, y forzar una casilla para poder trabajar
> no lo vuelve más válido. Lo que sí hay que poder demostrar es que **se informó**, y para eso
> alcanza con registrar que la pantalla se mostró y qué versión del aviso era.

---

## Termly — DECISIÓN del 2026-08-20

Se contrata **Termly Pro+** ($15/mes facturado anual; $20 mensual) para generar `privacy`, `terms`
y una política de cookies en los dos idiomas. Los planes son Free (**1** política básica), Starter
(**2**, $10/$14) y Pro+ (**ilimitadas**). Acá hacen falta tres, así que el Starter no alcanza.

⚠️ **El `dpa` NO sale de Termly y no puede salir.** Sus generadores son diez —privacy, terms,
cookies, impressum, EULA, uso aceptable, disclaimer, devoluciones, envíos y accesibilidad— y el
anexo de tratamiento no está entre ellos. Sigue siendo texto propio, y con él **la tabla de
subprocesadores**, que es la pieza que sostiene la autorización del artículo 14. O sea que el
documento más caro de mantener no se terceriza.

### Lo que Pro+ compra de verdad, y dónde se choca

Su diferencial frente a Starter no es solo el tercer documento: es **«Multi-Language Policies»**,
descrito como *«automatically display your **hosted** policies in the visitor's browser language»*.
La palabra que importa es **hosted**. Esa función vive del lado de Termly, no del texto copiado.

Y ahí está el choque, porque los dos modos de publicar se excluyen:

| | Copiar el texto a los `.mdx` | Publicar el hosted/embed de Termly |
|---|---|---|
| Registro de aceptación | Sigue funcionando | **Se rompe** (ver abajo) |
| Termly como subprocesador | No | **Sí** — ve la IP de cada visitante |
| Sitio estático | Se mantiene | La página legal depende de que Termly esté arriba |
| Multi-idioma automático | No aplica: se copia cada idioma a mano | Es justo lo que se paga |
| Actualizaciones del texto | A mano | Solas |

⚠️ **La recomendación es COPIAR, y el motivo es el registro de aceptación.**
`aceptaciones_legales` guarda qué `version` aceptó cada persona y `LEGAL_NAV` dice cuál rige. Un
documento que Termly actualiza solo **cambia el texto sin tocar la versión**: quedan firmas contra
un texto que ya no existe. Es exactamente lo que el preaviso de 30 días viene a evitar, y no hay
forma de conciliarlo con un texto que muta en el servidor de un tercero.

Consecuencia honesta: **en modo copiar, Pro+ se paga casi solo por el tercer documento** —el
multi-idioma automático, las vistas ilimitadas del banner y el IAB TCF no se usan—. Si el banner de
cookies nunca se monta, el Starter hace el mismo trabajo por $5 menos. Queda dicho para que la
decisión sea con el dato, no contra él.

### El banner de cookies se justifica a sí mismo

Hoy el sitio **no tiene ninguna cookie no esencial** —cero analítica, verificado en el repo— y
`privacy` ya lo declara en «Cookies y medición del sitio». Montar el CMP de Termly le agrega al
sitio las cookies del propio banner, que es lo único que habría que consentir. **El orden correcto
es al revés**: primero la herramienta de medición, después el banner.

### El cuestionario tiene que decir lo que el producto hace

Un generador produce el texto que le dictan. Si el cuestionario se contesta de memoria, sale un
documento genérico que promete cosas que el producto no hace —que es el defecto que el trabajo del
2026-08-18 vino a cerrar—. Estas son las respuestas, sacadas de este documento y de los `.mdx`
vigentes:

⚠️ **Tres filas se CORRIGIERON el 2026-08-21** —normativa, base legal y transferencia
internacional—. Estaban escritas contra el texto costarricense y quedaron desfasadas el mismo día
que se escribieron, porque la internacionalización (ver el final de este documento) las derogó unas
horas después. Contestarle a Termly lo que decían antes **regenera exactamente el bloqueo que la
2.0 del `dpa` vino a cerrar**: consentimiento como base de licitud del servicio y el artículo 14
como base de transferencia hacia la Unión. Si alguna de estas tres respuestas vuelve a sonar
«simple», es señal de que se está contestando de memoria.

| Lo que pregunta Termly | Qué contestar |
|---|---|
| Tipo de entidad | **Persona física**, no sociedad. Nombre comercial «Knotfix» |
| Nombre legal / identificación | José Alejandro Chaves Ramírez · cédula 5-0448-0254 |
| Domicilio | Guanacaste, Liberia, Liberia, La Cruz, CP 50101, Costa Rica |
| Contacto de privacidad | `knotfixservice@knotfix.com` · +506 8791 7066 (identificación, **no** tramitación) |
| Jurisdicción y ley aplicable | Costa Rica; tribunales de **Liberia, Guanacaste** — no San José |
| Normativa que aplica | **Ley 8968** y su reglamento **Y el RGPD** (más UK GDPR y la LPD suiza), con el lenguaje de *service provider* de **CCPA/CPRA**. No es «la 8968 con extras opcionales»: los dos marcos rigen a la vez desde el 2026-08-20 |
| Público | B2B. Organizaciones; el titular de los datos que importan es la persona empleada, que **nunca pasa por el registro** |
| Menores | No dirigido a menores; personas trabajadoras mayores de edad |
| Datos que se recolectan | Identificación de cuenta · credenciales (viven en Clerk, la contraseña **nunca** se ve) · facturación · medio de pago (**nunca toca nuestros servidores**) · bitácoras de acceso e IP · bitácora de consultas de resultados · comunicaciones de soporte · logo · nómina y respuestas |
| Datos sensibles | **No se piden.** El cliente se obliga por contrato a no usar las preguntas propias para recabarlos |
| Base legal | **Una tabla por base**, no una sola: ejecución del contrato, interés legítimo, obligación legal (facturación) y consentimiento **solo para lo opcional** —que hoy es nada—. En Costa Rica, además, el consentimiento expreso del artículo 5, revocable. ⚠️ **La casilla del registro NO es la base de licitud del servicio**, es la constancia de que se firmó un contrato: acoplarlas viola el artículo 7.4 del RGPD |
| Con quién se comparte | Hostinger · PlanetScale · Clerk · Resend · Cloudflare R2 · Polar · Allegra. **La fila de la pasarela la decide `PASARELA`, no una preferencia** |
| Transferencia internacional | Sí; todos en EE. UU. salvo Allegra (Costa Rica). **Desde Costa Rica**, artículo 14. **Desde el EEE, el Reino Unido y Suiza, Cláusulas Contractuales Tipo** de la Decisión (UE) 2021/914 con Anexos I–III completos, *Addendum* del ICO y adaptaciones suizas. ⚠️ **Nunca «autorizada al aceptar la política»**: el consentimiento como base de transferencia es la derogación del artículo 49, pensada para casos ocasionales, y no vale para infraestructura permanente |
| Venta de datos / publicidad / entrenamiento de modelos | **Ninguna de las tres** |
| Analítica y rastreo | **No hay**, ni en el sitio ni en la app |
| Cookies | Solo indispensables: sesión, idioma y tema |
| Retención | La tabla de `privacy`. Bitácora de consultas **12 meses**; bitácoras de acceso del servidor **efímeras, sin plazo** |
| Respaldos | Diarios, **2 días** de retención (default de PlanetScale) |
| Modelo comercial | Suscripción **anual adelantada**, un solo SKU, en **USD** |
| Prueba gratis | **30 días naturales, sin tarjeta.** No convierte sola: no hay medio de pago registrado |
| Al vencer sin contratar | **Solo lectura permanente** — ni borrado ni bloqueo |
| Reembolsos | **No hay.** La cancelación corre hasta el fin del período pagado |
| Impuestos | Los liquida y cobra **Polar** como *merchant of record* |
| Cobro fallido | 14 días naturales de gracia con servicio completo |
| Tope de responsabilidad | Lo pagado en los **12 meses** anteriores, **con piso de USD 1.000**, salvo dolo y culpa grave; sin daños indirectos |
| Cambios en los documentos | **30 días** de preaviso por correo antes de que rija una versión nueva |
| Incidentes | **72 horas** desde la detección |
| Soporte | Formulario de `/ayuda` + correo, L–V 8:00–17:00 CR |

⚠️ **Lo que Termly NO va a saber preguntar, y hay que agregarle a mano al texto que devuelva**: la
separación entre quién respondió y qué respondió, el N mínimo de los agregados, que **los verbatims
se entregan tal cual y sin filtro de PII**, la fecha de respuesta guardada sin hora, y la bitácora
de consultas como medida de anonimato. Son las cláusulas que hacen distinto a este producto y
ninguna sale de una plantilla.

### Qué pasa con las versiones el día que el texto se reemplace

El texto generado **no entra sin más**: se reconcilia contra lo que hoy dicen los seis `.mdx`, se
verifica que ninguna cláusula prometa algo que el producto no hace, y se comprueba la paridad es/en
sección por sección. Recién entonces sube a **2.0** en `LEGAL_NAV` **y** en `DOCUMENTOS_LEGALES`
del producto — el mismo día, y **después** del correo de preaviso. El orden sigue siendo: avisar →
esperar los 30 días → subir las dos constantes.

Si la política de cookies llega a existir, entra en `LEGAL_NAV` como cuarto documento **pero no en
el conjunto de aceptación del producto**: una política de cookies se informa, no se firma.

---

## La cláusula de impuestos y factura — CORREGIDA el 2026-08-20

**Cuando la pasarela cambió a Polar el 2026-08-19, `privacy` se actualizó y `terms` no.** La
tabla de subprocesadores ganó su fila de Polar en los dos idiomas, pero
`terms` §«Precios, impuestos y facturación» quedó con la redacción de la era ONVO, que decía dos
cosas que ya eran falsas:

1. que a los precios se les aplica **el IVA costarricense del 13 %** — con un *merchant of record*
   el impuesto es el del país del Cliente y lo determina Polar, no nosotros;
2. que **«por cada cobro emitimos la factura electrónica»** — no se emite: el comprobante lo emite
   Polar, y por esa vía no hay factura ante Hacienda.

Es exactamente la clase de defecto que la regla de este documento prohíbe —ninguna cláusula que
prometa algo que el producto no hace— y sobrevivió porque **el cambio de pasarela se revisó
documento por documento y `terms` se pasó por alto**. La lección operativa: `PASARELA` no toca una
tabla, toca **las seis páginas**, y la de impuestos es la más fácil de olvidar porque no nombra al
proveedor.

### Qué dice ahora

Que la suscripción **la vende y la cobra Polar como comercio registrado**, que Polar determina,
liquida y cobra el impuesto del país del Cliente —que puede no ser costarricense—, y que por eso
**el monto final puede ser mayor que el precio publicado**. El ⚠️ del párrafo siguiente dice sin
rodeos que **por esa vía no hay factura electrónica ante la Administración Tributaria**, y deja la
salida abierta: quien necesite un comprobante costarricense lo pide **antes de contratar** y el
cobro se procesa desde Costa Rica, con el 13 % y con factura.

Se agregó además una frase que antes no hacía falta y ahora sí: **los impuestos, retenciones o
trámites de importación de servicios del país del Cliente son del Cliente**. Es lo que aparece
apenas se vende fuera de Costa Rica —el IVA a servicios digitales en México, las retenciones en
Colombia— y sin ella la cláusula quedaba muda justo donde el cliente extranjero pregunta.

### La versión NO subió, y eso hay que verificarlo antes de desplegar

⚠️ **`version` sigue en 1.0 y `updated` pasó a 2026-08-20.** Es la primera corrección posterior a
que los documentos entraran en vigor (2026-08-18), así que la regla de siempre —avisar, esperar 30
días, subir las dos constantes— **se saltea solo si no hay a quién avisar**.

**El verificador es una consulta, no una opinión: `aceptaciones_legales` tiene que estar VACÍA en
producción.** Si lo está, esta corrección entra con 1.0 y no hay nada más que hacer. Si tiene
filas, alguien aceptó un texto que ya no es el publicado, y entonces esto pasa a ser **2.0** en
`LEGAL_NAV` **y** en `DOCUMENTOS_LEGALES`, después del correo de preaviso.

⚠️ **Y hay una ventana que se cierra sola:** mientras no llegue el primer cliente, corregir el
texto legal es gratis. Después cuesta 30 días cada vez. Las correcciones que se vean venir
conviene hacerlas ahora.

### El verificador de `[PENDIENTE:]` tiene dos falsos positivos

`grep -rniE "PENDIENTE|PENDING" src/content/legal/` ya **no devuelve vacío**, y no es un hueco
nuevo: los dos aciertos están en `nav.js` —la palabra «independientes» contiene «pendiente», y el
propio comentario del archivo cita `[PENDIENTE:]`—. Los seis `.mdx` están limpios. Si se quiere el
verificador exacto, hay que acotarlo a los `.mdx`:

```
grep -rniE "\[(PENDIENTE|PENDING):" src/content/legal --include=*.mdx
```

---

## Precios con impuesto incluido — DECISIÓN del 2026-08-20

**El precio que se muestra es el TOTAL que se cobra.** Ya no se le agrega nada al pagar.

⚠️ **Esto NO es una cuenta del front: es una configuración de Polar.** El comportamiento fiscal de
la organización tiene que estar en **«Inclusive»**. Sus tres opciones son *Location-based* (el
default: elige según el país del comprador, porque Norteamérica espera el precio sin impuesto y
Europa con él), *Inclusive* (el impuesto se **extrae** del precio) y *Exclusive* (se **agrega**
encima). **Mientras el tablero de Polar siga en el default, la pantalla miente**, y ningún cambio
de código lo arregla.

**El front NUNCA calcula un impuesto**, y eso es deliberado: la tasa depende del país —y a veces
del estado— del comprador, que es justo el dato que no se tiene al dibujar la tabla de planes.
Reimplementarlo sería rehacer lo que se le paga a Polar por tener.

### Lo que cuesta, en plata

Con *inclusive*, el impuesto sale **de tu precio**, no del bolsillo del Cliente. El ejemplo de la
propia documentación de Polar: un producto a $12 con 20 % de impuesto → el Cliente paga $12, de los
que **$2 son impuesto y $10 son tu neto**.

Traducido a la escalera de planes: un cliente **costarricense** con IVA del 13 % en un plan de
**$2.500** deja un neto de **$2.212** —se van $288—, mientras que un cliente de un estado de EE. UU.
donde el SaaS B2B no tributa deja los $2.500 completos. **El mismo precio de lista rinde distinto
según dónde esté el cliente, y el país que más grava es el que menos te paga.**

⚠️ **Los precios de la tabla `planes` NO se tocaron.** Se decidió que el número publicado pase a
leerse como total, no subirlos para compensar. Si algún día se quiere netear lo mismo que antes, hay
que hacer *gross-up* en `planes` —$2.500 netos desde Costa Rica son $2.825 de lista— y eso también
se lo cobra a quien no paga impuesto. Es una decisión de precio, no de implementación.

⚠️ **El tope de responsabilidad se lee sobre lo EFECTIVAMENTE PAGADO**, que es el bruto con el
impuesto adentro. La fórmula no cambia; lo que cambia es que ahora una parte de ese bruto nunca fue
tuya.

### Dónde quedó dicho

| Superficie | Qué dice |
|---|---|
| `terms` §Precios (es/en) | El importe mostrado es el total; Polar **extrae** el impuesto y lo desglosa en el comprobante; **al Cliente no se le agrega nada sobre el precio que vio** |
| Tabla de planes del alta | `registro.ts` → `periodo: "por año, impuestos incluidos"` |
| Lista de planes de la app | Una línea al pie de la lista, **no una por tarjeta**: el impuesto no cambia de plan a plan y repetirlo competiría con el precio. Clave `suscripcion.contratacion.impuestos_incluidos`, en los **ocho** catálogos |

### La excepción que no se puede olvidar

**El excedente de nómina se factura FUERA de la pasarela**, así que la inclusión no lo alcanza: se
cobra por cabeza y por separado, y lleva el impuesto que corresponda a esa factura. Quedó dicho en
`terms` en los dos idiomas. Sin esa frase, «impuestos incluidos» prometía algo sobre un cargo que
Polar ni siquiera ve.

---

## La internacionalización — 2026-08-20

Los documentos estaban escritos sobre la Ley 8968 y para un cliente costarricense. El producto
se vende en ocho idiomas, cobra en dólares por un *merchant of record* estadounidense y aloja
en Estados Unidos, así que **el texto describía un negocio que no es el que se está haciendo**.

Versiones: `terms` **1.1**, `privacy` **1.1**, `dpa` **2.0**. El `dpa` sube de mayor porque no
es el mismo documento con retoques: pasa a regir bajo dos marcos e incorpora las Cláusulas
Contractuales Tipo con sus tres anexos.

### El bloqueo que se cerró, y por qué era un bloqueo

Costa Rica **no está en la lista de adecuación de la Comisión Europea**. Un cliente europeo que
manda la nómina de su plantilla a un encargado costarricense necesita garantías del artículo 46
del RGPD, y el `dpa` resolvía la transferencia así:

> «al amparo del artículo 14 de la Ley 8968, con la autorización que el Cliente otorga»

⚠️ **Eso no vale bajo el RGPD**, y no es un matiz de redacción: el consentimiento como base de
transferencia es una derogación del artículo 49, pensada para casos ocasionales, no para
infraestructura permanente. Es el punto exacto donde el trámite de compras de un cliente europeo
se detiene. Hoy la transferencia se apoya en las **Cláusulas Contractuales Tipo** de la Decisión
(UE) 2021/914, incorporadas por referencia con las elecciones hechas (módulo, cláusula 7,
cláusula 9(a) opción 2, cláusula 11(a), ley y fuero) y con los **Anexos I, II y III completos**,
más el *Addendum* del ICO para el Reino Unido y las adaptaciones suizas.

⚠️ **Incorporar por referencia es lo correcto y no un atajo**: una cláusula tipo MODIFICADA deja
de ser una cláusula tipo y con ella se cae la base de la transferencia. Por eso el `dpa` dice
expresamente que ante una contradicción **mandan las cláusulas**. Si alguien "mejora" una
cláusula copiándola al texto, rompe justo lo que la hace servir.

### Lo demás que se corrigió

- **La base de licitud de `privacy` estaba MAL para la UE.** Decía consentimiento y remataba con
  «revocarlo implica que no podemos seguir prestando el servicio»: exactamente el acoplamiento
  que el artículo 7.4 del RGPD prohíbe —un consentimiento que no se puede retirar sin perder el
  servicio no es libre—. Hoy es una tabla por base (contrato, interés legítimo, obligación legal,
  consentimiento solo para lo opcional, que hoy es nada) y dice explícitamente que **la casilla
  del registro no es la base de licitud del servicio** sino la constancia de que se firmó un
  contrato.
- **Faltaban derechos.** Solo estaban acceso, rectificación y eliminación. Se agregaron
  portabilidad, limitación, oposición, retiro del consentimiento y no ser objeto de decisiones
  automatizadas, más la autoridad de control **del país de cada quien** (antes solo PRODHAB).
- **`terms` no tenía el paquete que un comprador de afuera busca primero**: garantías y su
  exclusión, indemnidad de propiedad intelectual, fuerza mayor, sanciones y control de
  exportaciones, cesión, integridad y divisibilidad, e idioma prevalente (rige el español).
- **Se declaró que no se vende a consumidores**, con la salvedad de las normas imperativas. Sin
  eso, el «no hay reembolsos» y la renovación automática chocan con el derecho de desistimiento
  europeo el día que compre un autónomo.
- **Lenguaje de *service provider* de la CCPA/CPRA** en `privacy` y en el `dpa`: «no vendemos ni
  compartimos» como compromiso contractual y no solo como afirmación.
- **`terms` dejó de decir que el excedente se factura por fuera**, porque dejó de ser cierto — y
  ese cambio empezó siendo un problema fiscal, no de redacción. Ver abajo.

### El excedente: era un agujero fiscal, no una tarea pendiente

`terms` decía que los cargos por personas de más «se facturan por separado y **fuera** de la
pasarela». Facturar por fuera es emitirle una factura transfronteriza al cliente, o sea salirse
del *merchant of record* y quedar expuesto a registrarse al IVA de su país — justamente de lo
que se estaba escapando el proyecto al elegir Polar. **La obligación de registrarse se activa por
vender ahí, no por cuánto**, así que cobrar el 95 % por el MoR y el 5 % por fuera deja las mismas
obligaciones que cobrar todo por fuera.

Se cerró **construyendo el cobro**, no reescribiendo la cláusula: precio medido sobre el producto
del plan, alimentado por `manage.py reportar_excedentes` (cuarto cron). Detalle en el `CLAUDE.md`
del producto, «La oferta comercial».

⚠️ **La cláusula ahora declara CÓMO se calcula, y eso ata el texto al código**: se cobra el
**máximo del período** y no la nómina del día de la renovación, porque el medidor agrega con
`max`. Si alguien cambia esa agregación, `terms` es parte del cambio en los dos idiomas. Y la
cláusula promete además que los dos números —hoy y el pico— **están a la vista en la pantalla del
plan**; por eso el front muestra los dos (`resumen-suscripcion.tsx`, clave `excedente_pico` en
los ocho catálogos).

### Las versiones subieron SIN el preaviso de 30 días

Los propios Términos prometen avisar por correo con 30 días antes de que rija una versión nueva,
y el orden documentado es avisar → esperar → subir `LEGAL_NAV` y `DOCUMENTOS_LEGALES` el mismo día.
**Acá se subieron directo**, y se sostiene por un solo motivo: **no hay ningún cliente que haya
aceptado la 1.0 en producción**. El preaviso protege a quien ya aceptó una versión; sin nadie a
quien avisar, no se le está imponiendo nada a nadie.

⚠️ **El día que exista el primer cliente, esa excusa deja de existir.** No es una relajación de la
regla: es el único caso en el que la regla no tiene a quién proteger. La próxima subida va con
`manage.py avisar_version_legal` primero.

### LO QUE NO SE HIZO, y es una decisión tomada

**No hay representante en la UE ni en el Reino Unido** (artículo 27 del RGPD), y **no se constituyó
sociedad**. Decisión explícita del usuario, 2026-08-20. **No lo vuelvas a proponer como pendiente
de redacción**: no es algo que se arregle escribiendo un párrafo.

Qué significa exactamente, para que nadie crea que está cubierto:

- **Para el CLIENTE europeo, la transferencia ya es lícita.** Las Cláusulas Contractuales Tipo son
  lo que él necesita para poder mandarnos datos, y están. El representante es una obligación
  NUESTRA y separada.
- **La exposición es de Knotfix, no del cliente**: el artículo 27 alcanza a quien ofrece servicios
  a interesados en la Unión sin estar establecido ahí, y su incumplimiento es del artículo 83.4
  (hasta 10 M € o el 2 %). Discutible para el papel de ENCARGADO —las directrices 3/2018 del CEPD
  dicen que un encargado fuera de la Unión que trabaja para un responsable europeo no queda
  atrapado por el artículo 3.2 solo por eso—, y bastante menos discutible para el papel de
  RESPONSABLE de los datos de la cuenta.
- **Los documentos publicados NO mencionan el hueco**, y es a propósito: una política que declara
  que no designó representante se autoincrimina sin darle nada a nadie. Queda anotado acá, que es
  donde tiene que estar.
- **Si algún día se designa** (proveedores tipo Prighter, del orden de 200–500 €/año), el cambio
  es una fila en «Quién trata tus datos» de `privacy`, en los dos idiomas, y una versión nueva.

Sigue abierta también, del relevamiento del mismo día y sin decidir:

- **La jurisdicción exclusiva de Liberia** no la va a aceptar sin discutir ningún comprador de
  afuera. La salida habitual es arbitraje en sede neutral. **No se tocó**: es una decisión
  comercial, no un defecto del texto.
- **El precio con impuesto INCLUIDO** cobrando en todo el mundo hace que el neto varíe por país
  (un comprador con 25 % de IVA deja bastante menos que uno con 0 %), y un cliente europeo con
  número de IVA va por *reverse charge* y paga 0 — momento en el cual «el impuesto ya está
  incluido» le suena a que se le cobró de más. El estándar B2B es publicar sin impuesto y
  agregarlo en el checkout. **Es un cambio de modelo de precios, no de redacción.**
- **Sin SOC 2 ni ISO 27001**, y el `dpa` lo dice explícitamente en su Anexo II en vez de dejarlo
  en el aire. Para pymes el derecho de auditoría anual sustituye bien; para *enterprise* no.
