import { readdir } from "node:fs/promises";
import path from "node:path";

import { flatten_nav } from "@/content/docs/nav";
import { LEGAL_NAV } from "@/content/legal/nav";
import { hreflang_of } from "@/lib/seo";
import { LOCALES, site_config } from "@/lib/site_config";

/**
 * El mapa del sitio: las ~52 URLs reales, cada una declarando sus traducciones.
 *
 * **Lo que importa aca no es la lista, es `alternates.languages`.** Sin eso,
 * `/es/docs/kiosk` y `/en/docs/kiosk` son dos paginas distintas que dicen lo
 * mismo, y un buscador tiene que adivinar cual mostrar —o penalizar a una por
 * duplicada—. Con el par declarado son la misma pagina en dos idiomas. El
 * `x-default` que va con ellas es el MISMO que emite cada pagina en su
 * `<head>` (`hreflang_of`, en `lib/seo.js`): las dos declaraciones tienen
 * que coincidir o el buscador desconfia de las dos.
 *
 * **Las rutas salen de los mismos manifiestos que las dibujan**, no de una lista
 * escrita a mano: `flatten_nav()` para las docs y `LEGAL_NAV` para los legales.
 * Una lista aparte se desincroniza el dia que alguien agrega una pagina, y el
 * modo de fallo es silencioso — la pagina existe y el buscador no se entera.
 *
 * **Se importa de `@/content/**` y NO de `@/lib/docs`**, que lleva
 * `server-only`: la version de `lib/` ademas compila el `.mdx` para devolver el
 * componente, y para una URL no hace falta abrir el archivo.
 */
export default async function sitemap() {
  const paths = [
    "",
    "/docs",
    "/changelog",
    ...flatten_nav().map((entry) => `/docs/${entry.slug}`),
    ...LEGAL_NAV.map((entry) => `/legal/${entry.slug}`),
  ];

  // Fechas solo donde hay una de verdad. **Nada de `new Date()`**: poner la
  // fecha del build en cada URL le dice al rastreador que el sitio entero
  // cambio cada vez que se despliega, que es exactamente el dato que hace que
  // deje de creerle al campo.
  //
  // El indice `/docs` hereda la fecha de la doc mas nueva: es una portada, y
  // cambia exactamente cuando cambia algo de lo que lista. La home queda sin
  // fecha a proposito: cambia con cada despliegue y no hay una sola fuente
  // que lo diga.
  const changelog_date = await newest_changelog_date();
  const docs = flatten_nav();
  const modified = new Map([
    ["/changelog", changelog_date],
    ["/docs", newest_of(docs.map((entry) => entry.updated))],
    ...docs.map((entry) => [`/docs/${entry.slug}`, entry.updated]),
    ...LEGAL_NAV.map((entry) => [`/legal/${entry.slug}`, entry.updated]),
  ]);

  return paths.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${site_config.domain}/${locale}${route}`,
      lastModified: modified.get(route),
      alternates: {
        languages: hreflang_of(route, site_config.domain),
      },
    })),
  );
}

/**
 * La mas nueva de una lista de fechas `YYYY-MM-DD`. Ordenan como texto porque
 * el formato es ISO; `undefined` si no hay ninguna.
 */
function newest_of(dates) {
  return dates.filter(Boolean).sort().at(-1);
}

/**
 * La entrada mas nueva del changelog, por nombre de archivo.
 *
 * Se lee el DIRECTORIO y no se usa `changelog_entries()` de `lib/changelog.js`
 * a proposito: esa funcion importa cada `.mdx` para devolver el componente
 * compilado, y aca solo hace falta la fecha — que ya esta en el nombre. Es la
 * misma razon por la que las docs entran por `@/content/docs/nav`.
 *
 * `undefined` si no hay ninguna: el campo se omite y la URL sigue valiendo.
 */
async function newest_changelog_date() {
  try {
    const dir = path.join(process.cwd(), "src", "content", "changelog", "es");
    const dates = (await readdir(dir))
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""))
      .sort();
    return dates.at(-1);
  } catch {
    return undefined;
  }
}
