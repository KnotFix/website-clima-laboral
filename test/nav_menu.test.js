import { describe, expect, it } from "vitest";

import en from "@/content/en";
import es from "@/content/es";
import { RESOURCES, RESOURCES_BASE, resource_paths } from "@/content/resources/nav";
import { nav_menu, path_matches } from "@/lib/nav_menu";

/**
 * La lista del navbar (`lib/nav_menu.js`): lo que se rompe en silencio es un
 * ancla que desde otra pagina no vuelve a la home, o un «Recursos» que apunta
 * al slug del otro idioma.
 */

const dicts = { es, en };

describe("nav_menu", () => {
  it("tiene Producto, Precios, Documentacion y Recursos, en ese orden", () => {
    for (const lang of ["es", "en"]) {
      const menu = nav_menu({ lang, dict: dicts[lang] });
      expect(menu.map((entry) => entry.id)).toEqual(["product", "pricing", "docs", "resources"]);
      // Las docs son un enlace directo, no un desplegable.
      expect(menu[2]).toMatchObject({ href: `/${lang}/docs` });
      expect(menu[2].items).toBeUndefined();
      for (const entry of menu) expect(entry.label).toBeTruthy();
    }
  });

  it("las anclas de Producto vuelven a la home fuera de ella", () => {
    const home = nav_menu({ lang: "es", dict: es });
    const docs = nav_menu({ lang: "es", dict: es, section_base: "/es" });

    expect(home[0].items.map((item) => item.href)).toEqual(["#how", "#weights", "#faq"]);
    expect(docs[0].items.map((item) => item.href)).toEqual(["/es#how", "/es#weights", "/es#faq"]);
    expect(docs[0].items.every((item) => item.section_id)).toBe(true);
  });

  it("Recursos lleva al indice, con el slug traducido", () => {
    for (const lang of ["es", "en"]) {
      const resources = nav_menu({ lang, dict: dicts[lang] }).find(
        (entry) => entry.id === "resources",
      );
      expect(resources.href).toBe(`/${lang}${RESOURCES_BASE[lang]}`);
      expect(resources.items).toBeUndefined();
    }
  });

  it("Recursos se marca en el indice y en cada recurso", () => {
    for (const entry of RESOURCES) {
      expect(path_matches(`/es${resource_paths(entry).es}`, "/es/recursos")).toBe(true);
    }
  });

  it("path_matches cubre las subrutas y nada mas", () => {
    expect(path_matches("/es/docs", "/es/docs")).toBe(true);
    expect(path_matches("/es/docs/kiosk", "/es/docs")).toBe(true);
    expect(path_matches("/es/docsx", "/es/docs")).toBe(false);
    expect(path_matches("/es", "/es/pricing")).toBe(false);
  });
});
