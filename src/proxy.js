import { NextResponse } from "next/server";

import { DEFAULT_LOCALE, LOCALES } from "@/lib/site_config";

/**
 * Elige el idioma leyendo Accept-Language.
 * Se parsea a mano a proposito: negotiator + intl-localematcher son dos
 * dependencias para resolver algo que aca son seis lineas.
 */
function pick_locale(request) {
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
  return NextResponse.redirect(url);
}

export const config = {
  // Se excluyen los internos de Next y cualquier archivo con extension
  // (imagenes, fuentes, robots.txt); si no, el redirect les rompe la carga.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
