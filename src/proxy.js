import { NextResponse } from "next/server";

import { DEFAULT_LOCALE, LOCALES } from "@/lib/site_config";

/**
 * Elige el idioma leyendo Accept-Language.
 * Se parsea a mano a proposito: negotiator + intl-localematcher son dos
 * dependencias para resolver algo que aca son seis lineas.
 *
 * **Se exporta solo para poder probarla** (`test/proxy.test.js`), y esa es toda
 * la razon: nadie mas la llama. Un parser escrito a mano que decide en que
 * idioma entra cada visitante nuevo es exactamente la clase de codigo que hay
 * que poder ejercitar con headers raros, y hacerlo a traves de `proxy()`
 * obligaria a fabricar un `NextRequest` entero para mirar un string.
 */
export function pick_locale(request) {
  const header = request.headers.get("accept-language");
  if (!header) return DEFAULT_LOCALE;

  // "es-CR,es;q=0.9,en;q=0.8" -> [{ tag: "es-cr", q: 1 }, ...] ordenado por q
  const preferences = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q_param = params.find((p) => p.trim().startsWith("q="));
      const q = q_param ? Number.parseFloat(q_param.split("=")[1]) : 1;
      return { tag: tag.toLowerCase(), q: Number.isNaN(q) ? 0 : q };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of preferences) {
    // "es-cr" tiene que resolver a "es"
    const base = tag.split("-")[0];
    if (LOCALES.includes(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  const has_locale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (has_locale) return NextResponse.next();

  const locale = pick_locale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;

  // **307 y no 308.** El destino depende de quien pide, asi que el redirect no
  // es permanente: con 308 el navegador lo guarda para siempre y quien cambia
  // el idioma del sistema sigue cayendo en el viejo. Es ademas lo que Google
  // espera de una redireccion por idioma; el `x-default` de cada pagina es lo
  // que le dice que indexar. `NextResponse.redirect` ya usa 307 por defecto.
  const response = NextResponse.redirect(url);

  // **`Vary` porque la respuesta depende de un header.** Sin esto, cualquier
  // cache compartida delante del sitio (un CDN, el proxy del hosting) guarda el
  // `/ -> /es` de la primera visita y se lo sirve tambien a quien pidio ingles,
  // que es el modo de fallo que no se ve desde adentro: en local nunca hay
  // cache intermedia y el bug aparece solo en produccion y solo para terceros.
  response.headers.set("Vary", "Accept-Language");
  return response;
}

export const config = {
  // Se excluyen los internos de Next y cualquier archivo con extension
  // (imagenes, fuentes, robots.txt); si no, el redirect les rompe la carga.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
