import { GlassBar } from "@/components/effects/glass_bar";
import { BrandLink } from "@/components/site/brand_link";
import { LangSwitch } from "@/components/site/lang_switch";
import { Marca } from "@/components/site/marca";
import { MobileMenu } from "@/components/site/mobile_menu";
import { NavMenu } from "@/components/site/nav_menu";
import { ThemeToggle } from "@/components/site/theme_toggle";
import { Button } from "@/components/ui/button";
import { chrome_dict_of } from "@/lib/dictionaries";
import { nav_menu } from "@/lib/nav_menu";
import { site_config } from "@/lib/site_config";

/**
 * `section_base` es el prefijo de los enlaces de seccion. En la home va vacio
 * —son anclas de esta misma pagina, y asi `useActiveSection` puede marcarlas—;
 * fuera de la home vale `/es` o `/en`, y las anclas pasan a ser enlaces que
 * vuelven a la home a esa seccion. Sin eso, un "#how" apretado desde las docs
 * no hace absolutamente nada: el id no esta en esta pagina.
 *
 * **Desde el 2026-10-12 la barra es corta**: «Producto» (las tres anclas de la
 * home) es el unico desplegable; «Precios», «Documentacion» y «Recursos» (el
 * indice de recursos) son enlaces sueltos, y «Contacto» salio de la barra (sigue en el pie, y
 * el boton flotante de WhatsApp lo reemplaza). Que item esta activo lo decide
 * el `pathname` y la seccion en pantalla, adentro de `NavMenu`: las paginas ya
 * no le pasan `docs_active` ni `pricing_active`.
 */
export function Navbar({ lang, dict, section_base = "" }) {
  // Los componentes de cliente reciben solo las llaves que leen: ver
  // `chrome_dict_of`.
  const chrome = chrome_dict_of(dict);
  const menu = nav_menu({ lang, dict: chrome, section_base });

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
          class_name="flex shrink-0 items-center gap-2 rounded-md px-1 text-base font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Marca class_name="size-6" />
          {/* Debajo de 360px (un iPhone SE de primera generacion) el nombre no
              entra junto al CTA: queda el logo, y el nombre sigue siendo el
              texto del enlace para el lector de pantalla. */}
          <span className="max-[359px]:sr-only">{site_config.product}</span>
        </BrandLink>

        {/* **La navegacion aparece desde `lg` (1024px).** Con cuatro items la
            isla todavia entra a ese ancho (medido el 2026-10-12, en es y en
            en); debajo va el menu de hamburguesa.
            `hidden` es CSS: los enlaces, los de los desplegables incluidos,
            estan igual en el HTML para el buscador. */}
        <div className="hidden lg:block">
          <NavMenu
            menu={menu}
            label={chrome.a11y_main_nav}
            section_base={section_base}
          />
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Debajo de sm el idioma y el tema viven en el menu movil, para que
              en la barra entren la marca, «Empezar gratis» y la hamburguesa.
              Es la unica copia visible ahi: si se saca de los dos lados, el
              sitio bilingue se queda sin conmutador. */}
          <div className="hidden sm:block">
            <LangSwitch lang={lang} dict={chrome} />
          </div>
          <div className="hidden sm:block">
            <ThemeToggle dict={chrome} />
          </div>
          {/* Secundario a proposito: un enlace de texto, no un boton, para que
              no le compita a «Empezar gratis». `data-login` le avisa a la
              medicion que esto no es un registro: ver `site_config.login_url`. */}
          <a
            href={site_config.login_url}
            data-login=""
            data-track="nav_login"
            data-track-location="navbar"
            className="nav-key hidden whitespace-nowrap rounded-md px-2 py-2 text-sm xl:px-2.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:inline-flex"
          >
            {dict.nav_login}
          </a>
          {/* **Visible en todos los anchos**: es la accion del sitio, y en el
              celular no se esconde en el menu. Debajo de sm es mas angosto y
              con la letra un punto mas chica, para que entre junto a la marca y
              la hamburguesa en 360px; desde `xl`, el `px-5` de siempre (entre
              `lg` y `xl` no entra junto a los cuatro items). */}
          <Button
            asChild
            className="cta-key-flat h-9 px-2.5 text-[13px] sm:px-3 sm:text-sm xl:px-5"
          >
            <a
              href={site_config.signup_url}
              data-track="nav_start"
              data-track-location="navbar"
            >
              {dict.nav_cta}
            </a>
          </Button>
          <div className="lg:hidden">
            <MobileMenu lang={lang} dict={chrome} menu={menu} />
          </div>
        </div>
      </GlassBar>
    </>
  );
}
