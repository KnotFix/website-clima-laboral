import { describe, expect, it } from "vitest";

import { pick_locale } from "@/proxy";

/** Un request con lo unico que `pick_locale` mira: el header. */
function request_with(accept_language) {
  return {
    headers: {
      get: (name) =>
        name.toLowerCase() === "accept-language" ? accept_language : null,
    },
  };
}

describe("pick_locale", () => {
  it("toma el idioma de mayor q, no el primero de la lista", () => {
    // El orden del header NO es el orden de preferencia: manda `q`. Es el error
    // clasico al escribir este parser a mano.
    expect(pick_locale(request_with("en;q=0.4,es;q=0.9"))).toBe("es");
    expect(pick_locale(request_with("es;q=0.2,en;q=0.8"))).toBe("en");
  });

  it("resuelve una region a su idioma base", () => {
    expect(pick_locale(request_with("es-CR,es;q=0.9,en;q=0.8"))).toBe("es");
    expect(pick_locale(request_with("en-GB"))).toBe("en");
  });

  it("no distingue mayusculas", () => {
    expect(pick_locale(request_with("EN-US,EN;q=0.9"))).toBe("en");
  });

  it("cae al idioma por defecto cuando no hay header", () => {
    expect(pick_locale(request_with(null))).toBe("es");
    expect(pick_locale(request_with(""))).toBe("es");
  });

  it("cae al idioma por defecto cuando ninguno esta soportado", () => {
    expect(pick_locale(request_with("fr-FR,de;q=0.8,ja;q=0.6"))).toBe("es");
  });

  it("salta el idioma con q malformado en vez de romperse", () => {
    // `Number.parseFloat("abc")` da NaN; el parser lo manda a q=0, asi que el
    // roto pierde contra cualquier otro en vez de tumbar la peticion.
    expect(pick_locale(request_with("en;q=abc,es;q=0.5"))).toBe("es");
  });

  it("un idioma sin q vale 1 y le gana a uno con q explicito menor", () => {
    expect(pick_locale(request_with("en,es;q=0.9"))).toBe("en");
  });

  it("tolera espacios y parametros de sobra", () => {
    expect(pick_locale(request_with("  es-419 ; q=0.7 , en ; q=0.3 "))).toBe(
      "es",
    );
  });
});
