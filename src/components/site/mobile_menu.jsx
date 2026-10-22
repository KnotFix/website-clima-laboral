"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { LangSwitch } from "@/components/site/lang_switch";
import { ThemeToggle } from "@/components/site/theme_toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { path_matches } from "@/lib/nav_menu";
import { site_config } from "@/lib/site_config";
import { cn } from "@/lib/utils";

const LINK_CLASS =
  "block rounded-md px-2 py-3 text-base font-medium transition-colors hover:bg-accent hover:text-foreground";

/**
 * Un enlace del menu. Las anclas de la home son `<a>` (desde otra pagina
 * recargan la home en la seccion); las rutas, `Link` de Next. Las anclas no se
 * marcan activas: con el panel abierto no hay seccion en pantalla que mirar.
 */
function MobileLink({ item, is_active, on_navigate }) {
  const Tag = item.section_id ? "a" : Link;
  return (
    <Tag
      href={item.href}
      aria-current={is_active ? "page" : undefined}
      data-track={item.track ? `mobile_nav_${item.track}` : undefined}
      data-track-location={item.track ? "mobile_menu" : undefined}
      onClick={on_navigate}
      className={cn(
        LINK_CLASS,
        is_active ? "bg-accent text-foreground" : "text-muted-foreground",
      )}
    >
      {item.label}
    </Tag>
  );
}

/**
 * El menu de hamburguesa, debajo de `lg`. `menu` es la misma lista que dibuja
 * la barra de escritorio (`lib/nav_menu.js`), armada en el servidor.
 */
export function MobileMenu({ lang, dict, menu }) {
  const [is_open, set_is_open] = useState(false);
  const pathname = usePathname();
  const close = () => set_is_open(false);

  // > **El menu NO es modal, y es por el toque que lo abre.** En modo modal,
  // Radix le pone `pointer-events: none` al `<body>` para bloquear la pagina.
  // Esa propiedad se hereda, asi que el navegador recalcula el estilo de los
  // ~960 elementos de la home dentro del mismo toque, antes de pintar el
  // primer cuadro del panel. Medido el 2026-10-02 en telefono emulado con CPU
  // x4: 280 ms entre el toque y el primer cuadro, contra ~120 ms sin modal. En
  // la mano se sentia como un menu que abre pegado.
  //
  // Lo que el modal hacia se cubre con el fondo de abajo: tapa la pagina, se
  // come el toque de afuera (sin el, el toque cerraria el menu Y apretaria lo
  // que hubiera debajo) y con `touch-action: none` no deja scrollearla por
  // detras. Escape y el toque afuera los sigue resolviendo Radix. Lo unico que
  // se pierde es la trampa del Tab, que en un menu de enlaces no hace falta.
  //
  // Va por portal porque el navbar se traslada con `transform`, y un `fixed`
  // adentro de un ancestro transformado se mide contra ese ancestro y no
  // contra la pantalla. Va en `z-50` como el navbar, y como entra despues en
  // el DOM le gana y lo oscurece igual que el fondo de Radix; el panel sube a
  // `z-[51]` para quedar encima de los dos.
  // Sin desenfoque, a proposito: un `backdrop-filter` a pantalla completa es
  // lo mas caro que se le puede pedir a un telefono mientras anima el panel.
  const backdrop =
    is_open &&
    createPortal(
      <div
        aria-hidden="true"
        className="fixed inset-0 z-50 touch-none bg-black/10 animate-in fade-in-0 duration-100"
      />,
      document.body,
    );

  return (
    <Sheet open={is_open} onOpenChange={set_is_open} modal={false}>
      {backdrop}
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={dict.a11y_open_menu}>
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="z-[51] w-72 overscroll-contain">
        <SheetHeader>
          <SheetTitle className="text-left">{site_config.product}</SheetTitle>
        </SheetHeader>
        {/* Etiqueta propia: si este nav y el de escritorio comparten nombre
            accesible, un lector de pantalla lista dos landmarks identicos.

            La misma lista que la barra (`lib/nav_menu.js`), pero ABIERTA: los
            desplegables se vuelven grupos con su titulo arriba. En un panel
            angosto un desplegable adentro de otro es un toque de mas para ver
            cinco enlaces. */}
        <nav
          className="flex flex-col gap-1 overflow-y-auto px-4"
          aria-label={dict.a11y_mobile_nav}
        >
          {menu.map((entry) =>
            entry.items ? (
              <div key={entry.id} className="flex flex-col pt-2">
                <p
                  id={`mobile_nav_${entry.id}`}
                  className="px-2 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground/80"
                >
                  {entry.label}
                </p>
                <ul aria-labelledby={`mobile_nav_${entry.id}`} className="flex flex-col">
                  {entry.items.map((item) => (
                    <li key={item.id}>
                      <MobileLink
                        item={item}
                        is_active={!item.section_id && path_matches(pathname, item.href)}
                        on_navigate={close}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <MobileLink
                key={entry.id}
                item={entry}
                is_active={path_matches(pathname, entry.href)}
                on_navigate={close}
              />
            ),
          )}

          {/* Para quien ya tiene cuenta. Debajo de la navegacion y arriba del
              CTA, como en la barra. `data-login`: ver `site_config.login_url`. */}
          <div className="mt-2 border-t border-border pt-2">
            <a
              href={site_config.login_url}
              data-login=""
              data-track="mobile_nav_login"
              data-track-location="mobile_menu"
              className={cn(LINK_CLASS, "text-muted-foreground")}
            >
              {dict.nav_login}
            </a>
          </div>
          <Button asChild className="mt-2">
            <a
              href={site_config.register_url(lang)}
              data-track="mobile_nav_start"
              data-track-location="mobile_menu"
            >
              {dict.nav_cta}
            </a>
          </Button>
        </nav>

        {/* Debajo de sm el idioma y el tema no entran en la barra, asi que su
            unica copia visible es esta. De sm para arriba ya estan en la
            barra: mostrarlos aca tambien los duplicaria. */}
        <div className="mt-6 flex items-center justify-between gap-4 px-6 pb-6 sm:hidden">
          <LangSwitch lang={lang} dict={dict} />
          <ThemeToggle dict={dict} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
