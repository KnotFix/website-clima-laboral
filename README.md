# Knotfix Clima — sitio web

Sitio público del SaaS de evaluación de clima laboral de Knotfix. **No es el
producto**: es la página que lo vende, la documentación que lo explica y los tres
documentos legales que lo rigen.

Se vende por autoservicio con prueba gratis, así que el sitio tiene que hacer el
producto autoexplicativo — no hay nadie del otro lado para aclararlo.

Es el **tercer despliegue** del sistema, junto al backend (Django) y al front del
producto (React + Vite), que viven en `../Proyecto/`.

## Qué sirve

| Ruta | Qué es |
|---|---|
| `/[lang]` | La home de marketing |
| `/[lang]/docs/[...slug]` | 21 páginas de documentación del producto, con barra lateral e índice |
| `/[lang]/legal/[slug]` | `privacy`, `terms` y `dpa` |
| `/[lang]/changelog` | Novedades del producto |

**Dos idiomas: `es` y `en`.** El producto sirve ocho; el mapeo de esos ocho a
estos dos vive del lado del producto (`Front-End/src/lib/sitio.ts`), no acá.

## Empezar

```bash
npm install
npm run dev          # http://localhost:3000
```

`/` redirige a `/es` o `/en` según el `Accept-Language` del navegador. Esa
decisión la toma `src/proxy.js` (en Next 16 el middleware se llama así).

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | servidor de desarrollo |
| `npm run build` | build de producción |
| `npm start` | sirve el build |
| `npm run lint` | ESLint — tiene que salir limpio antes de cerrar una entrega |
| `npm test` | Vitest, una vez |
| `npm run test:watch` | Vitest en modo watch |

## Qué cubren los tests

No hay tests de componente: todo lo que se prueba es lógica pura y lectura de
archivos. Vigilan lo que **falla en silencio**, que en este proyecto es casi
todo lo que puede fallar:

- `es.js` y `en.js` con las mismas llaves — una que falta renderiza `undefined`,
  no rompe nada.
- Cada slug de `DOCS_NAV` y `LEGAL_NAV` con su `.mdx` en los dos idiomas, y
  ningún `.mdx` huérfano — una página que no está en el manifiesto da 404 aunque
  el archivo exista.
- El parser de `Accept-Language` de `proxy.js`, con headers raros.
- Que los ids del índice lateral de las docs sean los mismos que pone
  `rehype-slug` en el HTML — si se separan, el índice se dibuja igual y deja de
  saltar a ningún lado.

`npm run build` sigue siendo parte de la verificación: compila el MDX y genera
todas las rutas estáticas, así que un `.mdx` roto se cae ahí y no en los tests.

## Lo que hay que leer antes de tocar nada

Este README es un mapa. El detalle vive en cuatro documentos, y cada uno es dueño
de lo suyo:

- **`AGENTS.md`** — el stack y la nomenclatura. Next 16 tiene cambios que
  contradicen lo que uno cree saber (el middleware se llama `proxy.js`, `params`
  es asíncrono).
- **`docs/architecture.md`** — el **registro canónico de nombres** y el mapa de
  archivos. Se lee antes de escribir; nadie inventa nombres fuera de él.
- **`docs/documentation.md`** — las reglas de la sección de docs. Se lee **antes
  de escribir la primera página**.
- **`docs/legal.md`** — los tres documentos legales: qué rige, qué se decidió y
  por qué.

## Tres reglas que no son de estilo

**1. Un `.mdx` que no está en su `nav.js` NO EXISTE.** No se rutea y no se
enlaza. Es el mecanismo con el que una página se escribe entera antes de
publicarse — y también la forma en que una página terminada se queda invisible
sin que nada falle. Hoy `test/content_parity.test.js` caza esos huérfanos, pero
si escribiste algo y no aparece, empezá por ahí.

**2. Las docs no publican el MÉTODO de cálculo.** Explican qué significa un
resultado y cómo usarlo, nunca cómo se calcula. La prueba antes de escribir un
párrafo: *¿esto le permite a alguien reproducir el número sin el producto?* Si
sí, no va. El detalle y la tabla de ejemplos están en `docs/documentation.md`.

**3. La versión de un documento legal vive en DOS repos.** `LEGAL_NAV` (acá) y
`DOCUMENTOS_LEGALES` (`../Proyecto/Back-End/apps/accesos/legales.py`) son dos
copias en dos despliegues, y **no hay build que las compare**. Subir una versión
acá y olvidarla allá hace que la gente acepte un número que el texto publicado no
lleva. Se tocan el mismo día. El orden completo —avisar por correo, esperar 30
días, recién ahí subir las dos— está en `docs/legal.md`.

⚠️ Lo mismo vale para los **slugs de las docs**: la FAQ de `/ayuda` del producto
enlaza siete páginas de acá por su slug. Renombrar una rompe esos enlaces **sin
que nada falle en este repo**.

## Estado

Las docs y los tres legales están escritos en los dos idiomas y **rigen**
(`draft: false`). Las versiones vigentes son `terms 1.1`, `privacy 1.1` y
`dpa 2.0`, subidas el 2026-08-20 junto con `DOCUMENTOS_LEGALES` del producto.
Lo que falta, con el detalle en `docs/documentation.md`:

- **Las capturas de la HOME siguen siendo fotos de Unsplash**
  (`public/shots/unsplash_*`): el sitio vende el producto sin mostrarlo. Es el
  hueco más caro que queda.
- **No hay página de precios.** Cuando exista, la lista tiene que salir de la
  tabla `planes` del producto: una tercera copia de los precios es la que se
  desactualiza sin que nadie se entere.
- Las **guías de clic** están diferidas a propósito —describen pantallas y cada
  rediseño las desactualiza—, no por falta de tiempo.

## Stack

Next.js 16 (App Router, **JavaScript sin TypeScript**), Tailwind v4, shadcn/ui,
`motion` para animación y `next-themes` para el tema. Nada más sin justificar.
