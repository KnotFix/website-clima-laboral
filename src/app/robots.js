import { site_config } from "@/lib/site_config";

/**
 * `robots.txt`, generado.
 *
 * Va en la raiz de `app/` y NO adentro de `[lang]/`: hay un solo robots.txt por
 * dominio, y puesto bajo el segmento de idioma Next generaria `/es/robots.txt`
 * y `/en/robots.txt`, que no es donde ningun rastreador lo busca.
 *
 * **Por eso ademas no lo toca `proxy.js`.** Su matcher excluye todo lo que tenga
 * extension (`.*\\..*`), asi que `/robots.txt` y `/sitemap.xml` no se comen el
 * redirect al idioma — que los dejaria en `/es/robots.txt` y devolveria un 404.
 * Es la misma exclusion que ya protegia a las imagenes y las fuentes.
 */
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site_config.domain}/sitemap.xml`,
  };
}
