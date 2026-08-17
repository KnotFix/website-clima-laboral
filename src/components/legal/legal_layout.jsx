import { Container } from "@/components/site/container";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";

/**
 * El marco de un documento legal: navbar, cabecera con version, texto y pie.
 *
 * Componente y no `layout.js`, por lo mismo que `DocsLayout`: un layout de App
 * Router no ve el `slug` del segmento de abajo, y aca hace falta para la
 * cabecera. Ver `architecture.md`.
 *
 * Sin barra lateral y sin indice, a diferencia de las docs. Un documento legal
 * no es un recorrido: se entra por un enlace directo del pie o del registro,
 * se lee o se busca, y se sale.
 */
export function LegalLayout({ lang, dict, title, entry, children }) {
  return (
    <>
      <Navbar lang={lang} dict={dict} section_base={`/${lang}`} />

      {/* `bg-background` opaco por lo mismo que las docs: `PageLight` es una
          capa fija detras de toda la pagina y los destellos diagonales detras
          de cuarenta clausulas le pelean al texto. */}
      <main id="main" className="flex-1 bg-background">
        {/* `pt-28` despeja la isla del navbar, que es fija. Misma cuenta que en
            `DocsLayout` — los dos responden a cuanto mide la barra. */}
        <Container class_name="pt-28 pb-16 lg:pt-36 lg:pb-24">
          {/* **`max-w-3xl` es la MEDIDA DE LECTURA, no el ancho de la pagina.**
              El tope de 1200 sigue viviendo solo en `Container`. Sin sidebar ni
              indice que ocupen las otras columnas, un parrafo suelto se
              estiraria a los 1200 enteros: ~160 caracteres por linea, donde el
              ojo pierde el renglon al volver. Las docs no lo necesitan porque
              la grilla ya les acota la columna del texto. */}
          <div className="max-w-3xl">
            <header>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </h1>

              <p className="mt-4 text-sm text-muted-foreground">
                {dict.legal_version} {entry.version} · {dict.legal_updated}{" "}
                <time dateTime={entry.updated}>{entry.updated}</time>
              </p>

              {/* El aviso de borrador se dibuja desde `LEGAL_NAV`, no se escribe
                  a mano en cada .mdx: escrito a mano hay que acordarse de
                  sacarlo de seis archivos, y el que se olvida queda avisando
                  para siempre. Ver el comentario de `draft` en `nav.js`. */}
              {entry.draft ? (
                <div
                  role="note"
                  className="mt-8 rounded-lg border border-box-edge bg-card p-4"
                >
                  <p className="text-sm font-medium">
                    {dict.legal_draft_title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {dict.legal_draft_body}
                  </p>
                </div>
              ) : null}
            </header>

            <div className="mt-10">{children}</div>
          </div>
        </Container>
      </main>

      <Footer lang={lang} dict={dict} section_base={`/${lang}`} />
    </>
  );
}
