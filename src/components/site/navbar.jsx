import Link from "next/link";

import { GlassBar } from "@/components/effects/glass_bar";
import { LangSwitch } from "@/components/site/lang_switch";
import { MobileMenu } from "@/components/site/mobile_menu";
import { NavLinks } from "@/components/site/nav_links";
import { ThemeToggle } from "@/components/site/theme_toggle";
import { Button } from "@/components/ui/button";
import { site_config } from "@/lib/site_config";

export function Navbar({ lang, dict }) {
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

        <NavLinks dict={dict} class_name="hidden md:flex" />

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
            <MobileMenu lang={lang} dict={dict} />
          </div>
        </div>
      </GlassBar>
    </>
  );
}
