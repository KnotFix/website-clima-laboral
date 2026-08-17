# Los documentos legales

Documento de referencia. Dueño: `architect`. Extiende a `architecture.md`, que tiene el mapa de
archivos; acá están las reglas y lo que falta.

Cubre dos cosas que se confunden todo el tiempo: **publicar** un documento legal (este sitio) y
**hacerlo aceptar** (el producto). Son momentos distintos, personas distintas y efectos legales
distintos.

Estado: **los tres documentos están escritos en los dos idiomas y marcados como borrador.**
Ninguno rige todavía.

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

### El aviso de borrador

`draft: true` en `LEGAL_NAV` dibuja el aviso arriba del documento. Se apaga cuando el texto volvió
revisado por el abogado, **y no antes**: un documento legal sin revisar publicado sin marca es peor
que no tenerlo, porque parece que rige.

Es la misma disciplina que `<Shot>` con las capturas que faltan — el hueco es visible a propósito.

---

## Lo que falta antes de que rijan

Los `.mdx` llevan los faltantes marcados en línea como **`[PENDIENTE: …]`**. Se encuentran todos
con `grep -rn "PENDIENTE" src/content/legal/`.

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

### Para el abogado

El tope de responsabilidad de `terms`, la cláusula de auditoría de `dpa` —que ya lleva una
redacción propuesta, no un hueco— y una revisión general. Revisar borradores cuesta bastante
menos que encargarlos. Dos preguntas específicas que conviene llevarle:

- **Si esta base de datos hay que inscribirla ante PRODHAB** (Ley 8968, art. 21). La inscripción
  alcanza a las bases de distribución o comercialización de datos, y acá se tratan por cuenta
  del Cliente, así que no es obvio en ninguna de las dos direcciones.
- **Qué se gana constituyendo una sociedad.** Como persona física, quien responde por un
  incidente de datos responde con su patrimonio personal, y el tope de responsabilidad de
  `terms` es justamente lo que amortigua eso. Es decisión de negocio, pero se toma antes del
  primer cliente, no después.

### Lo técnico está completo

El último hueco —el proveedor de facturación electrónica— se cerró el 2026-08-17: es **Allegra**,
y cobra por **ONVOPay**. Son dos proveedores y dos filas separadas en la tabla a propósito: ONVO
mueve la PLATA (procesa la tarjeta) y Allegra emite el COMPROBANTE ante Hacienda con los datos
fiscales del Cliente. Confundirlos deja sin declarar a quien recibe la razón social, la cédula
jurídica y la dirección fiscal de cada cliente.

⚠️ **Allegra no está cableado en el repo** (no hay integración ni variables de entorno): hoy la
factura se emite por fuera de la aplicación. Si mañana se automatiza, la fila ya está declarada y
no hay que tocar los documentos.

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
| Moneda e IVA | USD, **sin IVA incluido**; 13 % cuando corresponda | `facturacion/0007`, `ONVO_MONEDA` |
| Periodicidad | **Anual adelantada**, un solo SKU | `Plan.precio_anual_centavos` |
| Cobro fallido | 14 días naturales de gracia con servicio completo | `services.DIAS_GRACIA` |
| Reembolsos | **No hay**; la cancelación corre hasta el fin del período pagado | decisión del usuario + `estado_efectivo` |
| Excedente de nómina | Se cobra por cabeza, **facturado por fuera** de ONVO | `cargo_extra_estimado_centavos` |
| Tarjeta | **Nunca toca nuestros servidores** (SDK del navegador) | `apps/facturacion/` — alcance PCI |
| Exportar / eliminar al terminar | 30 días / 90 días, respaldos incluidos | decisión del usuario |
| Bitácoras | 12 meses | decisión del usuario |
| Soporte | Formulario de `/ayuda` + correo, L–V 8:00–17:00 CR | `SOPORTE_EMAIL`, `apps/common/soporte.py` |
| Preavisos | 30 días (precios, subencargados, versión de los documentos) | decisión del usuario |
| Incidentes | 72 horas desde la detección | decisión del usuario |
| Analítica | **No hay ninguna**, ni en el sitio ni en la app | verificado en el repo |
| Auditoría del `dpa` | Una al año, 30 días de preaviso, a costa del Cliente | propuesta, sujeta a revisión legal |

### La tabla de subprocesadores

Es la que sostiene la autorización de transferencia internacional del artículo 14, así que tiene
que ser exacta y estar al día. Hoy: **Hostinger** (VPS con Dokploy, EE. UU.) · **Supabase**
(Postgres) · **Clerk** (identidad) · **Resend** (correo) · **Cloudflare R2** (logo) ·
**ONVOPay** (cobro, Costa Rica) · **Allegra** (factura electrónica, Costa Rica).

⚠️ **Clerk faltaba en el borrador y es el más sensible de todos**: guarda el correo, la
contraseña y los factores de MFA de quienes administran la cuenta. Si mañana se apaga Clerk o se
cambia de proveedor de identidad, esa fila se toca el mismo día.

**El país de Supabase está CONFIRMADO: Estados Unidos** (2026-08-17, decisión del usuario). Era
lo último que quedaba sin verificar de esta tabla, y no era un detalle: la región se elige POR
PROYECTO, así que uno alojado en Frankfurt o São Paulo habría dejado la fila mintiendo sobre
adónde viajan la nómina y las respuestas, que es exactamente lo que el artículo 14 obliga a
declarar. Si algún día se migra el proyecto de región —o se abre un segundo proyecto para otro
entorno— esta fila se toca el mismo día, en los seis `.mdx`.

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

### Revocación

Tiene que haber una forma de revocar desde la cuenta —el artículo 5 lo exige— con la consecuencia
escrita al lado: revocar implica cerrar la cuenta, porque sin esos datos el servicio no se puede
prestar. Revocar **no borra las filas de aceptación**: son la prueba de lo que pasó, y borrarlas
deja sin evidencia el periodo en que el tratamiento sí estuvo consentido.

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
