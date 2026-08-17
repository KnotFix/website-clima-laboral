import { DocsSidebar } from "@/components/docs/docs_sidebar";
import { DocsToc } from "@/components/docs/docs_toc";
import { Container } from "@/components/site/container";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";

/**
 * El marco de las docs: navbar, sidebar, contenido, indice y pie.
 *
 * **No es un `layout.js`, y no es un descuido.** Un layout de App Router recibe
 * los params de SU segmento: `app/[lang]/docs/layout.js` conoce `lang` y NUNCA
 * el `slug` de la catch-all de abajo. Sin el slug no se puede marcar la pagina
 * activa en la barra lateral, que es la mitad de para que sirve una barra
 * lateral. Como componente lo llaman las dos rutas y le pasan lo que saben.
 * Ademas es el mismo patron que ya usa la home: `page.js` monta `Navbar` y
 * `Footer`; el layout raiz solo pone <html>, el tema y la luz.
 */
export function DocsLayout({
  lang,
  dict,
  active_slug = null,
  headings = [],
  children,
}) {
  return (
    <>
      {/* `section_base` reescribe los enlaces de seccion del navbar y del pie.
          En la home son anclas crudas ("#how") y aca no sirven: apuntarian a un
          id que esta en OTRA pagina, asi que el link no haria nada. Con la base
          pasan a ser "/es#how" y se van a la home, a la seccion. */}
      <Navbar
        lang={lang}
        dict={dict}
        section_base={`/${lang}`}
        docs_active
      />

      {/* `bg-background` opaco por lo mismo que el pie de la home: `PageLight`
          es una capa FIJA detras de toda la pagina y aca no se la quiere. Los
          destellos diagonales son la firma de la primera pantalla; detras de
          cuarenta parrafos de prosa son ruido que le pelea al texto. */}
      <main id="main" className="flex-1 bg-background">
        {/* **El padding de arriba tiene que despejar la isla del navbar, que es
            FIJA.** La cuenta: `pt-2` (8px) + `h-16` (64px), y al scrollear baja
            `DETACH_OFFSET` (10px) mientras se achica a 0.92 desde `origin-top`,
            asi que su borde de abajo cae en ~77px. Con `py-10`/`lg:py-16` —40 y
            64px— el titulo de la pagina quedaba POR DEBAJO de la isla: no era
            que estuviera "pegado", es que estaba tapado.
            28 y 36 dejan 35px y 67px de aire libre bajo la isla. El 28 es
            ademas el mismo numero que el `scroll-mt-28` de los encabezados y
            que el `top-28` de las dos columnas pegadas: los tres responden a la
            misma pregunta —cuanto mide el navbar— y desincronizarlos deja el
            salto por ancla cayendo en otro lado que el titulo. */}
        <Container class_name="pt-28 pb-16 lg:pt-36 lg:pb-24">
          {/* Debajo de lg la barra lateral va PLEGADA, en un <details>: es el
              indice del sitio entero y desplegado empuja el contenido una
              pantalla hacia abajo en cada visita. `<details>` y no un Sheet
              para no volver cliente el arbol de navegacion por un desplegable
              que el navegador ya sabe hacer. */}
          <details className="mb-8 rounded-lg border border-box-edge bg-card p-4 lg:hidden">
            <summary className="cursor-pointer text-sm font-medium">
              {dict.docs_all_pages}
            </summary>
            <div className="mt-4">
              <DocsSidebar
                lang={lang}
                active_slug={active_slug}
                label={dict.a11y_docs_nav_mobile}
              />
            </div>
          </details>

          <div className="lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[13rem_minmax(0,1fr)_12rem]">
            {/* `top-28` deja la isla del navbar libre; `self-start` es lo que
                hace que `sticky` funcione dentro de un grid — sin el, la celda
                se estira a lo alto de la fila y no hay nada que pegar. */}
            <div className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
              <DocsSidebar
                lang={lang}
                active_slug={active_slug}
                label={dict.a11y_docs_nav}
              />
            </div>

            <div className="min-w-0">{children}</div>

            {/* El indice aparece recien en xl. Entre lg y xl la pagina ya tiene
                sidebar y columna de texto: meter una tercera columna ahi deja
                la prosa en ~45 caracteres por linea, que es peor que no tener
                indice. */}
            <div className="hidden xl:sticky xl:top-28 xl:block xl:self-start">
              <DocsToc
                headings={headings}
                title={dict.docs_on_this_page}
                label={dict.a11y_docs_toc}
              />
            </div>
          </div>
        </Container>
      </main>

      <Footer lang={lang} dict={dict} section_base={`/${lang}`} />
    </>
  );
}
