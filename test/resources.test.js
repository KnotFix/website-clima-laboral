import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import en from "@/content/en";
import es from "@/content/es";
import { RESOURCES, RESOURCES_BASE, resource_paths } from "@/content/resources/nav";
import { llms_txt } from "@/lib/llms";
import { hreflang_of, page_metadata } from "@/lib/seo";
import { LOCALES, site_config, swap_locale_in_path } from "@/lib/site_config";

/**
 * Los recursos son la unica seccion con el slug traducido, y eso es lo que se
 * rompe en silencio: un conmutador de idioma que manda a `/en/recursos` (404),
 * un hreflang que apunta a la ruta del otro idioma, o un articulo del
 * manifiesto sin su `.mdx` en alguno de los dos idiomas. Ver `content/resources/nav.js`.
 */

const CONTENT = path.join(process.cwd(), "src", "content", "resources");

describe("rutas traducidas", () => {
  it("el conmutador de idioma lleva al recurso en el otro idioma", () => {
    for (const entry of RESOURCES) {
      const paths = resource_paths(entry);
      expect(swap_locale_in_path(`/es${paths.es}`, "en")).toBe(`/en${paths.en}`);
      expect(swap_locale_in_path(`/en${paths.en}`, "es")).toBe(`/es${paths.es}`);
    }
    expect(swap_locale_in_path("/es/recursos", "en")).toBe("/en/resources");
    expect(swap_locale_in_path("/en/resources", "es")).toBe("/es/recursos");
  });

  it("las demas rutas siguen cambiando solo el idioma", () => {
    expect(swap_locale_in_path("/es/docs/kiosk", "en")).toBe("/en/docs/kiosk");
    expect(swap_locale_in_path("/es/recursos/otra-cosa", "en")).toBe("/en/recursos/otra-cosa");
  });

  it("el hreflang y el canonical usan la ruta de cada idioma", () => {
    const entry = RESOURCES[0];
    const paths = resource_paths(entry);
    const meta = page_metadata({ lang: "en", path: paths, description: "x" });

    expect(meta.alternates.canonical).toBe(`/en${paths.en}`);
    expect(meta.alternates.languages).toEqual({
      es: `/es${paths.es}`,
      en: `/en${paths.en}`,
      "x-default": `/es${paths.es}`,
    });
    expect(meta.openGraph.url).toBe(`${site_config.domain}/en${paths.en}`);
  });

  it("los slugs son usables en una URL", () => {
    for (const entry of RESOURCES) {
      for (const lang of LOCALES) {
        expect(entry.slug[lang]).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(entry.title[lang]).toBeTruthy();
        expect(entry.description[lang]).toBeTruthy();
      }
    }
  });
});

describe("sitemap y llms.txt", () => {
  it("el sitemap lista el indice y cada recurso con su par de idiomas", async () => {
    const urls = await sitemap();
    const expected = [RESOURCES_BASE, ...RESOURCES.map(resource_paths)];

    for (const paths of expected) {
      for (const lang of LOCALES) {
        const item = urls.find(
          (url) => url.url === `${site_config.domain}/${lang}${paths[lang]}`,
        );
        expect(item, `${lang}${paths[lang]} falta en el sitemap`).toBeTruthy();
        expect(item.alternates.languages).toEqual(hreflang_of(paths, site_config.domain));
      }
    }
    // Ninguna URL cruzada: `/en/recursos` no existe.
    expect(urls.some((url) => url.url.includes("/en/recursos"))).toBe(false);
    expect(urls.some((url) => url.url.includes("/es/resources"))).toBe(false);
  });

  it("llms.txt enlaza cada recurso con la URL de su idioma", () => {
    const text = llms_txt({ dicts: { es, en }, descriptions: { es: {}, en: {} } });
    for (const entry of RESOURCES) {
      for (const lang of LOCALES) {
        expect(text).toContain(`(${site_config.domain}/${lang}${resource_paths(entry)[lang]})`);
      }
    }
  });
});

describe("articulos", () => {
  it("cada articulo del manifiesto tiene su .mdx en los dos idiomas", () => {
    // Sin el archivo, la ruta esta en el sitemap y en el indice y da 404.
    for (const entry of RESOURCES) {
      for (const lang of LOCALES) {
        const file = path.join(CONTENT, lang, `${entry.id}.mdx`);
        expect(existsSync(file), `falta ${lang}/${entry.id}.mdx`).toBe(true);
      }
    }
  });

  it("las fechas son AAAA-MM-DD y la actualizacion no es anterior a la publicacion", () => {
    for (const entry of RESOURCES) {
      expect(entry.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(entry.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(entry.updated >= entry.published).toBe(true);
    }
  });

  it("los textos no llevan rayas em", () => {
    // Regla de la prosa del sitio: se reformula la frase, no se usa la raya.
    for (const entry of RESOURCES) {
      for (const lang of LOCALES) {
        const body = readFileSync(path.join(CONTENT, lang, `${entry.id}.mdx`), "utf8");
        expect(body).not.toContain("—");
        expect(entry.title[lang]).not.toContain("—");
        expect(entry.description[lang]).not.toContain("—");
      }
    }
  });

  it("el indice y el articulo tienen sus textos en los dos idiomas", () => {
    for (const key of [
      "resources_reading",
      "resources_card_cta",
      "resources_back",
      "resources_cta_title",
      "resources_cta",
    ]) {
      expect(es[key], key).toBeTruthy();
      expect(en[key], key).toBeTruthy();
    }
    expect(es.resources_reading).toContain("{minutes}");
    expect(en.resources_reading).toContain("{minutes}");
  });
});
