"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * El nombre del producto como enlace al INICIO de la home.
 *
 * Desde las docs, los legales o el changelog es un `Link` normal a `/[lang]`:
 * cambia la ruta y Next lleva al tope solo. El caso que este componente existe
 * para cubrir es **estando ya en la home**: Next trata la navegacion a la misma
 * ruta como un no-op de scroll —la cache del segmento no cambia, asi que no hay
 * nada nuevo que enfocar— y el clic no movia la pagina. Aca, si ya estamos en
 * la home, se cancela la navegacion y se sube al tope a mano.
 *
 * `scrollTo` va SIN `behavior` a proposito: hereda el `scroll-behavior` de
 * `html` en `globals.css`, que es `smooth` de normal y `auto` bajo
 * `prefers-reduced-motion`. Es la misma regla que ya rige a las anclas del
 * navbar, y asi este enlace no puede animarse cuando el lector pidio que nada
 * lo haga. `ScrollGlide` no interfiere: solo intercepta la rueda y se
 * resincroniza cuando la pagina se mueve por otra via.
 *
 * Si la URL traia un ancla (`/es#how`), se limpia con `replaceState` para que
 * un recargo no vuelva a saltar a esa seccion.
 */
export function BrandLink({ lang, class_name, children }) {
  const pathname = usePathname();
  const home_href = `/${lang}`;
  const on_home = pathname === home_href || pathname === `${home_href}/`;

  function handle_click(event) {
    if (!on_home) return;
    event.preventDefault();
    window.scrollTo({ top: 0 });
    if (window.location.hash) {
      window.history.replaceState(null, "", home_href);
    }
  }

  return (
    <Link href={home_href} onClick={handle_click} className={class_name}>
      {children}
    </Link>
  );
}
