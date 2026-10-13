import Link from "next/link";

import { GlassBar } from "@/components/effects/glass_bar";
import { BrandLink } from "@/components/site/brand_link";
import { LangSwitch } from "@/components/site/lang_switch";
import { Marca } from "@/components/site/marca";
import { MobileMenu } from "@/components/site/mobile_menu";
import { NavLinks } from "@/components/site/nav_links";
import { ThemeToggle } from "@/components/site/theme_toggle";
import { Button } from "@/components/ui/button";
import { chrome_dict_of } from "@/lib/dictionaries";
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
 * necesitar la primera sin la segunda. `pricing_active` es eso mismo para la
 * pagina de precios.
 */
export function Navbar({
  lang,
  dict,
  section_base = "",
  docs_active = false,
  pricing_active = false,
}) {
  const docs_href = `/${lang}/docs`;
  const pricing_href = `/${lang}/pricing`;
  // Los componentes de cliente reciben solo las llaves que leen: ver
  // `chrome_dict_of`.
  const chrome = chrome_dict_of(dict);

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
        {/* Sube al tope aunque ya estemos en la home: ver brand_link.jsx. */}
        <BrandLink
          lang={lang}
          class_name="flex items-center gap-2 rounded-md px-1 text-base font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Marca class_name="size-6" />
          {site_config.product}
        </BrandLink>

        <div className="hidden items-center gap-1 md:flex">
          {/* El `flex` lo pone el llamador: el `nav` de NavLinks trae
              `items-center gap-1` pero no el display, y sin el los enlaces
              vuelven a ser inline y el gap no aplica. */}
          <NavLinks dict={chrome} section_base={section_base} class_name="flex" />

          {/* **«Precios» es una RUTA del sitio desde el 2026-10-12**
              (`/[lang]/pricing`), y antes era un enlace al registro de la app.
              Se movio para que la lista de planes quede indexada. Va fuera de
              `nav_links` por lo mismo que las docs (no es un ancla) y se marca
              activo por ruta. Entre las anclas y las docs porque sigue siendo
              parte de "que es esto", antes de "como se usa". */}
          <Link
            href={pricing_href}
            aria-current={pricing_active ? "page" : undefined}
            data-track="nav_pricing"
            data-track-location="navbar"
            className={cn(
              "nav-key relative rounded-md px-3 py-2 text-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              pricing_active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {dict.nav_pricing}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-3 bottom-1 h-px origin-center bg-foreground transition-transform duration-200",
                pricing_active ? "scale-x-100" : "scale-x-0",
              )}
            />
          </Link>

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

          {/* **«Contacto» baja al bloque de contacto del pie**, que esta en
              todas las paginas: por eso es `#contact` pelado y no lleva
              `section_base`. Tampoco entra a `nav_links`: no es una seccion de
              la home y `useActiveSection` no tiene nada que marcar. */}
          <a
            href="#contact"
            data-track="nav_contact"
            data-track-location="navbar"
            className={cn(
              "nav-key relative rounded-md px-3 py-2 text-sm",
              "text-muted-foreground hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            {dict.nav_contact}
          </a>
        </div>

        <div className="flex items-center gap-2">
          {/* Debajo de sm el cambio de idioma vive en el menu movil, para no
              apretar la barra. Es la unica copia visible ahi: si se saca de
              los dos lados, el sitio bilingue se queda sin conmutador. */}
          <div className="hidden sm:block">
            <LangSwitch lang={lang} dict={chrome} />
          </div>
          <ThemeToggle dict={chrome} />
          {/* size lg da 36px de alto y px-5 lo ensancha: con la etiqueta
              corta, el boton necesita el aire lateral para no leerse apretado
              dentro de una barra de 64px. */}
          <Button
            asChild
            size="lg"
            className="cta-key-flat hidden px-5 md:inline-flex"
          >
            <a
              href={site_config.signup_url}
              data-track="nav_start"
              data-track-location="navbar"
            >
              {dict.nav_cta}
            </a>
          </Button>
          <div className="md:hidden">
            <MobileMenu lang={lang} dict={chrome} section_base={section_base} />
          </div>
        </div>
      </GlassBar>
    </>
  );
}
