import { existsSync } from "node:fs";
import { readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import en from "@/content/en";
import es from "@/content/es";
import { DOCS_NAV, flatten_nav } from "@/content/docs/nav";
import { LEGAL_NAV } from "@/content/legal/nav";
import { LOCALES } from "@/lib/site_config";

const CONTENT = path.join(process.cwd(), "src", "content");

/**
 * Las invariantes de contenido: lo que tiene que ser cierto en los dos idiomas
 * a la vez.
 *
 * **Son los tests de mayor valor del proyecto**, y no porque prueben logica
 * dificil —no prueban ninguna— sino por como falla lo que vigilan. Una llave que
 * falta en `en.js` no rompe el build ni tira un error: renderiza `undefined` en
 * la pagina. Un `.mdx` que no se tradujo devuelve `null` en `resolve_doc` y sale
 * un 404 en un enlace que el sidebar sigue dibujando. Los dos se publican sin
 * que nadie se entere.
 */

describe("diccionarios", () => {
  it("es.js y en.js tienen exactamente las mismas llaves", () => {
    const solo_es = Object.keys(es).filter((k) => !(k in en));
    const solo_en = Object.keys(en).filter((k) => !(k in es));

    expect({ solo_es, solo_en }).toEqual({ solo_es: [], solo_en: [] });
  });

  it("ninguna llave queda vacia en ningun idioma", () => {
    for (const [nombre, dict] of [
      ["es", es],
      ["en", en],
    ]) {
      const vacias = Object.entries(dict)
        .filter(([, v]) => v === "" || v === null || v === undefined)
        .map(([k]) => k);
      expect(vacias, `llaves vacias en ${nombre}.js`).toEqual([]);
    }
  });

  it("las listas que se recorren en paralelo miden lo mismo", () => {
    // Los `*_segments` de los titulares quedan afuera a proposito: son el
    // titular partido en palabras, y una frase en ingles no se parte en la
    // misma cantidad de trozos que en español. El resto —items de secciones,
    // pasos, preguntas— si tiene que coincidir: el sitio los pinta con el mismo
    // `map` y a menudo con un icono por indice.
    const desparejas = Object.keys(es).filter(
      (k) =>
        !k.endsWith("_segments") &&
        Array.isArray(es[k]) &&
        Array.isArray(en[k]) &&
        es[k].length !== en[k].length,
    );

    expect(desparejas).toEqual([]);
  });
});

describe("documentacion", () => {
  it("no hay slugs repetidos en DOCS_NAV", () => {
    const slugs = flatten_nav().map((entry) => entry.slug);
    expect(slugs).toHaveLength(new Set(slugs).size);
  });

  it("cada grupo y cada entrada tiene titulo en los dos idiomas", () => {
    for (const group of DOCS_NAV) {
      for (const locale of LOCALES) {
        expect(group.title[locale], `grupo sin ${locale}`).toBeTruthy();
      }
      for (const entry of group.items) {
        for (const locale of LOCALES) {
          expect(
            entry.title[locale],
            `${entry.slug} sin titulo en ${locale}`,
          ).toBeTruthy();
        }
      }
    }
  });

  it("cada slug del nav tiene su .mdx en los dos idiomas", () => {
    const faltantes = [];
    for (const entry of flatten_nav()) {
      for (const locale of LOCALES) {
        const file = path.join(CONTENT, "docs", locale, `${entry.slug}.mdx`);
        if (!existsSync(file)) faltantes.push(`${locale}/${entry.slug}.mdx`);
      }
    }
    expect(faltantes).toEqual([]);
  });

  it("no hay .mdx huerfanos: todo archivo esta en el nav", () => {
    // El otro sentido del mismo chequeo. Un .mdx que no esta en `DOCS_NAV` no
    // existe para el sitio —`is_doc_slug` lo rechaza— asi que es texto escrito
    // que nadie va a leer nunca.
    const en_nav = new Set(flatten_nav().map((entry) => entry.slug));
    const huerfanos = [];
    for (const locale of LOCALES) {
      for (const file of readdirSync(path.join(CONTENT, "docs", locale))) {
        const slug = file.replace(/\.mdx$/, "");
        if (file.endsWith(".mdx") && !en_nav.has(slug)) {
          huerfanos.push(`${locale}/${file}`);
        }
      }
    }
    expect(huerfanos).toEqual([]);
  });
});

describe("legales", () => {
  it("cada slug tiene su .mdx en los dos idiomas", () => {
    const faltantes = [];
    for (const entry of LEGAL_NAV) {
      for (const locale of LOCALES) {
        const file = path.join(CONTENT, "legal", locale, `${entry.slug}.mdx`);
        if (!existsSync(file)) faltantes.push(`${locale}/${entry.slug}.mdx`);
      }
    }
    expect(faltantes).toEqual([]);
  });

  it("la version y la fecha son unicas por documento, no por idioma", () => {
    // `content/legal/nav.js` lo deja escrito: el mismo documento en los dos
    // idiomas tiene que ser la misma version. Con el dato en el `meta` de cada
    // .mdx se separarian en silencio; viviendo en el nav, esto solo confirma
    // que el nav los trae.
    for (const entry of LEGAL_NAV) {
      expect(entry.version, `${entry.slug} sin version`).toBeTruthy();
      expect(entry.updated, `${entry.slug} sin fecha`).toMatch(
        /^\d{4}-\d{2}-\d{2}$/,
      );
    }
  });
});

describe("changelog", () => {
  it("las mismas entradas en los dos idiomas", () => {
    const por_idioma = LOCALES.map((locale) =>
      readdirSync(path.join(CONTENT, "changelog", locale))
        .filter((file) => file.endsWith(".mdx"))
        .sort(),
    );

    expect(por_idioma[0]).toEqual(por_idioma[1]);
  });

  it("el nombre de cada archivo es una fecha ISO", () => {
    // De ahi sale el orden: `lib/changelog.js` lee el directorio y ordena por
    // nombre. Un archivo con otro formato se cuela en cualquier posicion.
    for (const locale of LOCALES) {
      for (const file of readdirSync(path.join(CONTENT, "changelog", locale))) {
        if (!file.endsWith(".mdx")) continue;
        expect(file, `${locale}/${file}`).toMatch(/^\d{4}-\d{2}-\d{2}\.mdx$/);
      }
    }
  });
});
