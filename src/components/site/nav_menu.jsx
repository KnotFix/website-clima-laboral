"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { useActiveSection } from "@/components/site/use_active_section";
import { path_matches } from "@/lib/nav_menu";
import { cn } from "@/lib/utils";

/** Cuanto espera un desplegable abierto por hover antes de cerrarse (ms). */
const HOVER_CLOSE_DELAY = 140;

// El mismo enlace de la barra que habia antes de los desplegables: `nav-key`
// trae el realce del hover. Entre `lg` y `xl` el relleno es un punto menor: con
// cuatro items, a 1024px el CTA quedaba a 11px del borde de la isla en vez de
// los 28 de siempre (medido el 2026-10-12).
const BAR_ITEM =
  "nav-key relative inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-2 text-sm xl:px-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * El color solo no alcanza: al pasar el mouse un enlace inactivo toma el mismo
 * `text-foreground` que el activo. El subrayado es lo que los distingue. Se
 * anima con scaleX (no con width) y el bloque de movimiento reducido de
 * globals.css ya lo desactiva.
 */
function ActiveUnderline({ is_active }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute inset-x-2 bottom-1 h-px origin-center bg-foreground transition-transform duration-200 xl:inset-x-2.5",
        is_active ? "scale-x-100" : "scale-x-0",
      )}
    />
  );
}

/**
 * La navegacion de la barra de escritorio: enlaces sueltos y desplegables, en
 * el orden de `nav_menu` (`lib/nav_menu.js`). Hoy el unico desplegable es
 * «Producto», pero cualquier entrada con `items` se dibuja asi.
 *
 * ## Los enlaces de los desplegables estan en el HTML desde el primer render
 *
 * Es el requisito que descarta el `DropdownMenu` de shadcn (y el
 * `NavigationMenu` de Radix): los dos DESMONTAN el contenido cerrado, asi que
 * los enlaces solo existirian despues de un clic, y el buscador no los ve.
 * Aca el panel se dibuja siempre y se esconde con `visibility: hidden`, que
 * ademas lo saca del orden de tabulacion y del arbol de accesibilidad mientras
 * esta cerrado.
 *
 * ## Es un disclosure, no un `role="menu"`
 *
 * El patron de WAI-ARIA para navegacion de un sitio es un boton con
 * `aria-expanded` que muestra una lista de enlaces comunes. `role="menu"`
 * promete flechas y foco itinerante de menu de aplicacion, y cambia como lo
 * anuncia el lector de pantalla. Con Tab se recorre todo.
 *
 * ## Hover y clic
 *
 * Con mouse abre al entrar y cierra al salir (con un respiro, para que cruzar
 * el hueco hasta el panel no lo cierre). El clic sobre un desplegable que el
 * hover ya abrio lo deja abierto: quien hace clic quiere verlo, y cerrarlo en
 * ese momento se lee como un menu que no responde. El tacto y el teclado
 * (Enter/Espacio sobre el boton) abren y cierran con el clic. Escape cierra y
 * devuelve el foco al boton; el clic afuera y el Tab hacia afuera cierran.
 *
 * Es cliente por el estado y por la seccion activa; el resto del navbar sigue
 * siendo Server Component.
 */
export function NavMenu({ menu, label, section_base = "" }) {
  const pathname = usePathname();
  // `{ id, by }`: que desplegable esta abierto y si lo abrio el hover o un
  // clic. Uno solo a la vez.
  const [open, set_open] = useState(null);
  const close_timer = useRef(null);
  const nav_ref = useRef(null);

  // Fuera de la home no hay ninguna seccion en el documento: lista VACIA en
  // vez de saltear el hook (los hooks no se llaman bajo condicion).
  const section_ids = section_base
    ? []
    : menu.flatMap((entry) => entry.items ?? []).flatMap((item) =>
        item.section_id ? [item.section_id] : [],
      );
  const active_section = useActiveSection(section_ids);

  const is_item_active = (item) =>
    item.section_id
      ? item.section_id === active_section
      : path_matches(pathname, item.href);

  const cancel_close = () => window.clearTimeout(close_timer.current);
  const close = () => {
    cancel_close();
    set_open(null);
  };

  // Escape y el clic afuera, solo mientras hay algo abierto. Escape se escucha
  // en el documento y no en el desplegable porque el hover lo abre sin darle
  // el foco.
  useEffect(() => {
    if (!open) return;

    const on_key_down = (event) => {
      if (event.key !== "Escape") return;
      const root = nav_ref.current?.querySelector(`[data-menu="${open.id}"]`);
      // El foco vuelve al boton solo si estaba adentro: si el menu lo abrio el
      // hover, robarselo a otra parte de la pagina seria peor.
      if (root?.contains(document.activeElement)) {
        root.querySelector("button")?.focus();
      }
      set_open(null);
    };
    const on_pointer_down = (event) => {
      if (!nav_ref.current?.contains(event.target)) set_open(null);
    };

    document.addEventListener("keydown", on_key_down);
    document.addEventListener("pointerdown", on_pointer_down);
    return () => {
      document.removeEventListener("keydown", on_key_down);
      document.removeEventListener("pointerdown", on_pointer_down);
    };
  }, [open]);

  // El cierre pendiente del hover no sobrevive al componente.
  useEffect(() => () => window.clearTimeout(close_timer.current), []);

  return (
    <nav ref={nav_ref} aria-label={label}>
      <ul className="flex items-center gap-1">
        {menu.map((entry) => {
          if (!entry.items) {
            const is_active = path_matches(pathname, entry.href);
            return (
              <li key={entry.id}>
                <Link
                  href={entry.href}
                  aria-current={is_active ? "page" : undefined}
                  data-track={`nav_${entry.track}`}
                  data-track-location="navbar"
                  className={cn(
                    BAR_ITEM,
                    is_active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {entry.label}
                  <ActiveUnderline is_active={is_active} />
                </Link>
              </li>
            );
          }

          const is_open = open?.id === entry.id;
          const is_active = entry.items.some(is_item_active);

          return (
            <NavDropdown
              key={entry.id}
              entry={entry}
              is_open={is_open}
              is_active={is_active}
              is_item_active={is_item_active}
              on_hover_enter={() => {
                cancel_close();
                // Si ya estaba abierto por clic, se queda «por clic».
                if (!is_open) set_open({ id: entry.id, by: "hover" });
              }}
              on_hover_leave={() => {
                cancel_close();
                close_timer.current = window.setTimeout(
                  () =>
                    set_open((current) =>
                      current?.id === entry.id ? null : current,
                    ),
                  HOVER_CLOSE_DELAY,
                );
              }}
              on_toggle={() => {
                cancel_close();
                if (!is_open) set_open({ id: entry.id, by: "click" });
                else if (open.by === "hover") set_open({ id: entry.id, by: "click" });
                else set_open(null);
              }}
              on_close={close}
            />
          );
        })}
      </ul>
    </nav>
  );
}

function NavDropdown({
  entry,
  is_open,
  is_active,
  is_item_active,
  on_hover_enter,
  on_hover_leave,
  on_toggle,
  on_close,
}) {
  const panel_id = useId();

  return (
    <li
      data-menu={entry.id}
      className="relative"
      // Solo el mouse: un toque dispara `pointerenter` y despues el clic, y el
      // clic cerraria lo que el `pointerenter` acaba de abrir.
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") on_hover_enter();
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") on_hover_leave();
      }}
      // Tab hacia afuera cierra. `relatedTarget` nulo es un clic en la nada,
      // y de ese se ocupa el `pointerdown` del documento.
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (next && !event.currentTarget.contains(next)) on_close();
      }}
    >
      <button
        type="button"
        aria-expanded={is_open}
        aria-controls={panel_id}
        onClick={on_toggle}
        className={cn(
          BAR_ITEM,
          is_active || is_open
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {entry.label}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-3.5 transition-transform duration-200",
            is_open && "rotate-180",
          )}
        />
        <ActiveUnderline is_active={is_active} />
      </button>

      {/* El `pt-5` es el puente: el panel queda debajo de la isla y no pegado
          al boton, y sin ese relleno el mouse saldria del `li` al cruzar el
          hueco. `visibility` entra en la transicion para que al cerrar espere
          a que termine el fundido (es discreta: cambia al final). */}
      <div
        id={panel_id}
        className={cn(
          "absolute left-1/2 top-full z-10 -translate-x-1/2 pt-5 transition-[opacity,translate,visibility] duration-150 ease-out",
          is_open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0",
        )}
      >
        {/* Casi opaco y no el vidrio de la isla: la isla pasa sobre aire, y
            el panel cae encima de titulares que, vistos a traves, competian
            con los enlaces. */}
        <ul className="flex min-w-60 flex-col gap-0.5 rounded-2xl border border-border bg-popover/95 p-1.5 text-popover-foreground shadow-lg backdrop-blur-md">
          {entry.items.map((item) => {
            const item_active = is_item_active(item);
            // Las anclas de la home son `<a>`: desde otra pagina recargan la
            // home en la seccion, que es lo que ya hacian antes.
            const Tag = item.section_id ? "a" : Link;

            return (
              <li key={item.id}>
                <Tag
                  href={item.href}
                  aria-current={
                    item_active ? (item.section_id ? "true" : "page") : undefined
                  }
                  data-track={item.track ? `nav_${item.track}` : undefined}
                  data-track-location={item.track ? "navbar" : undefined}
                  onClick={on_close}
                  className={cn(
                    "block whitespace-nowrap rounded-xl px-3 py-2 text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    item_active
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {item.label}
                </Tag>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
