import Link from "next/link";

import { Shot } from "@/components/docs/doc_shot";

/**
 * El mapa de etiquetas HTML a los tokens del sitio. Lo consume
 * `src/mdx-components.js`, que es el archivo que Next exige por convencion.
 *
 * **Se estila elemento por elemento y NO con `@tailwindcss/typography`.** El
 * plugin `prose` trae su propia escala tipografica, sus propios grises y su
 * propio ritmo vertical, o sea un segundo sistema de diseño discutiendo con el
 * de la pagina — y despues se pasa el rato apagandolo con `prose-headings:…`.
 * Son quince reglas; el plugin es una dependencia mas y una fuente de verdad
 * mas.
 *
 * Las lineas que se dibujan sobre el fondo de pagina van en `border-box-edge` y
 * NUNCA en `border-border`: `--border` es el contorno de una tarjeta, demasiado
 * flojo para una linea que tiene que leerse como estructura de la prosa. Es el
 * mismo motivo por el que `.org-canvas` saca de ahi su canto.
 */
export const mdx_components = {
  // Componentes propios que un .mdx puede usar SIN importarlos. Van acá y no
  // como import en cada archivo para que escribir una pagina sea escribir
  // prosa: quien redacta no tiene que saber de donde sale <Shot>.
  Shot,

  // El h1 lo dibuja la RUTA, no el .mdx: sale de `nav.js`, que es tambien lo
  // que el sidebar tiene que poder leer sin abrir el archivo. Si igual aparece
  // uno escrito a mano, se pinta como h2 para no tener dos titulos de pagina.
  h1: ({ children, ...props }) => (
    <h2
      {...props}
      className="mt-12 scroll-mt-28 text-2xl font-semibold tracking-tight"
    >
      {children}
    </h2>
  ),

  // `scroll-mt-28` deja el encabezado abajo de la isla del navbar al saltar por
  // ancla. Sin esto, el titulo al que se salta queda tapado por la barra.
  h2: ({ children, ...props }) => (
    <h2
      {...props}
      className="mt-12 scroll-mt-28 border-t border-box-edge pt-8 text-2xl font-semibold tracking-tight first:mt-0 first:border-0 first:pt-0"
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...props }) => (
    <h3
      {...props}
      className="mt-8 scroll-mt-28 text-lg font-semibold tracking-tight"
    >
      {children}
    </h3>
  ),

  p: ({ children, ...props }) => (
    <p {...props} className="mt-4 leading-7 text-muted-foreground">
      {children}
    </p>
  ),

  // Los enlaces internos van por `next/link` para no recargar la pagina; los
  // externos se quedan en <a> y avisan que salen. La distincion es el prefijo:
  // todo lo que arranca con "/" es de casa.
  a: ({ href = "", children, ...props }) => {
    const is_internal = href.startsWith("/") || href.startsWith("#");
    const class_name =
      "font-medium text-foreground underline decoration-box-edge underline-offset-4 transition-colors hover:decoration-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

    if (is_internal) {
      return (
        <Link href={href} className={class_name} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={class_name}
        {...props}
      >
        {children}
      </a>
    );
  },

  strong: ({ children, ...props }) => (
    <strong {...props} className="font-semibold text-foreground">
      {children}
    </strong>
  ),

  ul: ({ children, ...props }) => (
    <ul {...props} className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
      {children}
    </ul>
  ),

  ol: ({ children, ...props }) => (
    <ol
      {...props}
      className="mt-4 list-decimal space-y-2 pl-6 text-muted-foreground"
    >
      {children}
    </ol>
  ),

  li: ({ children, ...props }) => (
    <li {...props} className="leading-7">
      {children}
    </li>
  ),

  // La cita es el recurso para "esto es una regla del producto, no un consejo".
  // El canto de acento es de los pocos usos de `--brand`: acento, no relleno.
  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      className="mt-6 border-l-2 border-brand bg-panel py-1 pl-5 pr-4 [&>p]:text-foreground"
    >
      {children}
    </blockquote>
  ),

  // `code` suelto (entre backticks). El de adentro de un <pre> hereda del pre y
  // por eso se le apaga el fondo: dos fondos anidados se leen como un error.
  code: ({ children, ...props }) => (
    <code
      {...props}
      className="rounded-sm bg-panel px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
    >
      {children}
    </code>
  ),

  pre: ({ children, ...props }) => (
    <pre
      {...props}
      className="mt-6 overflow-x-auto rounded-lg border border-box-edge bg-card p-4 font-mono text-sm [&_code]:bg-transparent [&_code]:p-0"
    >
      {children}
    </pre>
  ),

  // La tabla se envuelve en su propio scroll horizontal: una tabla ancha que
  // desborda empuja el ancho del <body> y hace scrollear la PAGINA de lado.
  table: ({ children, ...props }) => (
    <div className="mt-6 overflow-x-auto">
      <table {...props} className="w-full border-collapse text-sm">
        {children}
      </table>
    </div>
  ),

  th: ({ children, ...props }) => (
    <th
      {...props}
      className="border-b border-box-edge py-2 pr-4 text-left font-semibold"
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }) => (
    <td
      {...props}
      className="border-b border-box-edge py-2 pr-4 align-top text-muted-foreground"
    >
      {children}
    </td>
  ),

  hr: (props) => <hr {...props} className="my-12 border-box-edge" />,
};
