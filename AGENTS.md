<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Sitio web del SaaS de Clima Laboral — Knotfix

Sitio web público (marketing) del SaaS de evaluación de clima laboral de Knotfix. **No** es el producto: es la página que lo vende.

El producto mide clima laboral con un núcleo universal de preguntas + preguntas personalizadas pegadas a nodos de un árbol organizacional. Su diferenciador es el **análisis estadístico**: resultados desglosados por segmento, ponderación por pesos, y comparar/unir filtros entre resultados. El flujo completo está en `../Clima laboral/flujo_completo_saas_clima.md` — esa es la fuente del copy.

**Se vende por autoservicio con prueba gratis.** Consecuencia directa: el sitio tiene que hacer el producto autoexplicativo, porque no hay nadie del otro lado para aclararlo.

## Stack

- **Next.js 16 App Router — JavaScript / JSX. Sin TypeScript.**
- **Tailwind v4** + **shadcn/ui** (`radix-nova`, base neutral, `tsx: false`, iconos lucide).
- `motion` para animación, `next-themes` para el tema. **Nada más sin justificar.**

Cambios de Next 16 respecto a lo que puedas creer saber:
- `middleware.js` se llama ahora **`proxy.js`** (`export function proxy(request)`).
- **`params` es asíncrono:** `const { lang } = await params`.
- Ante cualquier duda de API, leé `node_modules/next/dist/docs/`.

## Nomenclatura

**snake_case en inglés.** Tres excepciones, obligadas por el framework:

| Caso | Convención | Por qué |
|---|---|---|
| Componentes React | `HeroVisual` | JSX trata las minúsculas como etiqueta HTML |
| Hooks propios | `useParallax` | el linter solo detecta `/^use[A-Z]/` |
| Archivos de Next.js | `page.js`, `layout.js`, `proxy.js` | reservados por el router |

```
archivos      hero_visual.jsx, goo_filter.jsx, how_it_works.jsx
variables     const layer_offset = 0
funciones     function build_filter_chips()
props         <HeroVisual scroll_speed={0.2} />
diccionario   hero_title, hero_subtitle, cta_primary
```

Tokens CSS en kebab-case (`--muted-foreground`): los genera shadcn.

**`docs/architecture.md` tiene el registro canónico de nombres. Se lee antes de escribir. Nadie inventa nombres fuera de él.**

## Diseño

- **Blanco y negro principalmente. El morado es acento, no relleno** — CTA primario, focus ring, poco más.
- Tokens heredados del sistema administrativo de Knotfix, para que sitio y producto se vean de la misma familia. Primario `#5b21b6` en claro, `#8b5cf6` en oscuro.
- **Tema claro y oscuro**, ambos cuidados. Usar tokens (`bg-background`, `text-muted-foreground`), nunca colores literales.
- **Ancho máximo 1200px**, y vive **solo** en `Container`. Ninguna sección define su propio `max-w`.
- Sin badge/eyebrow arriba del titular del hero. Sin carrusel de logos.

## Contenido

- **Español e inglés.** Ningún texto visible hardcodeado en un componente: todo vive en `src/content/es.js` y `src/content/en.js` con las mismas llaves, y entra por props.
- Rutas `/es` y `/en`; `/` redirige según el navegador.

## Animación

- Solo `transform` y `opacity`. Animar `width`/`height`/`top` fuerza layout en cada frame.
- **`prefers-reduced-motion` siempre**, implementado de verdad.
- Nunca un filtro SVG sobre texto: destruye el antialiasing y anula `backdrop-filter` en los hijos.
- En móvil se apagan los filtros y blurs pesados.

## Subagentes

Cuatro, en `.claude/agents/`. **Zonas de escritura sin solapamiento** — ningún archivo tiene dos dueños:

| Agente | Escribe en |
|---|---|
| `architect` | `docs/**` únicamente |
| `creative` | `src/components/motion/**`, `src/components/effects/**` |
| `programmer` | todo el resto de `src/` y los configs |
| `qa` | nada — solo reporta |

`src/components/ui/**` no lo toca nadie: es código del registro shadcn y se deja intacto para poder actualizarlo.

Flujo por bloque: `architect` define y nombra → `creative` y `programmer` construyen → `architect` verifica nombres → `qa` revisa performance/responsive/UX → se aplica lo que corresponda → recién ahí sigue el bloque siguiente.

## Convenciones

- Interfaz del sitio en español e inglés; **el código y los identificadores, en inglés.**
- Server Components por defecto; `"use client"` solo con estado, efectos o eventos.
- `npm run lint` limpio antes de cerrar una entrega.
- No se toca `../administrativo Knotfix`: es solo referencia de estilo.
