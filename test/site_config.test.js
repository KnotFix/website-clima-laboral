import { describe, expect, it } from "vitest";

import {
  DEFAULT_LOCALE,
  LOCALES,
  is_locale,
  swap_locale_in_path,
} from "@/lib/site_config";

describe("is_locale", () => {
  it("acepta los idiomas del sitio y nada mas", () => {
    for (const locale of LOCALES) expect(is_locale(locale)).toBe(true);
    expect(is_locale("fr")).toBe(false);
    expect(is_locale("ES")).toBe(false); // las rutas van en minuscula
    expect(is_locale("")).toBe(false);
    expect(is_locale(undefined)).toBe(false);
  });

  it("el idioma por defecto es uno de los declarados", () => {
    expect(LOCALES).toContain(DEFAULT_LOCALE);
  });
});

describe("swap_locale_in_path", () => {
  it("cambia el segmento de idioma y deja el resto igual", () => {
    expect(swap_locale_in_path("/es/docs/kiosk", "en")).toBe("/en/docs/kiosk");
    expect(swap_locale_in_path("/en/legal/privacy", "es")).toBe(
      "/es/legal/privacy",
    );
  });

  it("funciona en la raiz de un idioma", () => {
    expect(swap_locale_in_path("/es", "en")).toBe("/en");
  });

  it("no confunde un segmento que solo PARECE un idioma", () => {
    // "esquemas" empieza con "es". Partir por "/" y comparar el segmento
    // entero es lo que evita que esto se rompa; un `startsWith` no.
    expect(swap_locale_in_path("/esquemas", "en")).toBe("/en/esquemas");
  });

  it("prefija cuando la ruta no trae idioma", () => {
    expect(swap_locale_in_path("/docs", "en")).toBe("/en/docs");
  });

  it("en la raiz pelada deja una barra de mas, y no importa", () => {
    // Documentado, no arreglado: `proxy.js` redirige "/" a "/es" o "/en" antes
    // de que se renderice nada, asi que el conmutador de idioma —el unico que
    // llama a esta funcion, con `usePathname()`— nunca ve un "/" pelado. Y aun
    // si lo viera, Next normaliza la barra final.
    expect(swap_locale_in_path("/", "en")).toBe("/en/");
  });
});
