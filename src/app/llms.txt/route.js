import { flatten_nav } from "@/content/docs/nav";
import { get_dictionary } from "@/lib/dictionaries";
import { resolve_doc } from "@/lib/docs";
import { llms_txt } from "@/lib/llms";
import { LOCALES } from "@/lib/site_config";

/**
 * `/llms.txt`: el mapa del sitio para asistentes de IA. Ver `lib/llms.js`.
 *
 * Va en la raiz y con extension por lo mismo que `robots.js`: el matcher de
 * `proxy.js` deja pasar todo lo que tiene un punto, asi que no se come el
 * redirect al idioma.
 *
 * **Estatico**: se arma una vez en el build, como el sitemap. Nada de lo que
 * lleva cambia entre un despliegue y el siguiente.
 */
export const dynamic = "force-static";

export async function GET() {
  const dicts = {};
  const descriptions = {};

  for (const lang of LOCALES) {
    dicts[lang] = await get_dictionary(lang);
    descriptions[lang] = {};
    for (const entry of flatten_nav()) {
      const doc = await resolve_doc(lang, entry.slug);
      descriptions[lang][entry.slug] = doc?.meta.description;
    }
  }

  return new Response(llms_txt({ dicts, descriptions }), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
