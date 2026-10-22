import { RESOURCES_BASE } from "@/content/resources/nav";

/**
 * La navegacion del navbar, en el orden en que se dibuja. La leen la barra de
 * escritorio (`NavMenu`) y el menu de hamburguesa (`MobileMenu`): una sola
 * lista, para que los dos no se separen.
 *
 * Cada entrada es un enlace suelto (`href`) o un desplegable (`items`). Un item
 * con `section_id` es un ancla de la home y se marca activo por scroll; uno sin
 * el es una ruta y se marca por `pathname`.
 *
 * Solo «Producto» es desplegable. «Recursos» se probo como desplegable y
 * volvio a ser un enlace al INDICE (`/es/recursos`, decision del usuario,
 * 2026-10-12): el indice ya es el menu de los recursos, con una tarjeta por
 * articulo, y sumar uno al manifiesto (`content/resources/nav.js`) lo
 * agrega ahi sin tocar el navbar. Se marca activo en el indice y en cada
 * recurso, porque `path_matches` cubre las subrutas.
 *
 * Las docs son un enlace DIRECTO y no van dentro de «Recursos» (decision del
 * usuario, 2026-10-12): los recursos son articulos para quien todavia no es
 * cliente, y las docs explican el producto.
 *
 * `dict` alcanza con las llaves `nav_*`: ver `chrome_dict_of`.
 */
export function nav_menu({ lang, dict, section_base = "" }) {
  return [
    {
      id: "product",
      label: dict.nav_product,
      // `section_base` vacio en la home (anclas de esta pagina); "/es" o "/en"
      // fuera de ella, para volver a la home a esa seccion. Ver `navbar.jsx`.
      items: dict.nav_links.map((link) => ({
        id: link.href.slice(1),
        label: link.label,
        href: `${section_base}${link.href}`,
        section_id: link.href.slice(1),
      })),
    },
    {
      id: "pricing",
      label: dict.nav_pricing,
      href: `/${lang}/pricing`,
      track: "pricing",
    },
    {
      id: "docs",
      label: dict.nav_docs,
      href: `/${lang}/docs`,
      track: "docs",
    },
    {
      id: "resources",
      label: dict.nav_resources,
      // El slug va traducido (`/es/recursos`, `/en/resources`): ver
      // `content/resources/nav.js`.
      href: `/${lang}${RESOURCES_BASE[lang]}`,
      track: "resources",
    },
  ];
}

/** `/es/docs` cubre `/es/docs/kiosk`, pero no `/es/docsx`. */
export function path_matches(pathname, href) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
