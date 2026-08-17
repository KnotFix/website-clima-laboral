import { mdx_components } from "@/components/docs/mdx_components";

/**
 * Nombre y firma fijados por Next: `@next/mdx` no funciona con App Router sin
 * este archivo, y tiene que estar en la raiz del proyecto o —como aca— en
 * `src/`. Por eso lleva guion medio y no snake_case, igual que `page.js`.
 *
 * El mapa real vive en `components/docs/mdx_components.jsx`; esto es solo el
 * enganche que Next busca por convencion.
 */
export function useMDXComponents(components) {
  return { ...components, ...mdx_components };
}
