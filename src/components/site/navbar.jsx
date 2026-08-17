import Link from "next/link";

import { GlassBar } from "@/components/effects/glass_bar";
import { LangSwitch } from "@/components/site/lang_switch";
import { MobileMenu } from "@/components/site/mobile_menu";
import { NavLinks } from "@/components/site/nav_links";
import { ThemeToggle } from "@/components/site/theme_toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site_config } from "@/lib/site_config";

/**
 * `section_base` es el prefijo de los enlaces de seccion. En la home va vacio
 * —son anclas de esta misma pagina, y asi `useActiveSection` puede marcarlas—;
 * fuera de la home vale `/es` o `/en`, y las anclas pasan a ser enlaces que
 * vuelven a la home a esa seccion. Sin eso, un "#how" apretado desde las docs
 * no hace absolutamente nada: el id no esta en esta pagina.
 *
 * `docs_active` marca el enlace de Documentacion. Va como prop y no derivado de
 * `section_base` porque son dos cosas distintas —donde apuntan las anclas, y
 * en que pagina estamos—, y la que viene despues (un blog, precios) va a
 * necesitar la primera sin la segunda.
 */
export function Navbar({ lang, dict, section_base = "", docs_active = false }) {
  const docs_href = `/${lang}/docs`;

  return (
    <>
      {/* Primer elemento enfocable de la pagina. Solo aparece al recibir foco
          por teclado; z-60 para quedar sobre la isla, que es z-50. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {dict.a11y_skip_to_content}
      </a>

      <GlassBar>
        <Link
          href={`/${lang}`}
          className="flex items-baseline gap-1.5 rounded-md px-1 text-base font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {site_config.brand}
          <span className="text-muted-foreground font-normal">
            {site_config.product}
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {/* El `flex` lo pone el llamador: el `nav` de NavLinks trae
              `items-center gap-1` pero no el display, y sin el los enlaces
              vuelven a ser inline y el gap no aplica. */}
          <NavLinks dict={dict} section_base={section_base} class_name="flex" />

          {/* **El enlace a las docs NO entra a `nav_links`, y no es una
              cuestion de orden.** Todos los items de esa lista son anclas, y
              `NavLinks` les saca el id con `section_id_of`, que corta el "#".
              Un "/es/docs" le devolveria string vacio: nunca se marcaria como
              activo, y ademas entraria un id vacio a `useActiveSection`. Es el
              primer item de navegacion del sitio que sale de la home, asi que
              se dibuja aparte y se marca por ruta, no por scroll. */}
          <Link
            href={docs_href}
            aria-current={docs_active ? "page" : undefined}
            className={cn(
              "nav-key relative rounded-md px-3 py-2 text-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              docs_active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {dict.nav_docs}
            {/* El mismo subrayado que las anclas: el color solo no alcanza,
                porque al pasar el mouse un link inactivo toma el mismo
                `text-foreground` que el activo. */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-3 bottom-1 h-px origin-center bg-foreground transition-transform duration-200",
                docs_active ? "scale-x-100" : "scale-x-0",
              )}
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Debajo de sm el cambio de idioma vive en el menu movil, para no
              apretar la barra. Es la unica copia visible ahi: si se saca de
              los dos lados, el sitio bilingue se queda sin conmutador. */}
          <div className="hidden sm:block">
            <LangSwitch lang={lang} dict={dict} />
          </div>
          <ThemeToggle dict={dict} />
          {/* size lg da 36px de alto y px-5 lo ensancha: con la etiqueta
              corta, el boton necesita el aire lateral para no leerse apretado
              dentro de una barra de 64px. */}
          <Button
            asChild
            size="lg"
            className="cta-key-flat hidden px-5 md:inline-flex"
          >
            <a href={site_config.signup_url}>{dict.nav_cta}</a>
          </Button>
          <div className="md:hidden">
            <MobileMenu lang={lang} dict={dict} section_base={section_base} />
          </div>
        </div>
      </GlassBar>
    </>
  );
}
