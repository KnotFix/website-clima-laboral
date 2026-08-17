/**
 * Los documentos legales. FUENTE UNICA de su slug, titulo, version y fecha.
 *
 * **No es `DOCS_NAV` y no va adentro de el.** Comparten el patron —contenido en
 * .mdx, slug en ingles en los dos idiomas— y no comparten nada mas: las docs
 * son un recorrido de lectura con barra lateral y anterior/siguiente, y esto
 * son tres textos sueltos que se consultan por enlace desde el pie o desde el
 * registro del producto. Meterlos en el arbol de la documentacion los pondria
 * en el sidebar, en el paginador y en la ruta /docs, que es justo donde nadie
 * los busca.
 *
 * **La version y la fecha viven ACA y no en el `meta` de cada .mdx.** Son
 * independientes del idioma: el mismo documento en español y en ingles tiene
 * que ser la misma version, y con el dato duplicado en dos archivos se separan
 * en silencio. Ademas de aca las lee el registro de aceptacion del producto,
 * que guarda QUE version acepto cada persona — ver `docs/legal.md`.
 *
 * `draft: true` dibuja el aviso de borrador arriba del documento. Se apaga
 * cuando el texto volvio revisado por el abogado, y no antes: un documento
 * legal sin revisar publicado sin marca es peor que no tenerlo, porque parece
 * que rige.
 */
export const LEGAL_NAV = [
  {
    slug: "privacy",
    title: {
      es: "Política de privacidad",
      en: "Privacy policy",
    },
    version: "1.0",
    updated: "2026-08-17",
    draft: true,
  },
  {
    slug: "terms",
    title: {
      es: "Términos del servicio",
      en: "Terms of service",
    },
    version: "1.0",
    updated: "2026-08-17",
    draft: true,
  },
  {
    slug: "dpa",
    title: {
      es: "Anexo de tratamiento de datos",
      en: "Data processing addendum",
    },
    version: "1.0",
    updated: "2026-08-17",
    draft: true,
  },
];

/** La entrada de un slug, o `undefined` si no esta registrado. */
export function find_legal(slug) {
  return LEGAL_NAV.find((entry) => entry.slug === slug);
}
