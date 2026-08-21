import Link from "next/link";

import { FooterBackdrop } from "@/components/effects/footer_backdrop";
import { LangSwitch } from "@/components/site/lang_switch";
import { Container } from "@/components/site/container";
import { LEGAL_NAV } from "@/content/legal/nav";
import { site_config } from "@/lib/site_config";

/**
 * Cuanto del pie queda metido debajo de la seccion anterior, en px. **Es
 * exactamente cuanto del footer no se ve hasta que se scrollea.**
 *
 * 120 deja asomando el canto redondeado del panel y la primera franja de su
 * fondo: alcanza para que se entienda que hay algo abajo, sin regalar de entrada
 * lo que se va a descubrir.
 *
 * > **Vive aca y no en cada pagina**, aunque quien lo consume sea `ScrollLift`
 * > desde cuatro lugares distintos. El numero dice cuanto del PIE se esconde,
 * > asi que es del pie: repartido, cuatro archivos tendrian que acordarse de
 * > cambiarlo juntos.
 */
export const FOOTER_LIFT = 120;

/**
 * Scroll que dura el destape, en px.
 *
 * > **Tiene un techo que es el alto del propio pie**, y no es de gusto. La tapa
 * > es lo ultimo antes del final del documento: desde que su borde de abajo
 * > llega al pie de la ventana hasta que la pagina se termina hay exactamente lo
 * > que el footer mide (~335px). Con un `span` mas largo el destape **no puede
 * > terminar** y se llega al final con el pie a medio descubrir.
 * >
 * > 220 cierra con ~115px de sobra. Ademas la tapa sube a `1 + lift/span` = 1.55
 * > veces la velocidad del scroll, que es la proporcion que el hero ya usa: lo
 * > justo para que se lea como una tapa que se corre y no como un bloque que
 * > sale despedido.
 */
export const FOOTER_SPAN = 220;

// `section_base` funciona igual que en el navbar: vacio en la home (anclas de
// esta pagina), "/es" o "/en" fuera de ella. Ver `navbar.jsx`.
export function Footer({ lang, dict, section_base = "" }) {
  const year = new Date().getFullYear();

  return (
    // > **El pie es un panel que sale desde ABAJO del CTA.** El no se mueve: la
    //   seccion de arriba es la que se levanta y lo descubre, y de eso se encarga
    //   `<ScrollLift>` en `page.js`. Aca solo queda el canto que lo hace leer
    //   como una pieza que estaba debajo.
    //
    // Se fue el `border-t`: una linea de 1px dice "aca termina una seccion y
    // empieza otra", y esto no es un final sino algo que aparece por detras.
    //
    // > **La sombra va ADENTRO y desde arriba**, no proyectada hacia afuera. Una
    //   sombra hacia arriba diria que el pie esta encima de lo anterior, que es
    //   justo al reves de lo que pasa. Un `inset` en el borde superior se lee
    //   como la sombra que el CTA le tira encima al taparlo — o sea, dice quien
    //   esta adelante.
    //
    // `overflow-hidden` no es prolijidad: **es lo que corta la palabra gigante**
    // contra el borde de abajo. Ver `FooterBackdrop`.
    //
    // `bg-background` se queda por lo mismo de siempre —el pie esta debajo del
    // video y sin fondo pelado los destellos siguen apareciendo—. El fondo nuevo
    // va ADENTRO, no en su lugar.
    <footer className="relative overflow-hidden rounded-t-[2rem] bg-background pt-14 pb-12 shadow-[inset_0_16px_28px_-22px_rgb(0_0_0/0.45)] dark:shadow-[inset_0_16px_30px_-20px_rgb(0_0_0/0.9)]">
      <FooterBackdrop />
      {/* El contenido se levanta por encima de las tres capas del fondo. */}
      <Container class_name="relative">
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
