import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import sitemap from "@/app/sitemap";
import en from "@/content/en";
import es from "@/content/es";
import { RESOURCES, RESOURCES_BASE, resource_paths } from "@/content/resources/nav";
import survey_template from "@/content/resources/survey_template.json";
import { llms_txt } from "@/lib/llms";
import { hreflang_of, page_metadata } from "@/lib/seo";
import { LOCALES, site_config, swap_locale_in_path } from "@/lib/site_config";

/**
 * Los recursos son la unica seccion con el slug traducido, y eso es lo que se
 * rompe en silencio: un conmutador de idioma que manda a `/en/recursos` (404),
 * un hreflang que apunta a la ruta del otro idioma, o un Excel que dice otra
 * cosa que la pagina. Ver `content/resources/nav.js`.
 */

const PUBLIC = path.join(process.cwd(), "public");

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

describe("plantilla de encuesta", () => {
  it("los dos idiomas tienen la misma forma", () => {
    // La pagina y el Excel recorren estas listas con el mismo codigo: una
    // pregunta de mas en un idioma corre toda la numeracion.
    const shape = (content) => ({
      keys: Object.keys(content).sort(),
      dimensions: content.dimensions.map((dimension) => dimension.questions.length),
      scale: content.scale.map((item) => item.value),
      steps: content.steps.length,
      open: content.open_questions.length,
      tips: content.anonymity_tips.length,
      limits: content.limits.length,
    });
    expect(shape(survey_template.en)).toEqual(shape(survey_template.es));
  });

  it("trae 30 preguntas en 6 dimensiones de 5 y una escala de 4 sin punto medio", () => {
    for (const lang of LOCALES) {
      const content = survey_template[lang];
      expect(content.dimensions).toHaveLength(6);
      for (const dimension of content.dimensions) {
        expect(dimension.questions).toHaveLength(5);
      }
      expect(content.scale.map((item) => item.value)).toEqual([1, 2, 3, 4]);
      expect(content.steps).toHaveLength(5);
    }
  });

  it("el Excel y la captura que enlaza la pagina estan publicados", () => {
    // Los arma `scripts/build_survey_template.py`. Sin ellos la pagina
    // ofrece una descarga que da 404.
    for (const lang of LOCALES) {
      const content = survey_template[lang];
      expect(existsSync(path.join(PUBLIC, content.download_path))).toBe(true);
      expect(existsSync(path.join(PUBLIC, content.preview_image))).toBe(true);
    }
  });

  it("el FAQ de la pagina tiene cuatro preguntas en los dos idiomas", () => {
    expect(es.template_faq_items).toHaveLength(4);
    expect(en.template_faq_items).toHaveLength(4);
  });
});
