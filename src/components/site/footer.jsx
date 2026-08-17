import Link from "next/link";

import { LangSwitch } from "@/components/site/lang_switch";
import { Container } from "@/components/site/container";
import { LEGAL_NAV } from "@/content/legal/nav";
import { site_config } from "@/lib/site_config";

// `section_base` funciona igual que en el navbar: vacio en la home (anclas de
// esta pagina), "/es" o "/en" fuera de ella. Ver `navbar.jsx`.
export function Footer({ lang, dict, section_base = "" }) {
  const year = new Date().getFullYear();

  return (
    // `bg-background` por lo mismo que el envoltorio de las secciones: el pie
    // esta debajo del video, asi que tambien va en gris pelado. Sin esto seria
    // el unico lugar de abajo donde los destellos siguen apareciendo.
    <footer className="border-t border-border bg-background py-12">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="flex items-baseline gap-1.5 text-base font-semibold tracking-tight">
              {site_config.brand}
              <span className="font-normal text-muted-foreground">
                {site_config.product}
              </span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              {dict.footer_tagline}
            </p>
          </div>

          <nav
            className="flex flex-col gap-2 sm:items-end"
            aria-label={dict.a11y_main_nav}
          >
            {dict.nav_links.map((link) => (
              <a
                key={link.href}
                href={`${section_base}${link.href}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <Link
              href={`/${lang}/docs`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {dict.nav_docs}
            </Link>
          </nav>
        </div>

        <div className="mt-10 flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {year} {site_config.brand}. {dict.footer_rights}
          </p>
          <LangSwitch lang={lang} dict={dict} />
        </div>

        {/* Los legales van en su propia fila y ABAJO del ©, no mezclados con la
            navegacion de secciones de arriba: no son parte del recorrido de
            venta y ponerlos ahi le compite al unico camino que esa columna
            tiene que dejar claro. Abajo es donde se los busca.

            Los titulos salen de `LEGAL_NAV` y no del diccionario: son el mismo
            texto que encabeza cada documento, y duplicarlo en `es.js` deja dos
            fuentes que se separan en cuanto una cambie. */}
        <nav
          className="mt-4 flex flex-wrap gap-x-6 gap-y-2"
          aria-label={dict.a11y_legal_nav}
        >
          {LEGAL_NAV.map((entry) => (
            <Link
              key={entry.slug}
              href={`/${lang}/legal/${entry.slug}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {entry.title[lang]}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
