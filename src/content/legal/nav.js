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
 * `draft: true` dibuja el aviso de borrador arriba del documento. NO se apaga
 * "cuando vuelva del abogado" — esa revision no va a existir (decision del
 * usuario, 2026-08-18). Se apaga cuando no queda ningun [PENDIENTE:] en los
 * seis .mdx y ninguna clausula promete algo que el producto no haga; eso es lo
 * que el aviso protege. Ver `docs/legal.md`.
 *
 * **APAGADO EN LOS TRES EL 2026-08-18** (decision del usuario): los dos
 * criterios se cumplen y verificaron. Desde hoy los documentos RIGEN, que es
 * lo que el producto ya asumia — el alta exige aceptarlos y la pantalla de
 * re-aceptacion es un gate de sesion, o sea que se hacia aceptar tres textos
 * cuyo cartel decia "no rige" y "no invocar".
 *
 * ⚠️ Apagar el flag NO toca `version`, y no puede: la 1.0 es la que ya
 * declara `DOCUMENTOS_LEGALES` en el otro repo y la que se guarda en cada
 * fila de `aceptaciones_legales`. Esto no es una version nueva, asi que no
 * dispara el preaviso de 30 dias ni la re-aceptacion de nadie.
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
    draft: false,
  },
  {
    slug: "terms",
    title: {
      es: "Términos del servicio",
      en: "Terms of service",
    },
    version: "1.0",
    updated: "2026-08-20",
    draft: false,
  },
  {
    slug: "dpa",
    title: {
      es: "Anexo de tratamiento de datos",
      en: "Data processing addendum",
    },
    version: "1.0",
    updated: "2026-08-17",
    draft: false,
  },
];

/** La entrada de un slug, o `undefined` si no esta registrado. */
export function find_legal(slug) {
  return LEGAL_NAV.find((entry) => entry.slug === slug);
}
