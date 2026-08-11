"use client";

import { useState } from "react";
import { Menu } from "lucide-react";

import { LangSwitch } from "@/components/site/lang_switch";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { site_config } from "@/lib/site_config";

export function MobileMenu({ lang, dict }) {
  const [is_open, set_is_open] = useState(false);

  return (
    <Sheet open={is_open} onOpenChange={set_is_open}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={dict.a11y_open_menu}>
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle className="text-left">{site_config.brand}</SheetTitle>
        </SheetHeader>
        {/* Etiqueta propia: si este nav y el de escritorio comparten nombre
            accesible, un lector de pantalla lista dos landmarks identicos. */}
        <nav
          className="flex flex-col gap-1 px-4"
          aria-label={dict.a11y_mobile_nav}
        >
          {dict.nav_links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => set_is_open(false)}
              className="rounded-md px-2 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <Button asChild className="mt-4">
            <a href={site_config.signup_url}>{dict.nav_cta}</a>
          </Button>
        </nav>

        {/* Debajo de sm el conmutador de idioma no entra en la barra, asi que
            su unica copia visible es esta. De sm para arriba ya esta en la
            barra: mostrarlo aca tambien lo duplicaria. */}
        <div className="mt-6 flex items-center justify-between px-6 sm:hidden">
          <span className="text-sm text-muted-foreground">
            {dict.a11y_switch_lang}
          </span>
          <LangSwitch lang={lang} dict={dict} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
