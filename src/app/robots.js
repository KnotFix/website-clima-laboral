import { site_config } from "@/lib/site_config";

/**
 * Los agentes de IA que se nombran uno por uno en el `robots.txt`.
 *
 * **Para un parser correcto esto no cambia nada**: `User-Agent: *` con
 * `Allow: /` ya los dejaba pasar a todos. Se nombran igual por dos razones.
 * La primera es que varios de estos rastreadores buscan PRIMERO un grupo con
 * su nombre y, ante un robots que no los menciona, algunos operadores eligen
 * la lectura conservadora. La segunda es que deja escrita la decision: el
 * sitio es material de venta y documentacion publica, y se quiere que un
 * asistente pueda leerlo y citarlo cuando alguien le pregunta por Censuma. El
 * dia que eso cambie, se cambia aca y no en un panel de hosting.
 *
 * Tres familias por proveedor, porque no son lo mismo: el rastreador que
 * entrena (`ClaudeBot`, `GPTBot`), el que arma el indice de busqueda
 * (`Claude-SearchBot`, `OAI-SearchBot`) y el que abre una pagina porque una
 * persona se lo pidio en el chat (`Claude-User`, `ChatGPT-User`). El tercero
 * es el que falla cuando alguien dice «Claude no puede abrir el sitio».
 *
 * Se exporta para que `test/seo.test.js` vigile que ninguno quede afuera.
 */
export const AI_AGENTS = [
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Meta-ExternalAgent",
  "MistralAI-User",
  "DuckAssistBot",
  "CCBot",
];

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
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AGENTS, allow: "/" },
    ],
    sitemap: `${site_config.domain}/sitemap.xml`,
  };
}
