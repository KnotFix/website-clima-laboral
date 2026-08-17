import { notFound } from "next/navigation";

import { Container } from "@/components/site/container";
import { Footer } from "@/components/site/footer";
import { Navbar } from "@/components/site/navbar";
import { changelog_entries } from "@/lib/changelog";
import { get_dictionary } from "@/lib/dictionaries";
import { LOCALES, is_locale } from "@/lib/site_config";

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!is_locale(lang)) return {};

  const dict = await get_dictionary(lang);

  return {
    title: dict.changelog_title,
    description: dict.changelog_body,
    alternates: {
      canonical: `/${lang}/changelog`,
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, `/${locale}/changelog`]),
      ),
    },
  };
}

/**
 * Las novedades del producto: TODAS en una pagina, no una pagina por entrada.
 *
 * Es lo que la gente busca de verdad cuando dice «versiones»: que cambio y si
 * les rompe algo. Se lee de arriba abajo y se abandona cuando se llega a lo que
 * uno ya sabia, asi que partirla en paginas obligaria a navegar para saber si
 * hace falta seguir leyendo.
 *
 * **Esto NO es versionado de la documentacion, y son cosas distintas.** Las docs
 * no se versionan porque no existe el usuario para el que la doc vieja sea
 * correcta: hay un solo despliegue y cuando el producto cambia, cambia para
 * todos esa misma tarde. El changelog es lo contrario — es historia a
 * proposito, y su valor es justamente que las entradas viejas NO se corrigen.
 * Ver `docs/documentation.md`.
 *
 * Sin barra lateral ni indice, como los legales: se entra por un enlace y se
 * recorre.
 */
export default async function ChangelogPage({ params }) {
  const { lang } = await params;
  if (!is_locale(lang)) notFound();

  const dict = await get_dictionary(lang);
  const entries = await changelog_entries(lang);

  return (
    <>
      <Navbar lang={lang} dict={dict} section_base={`/${lang}`} />

      {/* `bg-background` opaco por lo mismo que docs y legales: `PageLight` es
          una capa fija detras de toda la pagina y sus destellos diagonales le
          pelean al texto largo. */}
      <main id="main" className="flex-1 bg-background">
        {/* `pt-28` despeja la isla del navbar, que es fija. */}
        <Container class_name="pt-28 pb-16 lg:pt-36 lg:pb-24">
          <div className="max-w-3xl">
            <header>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {dict.changelog_title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {dict.changelog_body}
              </p>
            </header>

            <div className="mt-14 space-y-14">
              {entries.map(({ slug, Entry, meta }) => (
                <article key={slug}>
                  {/* La FECHA va arriba y en chico, el titulo abajo y grande:
                      quien recorre esta pagina busca «que cambio», no «que dia
                      fue». La etiqueta `<time>` la deja legible para un lector
                      de pantalla y para un buscador. */}
                  <time
                    dateTime={meta.date ?? slug}
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    {meta.date ?? slug}
                  </time>

                  <h2 className="mt-2 text-xl font-semibold tracking-tight">
                    {meta.title}
                  </h2>

                  {/* Sin clase de prosa: el estilo de cada etiqueta lo pone el
                      mapa de `mdx_components`, igual que en docs y legales. */}
                  <div className="mt-4">
                    <Entry />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </main>

      <Footer lang={lang} dict={dict} section_base={`/${lang}`} />
    </>
  );
}
